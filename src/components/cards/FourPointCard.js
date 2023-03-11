import { Box, Tabs, Tab, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAlgorithmValues } from "../../reducer/LaserDataSlice";
import FourPointGraph from "../graphs/FourPointGraph";
import ShimPanel from "./ShimPanel";
import CalculationPanel from "./CalculationPanel";
import { ExpandMore } from "@mui/icons-material";

export default function FourPointCard(props) {
    const {laserData, reset} = props;
    const dispatch = useDispatch();
    const [tabValue, setTabValue] = useState(0);

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

        if(laserData.algorithm.fourpoint) {
            fp = laserData.algorithm.fourpoint;
        } else {
            dispatch(setAlgorithmValues({algorithm:"fourpoint"}));
        }
    
        if(!fp){
            return (
                <Accordion>
                    <AccordionSummary>
                        Calculating shims values...
                    </AccordionSummary>
                </Accordion>
            )
        } else {
            return(
                <>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMore />}    
                        >
                            <ShimPanel title="Four Point" result={fp.result} />
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{width:"100%", height: "555px"}}>
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
                                    <FourPointGraph 
                                        reset={reset}
                                        result={fp.result} 
                                        laserData={laserData} 
                                    />
                                </Box>
                                <Box sx={{display: isVisible(1)}} >
                                    <CalculationPanel result={fp.result} />
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
                <p>Four Point</p>
                <label>Select pump and motor data</label>
            </>
            )}
        </Box>
    )
}