import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  isDrawerOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    toggleDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    addToCart: (state, action) => {
      const incoming = action.payload;
      const existing = state.cartItems.find((item) => item.id === incoming.id);

      if (existing) {
        existing.quantity += incoming.quantity ?? 1;
        existing.size = incoming.size || existing.size;
        return;
      }

      state.cartItems.push({
        ...incoming,
        quantity: incoming.quantity ?? 1,
      });
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((cartItem) => cartItem.id === id);

      if (!item) return;

      if (typeof quantity !== "number") return;

      if (quantity < 1) {
        state.cartItems = state.cartItems.filter((cartItem) => cartItem.id !== id);
        return;
      }

      item.quantity = quantity;
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const { toggleDrawer, addToCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
