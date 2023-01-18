import { Box, FormControl, MenuItem, FormHelperText } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Select from '@mui/material/Select';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Legend,
  } from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { Selector } from '../plugin/selector';
import Zoom from 'chartjs-plugin-zoom';
import { getRelativePosition } from 'chart.js/helpers';
import { getState, removeState } from '../plugin/chartstate';

ChartJS.register(LinearScale, PointElement, LineElement, Legend, Selector, Zoom);

export const options = {
    animation: {
      duration: 0
    },
    scales: {
      x: {
        min: 0,
        max: 250,
      },
      y: {
        min: 0,
        max: 11000,
      }
    },
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          mode: 'xy'
        }
      }
    },
    maintainAspectRatio: false
  };
  
  export const data = {
    datasets: [
      {
        label: 'Pump',
        data: [],
        backgroundColor: 'rgba(255,10,10,1)'
      },
      {
        label: 'Motor',
        data: [],
        backgroundColor: 'rgba(10,255,10,1)'
      },
      {
        label: 'All Points',
        data: [],
        backgroundColor: 'rgba(10, 10, 10, 1)',
      }
    ],
  };

const dataType = {
    pump: 0,
    motor: 1,
    allData: 2
};
  
export default function Visualizer(props) {

    const chartRef = useRef(null);
    const [noData, setNoData] = useState(true);
    const [selectedData, setSelectedData] = useState(dataType.pump);
    let laserData = props.data;
   
    useEffect(() => {
 
        const handleMouseDown = (event) => {
            let chartState = getState(chartRef.current);
            chartState.startX = event.x;
            chartState.startY = event.y;
            chartState.startData = getXY(event, chartRef.current);
            chartRef.current.update();
        };
    
        const handleMouseMove = (event) => {
            if(event.buttons) {
                let chartState = getState(chartRef.current);
                chartState.endX = event.x;
                chartState.endY = event.y;
                chartRef.current.update();
            }
        }
        
        const handleMouseUp = (event) => {
            let chart = chartRef.current;
            let chartState = getState(chart);

            if(chartState.startData) {
                let endData = getXY(event, chart);
        
                console.log(`start X: ${chartState.startData.x}, end X: ${endData.x}`);
        
                console.log(`selected data: ${chartState.selectedData}`);
                chart.data.datasets[chartState.selectedData].data.length = 0;
                console.log(`data length: ${chart.data.datasets[dataType.allData].data.length}`);
                for(let i=0;i<chart.data.datasets[dataType.allData].data.length;i++){
                    if(chart.data.datasets[dataType.allData].data[i].x > Math.ceil(chartState.startData.x) && chart.data.datasets[dataType.allData].data[i].x < endData.x){
                    chart.data.datasets[chartState.selectedData].data.push({
                        x:chart.data.datasets[dataType.allData].data[i].x,
                        y:chart.data.datasets[dataType.allData].data[i].y
                    });
                    }
                }
        
                // reset chart state; preserve the value of the selected value in the drop down
                let oldValue = chartState.selectedData;
                removeState(chart);
                console.log(`previous value: ${oldValue}`);
                chartState = getState(chart);
                chartState.selectedData = oldValue;

                chart.update();
            }
        }

        // update chart data
        if (chartRef && chartRef.current && laserData && laserData.data) {
            let chart = chartRef.current;

            setNoData(laserData.data.length === 0);
            if(laserData.data.length === 0){
                for(let i=0;i<chart.data.datasets.length;i++){
                  chart.data.datasets[i].data = [];
                }
                setSelectedData(dataType.pump);
                removeState(chart);
            }
            
            for(var i=0;i<laserData.data.length;i++){
                chart.data.datasets[dataType.allData].data.push({
                x:laserData.data[i].x,
                y:laserData.data[i].y
                });
            }    

            console.log(laserData);
            chart.options.scales.x.min = laserData.min.x;
            chart.options.scales.x.max = laserData.max.x;
            chart.options.scales.y.min = laserData.min.y;
            chart.options.scales.y.max = laserData.max.y;

            chart.canvas.addEventListener("mousedown", handleMouseDown);
            chart.canvas.addEventListener("mousemove", handleMouseMove);
            chart.canvas.addEventListener("mouseup", handleMouseUp); 
            chart.update();
            
        } else {
            setNoData(true);
        }
    
    }, [laserData]);

    const getXY = (event, chart) => {
        const canvasPosition = getRelativePosition(event, chart);
        
        // Substitute the appropriate scale IDs
        const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
        const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);
        return {x:dataX, y:dataY};
    }
    
    const handleSelect = (event) => {
        setSelectedData(event.target.value);
        const chartState = getState(chartRef.current);
        chartState.selectedData = event.target.value;
    }

    return(
        <>
            <Box sx={{height: "80%", width: "100%", display:"flex"}} >
                    <Scatter 
                        ref={chartRef} 
                        options={options} 
                        data={data} 
                    />
                
            </Box>
            <Box sx={{textAlign: "left", paddingLeft: "3px"}} >
                <FormControl size="small">
                    <FormHelperText sx={{textAlign: "left"}} >Choose type of data to select</FormHelperText>
                    <Select 
                        disabled={noData}
                        value={selectedData}
                        onChange={handleSelect}
                    >
                        <MenuItem value={dataType.pump}>Pump</MenuItem>
                        <MenuItem value={dataType.motor}>Motor</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </>
    )
}