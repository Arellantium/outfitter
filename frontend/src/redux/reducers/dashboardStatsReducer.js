import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8006/dashboard/metrics');
      if (!response.ok) throw new Error('Errore nel recupero dei dati');
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const dashboardStatsSlice = createSlice({
  name: 'dashboardStats',
  initialState: {
    data: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default dashboardStatsSlice.reducer;
