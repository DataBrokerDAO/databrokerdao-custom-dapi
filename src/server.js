require('dotenv').load();

const mongo = require('./services/mongo/store');
const spreadsheet = require('./services/google/spreadsheet');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const Promise = require('bluebird');
const delimiter = '!#!';

app.use(bodyParser.json());

app.post('/:sensorid/data', async (req, res, next) => {
  console.log(`Received data for sensor ${req.params.sensorid}`);

  let parts = req.params.sensorid.split(delimiter);
  let source = parts[0];
  if (typeof source === 'undefined') {
    return res.sendStatus(400);
  }

  let purchasers = [];
  let purchases = await mongo.getPurchasesForSensorID(req.params.sensorid);
  purchases.forEach(purchase => {
    if (purchase.endtime >= new Date() / 1000) {
      purchasers.push(purchase.address);
    }
  });

  let data = req.body;
  data.purchaser = purchasers.join(',');
  data.dbdaosensorid = req.params.sensorid;

  await new Promise((resolve, reject) => {
    spreadsheet
      .publish(source, data)
      .then(() => {
        resolve();
      })
      .catch(error => {
        console.log(`Error while publishing ${source} data ${error}`);
        resolve();
      });
  });

  return res.sendStatus(200);
});

function bootstrap() {
  app.listen(process.env.MIDDLEWARE_PORT, server => {
    console.log(`Listening on port ${process.env.MIDDLEWARE_PORT}`);

    // Note we establish a mongo connection during bootstrap b/c during the connection time
    // the  data endpoint might be hit >80 times, leading to rate limiting in Atlas
    mongo
      .triggerConnection()
      .then(() => {
        console.log('Mongo DB connection established');
      })
      .catch(error => {
        console.log(`Could not establish a Mongo DB connection, shutting down Express server ${error}`);
        server.close();
      });
  });
}

bootstrap();

module.exports = app; // Export app for tests.
