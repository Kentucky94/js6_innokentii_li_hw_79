const express = require('express');

const mysqlDb = require('../mysqlDb');

const router = express.Router();

router.get('/', async (req, res) => {
  const locations = await mysqlDb.getConnection().query('SELECT `id`, `location_name` FROM `locations`');
  res.send(locations);
});

router.get('/:id', async (req, res) => {
  const location = await mysqlDb.getConnection().query('SELECT * FROM `locations` WHERE `id` = ?', req.params.id);
  res.send(location[0]);
});

router.post('/', async (req, res) => {
  const location = req.body;

  await mysqlDb.getConnection().query(
    'INSERT INTO `locations` (`location_name`, `location_description`) VALUES' +
    `(?, ?)`,
    [location.location_name, location.location_description]
  );

  const result = await mysqlDb.getConnection().query('SELECT * FROM `locations` WHERE `location_name` = ?', location.location_name);

  res.send(result[0]);
});

router.delete('/:id', async (req, res) => {
  await mysqlDb.getConnection().query('DELETE FROM `locations` WHERE `id` = ?', req.params.id);

  res.send(req.body.id);
});

module.exports = router;