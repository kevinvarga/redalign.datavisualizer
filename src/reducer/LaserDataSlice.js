import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allValues: [],
    YValues: [],
    ZValues: [],
    selectedY: {pump: [], motor: []},
    selectedZ: {pump: [], motor: []},
    minXYZ: {x:0,y:0,z:0},
    maxXYZ: {x:0,y:0,z:0},
    selectedDataType: "pump",
    isSurfaceCorrected:  false
}

export const LaserDataSlice = createSlice({
    name:'laserData',
    initialState,
    reducers: {
        loadData: (state, action) => {
            state.allValues = action.payload.rawData;
            let surfaceCorr = action.payload.surfaceCorrection;
            state.isSurfaceCorrected = (surfaceCorr !== null);
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
                state.YValues.push({x:data.x,y:data.y,r:data.radius, index: i});
                state.ZValues.push({x:data.x,y:data.z,r:data.radius, index: i});

                state.minXYZ.x = (state.minXYZ.x === 0) ? data.x : state.minXYZ.x;
                state.minXYZ.y = (state.minXYZ.y > data.y) ? data.y : state.minXYZ.y;
                state.minXYZ.z = (state.minXYZ.z > data.z) ? data.z : state.minXYZ.z;
                
                state.maxXYZ.x = (state.maxXYZ.x < data.x) ? data.x : state.maxXYZ.x;
                state.maxXYZ.y = (state.maxXYZ.y < data.y ) ? data.y : state.maxXYZ.y;
                state.maxXYZ.z = (state.maxXYZ.z < data.z ) ? data.z : state.maxXYZ.z;
            }
        },
        setDataRange: (state, action) => {
            state.selectedY[state.selectedDataType] = [];
            state.selectedZ[state.selectedDataType] = [];
            for(let i=0;i<state.YValues.length;i++) {
                if(state.YValues[i].x >= Math.ceil(action.payload.startX) && state.YValues[i].x <= Math.floor(action.payload.endX)) {
                    // both the dataXY and dataXZ are the same length
                    state.selectedY[state.selectedDataType].push({...state.YValues[i]});
                    state.selectedZ[state.selectedDataType].push({...state.ZValues[i]});
                }
            }
        },
        setSelectedDataType: (state, action) => {
            console.log(action.payload.dataType);
            state.selectedDataType = action.payload.dataType;
            console.log(state.selectedDataType);
            console.log(state);
        },
        resetData: (state, action) => initialState,
    }
})

export const { loadData, setDataRange, setSelectedDataType, resetData } = LaserDataSlice.actions

export default LaserDataSlice.reducer