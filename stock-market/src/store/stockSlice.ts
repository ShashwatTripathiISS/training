import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StockState {
  totalStocks: number;
  price: number;
  priceHistory: number[];
}

const initialState: StockState = {
  totalStocks: 5000,
  price: 3000,
  priceHistory: [3000],
};

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    buy(state, action: PayloadAction<number>) {
      state.totalStocks -= action.payload;
      state.price += action.payload * 2; // price increases with demand
      state.priceHistory.push(state.price);
    },
    sell(state, action: PayloadAction<number>) {
      state.totalStocks += action.payload;
      state.price -= action.payload * 2; // price decreases with supply
      state.priceHistory.push(state.price);
    },
  },
});

export const { buy, sell } = stockSlice.actions;
export default stockSlice.reducer;