import { createSlice } from "@reduxjs/toolkit";
import BestFitLine from "../components/calculations/BestFitLine";
import FourPoint from "../components/calculations/FourPoint";

const initialState = {
    id: null,
    endDate: null,
    rawData: [],
    allValues: [],
    YValues: [],
    ZValues: [],
    RadiusValues: [],
    rangeY: {pump: [], motor: []},
    rangeZ: {pump: [], motor: []},
    rangeRadius: {pump: [], motor: []},
    ranges: {pump: {start: -1, end: -1}, motor: {start: -1, end: -1}},
    minXYZ: {x:0,y:0,z:0,r:0},
    maxXYZ: {x:0,y:0,z:0,r:0},
    algorithm: {},
    isSurfaceCorrected: false,
    noiseReduction : {
        isEnabled: false,
        tolerance: 100,
        includeRadius: true,
    }
}

export const LaserDataSlice = createSlice({
    name:'laserData',
    initialState,
    reducers: {
        loadData: (state, action) => {
            let tempState = JSON.parse(JSON.stringify(initialState));
            tempState.id = action.payload.id;
            tempState.endDate = action.payload.endDate;
            tempState.rawData = action.payload.rawData;
            tempState.allValues = action.payload.rawData;
            tempState.rangeY = {pump: [], motor: []};
            tempState.rangeZ = {pump: [], motor: []};
            tempState.rangeRadius = {pump: [], motor: []};
            tempState.ranges = {pump: {start: -1, end: -1}, motor: {start: -1, end: -1}};

            if(action.payload.isSurfaceCorrected === true) {
                // the raw data only needs to be surface corrected when it is initially loaded
                // data is reloaded when noise reduction is applied so surface correction is not reapplied
                tempState.isSurfaceCorrected = true;
            } else {
                let surfaceCorr = action.payload.surfaceCorrection;
                tempState.isSurfaceCorrected = (surfaceCorr !== null);
    
                // apply surface correction
                if(surfaceCorr !== null) {
                    for(let i=0; i<tempState.rawData.length; i++) {
    
                        let correction = surfaceCorr.find((val) => (val.x === tempState.rawData[i].x));
                        if(correction !== null){
                            tempState.rawData[i].y += correction.yCorr;
                            tempState.rawData[i].z += correction.zCorr;
                        }
                    }
                }
            }

            // apply noise reduction filter
            if(action.payload.state && action.payload.state.noiseReduction) {
                tempState.noiseReduction = action.payload.state.noiseReduction;
            } else {
                let nr = localStorage.getItem("noiseReduction");
                if(nr) {
                    tempState.noiseReduction = JSON.parse(nr);
                }
            }
            tempState.allValues = applyNoiseReduction(tempState.rawData, tempState.noiseReduction);

            // assign data to arrays used as chart data
            for(let i=0;i< tempState.allValues.length;i++){
                let data = tempState.allValues[i];
                
                tempState.YValues.push({x:data.x,y:data.y,radius:data.radius, index: i});
                tempState.ZValues.push({x:data.x,y:data.z,radius:data.radius, index: i});
                tempState.RadiusValues.push({x:data.x,y:data.radius,radius:data.radius, index:i});

                tempState.minXYZ.x = (tempState.minXYZ.x === 0) ? data.x : tempState.minXYZ.x;
                tempState.minXYZ.y = (tempState.minXYZ.y > data.y) ? data.y : tempState.minXYZ.y;
                tempState.minXYZ.z = (tempState.minXYZ.z > data.z) ? data.z : tempState.minXYZ.z;
                tempState.minXYZ.radius = (tempState.minXYZ.radius > data.radius) ? data.radius : tempState.minXYZ.radius;

                tempState.maxXYZ.x = (tempState.maxXYZ.x < data.x) ? data.x : tempState.maxXYZ.x;
                tempState.maxXYZ.y = (tempState.maxXYZ.y < data.y ) ? data.y : tempState.maxXYZ.y;
                tempState.maxXYZ.z = (tempState.maxXYZ.z < data.z ) ? data.z : tempState.maxXYZ.z;
                tempState.minXYZ.radius = (tempState.minXYZ.radius < data.radius) ? data.radius : tempState.minXYZ.radius;
            }

            if(action.payload.state && action.payload.state.algorithm) {
                tempState.algorithm = action.payload.state.algorithm;

                // set range values based on previous state
                let midPoint = tempState.allValues[0].x + Math.floor((tempState.allValues[tempState.allValues.length -1].x - tempState.allValues[0].x) / 2);
                tempState.ranges = action.payload.state.ranges;
                let ranges = [];
                ranges.push(action.payload.state.ranges.pump);
                ranges.push(action.payload.state.ranges.motor);
                for(let r=0;r<ranges.length;r++) {
                    for(let i=0;i<tempState.YValues.length;i++) {
                        if(tempState.YValues[i].x >= Math.ceil(ranges[r].start) && tempState.YValues[i].x <= Math.floor(ranges[r].end)) {
                            // both the dataXY and dataXZ are the same length
                            let dataType = tempState.YValues[i].x < midPoint ? "pump" : "motor";
                            tempState.rangeY[dataType].push({...tempState.YValues[i]});
                            tempState.rangeZ[dataType].push({...tempState.ZValues[i]});
                            tempState.rangeRadius[dataType].push({...tempState.RadiusValues[i]});
                        }
                    }
                }

                if(action.payload.calculateResults && (Object.keys(tempState.algorithm).length > 0)) {
                    tempState.algorithm.bestfitline.result = new BestFitLine(tempState).calculate();

                    // reset the four points since calculateResults is true when noiseReduction is changed
                    tempState.algorithm.fourpoint = algorithmDefaults("fourpoint", tempState);
                    tempState.algorithm.fourpoint.result = new FourPoint(tempState).calculate();
                }
            }

            return tempState;
        },
        setDataRange: (state, action) => {
            let midPoint = state.allValues[0].x + Math.floor((state.allValues[state.allValues.length -1].x - state.allValues[0].x) / 2);

            // reset ranges 
            if(action.payload.startX < midPoint) {
                state.rangeY.pump = [];
                state.rangeZ.pump = [];
                state.rangeRadius.pump = [];
                state.ranges.pump = {start: -1, end: -1}
            }

            if(action.payload.endX > midPoint) {
                state.rangeY.motor = [];
                state.rangeZ.motor = [];
                state.rangeRadius.motor = [];
                state.ranges.motor = {start: -1, end: -1}
            }
            
            // X value < midpoint => pump values
            // X value > midpoint => motor values
            for(let i=0;i<state.YValues.length;i++) {
                if(state.YValues[i].x >= Math.ceil(action.payload.startX) && state.YValues[i].x <= Math.floor(action.payload.endX)) {
                    // both the dataXY and dataXZ are the same length
                    let dataType = state.YValues[i].x < midPoint ? "pump" : "motor";
                    state.rangeY[dataType].push({...state.YValues[i]});
                    state.rangeZ[dataType].push({...state.ZValues[i]});
                    state.rangeRadius[dataType].push({...state.RadiusValues[i]});

                    // save ranges start/end
                    if(state.ranges[dataType].start === -1) {// the first value is always the start of a range
                        state.ranges[dataType].start = state.YValues[i].x;
                        state.ranges[dataType].end = state.YValues[i].x;
                    } else if(state.ranges[dataType].end < state.YValues[i].x) {
                        state.ranges[dataType].end = state.YValues[i].x;
                    }
                }
            }
            state.algorithm = {};
        },
        setAlgorithmValues: (state, action) => {

            let values = action.payload.values ?? null;
            if(values === null) {
                values = algorithmDefaults(action.payload.algorithm, state);
            }

            if(values !== null) {
                state.algorithm[action.payload.algorithm] = values;
            }

            let result;
            switch(action.payload.algorithm){
                case "bestfitline": {
                    result = new BestFitLine(state).calculate();
                    break;
                }
                case "fourpoint": {
                    result = new FourPoint(state).calculate();
                    break;
                }
                default:{
                    break;
                }
            }

            if(result) {
                state.algorithm[action.payload.algorithm].result = result;
            }
        },
        resetData: (state, action) => initialState,
        saveNoiseReduction: (state, action) => {
            state.noiseReduction.isEnabled = action.payload.isEnabled;
            state.noiseReduction.tolerance = Number(action.payload.tolerance);
            state.noiseReduction.includeRadius = action.payload.includeRadius;

            // save the values to local storage
            localStorage.setItem("noiseReduction", JSON.stringify(state.noiseReduction));
        }
    }
})

// private methods
const algorithmDefaults = (algorithm, state) => {
    let values = null;
    switch(algorithm) {
        case "bestfitline": {
            values = {
                pump: {
                    exclude: []
                },
                motor: {
                    exclude: []
                }
            }
            break;
        }
        case "fourpoint": {
            values = {
                pump: {
                    start: state.rangeY.pump[0].x,
                    end: state.rangeY.pump[state.rangeY.pump.length - 1].x,
                },
                motor: {
                    start: state.rangeY.motor[0].x,
                    end: state.rangeY.motor[state.rangeY.motor.length - 1].x,
                },
                edit: {
                    pump: "start",
                    motor: "start"
                }
            }
            break;
        }
        default: {
            break;
        }
    }
    
    return values;
}

const applyNoiseReduction = (data, filter) => {

    let filteredData = [];
  
    if(filter.isEnabled) {
      const tolerance = Number(filter.tolerance) ?? 100;
  
      for(let i=0; i<data.length; i++) {
          let keep = false;
          
          if(i>0) {
              keep = (Math.abs(data[i-1].y - data[i].y) < tolerance) &&
                      (Math.abs(data[i-1].z - data[i].z) < tolerance);
                      
              if(keep && filter.includeRadius) {
                keep = (Math.abs(data[i-1].radius - data[i].radius) < tolerance);
              } 
          } else  {
            keep = true;
          }
  
          if(keep && (i+1 < data.length)) {
              keep = (Math.abs(data[i+1].y - data[i].y) < tolerance) &&
                      (Math.abs(data[i-1].z - data[i].z) < tolerance);
  
              if(keep && filter.includeRadius){
                keep = (Math.abs(data[i-1].radius - data[i].radius) < tolerance);
              }
          }
  
          if(keep) {
            filteredData.push({...data[i]});
          }
      }
    } else {
      filteredData = data;
    }
  
    return filteredData;
}

// public exports
export const { loadData, setDataRange, setAlgorithmValues, resetData, saveNoiseReduction } = LaserDataSlice.actions

export default LaserDataSlice.reducer