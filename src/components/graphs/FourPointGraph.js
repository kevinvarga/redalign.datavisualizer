import { Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setAlgorithmValues } from "../../reducer/LaserDataSlice";
import SelectedPoints from "../cards/SelectedPoints";
import "./FourPointGraph.css";
import ScatterGraph from "./ScatterGraph";
let laserData;
let points; // needs to be outside the function for scoping issue with grid events.

export default function FourPointGraph(props) {
    const canvasRefPumpY = useRef();
    const canvasRefMotorY = useRef();
    const canvasRefPumpZ = useRef();
    const canvasRefMotorZ = useRef();
    const dispatch = useDispatch();
    const [refresh, setRefresh] = useState(true);
    const display = props.display ?? true;
    const result = props.result;

    laserData =  props.laserData; //useSelector((state) => state.laserData);
    points = laserData.algorithm.fourpoint; 

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
        if(points && dataPoint) {
            if(dataType === "pump") {
                return (dataPoint.x === points.pump.start) || (dataPoint.x === points.pump.end);    
            } else {
                return (dataPoint.x === points.motor.start) || (dataPoint.x === points.motor.end);
            }
        } else {
            return false;
        }
    }

    const activePointColor = (ctx) => {
        return isSelectedPoint(ctx) ? 'rgba(255, 0, 0, .5)' : 'rgba(10, 10, 10, .5)';
    }

    const activePointRadius = (ctx) => {
        return isSelectedPoint(ctx) ? 6 : 3;
    }

    const activePointStyle = (ctx) => {
        return isSelectedPoint(ctx) ?  'rect' : 'circle'; 
    }

    const handleChartClick = (evt) => {
        let elements = evt.chart.getActiveElements();
        if(points && elements.length > 0) {
            const dataType = evt.chart.canvas.dataset.type;
            let dataPoint = evt.chart.data.datasets[0].data[elements[0].index];
            let editPoint = (dataType === "pump") ? points.edit.pump : points.edit.motor;
            let tempPoints = JSON.parse(JSON.stringify(points));
            tempPoints[dataType][editPoint] = dataPoint.x;
            dispatch(setAlgorithmValues({algorithm:"fourpoint", values: tempPoints }));
        }
    }

    const handlePumpToggle = (event) => {
        let tempPoints = JSON.parse(JSON.stringify(points));
        tempPoints.edit.pump = event.target.value;
        dispatch(setAlgorithmValues({algorithm:"fourpoint", values: tempPoints }));
    }

    const handleMotorToggle = (event) => {
        let tempPoints = JSON.parse(JSON.stringify(points));
        tempPoints.edit.motor = event.target.value;
        dispatch(setAlgorithmValues({algorithm:"fourpoint", values: tempPoints }));
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
                        pointStyle: activePointStyle,
                        radius: activePointRadius,
                    }
                },
                onClick: handleChartClick,
            }
        };
    }

    const renderPoints = () => {
        if(result) {
            return(
                <Grid
                    container
                    direction="row"
                >
                    <SelectedPoints result={result} />

                </Grid>
            );
        }
    }

    return (
        <Box>
                <>
                    {renderPoints()}
                    <Grid
                        container
                        direction="row"
                    >
                        <Box className="fp-chart-container" >
                            <ScatterGraph 
                                data={[laserData.rangeY.pump]}
                                content={
                                <canvas 
                                    id="pumpY" 
                                    ref={canvasRefPumpY} 
                                    className="graph-canvas"
                                    data-type="pump"
                                />}
                                options={graphOptions("Pump Vertical")}
                            />
                        </Box>
                        <Box className="fp-chart-container" >
                            <ScatterGraph 
                                data={[laserData.rangeY.motor]}
                                content={
                                <canvas 
                                    id="motorY" 
                                    ref={canvasRefMotorY} 
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
                                data={[laserData.rangeZ.pump]}
                                content={
                                <canvas 
                                    id="pumpZ" 
                                    ref={canvasRefPumpZ} 
                                    className="graph-canvas"
                                    data-type="pump"
                                />}
                                options={graphOptions("Pump Horizontal")}
                            />
                        </Box>
                        <Box className="fp-chart-container" >
                            <ScatterGraph 
                                data={[laserData.rangeZ.motor]}
                                content={
                                <canvas 
                                    id="motorZ" 
                                    ref={canvasRefMotorZ} 
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
                        <Box className="fp-togglebutton-container">
                            <ToggleButtonGroup
                            color="primary"
                            value={points ? points.edit.pump : "start"}
                            exclusive
                            onChange={handlePumpToggle}
                        >
                                <ToggleButton value="start">Pump 1</ToggleButton>
                                <ToggleButton value="end">Pump 2</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                        <Box className="fp-togglebutton-container">
                            <ToggleButtonGroup
                            color="primary"
                            value={points ? points.edit.motor : "start"}
                            exclusive
                            onChange={handleMotorToggle}
                        >
                                <ToggleButton value="start">Motor 1</ToggleButton>
                                <ToggleButton value="end">Motor 2</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </Grid>
                </>
        </Box>
    )
}