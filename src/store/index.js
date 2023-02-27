import { configureStore } from '@reduxjs/toolkit'
import laserDataReducer from '../reducer/LaserDataSlice';
import surfaceCorrectionReducer from "../reducer/SurfaceCorrectionSlice";
import scansReducer from "../reducer/Scans";

export default configureStore({
  reducer: {
    laserData: laserDataReducer,
    surfaceCorrection: surfaceCorrectionReducer,
    scans: scansReducer,
  },
})