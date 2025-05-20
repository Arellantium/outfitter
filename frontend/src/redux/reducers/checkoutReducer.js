import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentStep: 1,
  shippingData: {},
  paymentData: {},
  orderNumber: null,
  outfitDetails: {
    name: '',
    items: [],
    totalPrice: 0,
    currency: '€',
    imageUrl: null,
    shippingCost: 0,
    discountAmount: 0
  }
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setShippingData(state, action) {
      state.shippingData = action.payload;
      state.currentStep = 2;
      if (action.payload.selectedShippingOption) {
        state.outfitDetails.shippingCost = action.payload.selectedShippingOption.price;
      }
    },
    setPaymentData(state, action) {
      state.paymentData = action.payload;
      state.currentStep = 3;
      state.orderNumber = `STA-${Math.floor(Math.random() * 90000) + 10000}`;
    },
    applyDiscount(state, action) {
      state.outfitDetails.discountAmount = action.payload;
    },
    goToPreviousStep(state) {
      if (state.currentStep > 1) state.currentStep -= 1;
    },
    setOutfitFromCart(state, action) {
      const cartItems = action.payload;
      state.outfitDetails = {
        name: 'Outfit dal Carrello',
        items: cartItems.map(item => item.description),
        totalPrice: cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0),
        currency: '€',
        imageUrl: cartItems[0]?.uri || null,
        shippingCost: 0,
        discountAmount: 0
      };
    }
  }
});

export const {
  setShippingData,
  setPaymentData,
  applyDiscount,
  goToPreviousStep,
  setOutfitFromCart
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
