import { Box, Grid, Tabs, Tab, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCalculationValues } from "../../reducer/LaserDataSlice";
import FourPoint from "../calculations/FourPoint";
import FourPointGraph from "../graphs/FourPointGraph";
import ShimPanel from "./ShimPanel";
import CalculationPanel from "./CalculationPanel";
import { ExpandMore } from "@mui/icons-material";

export default function FourPointCard(props) {
    const {laserData, reset} = props;
    const dispatch = useDispatch();
    const [tabValue, setTabValue] = useState(0);

    let points;
    let result;
    let fp;

    useEffect(() => {
        if(reset) {
            setTabValue(0);
        }
    }, [reset])

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    }

    const isVisible = (index) => {
        return (tabValue === index) ? "" : "none";
    }

    const formatResult = () => {

        if(laserData.calculation.fourpoint) {
            points = laserData.calculation.fourpoint;
        } else {
            points = {
                pump: {
                    start: 0,
                    end: laserData.rangeY.pump.length - 1,
                },
                motor: {
                    start: 0,
                    end: laserData.rangeY.motor.length - 1,
                },
                edit: {
                    pump: "start",
                    motor: "start"
                }
            }
            dispatch(setCalculationValues({calculation:"fourpoint", values:points}));
        }
    
        fp = new FourPoint(laserData, points);
        result = fp.calculate();
        
        return(
            <>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}    
                    >
                        <ShimPanel title="Four Point" result={result} />
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{width:"100%", height: "555px"}}>
                            <Box sx={{paddingBottom: "3px"}}>
                                <Tabs
                                    value={tabValue}
                                    onChange={handleTabChange}
                                >
                                    <Tab label="Calculations" />
                                    <Tab label="Edit Points" />
                                </Tabs>
                            </Box>

                            <Box sx={{display: isVisible(0)}}>
                                <CalculationPanel result={result} />
                            </Box>
                            <Box sx={{display: isVisible(1)}} >
                                <FourPointGraph result={result} laserData={laserData} />
                            </Box>  
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </>
        )
    }

    return(
        <Box  className="calculated-value-card" >
            {((laserData.rangeY.pump.length > 0) && (laserData.rangeY.motor.length > 0)) ? (
                <Box >
                    {formatResult()}
                </Box>                
            ) : (
            <>
                <p>Four Point</p>
                <label>Select pump and motor data</label>
            </>
            )}
        </Box>
    )
}

/*

<Box>
                        <p>X5: <b>{fp.X5}</b></p>
                        <p>X6: <b>{fp.X6}</b></p>
                    </Box>            
                    <Box>
                        
                    </Box>

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
        let pump1 = laserData.allValues[laserData.rangeY.pump[0].index];
        let pump2 = laserData.allValues[laserData.rangeY.pump[laserData.rangeY.pump.length - 1].index];
        let motor1 = laserData.allValues[laserData.rangeY.motor[0].index];
        let motor2 = laserData.allValues[laserData.rangeY.motor[laserData.rangeY.motor.length - 1].index];


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
    */
