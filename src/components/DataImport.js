import { Box, Button, Grid } from '@mui/material';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { loadData } from '../reducer/LaserDataSlice.js';
import Calibration from './Calibration.js';
import DataWatcher from './data/DataWatcher.js';


export default function DataImport(props) {
    const corrections = useSelector((state) => state.surfaceCorrection.corrections);
    const [fileName, setFileName] = useState("");
    const onFileSelected = props.onFileSelected;
    const onLoaded = props.onLoaded;
    const onUnload = props.onUnload;
    const dispatch = useDispatch();
    let fileReader;

    const handleFileRead = () => {
        const contents = fileReader.result;
        let lines = contents.split('\n');
        const data = [];

        for(let l=0;l<lines.length;l++) {
          let line = lines[l].replace('\r','').split('\t');
          
          if(line[1] !== '' && !isNaN(line[0]) && !isNaN(line[1]) && !isNaN(line[2]) && !isNaN(line[3])) {
            
            data.push({x:Number(line[0]),y:Number(line[1]),z:Number(line[2]),radius:Number(line[3])});
          }
        }

        dispatch(loadData({rawData:data, surfaceCorrection:corrections}));
        if(onLoaded){
            onLoaded();
        }
    }

    const handleDownloaded = (id, data) => {
        dispatch(loadData({id:id, 
                            endDate:data.end,
                            rawData:data.measurements,
                            state: data.state ?? undefined, 
                            surfaceCorrection:corrections}));
        if(onLoaded){
            onLoaded();
        }
    }

    const handleUnload = () => {
        setFileName("");
        if(onUnload) {
            onUnload();
        }
    }

    const handleFileChosen = (file) => {
        setFileName(file.name);
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file);
        if(onFileSelected) {
            onFileSelected();
        }
    };

    const handleDataAvailable = () => {
        if(onFileSelected) {
            onFileSelected();
        }
    }

    return (
        <Grid container
            direction="row"
            justifyContent="space-evenly"
            alignItems="flex-start"
            justifyItems="center"
            sx={{padding: "3px", width: "100%", backgroundColor: "black"}}
        >
            <Box><img height="50px" src="./images/logo-reverse.png" alt='logo' /></Box>
            <Box sx={{paddingTop: "9px"}} >
                <Button
                    variant="contained"
                    component="label"
                    sx={{display:"none"}}
                >
                    Load Data File
                    <input
                    type="file"
                    hidden
                    accept='.tsv'
                    onChange={e => handleFileChosen(e.target.files[0])}
                    value={""}
                    />
                </Button>
                {(fileName.length > 0) ? 
                (<Box component="span" sx={{padding:'5px', color:"white"}} >{fileName}</Box>)
                : 
                (<></>)}
                <DataWatcher
                    onDataAvailable={handleDataAvailable}
                    onDownloaded={handleDownloaded} 
                />
            </Box>
            <Box sx={{visibility:"hidden"}} >
                <Button 
                    variant="contained"
                    onClick={handleUnload}
                >
                        Unload
                </Button>
            </Box>
            <Box sx={{paddingTop: "10px"}} >
                <Calibration />
            </Box>
        </Grid>
    );
}