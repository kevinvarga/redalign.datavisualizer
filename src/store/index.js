import { configureStore } from '@reduxjs/toolkit'
import laserDataReducer from '../reducer/LaserDataSlice';
import surfaceCorrecctionReducer from "../reducer/SurfaceCorrectionSlice";

export default configureStore({
  reducer: {
    laserData: laserDataReducer,
    surfaceCorrection: surfaceCorrecctionReducer
  },
})