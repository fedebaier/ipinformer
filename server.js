'use strict';

const maxmind = require('maxmind');
const morgan = require('morgan');
const express = require('express');

const app = express();
app.use(morgan('common'));

app.get('/check-ip', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/ip-info', (req, res) => {
  const { clienttoken } = req.headers;

  if (!clienttoken || clienttoken !== '98mgUpRkJ8U3AQfFCmXG9WzDDPck2eSW')
    return res.status(403).send({ error: 'Forbidden' });

  const { ip } = req.query;

  if (!ip) return res.status(400).send({ error: 'Bad request' });

  // Load countries list
  const countryLookup = maxmind.openSync('./countries.mmdb');

  // Return country info from IP
  res.send(countryLookup.get(ip));
});

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log('We are live on ', port);
});
