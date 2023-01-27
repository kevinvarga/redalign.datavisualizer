import { Box, FormControl, FormHelperText, Grid, MenuItem, Select } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import BestFitLineCard from './components/calculations/BestFitLineCard';
import FourPointCard from './components/calculations/FourPointCard';
import FileInput from './components/FileInput';
import DataVisualizer from './components/graphs/DataVisualizer';
import { resetData, setDataRange, setSelectedDataType } from './reducer/LaserDataSlice';

function App() {
  const [reset, setReset] = useState(false);
  const laserData = useSelector((state) => state.laserData);
  const dispatch = useDispatch();


  const onFileSelected = () => {
    setReset(false);
  }

  const onUnload = () => {
    setReset(true);
    dispatch(resetData());
  }

  const onFileInputLoaded = (data) => {
  }

  const onRangeUpdated = (start, end) => {
    dispatch(setDataRange({startX: start.data.x, endX: end.data.x}));
  }

  const handleSelect = (event) => {
    dispatch(setSelectedDataType({dataType: event.target.value}));
  }

  return (
    <Box sx={{ width: "100vw", height: "100vh", justifyContent: 'center',  textAlign: 'center', display:'flex' }}>
      <Box>
        <FileInput
          onFileSelected={onFileSelected}
          onLoaded={onFileInputLoaded} 
          onUnload={onUnload}
        />
        <Box>
          <Grid
            container
            direction="row"
            justifyContent="center"
            
          >
            <Box>
              <DataVisualizer
                laserData={laserData}
                reset={reset}
                onRangeUpdated={onRangeUpdated}
              />
            </Box>
            <Box sx={{width:"50vw", minWidth: "50vw", paddingTop: "35px"}}>
              <Grid 
                container
                >
                  <Grid container
                    direction="row"
                    >
                    <FourPointCard />
                    <BestFitLineCard />
                  </Grid>
              </Grid>
            </Box>
          </Grid>
        </Box>
        <Box sx={{textAlign: "left", paddingLeft: "50px"}} >
                <FormControl size="small">
                    <FormHelperText sx={{textAlign: "left"}} >Choose type of data to select</FormHelperText>
                    <Select 
                        disabled={(laserData.YValues.length === 0)}
                        value={laserData.selectedDataType}
                        onChange={handleSelect}
                    >
                        <MenuItem value={"pump"}>Pump</MenuItem>
                        <MenuItem value={"motor"}>Motor</MenuItem>
                    </Select>
                </FormControl>
            </Box>
      </Box>
    </Box>
  );
}

export default App;