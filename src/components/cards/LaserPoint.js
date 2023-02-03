import { Box, Grid } from "@mui/material";
import React from "react";
import "./LaserPoint.css";

export default function LaserPoint(props) {
    const {title, point} = props;

    return(
        <Box sx={{padding: "5px", position: "relative", width:"20%"}}>
            <Grid
            container
            direction="row"
            >
                <Box className="laserpoint-title" >{title}</Box>
            </Grid>
            <Grid
            container
            direction="row"
            >
                <Box className="laserpoint-label">x</Box>
                <Box className="laserpoint-value">{point.x}</Box>
            </Grid>
            <Grid
            container
            direction="row"
            >
                <Box className="laserpoint-label">y</Box>
                <Box className="laserpoint-value">{point.y}</Box>
            </Grid>
            <Grid
            container
            direction="row"
            >
                <Box className="laserpoint-label">z</Box>
                <Box className="laserpoint-value">{point.z}</Box>
            </Grid>
        </Box>
    );
}