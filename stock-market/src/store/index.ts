import { configureStore } from '@reduxjs/toolkit';
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
      if (state.totalStocks >= action.payload) {
        state.totalStocks -= action.payload;
        state.price += action.payload * 2;
        state.priceHistory.push(state.price);
      }
    },
    sell(state, action: PayloadAction<number>) {
      state.totalStocks += action.payload;
      state.price = Math.max(1000, state.price - action.payload * 2);
      state.priceHistory.push(state.price);
    },
  },
});

export const { buy, sell } = stockSlice.actions;

export const store = configureStore({
  reducer: {
    stock: stockSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

