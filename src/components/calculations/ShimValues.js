import { roundToX } from "../../common/common";

export default class ShimValues {
    constructor() {
        this.X5 = 475000;
        this.X6 = 650000;
    }

    calcYZ = (pitchYaw, footPosition, intercept) => {
        return {
            value: (pitchYaw * footPosition + intercept),
            formula: `${roundToX(pitchYaw,5)} * ${footPosition} + ${roundToX(intercept,5)}`
        };
    }

    calcFootXY = (pitch, yaw, yIntercept, zIntercept) => {
        return {
            y5: this.calcYZ(pitch, this.X5, yIntercept),
            y6: this.calcYZ(pitch, this.X6, yIntercept),
            z5: this.calcYZ(yaw, this.X5, zIntercept),
            z6: this.calcYZ(yaw, this.X6, zIntercept)
        };
    }

    calcShim = (ideal, existing) => {
        const micron = 0.00003937;
        const shim = ideal - existing
        return {
            value: shim,
            formula: `${roundToX(ideal,5)} - ${roundToX(existing,5)}`,
            converted: shim * micron
        }
    }
}