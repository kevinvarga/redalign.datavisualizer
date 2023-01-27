import { configureStore } from '@reduxjs/toolkit'
import laserDataReducer from '../reducer/LaserDataSlice';

export default configureStore({
  reducer: {
    laserData: laserDataReducer,
  },
})