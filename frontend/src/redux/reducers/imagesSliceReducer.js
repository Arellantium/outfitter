// src/redux/reducers/imagesSliceReducer.js
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
      console.log('[imagesSlice] fetchImagesStart - Inizio caricamento immagini.');
      state.loading = true;
      state.error = null;
    },
    fetchImagesSuccess: (state, action) => {
      console.log('[imagesSlice] fetchImagesSuccess - Ricevuto payload. Lunghezza:', action.payload ? action.payload.length : 'Payload nullo/undefined');

      if (!Array.isArray(action.payload)) {
        console.error('[imagesSlice] ERRORE CRITICO: action.payload in fetchImagesSuccess NON è un array!', action.payload);
        state.loading = false;
        state.error = 'Dati immagine non validi ricevuti (non un array).';
        return;
      }

      const processedImages = action.payload.map((img, index) => {
        if (typeof img !== 'object' || img === null) {
          console.error(`[imagesSlice] ERRORE: Immagine all'indice ${index} nel payload non è un oggetto:`, img);
          return {
            id_image: `invalid-item-${Date.now()}-${index}`,
            description: `Errore: Dati immagine corrotti per item ${index}`,
            uri: '',
            price: '0.00',
            user: 'Sconosciuto',
            like: false,
            sold: false
          };
        }
        // console.log(`[imagesSlice] Pre-Process Img ${index} (ID: ${img.id_image}):`, JSON.stringify(img, null, 2));
        let descriptionText = '';
        if (typeof img.description === 'string' && img.description.trim() !== '') {
          descriptionText = img.description;
        } else if (typeof img.name === 'string' && img.name.trim() !== '') {
          descriptionText = img.name;
          // console.log(`[imagesSlice] Img ${index} (ID: ${img.id_image}): 'description' non valida o assente, usando 'name': '${descriptionText}'`);
        } else {
          descriptionText = `Articolo ${img.id_image || `generato-${index}`}`;
          // console.log(`[imagesSlice] Img ${index} (ID: ${img.id_image}): 'description' e 'name' non validi/assenti, usando fallback: '${descriptionText}'`);
        }
        const newImg = { ...img, description: descriptionText };
        // console.log(`[imagesSlice] Post-Process Img ${index} (ID: ${newImg.id_image}) - description: '${newImg.description}'`);
        return newImg;
      });

      // --- MODIFICA QUI ---
      // Dato che PhotoGrid.js ora carica allImages.json una sola volta,
      // sostituiamo sempre lo stato delle immagini.
      state.images = processedImages;
      console.log(`[imagesSlice] fetchImagesSuccess - Immagini SOSTITUITE nello stato. Totale: ${state.images.length}`);
      // --- FINE MODIFICA ---

      state.loading = false;
      state.error = null;
    },
    fetchImagesError(state, action) {
      console.error('[imagesSlice] fetchImagesError - Errore durante il fetch:', action.payload);
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
      console.log(`[imagesSlice] markAsSold - Tentativo di marcare come venduto ID: ${id}`); // LOG
      const image = state.images.find(img => String(img.id_image) === String(id)); // Confronta come stringhe per sicurezza
      if (image) {
        image.sold = true;
        console.log(`[imagesSlice] markAsSold - Immagine ID: ${id} MARCATA COME VENDUTA. Nuovo stato sold: ${image.sold}`); // LOG
      } else {
        console.warn(`[imagesSlice] markAsSold - Immagine ID: ${id} NON TROVATA per marcare come venduta.`); // LOG
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