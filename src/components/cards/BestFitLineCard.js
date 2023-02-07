import React, { useEffect, useState } from "react";
import { Box, Tabs, Tab, Accordion, AccordionSummary } from "@mui/material";
import BestFitLine from "../calculations/BestFitLine";
import ShimPanel from "./ShimPanel";
import CalculationPanel from "./CalculationPanel";
import { useDispatch } from "react-redux";
import { setCalculationValues } from "../../reducer/LaserDataSlice";
import BestFitLineGraph from "../graphs/BestFitLineGraph";
import { ExpandMore } from "@mui/icons-material";

export default function BestFitLineCard(props){
    const {laserData, reset} = props;
    const dispatch = useDispatch();
    const [tabValue, setTabValue] = useState(0);

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

        let points;

        if(laserData.calculation.bestfitline) {
            points = laserData.calculation.bestfitline;
        } else {
            points = {
                pump: {
                    exclude: []
                },
                motor: {
                    exclude: []
                }
            }
            dispatch(setCalculationValues({calculation:"bestfitline", values:points}));
        }

        let bfl = new BestFitLine(laserData);
        let result = bfl.calculate();
        return (
            <>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                    >
                        <ShimPanel title="Best Fit Line" result={result} />
                    </AccordionSummary>
                    <AccordionSummary>
                        <Box sx={{width:"100%", height: "525px"}}>
                            <Box sx={{paddingBottom: "3px"}}>
                                <Tabs
                                    value={tabValue}
                                    onChange={handleTabChange}
                                >
                                    <Tab label="Edit Points" />
                                    <Tab label="Calculations" />
                                </Tabs>
                            </Box>

                            <Box sx={{display: isVisible(0)}}>
                                <BestFitLineGraph 
                                    reset={reset}
                                    display={isVisible(0)} 
                                    laserData={laserData} 
                                    points={points} 
                                />
                            </Box>
                            <Box sx={{display: isVisible(1)}} >
                                <CalculationPanel result={result} />
                            </Box>
                        </Box>        
                    </AccordionSummary>
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
                <p>Best Fit Line</p>
                <label>Select pump and motor data</label>
            </>
            )}
        </Box>
    );
}