const express = require('express');
const bodyParser = require('body-parser');

const api = require('./api');

const { PORT = 8080 } = process.env;
const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', api);

app.listen(PORT, () => {

  // eslint-disable-next-line
  console.log(`Listening on http://localhost:${PORT}`);
});
