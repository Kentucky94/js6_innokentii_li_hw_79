const express = require('express');
const path = require('path');
const multer = require('multer');
const nanoid = require('nanoid');

const config = require('../config');
const mysqlDb = require('../mysqlDb');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, nanoid() + path.extname(file.originalname))
  }
});

const upload = multer({storage});

router.get('/', async (req, res) => {
  const items = await mysqlDb.getConnection().query('SELECT `id`, `category_id`, `location_id`,`item_name` FROM `items`');
  res.send(items);
});

router.get('/:id', async (req, res) => {
  const item = await mysqlDb.getConnection().query('SELECT * FROM `items` WHERE `id` = ?', req.params.id);
  res.send(item[0]);
});

router.post('/', upload.single('item_photo'), async (req, res) => {
  const item = req.body;

  if(req.file){
    item.item_photo = req.file.filename;
  }

  await mysqlDb.getConnection().query(
    'INSERT INTO `items` (`category_id`, `location_id`, `item_name`, `item_description`, `item_photo`) VALUES' +
    `(?, ?, ?, ?, ?)`,
    [item.category_id, item.location_id, item.item_name, item.item_description, item.item_photo]
  );

  const result = await mysqlDb.getConnection().query('SELECT * FROM `items` WHERE `item_name` = ?', item.item_name);

  res.send(result[0]);
});

router.delete('/:id', async (req, res) => {
  await mysqlDb.getConnection().query('DELETE FROM `items` WHERE `id` = ?', req.params.id);

  res.send(req.body.id);
});

module.exports = router;