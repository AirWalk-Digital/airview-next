import { createSlice } from '@reduxjs/toolkit';
import { siteConfig } from '../../../site.config';

const branchSlice = createSlice({
  name: 'branch',
  initialState: siteConfig.content,
  reducers: {
    setBranch: (state, action) => {
        return {
            ...state,
            [action.payload.path]: action.payload,
          };
    },
  },
});

export const { setBranch } = branchSlice.actions;
export default branchSlice.reducer;
