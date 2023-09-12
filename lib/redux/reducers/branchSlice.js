import {createSlice} from '@reduxjs/toolkit';
const branchSlice = createSlice({
    name: 'branch',
    initialState: {
        name: 'none'
    },
    reducers: {
        setBranch: (state, action) => {
            state.name = action.payload
        }
}})

export const {setBranch} = branchSlice.actions;
export default branchSlice.reducer;