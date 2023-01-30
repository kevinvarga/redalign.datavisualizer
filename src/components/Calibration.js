import React, { useEffect } from "react";
import { Chip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { loadCalibrationData } from "../reducer/SurfaceCorrectionSlice";
import { CheckCircle } from "@mui/icons-material";
import CancelIcon from '@mui/icons-material/Cancel';

export default function Calibration() {
    const corrections = useSelector((state) => state.surfaceCorrection.corrections)
    const dispatch = useDispatch();

    useEffect(() => {
        if(corrections.length === 0) {
            let client = new XMLHttpRequest();
            client.open('GET', '/calibration.tsv');
            client.onreadystatechange = (event) => {
                if(event.target.readyState === 4) {
                    dispatch(loadCalibrationData(client.responseText));
                }
            }
            client.send();
        }
    }, [corrections, dispatch]);

    return(
         <Chip avatar={ 
            (corrections.length > 0) ?
            <CheckCircle style={{color: '#4caf50'}} /> :
            <CancelIcon style={{color: '#f55a4e'}} />
            }
            label="Surface Correction" 
            variant="outlined" 
        />
    );
}