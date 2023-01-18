import { Box } from '@mui/material';
import { useState } from 'react';
import './App.css';
import FileInput from './components/FileInput';
import Visualizer from './components/Visualizer';

function App() {

  const [laserData, setLaserData] = useState(null);

  const onFileInputLoaded = (data) => {
    console.log(data.data.length);
    setLaserData(data);
  }

  return (
    <Box >

      <Box sx={{ width: "100vw", height: "100vh", justifyContent: 'center', alignItems: 'center' }}>   
        <FileInput
          onLoaded={onFileInputLoaded} 
        />
        <Visualizer 
          data={laserData}
        />
      </Box>
      
    </Box>
    
  );
}

export default App;
