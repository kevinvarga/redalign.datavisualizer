import { createSlice } from "@reduxjs/toolkit";
import BestFitLine from "../components/calculations/BestFitLine";
import FourPoint from "../components/calculations/FourPoint";

const initialState = {
    id: null,
    allValues: [],
    YValues: [],
    ZValues: [],
    RadiusValues: [],
    rangeY: {pump: [], motor: []},
    rangeZ: {pump: [], motor: []},
    rangeRadius: {pump: [], motor: []},
    minXYZ: {x:0,y:0,z:0,r:0},
    maxXYZ: {x:0,y:0,z:0,r:0},
    algorithm: {},
    isSurfaceCorrected: false
}

export const LaserDataSlice = createSlice({
    name:'laserData',
    initialState,
    reducers: {
        loadData: (state, action) => {
            let tempState = JSON.parse(JSON.stringify(initialState));
            tempState.id = action.payload.id;
            tempState.allValues = action.payload.rawData;
            tempState.rangeY = {pump: [], motor: []};
            tempState.rangeZ = {pump: [], motor: []};
            tempState.rangeRadius = {pump: [], motor: []};

            let surfaceCorr = action.payload.surfaceCorrection;
            tempState.isSurfaceCorrected = (surfaceCorr !== null);

            for(let i=0;i< action.payload.rawData.length;i++){
                let data = action.payload.rawData[i];
                // apply surface correction
                if(surfaceCorr !== null) {
                    let correction = surfaceCorr.find((val) => (val.x === data.x));
                    if(correction !== null){
                        data.y += correction.yCorr;
                        data.z += correction.zCorr;
                    }
                }
                
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

            if(action.payload.state) {
                tempState.algorithm = action.payload.state.algorithm;

                // set range values based on previous state
                let midPoint = tempState.allValues[0].x + Math.floor((tempState.allValues[tempState.allValues.length -1].x - tempState.allValues[0].x) / 2);
                let ranges = [];
                ranges.push(action.payload.state.range.pump);
                ranges.push(action.payload.state.range.motor);
                for(let r=0;r<ranges.length;r++) {
                    for(let i=ranges[r].start;i<=ranges[r].end;i++) {
                        // both the dataXY and dataXZ are the same length
                        let dataType = tempState.YValues[i].x < midPoint ? "pump" : "motor";
                        tempState.rangeY[dataType].push({...tempState.YValues[i]});
                        tempState.rangeZ[dataType].push({...tempState.ZValues[i]});
                        tempState.rangeRadius[dataType].push({...tempState.RadiusValues[i]});
                    }
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
            }

            if(action.payload.endX > midPoint) {
                state.rangeY.motor = [];
                state.rangeZ.motor = [];
                state.rangeRadius.motor = [];
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
                }
            }
            state.algorithm = {};
        },
        setAlgorithmValues: (state, action) => {

            state.algorithm[action.payload.algorithm] = action.payload.values;

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

                }
            }

            if(result) {
                state.algorithm[action.payload.algorithm].result = result;
            }
        },
        resetData: (state, action) => initialState,
    }
})

export const { loadData, setDataRange, setAlgorithmValues, resetData } = LaserDataSlice.actions

export default LaserDataSlice.reducer