const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const validator = require('validator');
const sensorupdate = require('./services/mail/mails/sensorupdate');
const sensorregister = require('./services/mail/mails/sensorregister');
const registry = require('./services/mail/registry');
const store = require('./services/mongo/store');
const rp = require('request-promise');
const rtrim = require('rtrim');
const { ecies } = require('@settlemint/lib-crypto');
const stripHexPrefix = require('strip-hex-prefix');

const DELIMITER_HASH = '||';
const DELIMITER_SENSOR = '!#!';

require('dotenv').config();

app.use(bodyParser.json());

app.get('/debug', (req, res, next) => {
  res.send('Running').status(200);
});

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
      let unsubscribedUrl = rtrim(process.env.DAPP_BASE_URL, '/') + '/unsubscribed';
      res.redirect(unsubscribedUrl);
    })
    .catch(error => {
      res.send(error).status(200);
    });
});

app.post('/:sensorid/data', async (req, res, next) => {
  console.log(`Received data for sensor ${req.params.sensorid}`);
  const sensorID = req.params.sensorid;
  const sensorCsvUrl = req.body.url;
  const sensorCsvData = req.body.data;

  if (typeof sensorCsvUrl === 'undefined' && typeof sensorCsvData === 'undefined') {
    return res.sendStatus(400);
  }

  // Return early if there are no purchases
  const sensor = await store.getSensorForSensorId(sensorID);
  if (!sensor) {
    console.log(`Could not find sensor ${sensorID}, possible race condition`);
    return res.sendStatus(404);
  }

  const purchases = await store.getPurchasesForSensorKey(sensor.key);
  if (purchases.length === 0) {
    return res.sendStatus(200);
  }

  let attachments;
  if (typeof sensorCsvUrl !== 'undefined') {
    let data = await rp({ url: sensorCsvUrl });
    data = data.replace(/;/g, ','); // Change delimiter so mail clients can parse it;
    const content = Buffer.from(data).toString('base64');

    const regexp = /\/\/.*\/(.*.csv)/g;
    const match = regexp.exec(sensorCsvUrl);
    const filename = match[1];

    attachments = [
      {
        type: 'text/csv',
        name: filename,
        content: content
      }
    ];
  } else if (typeof sensorCsvData !== 'undefined') {
    const data = JSON.stringify(sensorCsvData);
    const content = Buffer.from(data).toString('base64');
    attachments = [
      {
        type: 'text',
        name: 'sensorupdate',
        content: content
      }
    ];
  }

  await sensorupdate.send(sensor, attachments);
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
  const sensor = await store.getSensorForKey(purchase.sensor);
  if (!sensor) {
    console.log(`Error: could not find sensor ${purchase.sensor}`);
    return;
  }

  // Fallback for purchases that still have email not encrypted.
  let email;
  if (typeof purchase.email === 'string') {
    email = purchase.email;
  } else {
    email = ecies
      .decryptMessage(Buffer.from(process.env.SERVER_PRIVATE_KEY, 'hex'), Buffer.from(purchase.email))
      .toString('ascii');
  }

  const subscribed = await registry.isSubscribed(email, sensor.sensorid);
  if (subscribed) {
    console.log(`Notice: user already subscribed`);
    return;
  }

  registry.subscribe(email, sensor.sensorid).then(subscription => {
    sensorregister.send(subscription.email, sensor);
  });
}

bootstrap();

module.exports = app; // Export app for tests.
