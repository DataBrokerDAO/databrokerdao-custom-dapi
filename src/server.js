const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sensorupdate = require('./services/mail/mails/sensorupdate');
const registry = require('./services/mail/registry');
const DELIMITER = '||';

require('dotenv').config();

app.use(bodyParser.json());

app.get('/unsubscribe', (req, res, next) => {
  registry.unsubscribe(req.query.hash)
  res.sendStatus(200);
});

app.post('/:sensorid/data', async (req, res, next) => {
  console.log(`Received data for sensor ${req.params.sensorid}`);
  const sensorID = req.params.sensorid;
  const sensorCsvUrl = req.body.url;
  await sensorupdate.send(sensorID, sensorCsvUrl);
  return res.sendStatus(200);
});

function bootstrap() {
  app.listen(process.env.MIDDLEWARE_PORT, server => {
    console.log(`Listening on port ${process.env.MIDDLEWARE_PORT}`);
    registry.watch();
  });
}

bootstrap();

module.exports = app; // Export app for tests.
