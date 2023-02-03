import { createSlice } from "@reduxjs/toolkit";
import { median, roundToX } from "../common/common";

export const SurfaceCorrectionSlice = createSlice({
    name:'laserData',
    initialState: {
        corrections: []
    },
    reducers: {
        loadCalibrationData: (state, action) => {
            let lines = action.payload.split('\n');
            let data = [];

            for(let i=0;i<lines.length;i++) {
                let line = lines[i].replace('\r','').split('\t');
                // index of values in the line variable
                // x=0, y=1, z=2, radius=3
                // values repeat every 5, ex, x = (0,5,10,15,...)
                let x = Number(line[0]);
                let y = [];
                let z = [];
                for(let j=0;j<line.length;j+=5) {
                    y.push(Number(line[j + 1]));
                    z.push(Number(line[j + 2]));
                }

                // calculate median for y and z
                let yMedian = median(y);
                let zMedian = median(z);
                
                data.push({
                    x:x,
                    yMedian: yMedian,
                    zMedian: zMedian
                })
            }

            let lastPoint = data.length - 1;
            let yStep = (data[lastPoint].yMedian - data[0].yMedian)/(data[lastPoint].x - data[0].x);
            let zStep = (data[lastPoint].zMedian - data[0].zMedian)/(data[lastPoint].x - data[0].x);
            
            let tempCorrections = [];
            for(let i=0;i<data.length;i++) {
                let yLinear = data[0].yMedian + (data[i].x * yStep);
                let zLinear = data[0].zMedian + (data[i].x * zStep); 
                /*
                if(data[i].x === 496000){
                    console.log(`yMedian: ${data[i].yMedian}; yLinear: ${yLinear}; zMedian: ${data[i].zMedian}; zLinear: ${zLinear}`);
                }
                */

                tempCorrections.push({
                    x:data[i].x,
                    //yMedian: data[i].yMedian,
                    //yLinear: yLinear,
                    yCorr:roundToX(yLinear - data[i].yMedian, 0),
                    //zMedian: data[i].zMedian,
                    //zLinear: zLinear,
                    zCorr:roundToX(zLinear - data[i].zMedian, 0)
                })
            }

            /*
            let output = "";
            for(let i=0;i<tempCorrections.length;i++){
                output += `${tempCorrections[i].x}\t${tempCorrections[i].yCorr}\t${tempCorrections[i].zCorr}\n`;
            }
            console.log(output);
            */
            //console.log(tempCorrections);
            state.corrections = tempCorrections
        }
    }
})

export const { loadCalibrationData } = SurfaceCorrectionSlice.actions

export default SurfaceCorrectionSlice.reducer