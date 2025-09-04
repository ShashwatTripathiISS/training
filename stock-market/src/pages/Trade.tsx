import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { buy, sell } from '../store/stockSlice';

const Trade: React.FC = () => {
  const dispatch = useDispatch();
  const stock = useSelector((state: RootState) => state.stock);

  const [amount, setAmount] = useState(1);

  const handleBuy = () => {
    if (stock.totalStocks >= amount && amount > 0) {
      dispatch(buy(amount));
    }
  };

  const handleSell = () => {
    if (amount > 0) {
      dispatch(sell(amount));
    }
  };

  return (
    <div>
      <p>Market Stocks Left: {stock.totalStocks}</p>
      <p>Current Tesla Price: ₹{stock.price}</p>
      <input
        type="number"
        min={1}
        max={stock.totalStocks}
        value={amount}
        onChange={e => setAmount(Number(e.target.value))}
      />
      <button onClick={handleBuy}>Buy</button>
      <button onClick={handleSell}>Sell</button>
      <p style={{ fontSize: '0.9rem', color: '#888' }}>
        Buying increases price, selling decreases price.
      </p>
    </div>
  );
};

export default Trade;