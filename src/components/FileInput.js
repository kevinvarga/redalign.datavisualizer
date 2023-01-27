import { Box, Button } from '@mui/material';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { loadData } from '../reducer/LaserDataSlice.js';


export default function FileInput(props) {
    const [fileName, setFileName] = useState("");
    const [loadDisabled, setLoadDisabled] = useState(false);
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

        dispatch(loadData({rawData:data}));
        if(onLoaded){
            onLoaded();
        }
    }

    const handleUnload = () => {
        setFileName("");
        setLoadDisabled(false);
        if(onUnload) {
            onUnload();
        }
    }

    const handleFileChosen = (file) => {
        setFileName(file.name);
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file);
        setLoadDisabled(true);
        if(onFileSelected) {
            onFileSelected();
        }
      };

    return (
        <Box sx={{padding: '3px',width:'100%', position: 'relative'}} >
            <Box component="span" sx={{width:'50%'}} >
                <Button
                    variant="contained"
                    component="label"
                    disabled={loadDisabled}
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
            <Box component="span" sx={{width:'25vw',textAlign:'right'}}>
                <Button 
                    variant="contained"
                    onClick={handleUnload}>
                        Unload
                </Button>
            </Box>
        </Box>
    );
}