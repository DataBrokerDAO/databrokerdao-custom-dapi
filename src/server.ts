import { setApiKey as sendgridSetApiKey } from '@sendgrid/mail';
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import bodyParser = require('body-parser');
import { CronJob } from 'cron';
import express from 'express';
import {
  DATABROKER_DAPI_BASE_URL,
  MIDDLEWARE_PORT,
  SENDGRID_API_KEY
} from './config/dapi-config';
import { authenticate } from './dapi/auth';
import { updateSensorPurchases } from './dapi/purchaseRegistry';
import { updateSensorAddresses } from './dapi/sensorRegistry';
import { unsubscribeRoute } from './mail/unsubscribe';
import { sensorDataRoute } from './routes/sensors';

export const app = express();

app.use(bodyParser.json());

app.get('/debug', (req, res, next) => {
  res.send('Running').status(200);
});

app.post('/sensor/data', sensorDataRoute);

app.get('/unsubscribe', unsubscribeRoute);
 
function bootstrap() {
  app.listen(MIDDLEWARE_PORT, () => {
    console.log(`Listening on port ${MIDDLEWARE_PORT}`);
  });
}

async function init() {
  axios.defaults.baseURL = DATABROKER_DAPI_BASE_URL;
  sendgridSetApiKey(SENDGRID_API_KEY);
  await authenticate();
  updateSensorAddresses();
  updateSensorPurchases();

  new CronJob(
    '* */10 * * *',
    updateSensorPurchases,
    updateSensorPurchases,
    true,
    'Europe/Brussels'
  ).start();
}

bootstrap();
init();
