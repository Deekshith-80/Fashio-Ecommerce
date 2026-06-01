import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ordersList: [],
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, action) => {
      state.ordersList.unshift(action.payload);
    },
    setOrders: (state, action) => {
      state.ordersList = Array.isArray(action.payload) ? action.payload : [];
    },
  },
});

export const { addOrder, setOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
