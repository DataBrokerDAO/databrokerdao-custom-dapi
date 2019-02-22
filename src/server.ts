import express from 'express';
import bodyParser = require('body-parser');
import { unsubscribeRoute } from './mail/unsubscribe';
import { sensorDataRoute } from './sensors/sensors';
import { watch } from 'fs';
import { ecies } from '@settlemint/lib-crypto';
import { getSensorForKey } from './services/mongo/store';
import { sendDataSetCredentials } from './mail/mails/datasetcredentials';
import moment from 'moment';

export const app = express();

app.use(bodyParser);

app.get('/debug', unsubscribeRoute);

app.post('/sensors/data', sensorDataRoute);

function bootstrap() {
  app.listen(process.env.MIDDLEWARE_PORT, () => {
    console.log(`Listening on port ${process.env.MIDDLEWARE_PORT}`);
    // watch('purchaseregistry-items', (data: {}) => {
    //   if (data.operationType === 'insert') {
    //     handlePurchase(data.fullDocument);
    //   }
    // });
  });
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
