import { Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCalculationValues } from "../../reducer/LaserDataSlice";
import "./FourPointGraph.css";
import ScatterGraph from "./ScatterGraph";
let points; // needs to be outside function for scoping issue with grid events.

export default function FourPointGraph(props) {
    const canvasRefPumpY = useRef();
    const canvasRefMotorY = useRef();
    const canvasRefPumpZ = useRef();
    const canvasRefMotorZ = useRef();
    const laserData = useSelector((state) => state.laserData);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    points = laserData.calculation.fourpoint; 

    useEffect(() => {
        if(loading) {
            points = laserData.calculation.fourpoint;
            setLoading(false);
        }
    }, [loading, laserData]);

    const isSelectedPoint = (ctx) => {
        const index = ctx.dataIndex;
        const dataType = ctx.chart.canvas.dataset.type;
        
        if(points) {
            if(dataType === "pump") {
                return (index === points.pump.start) || (index === points.pump.end);    
            } else {
                return (index === points.motor.start) || (index === points.motor.end);
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
            let editPoint = (dataType === "pump") ? points.edit.pump : points.edit.motor;
            let tempPoints = JSON.parse(JSON.stringify(points));
            tempPoints[dataType][editPoint] = elements[0].index;
            dispatch(setCalculationValues({calculation:"fourpoint", values: tempPoints }));
            setLoading(true);
        }
    }

    const handlePumpToggle = (event) => {
        let tempPoints = JSON.parse(JSON.stringify(points));
        tempPoints.edit.pump = event.target.value;
        dispatch(setCalculationValues({calculation:"fourpoint", values: tempPoints }));
    }

    const handleMotorToggle = (event) => {
        let tempPoints = JSON.parse(JSON.stringify(points));
        tempPoints.edit.motor = event.target.value;
        dispatch(setCalculationValues({calculation:"fourpoint", values: tempPoints }));
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

    return (
        <Box>
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
                        refresh={loading}
                        options={graphOptions("Pump Y")}
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
                        data={[laserData.rangeZ.pump]}
                        content={
                        <canvas 
                            id="pumpZ" 
                            ref={canvasRefPumpZ} 
                            className="graph-canvas"
                            data-type="pump"
                        />}
                        options={graphOptions("Pump Z")}
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
                        options={graphOptions("Motor Z")}
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
                    value={points.edit.pump}
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
                    value={points.edit.motor}
                    exclusive
                    onChange={handleMotorToggle}
                >
                        <ToggleButton value="start">Motor 1</ToggleButton>
                        <ToggleButton value="end">Motor 2</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Grid>
        </Box>
    )
}