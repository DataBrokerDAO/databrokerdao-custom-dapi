"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const bodyParser = require("body-parser");
const cron_1 = require("cron");
const express_1 = __importDefault(require("express"));
const dapi_config_1 = require("./config/dapi-config");
const purchases_1 = require("./crons/purchases");
const auth_1 = require("./dapi/auth");
const registries_1 = require("./dapi/registries");
const unsubscribe_1 = require("./mail/unsubscribe");
const sensors_1 = require("./routes/sensors");
exports.app = express_1.default();
exports.app.use(bodyParser.json());
exports.app.get('/debug', unsubscribe_1.unsubscribeRoute);
exports.app.post('/sensor/data', sensors_1.sensorDataRoute);
function bootstrap() {
    exports.app.listen(dapi_config_1.MIDDLEWARE_PORT, () => {
        console.log(`Listening on port ${dapi_config_1.MIDDLEWARE_PORT}`);
        // TODO: replace this by purchase CRON
        // watch('purchaseregistry-items', (data: {}) => {
        //   if (data.operationType === 'insert') {
        //     handlePurchase(data.fullDocument);
        //   }
        // });
    });
}
async function init() {
    axios_1.default.defaults.baseURL = dapi_config_1.DATABROKER_DAPI_BASE_URL;
    await auth_1.authenticate();
    // Loads the sensorkeys to cache
    // TODO: Sould be updated each few hours, undefined issues at startup but should be no problem after startup
    // TODO: What if a sensor is not defined in cache?
    registries_1.updateSensorKeys();
    purchases_1.sensorPurchaseCron();
    new cron_1.CronJob('* */10 * * *', purchases_1.sensorPurchaseCron, purchases_1.sensorPurchaseCron, true, 'Europe/Brussels').start();
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
//# sourceMappingURL=server.js.map