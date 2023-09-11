import {configureStore} from '@reduxjs/toolkit';
import branchReducer from './reducers/branchSlice';
export default configureStore({
    reducer:{
        branch: branchReducer
    }
})