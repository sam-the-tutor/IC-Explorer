import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

// let rates = [];
// let d = t.map((x) => {
//   let supply = x?.last
//     ? x.last.circulating_supply / 10 ** x.config.decimals
//     : 0n;
//   let price = x.rates.find((q) => q.to_token === "0");
//   if (price) price = price.rate;
//   else price = 0;
//   let volume = x.rates.find((x) => x.to_token === "0").volume;
//   let depth2 = x.rates.find((x) => x.to_token === "0").depth2;
//   let depth8 = x.rates.find((x) => x.to_token === "0").depth8;
//   let depth50 = x.rates.find((x) => x.to_token === "0").depth50;

//   let total = Number((x.last?.total_supply || 0) / 10 ** x.config.decimals);
//   rates.push(...x.rates.map((a) => ({ pair: a.symbol, rate: a.rate })));
//   let sns = 'sns' in x.config.locking ? 'SNS' : '';
//   return {
//     sns,
//     symbol: x.config.symbol,
//     circulating:
//       supply + ' | ' + ((Number(supply) * 100) / total).toFixed(1) + '%',
//     price_USD: price.toFixed(6),
//     marketcap_USD: Number(supply) * price,
//     volume_USD: volume.toFixed(0),
//     total: total.toLocaleString(),
//     depth2: depth2.toFixed(0),
//     depth8: depth8.toFixed(0),
//     depth50: depth50.toFixed(0),
//     treasury: (
//       (x.last?.treasury || 0) /
//       10 ** x.config.decimals
//     ).toLocaleString(),
//     treasuryICP: (x.last?.other_treasuries[0]
//       ? x.last?.other_treasuries[0][1] / 10 ** 8
//       : 0
//     ).toLocaleString(),
//     dissolving_1d_USD: Math.round(
//       Number((x.last?.dissolving_1d || 0) / 10 ** x.config.decimals) * price,
//     ).toLocaleString(),
//     dissolving_30d_USD: Math.round(
//       Number((x.last?.dissolving_30d || 0) / 10 ** x.config.decimals) * price,
//     ).toLocaleString(),
//     dissolving_1y_USD: Math.round(
//       Number((x.last?.dissolving_1y || 0) / 10 ** x.config.decimals) * price,
//     ).toLocaleString(),
//   };
// });
// // d = d.filter(a => (a.symbol != 'OGY') && (a.symbol != 'ICP') && (a.symbol != "OT"))
// d = d.sort((a, b) => b.marketcap_USD - a.marketcap_USD);
// d = d.map((x) => ({
//   ...x,
//   marketcap_USD: Math.round(x.marketcap_USD).toLocaleString(),
// }));
// table(d);
