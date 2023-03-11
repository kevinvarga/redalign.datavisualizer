import { roundToX } from "../../common/common";
import ShimValues from "./ShimValues";

export default class FourPoint {
    constructor(ld) {
        this.laserData = ld;
        this.points = ld.algorithm.fourpoint;
    }

    calcSlope = (x1, y1, x2, y2) => {
        let slope = (y2 - y1)/(x2-x1);
        return {
            value: slope,
            formula: `(${y2} - ${y1})/(${x2} - ${x1})`
        };
    }

    calcIntercept = (slope, x, y) => {
        let intercept = (y - (slope * x));
        return {
            value: intercept,
            formula: `${y} - (${roundToX(slope, 5)} * ${x})`
        }
    }
    
    calculate = () => {
        let pumpStartIndex = this.laserData.rangeY.pump.findIndex(p => (p.x === this.points.pump.start));
        if(pumpStartIndex === -1) {
            pumpStartIndex = 0;
        }
        let pumpEndIndex = this.laserData.rangeY.pump.findIndex(p => (p.x === this.points.pump.end));
        if(pumpEndIndex === -1) {
            pumpEndIndex = this.laserData.rangeY.pump.length - 1;
        }
        let motorStartIndex = this.laserData.rangeY.motor.findIndex(m => (m.x === this.points.motor.start));
        if(motorStartIndex === -1) {
            motorStartIndex = 0;
        }
        let motorEndIndex = this.laserData.rangeY.motor.findIndex(m => (m.x === this.points.motor.end));
        if(motorEndIndex === -1) {
            motorEndIndex = this.laserData.rangeY.motor.length -1;
        }

        let pump1 = this.laserData.allValues[this.laserData.rangeY.pump[pumpStartIndex].index]; 
        let pump2 = this.laserData.allValues[this.laserData.rangeY.pump[pumpEndIndex].index];
        let motor1 = this.laserData.allValues[this.laserData.rangeY.motor[motorStartIndex].index]; 
        let motor2 = this.laserData.allValues[this.laserData.rangeY.motor[motorEndIndex].index]; 

        let pPitch = this.calcSlope(pump1.x, pump1.y, pump2.x, pump2.y);
        let pYaw = this.calcSlope(pump1.x, pump1.z, pump2.x, pump2.z);
        let pYIntercept = this.calcIntercept(pPitch.value, pump1.x, pump1.y);
        let pZIntercept = this.calcIntercept(pYaw.value, pump1.x, pump1.z);

        let mPitch = this.calcSlope(motor1.x, motor1.y, motor2.x, motor2.y);
        let mYaw = this.calcSlope(motor1.x, motor1.z, motor2.x, motor2.z);
        let mYIntercept = this.calcIntercept(mPitch.value, motor1.x, motor1.y);
        let mZIntercept = this.calcIntercept(mYaw.value, motor1.x, motor1.z);

        let shims = new ShimValues();

        let idealFoot = shims.calcFootXY(pPitch.value, pYaw.value, pYIntercept.value, pZIntercept.value);
        let existingFoot = shims.calcFootXY(mPitch.value, mYaw.value, mYIntercept.value, mZIntercept.value);

        return {
            pump1: pump1,
            pump2: pump2,
            motor1: motor1,
            motor2: motor2,
            pumpPitch: pPitch,
            pumpYaw: pYaw,
            pumpYIntercept: pYIntercept,
            pumpZIntercept: pZIntercept,
            motorPitch: mPitch,
            motorYaw: mYaw,
            motorYIntercept: mYIntercept,
            motorZIntercept: mZIntercept,
            idealFoot: idealFoot,
            existingFoot: existingFoot,
            frontYShim: shims.calcShim(idealFoot.y5.value, existingFoot.y5.value),
            rearYShim: shims.calcShim(idealFoot.y6.value, existingFoot.y6.value),
            frontZShim: shims.calcShim(idealFoot.z5.value, existingFoot.z5.value),
            rearZShim: shims.calcShim(idealFoot.z6.value, existingFoot.z6.value)
        };
    }
}