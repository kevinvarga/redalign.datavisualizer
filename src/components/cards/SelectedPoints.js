import { Box, Grid } from "@mui/material";
import React from "react";
import { roundToX } from "../../common/common";
import "./SelectedPoints.css";

export default function SelectedPoints(props) {
    const {result} = props;

    return(
        <Box className="four-point-panel">
            <Grid
            container
            direction="row"
            >
                <Box className="four-point-column" ></Box>
                <Box className="four-point-column" >Pump 1</Box>
                <Box className="four-point-column" >Pump 2</Box>
                <Box className="four-point-column" >Motor 1</Box>
                <Box className="four-point-column" >Motor 2</Box>
            </Grid>
            <Grid
            container
            direction="row"
            >
                <Box className="four-point-column four-point-column four-point-label">X</Box>
                <Box className="four-point-column four-point-column four-point-value">{result.pump1.x}</Box>
                <Box className="four-point-column four-point-column four-point-value">{result.pump2.x}</Box>
                <Box className="four-point-column four-point-column four-point-value">{result.motor1.x}</Box>
                <Box className="four-point-column four-point-column four-point-value">{result.motor2.x}</Box>
            </Grid>
            <Grid
            container
            direction="row"
            >
                <Box className="four-point-column four-point-label">Y</Box>
                <Box className="four-point-column four-point-value">{roundToX(result.pump1.y, 0)}</Box>
                <Box className="four-point-column four-point-value">{roundToX(result.pump2.y,0)}</Box>
                <Box className="four-point-column four-point-value">{roundToX(result.motor1.y,0)}</Box>
                <Box className="four-point-column four-point-value">{roundToX(result.motor2.y,0)}</Box>
            </Grid>
            <Grid
            container
            direction="row"
            >
                <Box className="four-point-column four-point-label">Z</Box>
                <Box className="four-point-column four-point-value">{roundToX(result.pump1.z,0)}</Box>
                <Box className="four-point-column four-point-value">{roundToX(result.pump2.z,0)}</Box>
                <Box className="four-point-column four-point-value">{roundToX(result.motor1.z,0)}</Box>
                <Box className="four-point-column four-point-value">{roundToX(result.motor2.z,0)}</Box>
            </Grid>
        </Box>
    );
}