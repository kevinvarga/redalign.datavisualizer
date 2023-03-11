import React, { useEffect, useState } from "react";
import { Box, Tabs, Tab, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ShimPanel from "./ShimPanel";
import CalculationPanel from "./CalculationPanel";
import { useDispatch } from "react-redux";
import { setAlgorithmValues } from "../../reducer/LaserDataSlice";
import BestFitLineGraph from "../graphs/BestFitLineGraph";
import { ExpandMore, Label } from "@mui/icons-material";

export default function BestFitLineCard(props){
    const [tabValue, setTabValue] = useState(0);
    const {laserData, reset} = props;
    const dispatch = useDispatch();

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

        let bfl;

        if(laserData.algorithm.bestfitline) {
            bfl = laserData.algorithm.bestfitline;
        } else {
            dispatch(setAlgorithmValues({algorithm:"bestfitline"}));
        }

        if(!bfl){
            return (
                <Label>
                    Calculating shims values...
                </Label>
            )
        } else {

            return (
                <>
                    <Accordion defaultExpanded={true} >
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                        >
                            <ShimPanel title="Best Fit Line" result={bfl.result} />
                        </AccordionSummary>
                        <AccordionDetails>
    
                            <Box sx={{width:"100%", flexGrow: "1"}}>
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
                                        points={bfl} 
                                    />
                                </Box>
                                <Box sx={{display: isVisible(1)}} >
                                    <CalculationPanel result={bfl.result} />
                                </Box>
                            </Box>        
                        </AccordionDetails>
                    </Accordion>
                </>
            )
        }
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