import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Chart: React.FC = () => {
  const priceHistory = useSelector((state: RootState) => state.stock.priceHistory);

  const options = {
    title: { text: 'Tesla Stock Price History' },
    xAxis: { title: { text: 'Trade #'}, categories: priceHistory.map((_, i) => (i + 1).toString()) },
    yAxis: { title: { text: 'Price (₹)' } },
    series: [
      {
        name: 'Price',
        data: priceHistory,
        type: 'line',
      },
    ],
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default Chart;