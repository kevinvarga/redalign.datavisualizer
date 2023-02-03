import { Box } from "@mui/material";
import React from "react";
import CalculatedValue from "./CalculatedValue";

export default function FourPointValuePanel(props) {
    const {result} = props;

    return(
        <Box className="calculated-value-table" >
            <CalculatedValue title="Pump Pitch" calcValue={result.pumpPitch} />
            <CalculatedValue title="Pump Yaw" calcValue={result.pumpYaw} />
            <CalculatedValue title="Motor Pitch" calcValue={result.motorPitch} />
            <CalculatedValue title="Motor Yaw" calcValue={result.motorYaw} />
            <CalculatedValue title="Pump Y Intercept" calcValue={result.pumpYIntercept} />
            <CalculatedValue title="Pump Z Intercept" calcValue={result.pumpZIntercept} />
            <CalculatedValue title="Motor Y Intercept" calcValue={result.motorYIntercept} />
            <CalculatedValue title="Motor Z Intercept" calcValue={result.motorZIntercept} />
            <CalculatedValue title="Ideal Y5" calcValue={result.idealFoot.y5} />
            <CalculatedValue title="Ideal Z5" calcValue={result.idealFoot.z5} />
            <CalculatedValue title="Ideal Y6" calcValue={result.idealFoot.y6} />
            <CalculatedValue title="Ideal Z6" calcValue={result.idealFoot.z6} />
            <CalculatedValue title="Existing Y5" calcValue={result.existingFoot.y5} />
            <CalculatedValue title="Existing Z5" calcValue={result.existingFoot.z5} />
            <CalculatedValue title="Existing Y6" calcValue={result.existingFoot.y6} />
            <CalculatedValue title="Existing Z6" calcValue={result.existingFoot.z6} />
            <CalculatedValue title="Front Y Shim" calcValue={result.frontYShim} />
            <CalculatedValue title="Front Z Shim" calcValue={result.frontZShim} />
            <CalculatedValue title="Rear Y Shim" calcValue={result.rearYShim} />
            <CalculatedValue title="Rear Z Shim" calcValue={result.rearZShim} />
        </Box>
    );
}