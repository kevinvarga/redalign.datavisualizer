import { roundToX } from "../../common/common";
import ShimValues from "./ShimValues";

export default class FourPoint {
    constructor(ld, points) {
        this.laserData = ld;
        this.points = points;
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
        let pump1 = this.laserData.allValues[this.laserData.rangeY.pump[this.points.pump.start].index]; // this.laserData.allValues[this.laserData.rangeY.pump[0].index];
        let pump2 = this.laserData.allValues[this.laserData.rangeY.pump[this.points.pump.end].index]; // this.laserData.allValues[this.laserData.rangeY.pump[this.laserData.rangeY.pump.length - 1].index];
        let motor1 = this.laserData.allValues[this.laserData.rangeY.motor[this.points.motor.start].index]; // this.laserData.allValues[this.laserData.rangeY.motor[0].index];
        let motor2 = this.laserData.allValues[this.laserData.rangeY.motor[this.points.motor.end].index]; // this.laserData.allValues[this.laserData.rangeY.motor[this.laserData.rangeY.motor.length - 1].index];

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