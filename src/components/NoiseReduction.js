import { Box, Button, FormControlLabel, FormGroup, Switch, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loadData, saveNoiseReduction } from "../reducer/LaserDataSlice";

export default function NoiseReduction(props) {
    const {laserData, loading} = props;
    const nrEnabled = Boolean(laserData.noiseReduction.isEnabled);
    const includeRadius = Boolean(laserData.noiseReduction.includeRadius);
    const [tolerance, setTolerance] = useState(Number(laserData.noiseReduction.tolerance));
    const dispatch = useDispatch();

    useEffect(() => {
        if(loading) {
            setTolerance(Number(laserData.noiseReduction.tolerance));
        }
    }, [loading, laserData.noiseReduction.tolerance])

    const handleChange = (evt) => {
        let nr = {isEnabled: evt.target.checked, tolerance: tolerance, includeRadius: includeRadius};
        dispatch(saveNoiseReduction(nr));
        updateData(nr);
    }

    const handleRadiusChange = (evt) => {
        let nr = {isEnabled: nrEnabled, tolerance: tolerance, includeRadius: evt.target.checked};
        dispatch(saveNoiseReduction(nr));
        updateData(nr);
    }

    const handleToleranceChange = (evt) => {
        setTolerance(evt.target.value);
    }

    const disableApply = () => {
        if(nrEnabled) {
            return (tolerance.length === 0) || (Number(tolerance) === Number(laserData.noiseReduction.tolerance));
        } else {
            return true;
        }
    }

    const handleApplyClick = (evt) => {
        let nr = {isEnabled: nrEnabled, tolerance: tolerance, includeRadius: includeRadius};
        dispatch(saveNoiseReduction(nr));
        updateData(nr);
    }

    const updateData = (nr) => {

        dispatch(loadData({
            id: laserData.id,
            endDate: laserData.endDate,
            rawData: [...laserData.rawData], // JSON.parse(JSON.stringify(laserData.rawData)),
            isSurfaceCorrected: laserData.isSurfaceCorrected,
            state: {
                algorithm: JSON.parse(JSON.stringify(laserData.algorithm)),
                ranges: JSON.parse(JSON.stringify(laserData.ranges)),
                noiseReduction: nr,
            },
            calculateResults: true,
        }));
    }

    return (
        <Box sx={{width: "100%", paddingTop:"8px"}}>
            <form>

            <FormGroup row>
                <FormControlLabel 
                    label="Noise Reduction" 
                    labelPlacement="start"
                    control={
                        <Switch checked={nrEnabled} onChange={handleChange} />
                    } 
                    sx={{paddingRight:"8px"}}
                />
                <FormControlLabel
                    label="Include Radius"
                    labelPlacement="start"
                    control={
                        <Switch 
                            disabled={!nrEnabled}
                            checked={includeRadius}
                            onChange={handleRadiusChange}
                        />
                    }
                    sx={{paddingRight: "10px"}}
                />
                <TextField 
                    label="Tolerance (microns)"
                    disabled={!nrEnabled} 
                    value={tolerance}
                    variant="standard" 
                    onChange={handleToleranceChange}
                    inputProps={{ 
                        inputMode: 'numeric', 
                        pattern: '[0-9]*'
                    }}
                    size="small"
                    sx={{paddingRight: "10px"}}
                />
                <Button 
                    type="submit"
                    variant="contained" 
                    disabled={disableApply()} 
                    onClick={handleApplyClick}
                >Apply</Button>
            </FormGroup>
            </form>
        </Box>
    )
}