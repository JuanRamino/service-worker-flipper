const express = require('express');
const updateVersion = require('./updateVersion');

const app = express();

app.use('/', express.static('public'));

app.get('/update-version', (req, res) => {
  updateVersion()
    .then(() => res.sendStatus(200))
    .catch((err) => {
      res.sendStatus(500);
      console.log(err);
    });
});

app.use((req, res) => {
  res.sendStatus(404);
});

let { PORT, HOST } = process.env;
PORT = PORT || 3000;
HOST = HOST || '127.0.0.1'

const server = app.listen(PORT, HOST, 0, ()=> console.log(`Server started on port ${HOST}:${PORT}`) );

module.exports = server;
