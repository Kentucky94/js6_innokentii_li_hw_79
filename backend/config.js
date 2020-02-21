const path = require('path');

const rootPath = __dirname;

module.exports = {
  rootPath,
  port: 8080,
  uploadPath: path.join(rootPath, 'public', 'uploads'),
  database: {
    user: 'user',
    host: 'localhost',
    password: 'Dorian1706$$$',
    database: 'hw_79'
  }
};