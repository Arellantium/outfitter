import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from '../reducers/dashboardReducer';
import imagesReducer from '../reducers/imagesSliceReducer';
import cartReducer from '../reducers/cartReducer';

const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    images: imagesReducer,
    cart: cartReducer,
  },
});

export default store;
