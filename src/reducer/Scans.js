import { createSlice } from "@reduxjs/toolkit";

export const Scans = createSlice({
    name:'scans',
    initialState: {
        measurements: [],
        show: false,
    },
    reducers: {
        loadScans: (state, action) => {
            state.measurements = action.payload.scans;
        },
        showScans: (state, action) => {
            state.show = action.payload.show;
        }
    }
})

export const { loadScans, showScans } = Scans.actions

export default Scans.reducer