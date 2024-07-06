const express = require('express');
const { getCurrency, addCurrency } = require('./currency-api');
const app = express();

app.use(express.json());

// Endpoint for /currency/:symbol
app.get('/currency/:symbol', (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const currency = getCurrency(symbol);
  if (currency) {
    res.json({
      name: currency.name,
      symbol: currency.symbol,
      description: currency.description
    });
  } else {
    res.status(404).json({ message: 'Currency not found' });
  }
});

// Endpoint for /rate/:symbol
app.get('/rate/:symbol', (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const currency = getCurrency(symbol);
  if (currency) {
    res.json({ rate: currency.rate });
  } else {
    res.status(404).json({ message: 'Currency not found' });
  }
});

// Endpoint for rate/:frSymbol/:amount
app.get('/rate/:frSymbol/:amount', (req, res) => {
  const frSymbol = req.params.frSymbol.toUpperCase();
  const amount = parseFloat(req.params.amount);
  const currency = getCurrency(frSymbol);
  if (currency && !isNaN(amount)) {
    const exchange = amount * currency.rate;
    res.json({ exchange });
  } else {
    res.status(400).json({ message: 'Invalid currency or amount' });
  }
});

// Endpoint for adding a new currency
app.post('/currency', (req, res) => {
  const { id, name, symbol, rate, description } = req.body;
  if (id && name && symbol && rate && description) {
    addCurrency(id, name, symbol, rate, description);
    res.status(201).json({
      status: '201',
      description: 'New currency added.'
    });
  } else {
    res.status(400).json({
      status: '400',
      description: 'Invalid currency data.'
    });
  }
});

// Fallback for non-existent endpoints
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

module.exports.handler = (req, res, context) => {
  app(req, res);
};