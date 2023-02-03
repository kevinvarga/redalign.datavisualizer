import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allValues: [],
    YValues: [],
    ZValues: [],
    rangeY: {pump: [], motor: []},
    rangeZ: {pump: [], motor: []},
    minXYZ: {x:0,y:0,z:0},
    maxXYZ: {x:0,y:0,z:0},
    selectedDataType: "pump",
    calculation: {},
    isSurfaceCorrected: false
}

export const LaserDataSlice = createSlice({
    name:'laserData',
    initialState,
    reducers: {
        loadData: (state, action) => {
            let tempState = JSON.parse(JSON.stringify(initialState));
            tempState.allValues = action.payload.rawData;
            tempState.rangeY = {pump: [], motor: []};
            tempState.rangeZ = {pump: [], motor: []};
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
                
                tempState.YValues.push({x:data.x,y:data.y,r:data.r, index: i});
                tempState.ZValues.push({x:data.x,y:data.z,r:data.r, index: i});

                tempState.minXYZ.x = (tempState.minXYZ.x === 0) ? data.x : tempState.minXYZ.x;
                tempState.minXYZ.y = (tempState.minXYZ.y > data.y) ? data.y : tempState.minXYZ.y;
                tempState.minXYZ.z = (tempState.minXYZ.z > data.z) ? data.z : tempState.minXYZ.z;
                
                tempState.maxXYZ.x = (tempState.maxXYZ.x < data.x) ? data.x : tempState.maxXYZ.x;
                tempState.maxXYZ.y = (tempState.maxXYZ.y < data.y ) ? data.y : tempState.maxXYZ.y;
                tempState.maxXYZ.z = (tempState.maxXYZ.z < data.z ) ? data.z : tempState.maxXYZ.z;
            }

            return tempState;
        },
        setDataRange: (state, action) => {
            state.rangeY[state.selectedDataType] = [];
            state.rangeZ[state.selectedDataType] = [];
            for(let i=0;i<state.YValues.length;i++) {
                if(state.YValues[i].x >= Math.ceil(action.payload.startX) && state.YValues[i].x <= Math.floor(action.payload.endX)) {
                    // both the dataXY and dataXZ are the same length
                    state.rangeY[state.selectedDataType].push({...state.YValues[i]});
                    state.rangeZ[state.selectedDataType].push({...state.ZValues[i]});
                }
            }
            state.calculation = {};
        },
        setSelectedDataType: (state, action) => {
            state.selectedDataType = action.payload.dataType;
        },
        setCalculationValues: (state, action) => {
            state.calculation[action.payload.calculation] = action.payload.values;
        },
        resetData: (state, action) => initialState,
    }
})

export const { loadData, setDataRange, setSelectedDataType, setCalculationValues, resetData } = LaserDataSlice.actions

export default LaserDataSlice.reducer