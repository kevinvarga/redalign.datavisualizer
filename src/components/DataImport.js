import { Box, Button, Grid } from '@mui/material';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { loadData } from '../reducer/LaserDataSlice.js';
import Calibration from './Calibration.js';


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
          
          if(line[1] !== '') {
            data.push({x:Number(line[0]),y:Number(line[1]),z:Number(line[2]),r:Number(line[3])});
          }
        }

        dispatch(loadData({rawData:data, surfaceCorrection:corrections}));
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

    return (
        <Grid container
            direction="row"
            justifyContent="space-evenly"
            alignItems="flex-start"
            justifyItems="center"
            sx={{padding: "3px"}}
        >
            <Box >
                <Button
                    variant="contained"
                    component="label"
                    
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
                <Box component="span" sx={{padding:'5px'}} >{fileName}</Box>
            </Box>
            <Box >
                <Calibration />
            </Box>
            <Box sx={{visibility:"hidden"}} >
                <Button 
                    variant="contained"
                    onClick={handleUnload}
                >
                        Unload
                </Button>
            </Box>
        </Grid>
    );
}