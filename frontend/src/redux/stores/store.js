import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from '../reducers/dashboardReducer';
import imagesReducer from '../reducers/imagesSliceReducer';
import cartReducer from '../reducers/cartReducer';
import checkoutReducer from '../reducers/checkoutReducer';
import dashboardStatsReducer from '../reducers/dashboardStatsReducer';

const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    images: imagesReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    dashboardStats: dashboardStatsReducer
  },
});

export default store;
