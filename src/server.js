require('dotenv').load();

const mongo = require('./services/mongo/store');
const spreadsheet = require('./services/google/spreadsheet');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const Promise = require('bluebird');

app.use(bodyParser.json());

app.post('/:sensorid/data', async (req, res, next) => {
  console.log(`Received data for sensor ${req.params.sensorid}`);
  let data = req.body;
  let purchases = await mongo.getPurchasesForSensorID(req.params.sensorid);
  await Promise.map(
    purchases,
    purchase => {
      return new Promise((resolve, reject) => {
        if (purchase.endtime < new Date() / 1000) {
          resolve();
        }

        // TEMP add purchaser to the data for demo purposes
        data.purchaser = purchase.address;

        spreadsheet
          .publish(data)
          .then(() => {
            resolve();
          })
          .catch(error => {
            console.log(`Error while publishing data ${error}`);
            resolve();
          });
      });
    },
    { concurrency: 4 }
  );

  res.sendStatus(200);
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