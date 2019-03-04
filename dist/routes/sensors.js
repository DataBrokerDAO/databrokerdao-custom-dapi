"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const purchase_1 = require("../dapi/purchase");
const registries_1 = require("../dapi/registries");
async function sensorDataRoute(req, res) {
    console.log(`Received data for sensor ${req.body.key}`);
    const sensorId = req.body.key;
    const sensor = req.body;
    if (typeof sensor.key === 'undefined') {
        console.log('Error!');
        return res.sendStatus(400);
    }
    // TODO: change get sensor by ID by the endpoint given by PJ in slack
    // TODO: why do you need it? because you need to go from sensorid => sensor.key (which is the smart contract address)
    // Return early if there are no purchases
    const sensorKey = await registries_1.getSensorKeyForSensorId(sensorId);
    if (sensorKey === undefined) {
        return res.sendStatus(500);
    }
    console.log(sensorKey, 'Sensorkey');
    if (!sensor) {
        console.log(`Could not find sensor ${sensorId}, possible race condition`);
        return res.sendStatus(404);
    }
    // TODO: fetch purchases from DAPI - instead of going to mongo, use the DAPI endpoint
    const purchases = await purchase_1.getSensorPurchasesForSensorKey(sensorKey).catch((error) => {
        return res.sendStatus(500);
    });
    if (purchases.total > 0) {
        console.log(purchases);
    }
    // TODO: fix error
    // if (purchases.length === 0) {
    //   return res.sendStatus(200);
    // }
    // // TODO: attachment now becomes the data packet sent through the request body
    // let attachments: Attachment[];
    // const data = JSON.stringify(sensor);
    // const content = Buffer.from(data).toString('base64');
    // attachments = [
    //   {
    //     contentType: 'text',
    //     filename: 'sensorupdate',
    //     content
    //   }
    // ];
    // TODO: re-enable
    // await sendSensorUpdate(sensor, attachments);
    // return res.sendStatus(200);
    console.log(`${sensorId} succesfully executed!`);
}
exports.sensorDataRoute = sensorDataRoute;
//# sourceMappingURL=sensors.js.map