import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  images: [],
  loading: false,
  error: null,
};

const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    fetchImagesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchImagesSuccess: (state, action) => {
      state.images = [...state.images, ...action.payload]; // ✅ Accoda immagini
      state.loading = false;
      state.error = null;
    },
    fetchImagesError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    toggleLike(state, action) {
      const id = action.payload;
      const image = state.images.find(img => img.id_image === id);
      if (image) {
        image.like = !image.like;
      }
    },
    markAsSold(state, action) {
      const id = action.payload;
      const image = state.images.find(img => img.id_image === id);
      if (image) {
        image.sold = true;
      }
    }
  }
});

export const {
  fetchImagesStart,
  fetchImagesSuccess,
  fetchImagesError,
  toggleLike,
  markAsSold
} = imagesSlice.actions;

export default imagesSlice.reducer;
