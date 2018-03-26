'use strict';

const maxmind = require('maxmind');
const morgan = require('morgan');
const express = require('express');

const app = express();
app.use(morgan('common'));

app.get('/ip-info', (req, res) => {
  const { clienttoken } = req.headers;

  if (!clienttoken || clienttoken !== '98mgUpRkJ8U3AQfFCmXG9WzDDPck2eSW')
    return res.status(403).send({ error: 'Forbidden' });

  const { ip } = req.query;

  if (!ip) return res.status(400).send({ error: 'Bad request' });

  // Load countries list
  const countryLookup = maxmind.openSync('./countries.mmdb');

  // Get country info from IP
  const info = countryLookup.get(ip);

  // Send info
  res.send(info);
});

app.listen(3333, () => {
  console.log('We are live on 3333');
});
