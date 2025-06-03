import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: []  // array di { id_image, user, ... }
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const exists = state.items.find(i => i.id_image === item.id_image);
      if (!exists) state.items.push(item);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i.id_image !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    }
  }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
