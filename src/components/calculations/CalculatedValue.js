import { Box, Grid } from "@mui/material";
import React from "react";
import { roundToX } from "../../common/common";
import "./calculations.css";

export default function CalculatedValue(props) {
    const {title, calcValue} = props;

    return (
        <Grid
            container
            direction="row"
        >
            <Box className="calculated-value-title" >{title}</Box>
            <Box className="calculated-value">{roundToX(calcValue.value, 5)} {(calcValue.converted) ? (`(${roundToX(calcValue.converted, 3)}")`) : ("")}</Box>
            <Box className="calculated-value-formula">{calcValue.formula}</Box>
        </Grid>
    );
}