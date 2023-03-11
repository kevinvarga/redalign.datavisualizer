import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setAlgorithmValues } from "../../reducer/LaserDataSlice";
import "./FourPointGraph.css";
import ScatterGraph from "./ScatterGraph";
let bflLaserData;
let bflPoints; // needs to be outside the function for scoping issue with grid events.

export default function BestFitLineGraph(props) {
    const canvasBFLRefPumpY = useRef();
    const canvasBFLRefMotorY = useRef();
    const canvasBFLRefPumpZ = useRef();
    const canvasBFLRefMotorZ = useRef();
    const canvasBFLRefPumpRadius = useRef();
    const canvasBFLRefMotorRadius = useRef();
    const dispatch = useDispatch();
    const [refresh, setRefresh] = useState(true);
    const display = props.display ?? true;
    const reset = props.reset;
    bflLaserData =  props.laserData; 
    bflPoints = props.points; 
    
    useEffect(() => {
        if(display && !refresh) {
            setRefresh(true);
        } else if(refresh) {
            window.setTimeout(() => {
                setRefresh(false);
            }, 1000);
        }
    }, [display, refresh])

    const isSelectedPoint = (ctx) => {
        const index = ctx.dataIndex;
        const dataType = ctx.chart.canvas.dataset.type;
        const dataPoint = ctx.chart.data.datasets[0].data[index];

        if(bflPoints && dataPoint) {
            if(dataType === "pump") {
                return (bflPoints.pump.exclude.findIndex(e => (e === dataPoint.x)) !== -1);
            } else {
                return (bflPoints.motor.exclude.findIndex(e => (e === dataPoint.x)) !== -1);
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
            let dataPoint = evt.chart.data.datasets[0].data[elements[0].index];
            let excludeIndex = tempExcluded[dataType].exclude.findIndex(e => (e === dataPoint.x));
            
            if(excludeIndex === -1) {
                tempExcluded[dataType].exclude.push(dataPoint.x);
            } else {
                tempExcluded[dataType].exclude.splice(excludeIndex, 1);
            }            
            
            dispatch(setAlgorithmValues({algorithm:"bestfitline", values: tempExcluded }));
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
                        radius: activePointRadius, // radius of point displayed
                    }
                },
                onClick: handleChartClick,
            }
        };
    }

    return (
        <Box>
            <>
                <Grid
                    container
                    direction="row"
                >
                    <Box className="fp-chart-container" >
                        <ScatterGraph 
                            data={[bflLaserData.rangeY.pump]}
                            reset={reset}
                            content={
                            <canvas 
                                id="pumpY" 
                                ref={canvasBFLRefPumpY} 
                                className="graph-canvas"
                                data-type="pump"
                            />}
                            options={graphOptions("Pump Vertical")}
                        />
                    </Box>
                    <Box className="fp-chart-container" >
                        <ScatterGraph 
                            data={[bflLaserData.rangeY.motor]}
                            reset={reset}
                            content={
                            <canvas 
                                id="motorY" 
                                ref={canvasBFLRefMotorY} 
                                className="graph-canvas"
                                data-type="motor"
                            />}
                            options={graphOptions("Motor Vertical")}
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
                            options={graphOptions("Pump Horizontal")}
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
                            options={graphOptions("Motor Horizontal")}
                        />
                    </Box>
                </Grid>
                <Grid
                    container
                    direction="row"
                >
                    <Box className="fp-chart-container" >
                        <ScatterGraph 
                            data={[bflLaserData.rangeRadius.pump]}
                            content={
                            <canvas 
                                id="pumpRadius" 
                                ref={canvasBFLRefPumpRadius} 
                                className="graph-canvas"
                                data-type="pump"
                            />}
                            options={graphOptions("Pump Radius")}
                        />
                    </Box>
                    <Box className="fp-chart-container" >
                        <ScatterGraph 
                            data={[bflLaserData.rangeRadius.motor]}
                            content={
                            <canvas 
                                id="motorRadius" 
                                ref={canvasBFLRefMotorRadius} 
                                className="graph-canvas"
                                data-type="motor"
                            />}
                            options={graphOptions("Motor Radius")}
                        />
                    </Box>
                </Grid>
            </>
            
        </Box>
    )
}