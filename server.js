'use strict';

const maxmind = require('maxmind');
const morgan = require('morgan');
const express = require('express');

const app = express();
app.use(morgan('common'));

app.get('/check-ip', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/ip-info', async (req, res) => {
  const clientToken = req.header('ClientToken');

  if (!clientToken || clientToken !== '98mgUpRkJ8U3AQfFCmXG9WzDDPck2eSW')
    return res.status(403).send({ error: 'Forbidden' });

  const { ip } = req.query;

  if (!ip) return res.status(400).send({ error: 'Bad request' });

  if (!maxmind.validate(ip))
    return res.status(400).send({ error: 'Invalid IP' });

  // Load countries list
  const countryLookup = await maxmind.open('./countries.mmdb');

  // Return country info from IP
  res.send(countryLookup.get(ip));
});

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log('We are live on ', port);
});
