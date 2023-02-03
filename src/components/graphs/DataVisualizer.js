import { Box } from "@mui/material";
import React, { useRef } from "react";
import ScatterGraph from "./ScatterGraph";
import "./DataVisualizer.css";

export default function DataVisualizer(props) {
    const canvasRefXY = useRef(null);
    const canvasRefXZ = useRef(null);
    const {laserData, reset, onRangeUpdated} = props;

    const onDataSelected = (start, end) => {
        if(onRangeUpdated) {
            onRangeUpdated(start, end);
        }
    }

    const graphOptions = (title, legendDisplay = true, legendPosition = "right")=>{
        
        return{
            type: "scatter",
            data: {
                datasets: [
                    {
                        label: 'Pump',
                        data: [],
                        backgroundColor: 'rgb(255,0,0)'
                    },
                    {
                        label: 'Motor',
                        data: [],
                        backgroundColor: 'rgba(10,255,10,1)'
                    },
                    {
                        label: 'All Data',
                        data: [],
                        backgroundColor: 'rgba(10, 10, 10, .5)',
                    }
                ]
            },
            options: {
                //Customize chart options
                maintainAspectRatio: false,
                animation: {
                    duration: 0
                },
                select: {
                    enabled: true,
                    onDataSelected: onDataSelected
                },
                plugins: {
                    title: {
                        display: true,
                        text: title
                    },
                    legend: {
                        display: (legendDisplay),
                        position: (legendPosition),
                    }
                }
            }
        };
    }

    return (
        <Box>
            <Box className="chart-container" >
                <ScatterGraph
                    data={[laserData.rangeY.pump,laserData.rangeY.motor, laserData.YValues]}
                    min={{x:laserData.minXYZ.x, y:laserData.minXYZ.y}}
                    max={{x:laserData.maxXYZ.x, y:laserData.maxXYZ.y}}
                    reset={reset}
                    content={
                    <canvas 
                        id="chartXY" 
                        ref={canvasRefXY} 
                        className="graph-canvas"
                    />}
                    options={graphOptions("Y Values", false)}
                />
            </Box>
            <Box className="chart-container" >
                <ScatterGraph
                        data={[laserData.rangeZ.pump,laserData.rangeZ.motor, laserData.ZValues]}
                        min={{x:laserData.minXYZ.x, y:laserData.minXYZ.z}}
                        max={{x:laserData.maxXYZ.x, y:laserData.maxXYZ.z}}
                        reset={reset}
                        content={
                        <canvas 
                            id="chartXZ" 
                            ref={canvasRefXZ} 
                            className="graph-canvas"
                        />}
                        options={graphOptions("Z Values", true, "bottom")}
                    />
            </Box>
        </Box>
    );
}