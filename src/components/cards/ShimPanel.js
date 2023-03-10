import { Box, Grid } from "@mui/material";
import React from "react";
import { roundToX } from "../../common/common";
import "./ShimPanel.css";

export default function ShimPanel(props) {
    const {result, title} = props;

    return (
        <Box className="shim-panel" >
            <Grid
            container
            direction="row"
            >
                <Box className="shim-column shim-title" >{title} - Shim Values</Box>
                <Box className="shim-column shim-label" ></Box>
                <Box className="shim-column shim-caption" >Front</Box>
                <Box className="shim-column shim-caption" >Rear</Box>
            </Grid>
            <Grid
            container
            direction="row"
            >
                <Box className="shim-column shim-title"></Box>
                <Box className="shim-column shim-label">Vertical</Box>
                <Box className="shim-column shim-value">{`${roundToX(result.frontYShim.converted, 3).toFixed(3)}"`}</Box>
                <Box className="shim-column shim-value">{`${roundToX(result.rearYShim.converted, 3).toFixed(3)}"`}</Box>
            </Grid>
            <Grid
            container
            direction="row"
            >
                <Box className="shim-column shim-title"></Box>
                <Box className="shim-column shim-label">Horizontal</Box>
                <Box className="shim-column shim-value">{`${roundToX(result.frontZShim.converted, 3).toFixed(3)}"`}</Box>
                <Box className="shim-column shim-value">{`${roundToX(result.rearZShim.converted, 3).toFixed(3)}"`}</Box>
            </Grid>
        </Box>
    );
}