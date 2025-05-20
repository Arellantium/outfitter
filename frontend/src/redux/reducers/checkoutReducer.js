// src/redux/reducers/checkoutReducer.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentStep: 1,
  shippingData: {},
  paymentData: {},
  orderNumber: null,
  discount: 0, 
  outfitDetails: {
    name: '', 
    items: [],
    totalPrice: 0,
    currency: '€',
    imageUrl: null, // Verrà impostato solo per singolo item
    isSingleItemWithSpecificName: false, // NUOVA proprietà per la logica di visualizzazione
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
      const cartItems = action.payload || []; 
      state.currentStep = 1; 
      state.shippingData = {};
      state.paymentData = {};
      state.orderNumber = null;

      let dynamicOutfitName = 'Nessun articolo nel carrello';
      let dynamicImageUrl = null;
      let isSingleItemWithNameFlag = false; // Flag per la nuova proprietà

      if (cartItems.length > 0) {
        if (cartItems.length > 1) {
          dynamicOutfitName = `Selezione di ${cartItems.length} Articoli`;
          // Nessuna immagine principale per multi-item
        } else if (cartItems.length === 1 && cartItems[0]) {
          const singleItem = cartItems[0];
          if (singleItem.name && singleItem.name.trim() !== '') {
            dynamicOutfitName = singleItem.name;
            isSingleItemWithNameFlag = true;
          } else if (singleItem.description && singleItem.description.trim() !== '') {
            dynamicOutfitName = singleItem.description.substring(0, 50) + (singleItem.description.length > 50 ? '...' : '');
            isSingleItemWithNameFlag = true; 
          } else {
            dynamicOutfitName = `Articolo ${singleItem.id_image || 'ID non disponibile'}`;
            // isSingleItemWithNameFlag rimane false, quindi la lista item mostrerà i dettagli
          }
          dynamicImageUrl = singleItem.uri || null; // Solo per singolo item
        }
      }

      state.outfitDetails = {
        name: dynamicOutfitName,
        items: cartItems, 
        totalPrice: cartItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0),
        currency: '€', 
        imageUrl: dynamicImageUrl, // Sarà null se multi-item
        isSingleItemWithSpecificName: isSingleItemWithNameFlag, // IMPOSTA IL FLAG
        shippingCost: 0,    
        discountAmount: 0 
      };
    },
    resetCheckout(state) {
      // Ritorna una copia pulita di initialState per evitare mutazioni
      const freshInitialState = {
        currentStep: 1,
        shippingData: {},
        paymentData: {},
        orderNumber: null,
        discount: 0,
        outfitDetails: {
          name: '',
          items: [],
          totalPrice: 0,
          currency: '€',
          imageUrl: null,
          isSingleItemWithSpecificName: false, // Assicurati che sia resettato
          shippingCost: 0,
          discountAmount: 0
        }
      };
      return freshInitialState;
    }
  }
});

export const {
  setShippingData,
  setPaymentData,
  applyDiscount,
  goToPreviousStep,
  setOutfitFromCart,
  resetCheckout
} = checkoutSlice.actions;

export default checkoutSlice.reducer;