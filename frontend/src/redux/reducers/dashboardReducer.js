import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess(state, action) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchStart, fetchSuccess, fetchError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
