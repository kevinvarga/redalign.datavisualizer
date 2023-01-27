import { Box, Card, CardContent, CardHeader, Grid } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { roundToX } from "../../common/common";
import CalculatedValue from "./CalculatedValue";
import LaserPoint from "./LaserPoint";

export default function FourPointCard() {
    const laserData = useSelector((state) => state.laserData);
    const X5 = 475000;
    const X6 = 650000;

    const calcSlope = (x1, y1, x2, y2) => {
        let slope = (y2 - y1)/(x2-x1);
        return {
            value: slope,
            formula: `(${y2} - ${y1})/(${x2} - ${x1})`
        };
    }

    const calcIntercept = (slope, x, y) => {
        let intercept = (y - (slope * x));
        return {
            value: intercept,
            formula: `${y} - (${roundToX(slope, 5)} * ${x})`
        }
    }

    const calcYZ = (pitchYaw, footPosition, intercept) => {
        return {
            value: (pitchYaw * footPosition + intercept),
            formula: `${roundToX(pitchYaw,5)} * ${footPosition} + ${roundToX(intercept,5)}`
        };
    }

    const calcFootXY = (pitch, yaw, yIntercept, zIntercept) => {
        return {
            y5: calcYZ(pitch, X5, yIntercept),
            y6: calcYZ(pitch, X6, yIntercept),
            z5: calcYZ(yaw, X5, zIntercept),
            z6: calcYZ(yaw, X6, zIntercept)
        };
    }

    const calcShim = (ideal, existing) => {
        const micron = 0.00003937;
        const shim = ideal - existing
        return {
            value: shim,
            formula: `${roundToX(ideal,5)} - ${roundToX(existing,5)}`,
            converted: shim * micron
        }
    }

    const calculate = () => {
        let pump1 = laserData.allValues[laserData.selectedY.pump[0].index];
        let pump2 = laserData.allValues[laserData.selectedY.pump[laserData.selectedY.pump.length - 1].index];
        let motor1 = laserData.allValues[laserData.selectedY.motor[0].index];
        let motor2 = laserData.allValues[laserData.selectedY.motor[laserData.selectedY.motor.length - 1].index];


        let pPitch = calcSlope(pump1.x, pump1.y, pump2.x, pump2.y);
        let pYaw = calcSlope(pump1.x, pump1.z, pump2.x, pump2.z);
        let pYIntercept = calcIntercept(pPitch.value, pump1.x, pump1.y);
        let pZIntercept = calcIntercept(pYaw.value, pump1.x, pump1.z);

        let mPitch = calcSlope(motor1.x, motor1.y, motor2.x, motor2.y);
        let mYaw = calcSlope(motor1.x, motor1.z, motor2.x, motor2.z);
        let mYIntercept = calcIntercept(mPitch.value, motor1.x, motor1.y);
        let mZIntercept = calcIntercept(mYaw.value, motor1.x, motor1.z);

        let idealFoot = calcFootXY(pPitch.value, pYaw.value, pYIntercept.value, pZIntercept.value);
        let existingFoot = calcFootXY(mPitch.value, mYaw.value, mYIntercept.value, mZIntercept.value);

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
            frontYShim: calcShim(idealFoot.y5.value, existingFoot.y5.value),
            rearYShim: calcShim(idealFoot.y6.value, existingFoot.y6.value),
            frontZShim: calcShim(idealFoot.z5.value, existingFoot.z5.value),
            rearZShim: calcShim(idealFoot.z6.value, existingFoot.z6.value)
        };
    }

    const formatResult = (result) => {
        return(
            <Box sx={{fontSize: "10pt"}}>
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    className="calculated-value-table"
                >
                    <LaserPoint title="Pump 1" point={result.pump1} />
                    <LaserPoint title="Pump 2" point={result.pump2} />            
                    <LaserPoint title="Motor 1" point={result.motor1} />
                    <LaserPoint title="Motor 2" point={result.motor2} />
                    <Box>
                        <p>X5: <b>{X5}</b></p>
                        <p>X6: <b>{X6}</b></p>
                    </Box>            
                </Grid>
                <Grid container className="calculated-value-table">
                    <CalculatedValue title="Pump Pitch" calcValue={result.pumpPitch} />
                    <CalculatedValue title="Pump Yaw" calcValue={result.pumpYaw} />
                    <CalculatedValue title="Motor Pitch" calcValue={result.motorPitch} />
                    <CalculatedValue title="Motor Yaw" calcValue={result.motorYaw} />
                    <CalculatedValue title="Pump Y Intercept" calcValue={result.pumpYIntercept} />
                    <CalculatedValue title="Pump Z Intercept" calcValue={result.pumpZIntercept} />
                    <CalculatedValue title="Motor Y Intercept" calcValue={result.motorYIntercept} />
                    <CalculatedValue title="Motor Z Intercept" calcValue={result.motorZIntercept} />
                    <CalculatedValue title="Ideal Y5" calcValue={result.idealFoot.y5} />
                    <CalculatedValue title="Ideal Z5" calcValue={result.idealFoot.z5} />
                    <CalculatedValue title="Ideal Y6" calcValue={result.idealFoot.y6} />
                    <CalculatedValue title="Ideal Z6" calcValue={result.idealFoot.z6} />
                    <CalculatedValue title="Existing Y5" calcValue={result.existingFoot.y5} />
                    <CalculatedValue title="Existing Z5" calcValue={result.existingFoot.z5} />
                    <CalculatedValue title="Existing Y6" calcValue={result.existingFoot.y6} />
                    <CalculatedValue title="Existing Z6" calcValue={result.existingFoot.z6} />
                    <CalculatedValue title="Front Y Shim" calcValue={result.frontYShim} />
                    <CalculatedValue title="Front Z Shim" calcValue={result.frontZShim} />
                    <CalculatedValue title="Rear Y Shim" calcValue={result.rearYShim} />
                    <CalculatedValue title="Rear Z Shim" calcValue={result.rearZShim} />
                </Grid>
            </Box>
        )
    }

    return(
        <Card variant="outlined" className="calculated-value-card" >
            <CardContent>
                {((laserData.selectedY.pump.length > 0) && (laserData.selectedY.motor.length > 0)) ? (
                    <>
                        <CardHeader sx={{padding: "5px"}} title="Four Point" />
                        {formatResult(calculate())}
                    </>                
                ) : (
                    <>
                        <CardHeader title="Four Point" subheader="Select pump and motor data" />
                    </>
                )}
            </CardContent>
        </Card>
    )
}