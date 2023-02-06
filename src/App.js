import { Box, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FourPointCard from './components/cards/FourPointCard';
import DataImport from './components/DataImport';
import DataVisualizer from './components/graphs/DataVisualizer';
import { setDataRange } from './reducer/LaserDataSlice';
import './App.css';
import BestFitLineCard from './components/cards/BestFitLineCard';

function App() {
  const [reset, setReset] = useState(false);
  const laserData = useSelector((state) => state.laserData);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(loading) {
      setLoading(false);
    }
  }, [loading]);

  const onFileSelected = () => {
    setReset(true);
  }

  const onUnload = () => {
    setReset(true);
  }

  const onFileInputLoaded = (data) => {
    setReset(false);
    setLoading(true);
  }

  const onRangeUpdated = (start, end) => {
    dispatch(setDataRange({startX: start.data.x, endX: end.data.x}));
  }

  const renderSplash = () => {
    return (
      <Box sx={{padding:"50px"}}>
        <Typography variant='h4'>Data Visualizer</Typography>
        <Typography variant='h6'>Click the LOAD DATA FILE button to load a TSV file from Marshall's program</Typography>
      </Box>
    )
  }

  const renderContent = () => {
    return (
      <Box>
          <Grid
            container
            direction="row"
            justifyContent="center"
            
          >
            <Box sx={{width:"50vw", minWidth: "50vw"}}>
              <DataVisualizer
                laserData={laserData}
                reset={reset}
                onRangeUpdated={onRangeUpdated}
              />
            </Box>
            <Box sx={{width:"50vw", minWidth: "50vw", paddingTop: "34px"}}>
              <Grid 
                container
                >
                  <Grid container
                    direction="row"
                    >
                    <BestFitLineCard laserData={laserData} reset={reset} />
                    <FourPointCard laserData={laserData} reset={reset} />
                  </Grid>
              </Grid>
            </Box>
          </Grid>
        </Box>
    );
  }

  return (
    <Box sx={{ width: "100vw", height: "100vh", justifyContent: 'center',  textAlign: 'center', display:'flex' }}>
      <Box sx={{width: "100%"}}>
        <DataImport
          onFileSelected={onFileSelected}
          onLoaded={onFileInputLoaded} 
          onUnload={onUnload}
        />
        {(laserData.allValues.length === 0) ? renderSplash() : renderContent()}
      </Box>
    </Box>
  );
}

export default App;