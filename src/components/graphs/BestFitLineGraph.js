import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setCalculationValues } from "../../reducer/LaserDataSlice";
import "./FourPointGraph.css";
import ScatterGraph from "./ScatterGraph";
let bflLaserData;
let bflPoints; // needs to be outside function for scoping issue with grid events.

export default function BestFitLineGraph(props) {
    const canvasBFLRefPumpY = useRef();
    const canvasBFLRefMotorY = useRef();
    const canvasBFLRefPumpZ = useRef();
    const canvasBFLRefMotorZ = useRef();
    const dispatch = useDispatch();
    const [refresh, setRefresh] = useState(true);
    const display = props.display ?? true;
    bflLaserData =  props.laserData; 
    bflPoints = props.points; 

    useEffect(() => {
        if(display && !refresh) {
            setRefresh(true);
        } else if(refresh) {
            window.setTimeout(() => {
                setRefresh(false);
            }, 100);
        }
    }, [display, refresh])

    const isSelectedPoint = (ctx) => {
        const index = ctx.dataIndex;
        const dataType = ctx.chart.canvas.dataset.type;
        
        if(bflPoints) {
            if(dataType === "pump") {
                return (bflPoints.pump.exclude.indexOf(index) !== -1);
            } else {
                return (bflPoints.motor.exclude.indexOf(index) !== -1);
            }
        } else {
            return false;
        }
    }

    const activePointColor = (ctx) => {
        return isSelectedPoint(ctx) ? 'rgb(255, 0, 0, .5)' : 'rgba(10, 10, 10, .5)';
    }

    const activePointRadius = (ctx) => {
        return isSelectedPoint(ctx) ? 6 : 3;
    }

    const activePointStyle = (ctx) => {
        return isSelectedPoint(ctx) ?  'crossRot' : 'circle'; 
    }

    const handleChartClick = (evt) => {
        let elements = evt.chart.getActiveElements();
        if(bflPoints && elements.length > 0) {
            const dataType = evt.chart.canvas.dataset.type;
            let tempExcluded = JSON.parse(JSON.stringify(bflPoints));
            let excludeIndex = tempExcluded[dataType].exclude.indexOf(elements[0].index);
            
            if(excludeIndex === -1) {
                tempExcluded[dataType].exclude.push(elements[0].index);
            } else {
                tempExcluded[dataType].exclude.splice(excludeIndex, 1);
            }            
            
            dispatch(setCalculationValues({calculation:"bestfitline", values: tempExcluded }));
        }
    }


    const graphOptions = (title) => {
        return{
            type: "scatter",
            data: {
                datasets: [
                    {
                        label: 'All Data',
                        data: [],
                        trendlineLinear: {
                            style: "rgba(255,105,180, .8)",
                            lineStyle: "dotted|solid",
                            width: 2
                        }
                    },
                ]
            },
            options: {
                //Customize chart options
                maintainAspectRatio: false,
                animation: {
                    duration: 0
                },
                select: {
                    enabled: false,
                },
                plugins: {
                    title: {
                        display: true,
                        text: title
                    },
                    legend: {
                        display: false,
                    }
                },
                elements: {
                    point: {
                        backgroundColor: activePointColor,
                        borderColor: activePointColor,
                        pointStyle: activePointStyle,
                        radius: activePointRadius,
                    }
                },
                onClick: handleChartClick,
            }
        };
    }

    return (
        <Box>
            {(refresh) ? 
            (<><label>Loading charts...</label></>) 
            : (
                <>
                    <Grid
                        container
                        direction="row"
                    >
                        <Box className="fp-chart-container" >
                            <ScatterGraph 
                                data={[bflLaserData.rangeY.pump]}
                                content={
                                <canvas 
                                    id="pumpY" 
                                    ref={canvasBFLRefPumpY} 
                                    className="graph-canvas"
                                    data-type="pump"
                                />}
                                options={graphOptions("Pump Y")}
                            />
                        </Box>
                        <Box className="fp-chart-container" >
                            <ScatterGraph 
                                data={[bflLaserData.rangeY.motor]}
                                content={
                                <canvas 
                                    id="motorY" 
                                    ref={canvasBFLRefMotorY} 
                                    className="graph-canvas"
                                    data-type="motor"
                                />}
                                options={graphOptions("Motor Y")}
                            />
                        </Box>
                    </Grid>
                    <Grid
                        container
                        direction="row"
                    >
                        <Box className="fp-chart-container" >
                            <ScatterGraph 
                                data={[bflLaserData.rangeZ.pump]}
                                content={
                                <canvas 
                                    id="pumpZ" 
                                    ref={canvasBFLRefPumpZ} 
                                    className="graph-canvas"
                                    data-type="pump"
                                />}
                                options={graphOptions("Pump Z")}
                            />
                        </Box>
                        <Box className="fp-chart-container" >
                            <ScatterGraph 
                                data={[bflLaserData.rangeZ.motor]}
                                content={
                                <canvas 
                                    id="motorZ" 
                                    ref={canvasBFLRefMotorZ} 
                                    className="graph-canvas"
                                    data-type="motor"
                                />}
                                options={graphOptions("Motor Z")}
                            />
                        </Box>
                    </Grid>
                </>
            )}
        </Box>
    )
}


/*     const handlePumpToggle = (event) => {
        let tempPoints = JSON.parse(JSON.stringify(points));
        tempPoints.edit.pump = event.target.value;
        dispatch(setCalculationValues({calculation:"fourpoint", values: tempPoints }));
    }

    const handleMotorToggle = (event) => {
        let tempPoints = JSON.parse(JSON.stringify(points));
        tempPoints.edit.motor = event.target.value;
        dispatch(setCalculationValues({calculation:"fourpoint", values: tempPoints }));
    } */