import { Box, Grid } from "@mui/material";
import React from "react";
import { roundToX } from "../../common/common";

export default function FourPointShims(props) {
    const {result} = props;

/*
<CalculatedValue title="Front Y Shim" calcValue={result.frontYShim} />
            <CalculatedValue title="Front Z Shim" calcValue={result.frontZShim} />
            <CalculatedValue title="Rear Y Shim" calcValue={result.rearYShim} />
            <CalculatedValue title="Rear Z Shim" calcValue={result.rearZShim} />
*/
    return (
        <Box sx={{width:"20%"}}>
            <Grid
            container
            direction="row"
            >
                <Box className="laserpoint-title" >Shims</Box>
            </Grid>
            <Grid
            container
            direction="row"
            >
                <Box className="laserpoint-label">Front Y</Box>
                <Box className="laserpoint-value">{`${roundToX(result.frontYShim.converted, 3)}"`}</Box>
                <Box className="laserpoint-label">Front Z</Box>
                <Box className="laserpoint-value">{`${roundToX(result.frontZShim.converted, 3)}"`}</Box>
            </Grid>
            <Grid
            container
            direction="row"
            >
                <Box className="laserpoint-label">Rear Y</Box>
                <Box className="laserpoint-value">{`${roundToX(result.rearYShim.converted, 3)}"`}</Box>
                <Box className="laserpoint-label">Rear Z</Box>
                <Box className="laserpoint-value">{`${roundToX(result.rearZShim.converted, 3)}"`}</Box>
            </Grid>
        </Box>
    );
}