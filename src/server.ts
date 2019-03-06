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
import { sensorPurchaseCron } from './crons/purchases';
import { authenticate } from './dapi/auth';
import { updateSensorAddresses } from './dapi/sensorRegistry';
import { send } from './mail/mailer';
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
  sensorPurchaseCron();

  new CronJob(
    '* */10 * * *',
    sensorPurchaseCron,
    sensorPurchaseCron,
    true,
    'Europe/Brussels'
  ).start();
}

// async function handlePurchase(purchase) {
//   const sensor = await getSensorForKey(purchase.sensor);
//   if (!sensor) {
//     console.log(`Error: could not find sensor ${purchase.sensor}`);
//     return;
//   }

//   // Fallback for purchases that still have email not encrypted.
//   let email;
//   if (typeof purchase.email === 'string') {
//     email = purchase.email;
//   } else {
//     email = ecies
//       .decryptMessage(
//         Buffer.from(process.env.SERVER_PRIVATE_KEY, 'hex'),
//         Buffer.from(purchase.email)
//       )
//       .toString('ascii');
//   }

//   const subscribed = await registry.isSubscribed(email, sensor.sensorid);
//   if (subscribed) {
//     console.log(`Notice: user already subscribed`);
//     return;
//   }

//   if (sensor.sensortype === 'DATASET') {
//     registry.subscribe(email, sensor.sensorid).then(subscription => {
//       handleDatasetPurchase(purchase, sensor);
//     });
//   } else {
//     registry.subscribe(email, sensor.sensorid).then(subscription => {
//       sensorregister.send(subscription.email, sensor);
//     });
//   }
// }

// async function handleDatasetPurchase(purchase, sensor) {
//   console.log(
//     `Notice: handling purchase ${purchase.key} of dataset ${sensor.key}`
//   );

//   // Check if purchase is not expired yet
//   if (
//     !moment.unix(purchase.starttime).isBefore() && // starttime needs to be before now
//     !moment.unix(purchase.endtime).isAfter() // endtime needs to be after now
//   ) {
//     return console.log(
//       `Error: access to purchase with key ${purchase.key} has expired`
//     );
//   }

//   // Decrypt sensor credentials
//   let credentials;
//   try {
//     credentials = {
//       url: ecies
//         .decryptMessage(
//           Buffer.from(process.env.SERVER_PRIVATE_KEY, 'hex'),
//           Buffer.from(sensor.credentials.url)
//         )
//         .toString('ascii')
//     };
//   } catch (e) {
//     console.log(
//       `Error: could not decrypt credentials for sensor with key ${
//         purchase.sensor
//       }`,
//       e
//     );
//   }
//
//   // Send email with credentials to purchaser
//   try {
//     await sendDataSetCredentials(purchase.email, sensor, credentials);
//   } catch (e) {
//     console.log(
//       `Error: could not send credentials by email for sensor with key ${
//         purchase.sensor
//       }`,
//       e
//     );
//   }
// }

bootstrap();
init();
