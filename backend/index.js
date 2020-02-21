const express = require('express');
const cors = require('cors');

const config = require('./config');
const mysqlDb = require('./mysqlDb');

const categories = require('./app/categories');
const locations = require('./app/locations');
const items = require('./app/items');

const app = express();

app.use(express.json());

app.use(cors());

app.use(express.static('public'));

app.use('/categories', categories);

app.use('/locations', locations);

app.use('/items', items);

const run = async () => {
  await mysqlDb.connect();

  app.listen(config.port, () => {
    console.log('Please try', config.port);
  });

  process.on('exit', () => {
    mysqlDb.disconnect();
  })
};

run().catch(e => {
  console.log(e);
});