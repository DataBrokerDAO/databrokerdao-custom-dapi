import { setApiKey as sendgridSetApiKey } from '@sendgrid/mail';
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import bodyParser = require('body-parser');
import { CronJob } from 'cron';
import express from 'express';
import { authenticate } from './dapi/auth';
import { updateSensorPurchases } from './dapi/purchaseRegistry';
import { updateSensorAddresses } from './dapi/sensorRegistry';
import { unsubscribeRoute } from './mail/unsubscribe';
import { sensorDataRoute } from './routes/sensors';
import ConfigService from './services/ConfigService';

export const app = express();
const configService = ConfigService.init();
const dapiBaseUrl = configService.getVariable('DATABROKER_DAPI_BASE_URL');
const sendGridApiKey = configService.getVariable('SENDGRID_API_KEY');
const middlewarePort = configService.getVariable('MIDDLEWARE_PORT');

app.use(bodyParser.json());

app.get('/debug', (req, res, next) => {
  res.send('Running').status(200);
});

app.post('/sensorupdate', sensorDataRoute);

app.get('/unsubscribe', unsubscribeRoute);

function bootstrap() {
  app.listen(middlewarePort, () => {
    console.log(`Listening on port ${middlewarePort}`);
  });
}

async function init() {
  axios.defaults.baseURL = dapiBaseUrl;
  sendgridSetApiKey(sendGridApiKey);
  await authenticate();
  await updateSensorAddresses();
  await updateSensorPurchases();

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
