import { roundToX } from "../../common/common";
import ShimValues from "./ShimValues";

export default class BestFitLine  {
    constructor(ld) {
        this.laserData = ld;
    }

    calculateMean = (data) => {
        // Calculate the mean of x, y, and z values
        let xMean = 0;
        let yMean = 0;
        let zMean = 0;
        for (let i = 0; i < data.length; i++) {
            xMean += data[i].x;
            yMean += data[i].y;
            zMean += data[i].z;
        }
        xMean /= data.length;
        yMean /= data.length;
        zMean /= data.length;
        return {
            x: xMean,
            y: yMean,
            z: zMean
        };
    }

    centerData = (data, means) => {
        // Center the data around the origin
        let centeredData = [];
        for (let i = 0; i < data.length; i++) {
            centeredData.push([data[i].x - means.x, data[i].y - means.y, data[i].z - means.z]);
        }
        return centeredData;
    }

    calcSlope = (centered) => {
        let sumXY = 0;
        let sumXX = 0;
        let sumXZ = 0;

        for(let i=0;i<centered.length;i++){
            sumXX += (centered[i][0] * centered[i][0]); // [0] is y value
            sumXY += (centered[i][0] * centered[i][1]); // [1] is x value
            sumXZ += (centered[i][0] * centered[i][2]); // [2] is y value
        }

        return {
            pitch: {
                value: (sumXY/sumXX),
                formula: `${roundToX(sumXY, 5)} / ${roundToX(sumXX,5)}`,
            },
            yaw: {
                value: (sumXZ/sumXX),
                formula: `${roundToX(sumXZ, 5)} / ${roundToX(sumXX, 5)}`,
            }
        }
    }

    calcIntercept = (slope, means) => {
        return {
            YIntercept: {
                value: (means.y - (slope.pitch.value * means.x)),
                formula: `${roundToX(means.y)} - (${roundToX(slope.pitch.value, 5)} * ${roundToX(means.x,5)})`
            },
            ZIntercept: {
                value: (means.z - (slope.yaw.value * means.x)),
                formula: `${roundToX(means.z,5)} - (${roundToX(slope.yaw.value, 5)} * ${roundToX(means.x, 5)})`
            }
        }
    }

    getData = (firstIndex, lastIndex, exclude) => {

        let data = this.laserData.allValues.slice(firstIndex, lastIndex + 1);
        
        // remove excluded elements
        if(exclude.length > 0){
            for(let i=0;i<exclude.length;i++){
                let removeIndex = data.findIndex((e) => (e.x === exclude[i].x));
                if(removeIndex !== -1){
                    data.splice(removeIndex, 1);
                }
            }    
        }
        return data;
    }

    getExcludedPoints = (range, exclude) => {
        let skip = [];
        for(let i=0; i<exclude.length;i++){
            // the exclude array is a list of x values to exclude
            let index = range.findIndex(r => r.x === exclude[i]);
            if(index !== -1) { // it is possible that an excluded value doesn't exist due to noise reduction
                skip.push({...range[index]}); // push a copy of the point to exclude from the calculation
            }
        }

        return skip;
    }

    calculate = () => {
        try {
            // to get the first and last index of the pump/motor range use either rangeY or rangeZ can be used since they contains the same number of values
            let pumpExclude = [];
            let motorExclude = [];
            if ((this.laserData.algorithm) && (this.laserData.algorithm.bestfitline)) {
                pumpExclude = this.getExcludedPoints(this.laserData.rangeY.pump, this.laserData.algorithm.bestfitline.pump.exclude); 
                motorExclude = this.getExcludedPoints(this.laserData.rangeY.motor, this.laserData.algorithm.bestfitline.motor.exclude);
            }
            
            let pumpData = this.getData(this.laserData.rangeY.pump[0].index, this.laserData.rangeY.pump[this.laserData.rangeY.pump.length - 1].index, pumpExclude);
            let motorData = this.getData(this.laserData.rangeY.motor[0].index, this.laserData.rangeY.motor[this.laserData.rangeY.motor.length - 1].index, motorExclude);

            // 1. calculate means
            let pumpMeans = this.calculateMean(pumpData);
            let motorMeans = this.calculateMean(motorData);

            // 2. center data
            let pumpCentered = this.centerData(pumpData, pumpMeans);
            let motorCentered = this.centerData(motorData, motorMeans);
            
            // 3. calculate slope
            let pumpSlope = this.calcSlope(pumpCentered);
            let motorSlope = this.calcSlope(motorCentered);

            // 4. calculate intercepts
            let pumpIntercept = this.calcIntercept(pumpSlope, pumpMeans);
            let motorIntercept = this.calcIntercept(motorSlope, motorMeans);

            // 5. calculate the foot position and shims values
            let shims = new ShimValues();
            let idealFoot = shims.calcFootXY(pumpSlope.pitch.value, pumpSlope.yaw.value, pumpIntercept.YIntercept.value, pumpIntercept.ZIntercept.value);
            let existingFoot = shims.calcFootXY(motorSlope.pitch.value, motorSlope.yaw.value, motorIntercept.YIntercept.value, motorIntercept.ZIntercept.value);

            return {
                pumpPitch: pumpSlope.pitch,
                pumpYaw: pumpSlope.yaw,
                pumpYIntercept: pumpIntercept.YIntercept,
                pumpZIntercept: pumpIntercept.ZIntercept,
                motorPitch: motorSlope.pitch,
                motorYaw: motorSlope.yaw,   
                motorYIntercept: motorIntercept.YIntercept,
                motorZIntercept: motorIntercept.ZIntercept,
                idealFoot: idealFoot,
                existingFoot: existingFoot,
                frontYShim: shims.calcShim(idealFoot.y5.value, existingFoot.y5.value),
                rearYShim: shims.calcShim(idealFoot.y6.value, existingFoot.y6.value),
                frontZShim: shims.calcShim(idealFoot.z5.value, existingFoot.z5.value),
                rearZShim: shims.calcShim(idealFoot.z6.value, existingFoot.z6.value)
            }

        } catch (err) {
            console.log(err);
        }
    }
}