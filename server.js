require('dotenv').load();

const mongo = require('./src/services/mongo/store');
const spreadsheet = require('./src/services/google/spreadsheet');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
app.use(bodyParser.json());

app.post('/:sensorid/data', async (req, res, next) => {
  console.log(`Received data for sensor ${req.params.sensorid}`);
  let purchases = await store.getPurchasesForSensorID(req.params.sensorid).toArray();
  if (purchases.length === 0) {
    return res.status(204);
  }

  let data = req.body;
  purchases.forEach(purchase => {
    // Only process if the purchase is not expired
    if (purchase.endtime >= new Date() / 1000) {
      data.address = purchase.address;
      spreadsheet.publish(row);
    }
  });

  res.status(200);
});

function bootstrap() {
  app.listen(process.env.MIDDLEWARE_PORT, async () => {
    console.log(`Listening on port ${process.env.MIDDLEWARE_PORT}`);
  });
}

bootstrap();

module.exports = app; // Export app for tests.
