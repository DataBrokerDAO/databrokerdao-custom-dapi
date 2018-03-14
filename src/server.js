const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sensorupdate = require('./services/mail/mails/sensorupdate');
const registry = require('./services/mail/registry');

require('dotenv').config();

app.use(bodyParser.json());

app.get('/debug', async (req, res, next) => {
  const MongoQS = require('mongo-querystring');
  const util = require('util');

  const DEFAULT_OPTIONS = {
    skip: 0,
    limit: 25,
    dir: -1,
    sort: 'key'
  };

  const qs = new MongoQS({
    custom: {
      bbox: 'geo',
      near: 'geo'
    }
  });

  console.log(req.query);
  let q = qs.parse(req.query);
  console.log(util.inspect(q, false, null));
  let c = await mongo.getCollection();
  c.find();
  res.sendStatus(200);
});

app.get('/unsubscribe', (req, res, next) => {
  const hash = req.query.hash;
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
