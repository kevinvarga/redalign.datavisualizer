import { Box, Button } from '@mui/material';
import React, { useState } from 'react'


export default function FileInput(props) {
    const [fileName, setFileName] = useState("");
    const [loadDisabled, setLoadDisabled] = useState(false);
    const onLoaded = props.onLoaded;
    let fileReader;
    const laserDataDefault = {data:[], min: {x:0,y:0},max: {x:250,y:250}};

    const handleFileRead = () => {
        const laserData = laserDataDefault;
        const contents = fileReader.result;
        console.log(`handleFileRead - data length: ${laserData.data.length}`);

        let lines = contents.split('\n');

        for(let l=0;l<lines.length;l++) {
          let line = lines[l].replace('\r','').split('\t');
          
          if(line[1] !== '')
          {
            let x = Number(line[0]);
            let y = Number(line[1]);
            laserData.min.x = (laserData.min.x === 0) ? x : laserData.min.x;
            laserData.max.x = (laserData.max.x < x) ? x : laserData.max.x;
            laserData.min.y = (laserData.min.y > y) ? y : laserData.min.y;
            laserData.max.y = (laserData.max.y < y ) ? y : laserData.max.y;
    
            laserData.data.push({x:x,y:y,z:Number(line[2]),r:Number(line[3])});
          }
        }

        if(onLoaded){
            onLoaded(laserData);
        }
    }

    const handleUnload = () => {
        setFileName("");
        if(onLoaded) {
            onLoaded(laserDataDefault);
        }
        setLoadDisabled(false);
        window.location.reload();
    }

    const handleFileChosen = (file) => {
        console.log('file selected');
        console.log(file);
        setFileName(file.name);
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file);
        setLoadDisabled(true);
      };

    return (
        <Box sx={{textAlign: 'left', padding: '3px',width:'50%', display:'flex'}} >
            <Box component="span" sx={{width:'50vw'}}>
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
                <Box component="span" sx={{paddingLeft:'5px', width:'100%'}} >{fileName}</Box>
            </Box>
            <Box component="span" sx={{width:'100%',textAlign:'right'}}>
                <Button 
                    variant="contained"
                    onClick={handleUnload}>
                        Unload
                </Button>
            </Box>
        </Box>
    );
}