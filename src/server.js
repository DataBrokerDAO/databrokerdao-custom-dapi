const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const validator = require('validator');
const sensorupdate = require('./services/mail/mails/sensorupdate');
const sensorregister = require('./services/mail/mails/sensorregister');
const registry = require('./services/mail/registry');
const store = require('./services/mongo/store');

const DELIMITER_HASH = '||';
const DELIMITER_SENSOR = '!#!';

require('dotenv').config();

app.use(bodyParser.json());

app.get('/unsubscribe', (req, res, next) => {
  const hash = new Buffer(req.query.hash, 'base64').toString('utf8');
  const parts = hash.split(DELIMITER_HASH);
  if (parts.length < 1) {
    res.sendStatus(400);
  }

  // Validate user input - email
  const email = parts[0];
  if (!validator.isEmail(email)) {
    res.sendStatus(400);
  }

  // Validate user input - sensorid
  const sensorid = parts[1];
  if (typeof sensorid !== 'undefined') {
    const sensorIdParts = sensorid.split(DELIMITER_SENSOR);
    if (!sensorIdParts.length === 3) {
      res.sendStatus(400);
    }
  }

  registry
    .unsubscribe(email, sensorid)
    .then(response => {
      res.send('OK').status(200);
    })
    .catch(error => {
      res.send(error).status(200);
    });
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
    store.watch('purchaseregistry-items', data => {
      if (data.operationType === 'insert') {
        handlePurchase(data.fullDocument);
      }
    });
  });
}

async function handlePurchase(purchase) {
  const sensor = await store.getSensorForKey(purchase.stream);
  if (!sensor) {
    console.log(`Error: could not find sensor for stream ${purchase.stream}`);
    return;
  }

  const subscribed = await registry.isSubscribed(purchase.email, sensor.sensorid);
  if (!subscribed) {
    console.log(`Notice: user already subscribed or unsubscribed manually`);
    return;
  }

  registry.subscribe(purchase.email, sensor).then(subscription => {
    sensorregister.send(subscription.email, sensor);
  });
}

bootstrap();

module.exports = app; // Export app for tests.
