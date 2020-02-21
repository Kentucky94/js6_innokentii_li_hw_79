const express = require('express');

const mysqlDb = require('../mysqlDb');

const router = express.Router();

router.get('/', async (req, res) => {
  const categories = await mysqlDb.getConnection().query('SELECT `id`, `category_name` FROM `categories`');
  res.send(categories);
});

router.get('/:id', async (req, res) => {
  const category = await mysqlDb.getConnection().query('SELECT * FROM `categories` WHERE `id` = ?', req.params.id);
  res.send(category[0]);
});

router.post('/', async (req, res) => {
  const category = req.body;

  await mysqlDb.getConnection().query(
    'INSERT INTO `categories` (`category_name`, `category_description`) VALUES' +
    `(?, ?)`,
    [category.category_name, category.category_description]
  );

  const result = await mysqlDb.getConnection().query('SELECT * FROM `categories` WHERE `category_name` = ?', category.category_name);

  res.send(result[0]);
});

router.delete('/:id', async (req, res) => {
  await mysqlDb.getConnection().query('DELETE FROM `categories` WHERE `id` = ?', req.params.id);

  res.send(req.body.id);
});

module.exports = router;