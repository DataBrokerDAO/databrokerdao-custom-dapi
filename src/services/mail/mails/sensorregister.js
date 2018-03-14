const mongo = require('./services/mongo/store');
const rp = require('request-promise');
const mailer = require('./../mailer');

async function send(sensorID, emailTo) {
  const emailFrom = 'Databroker DAO <dao@databroker.com>';
  const subject = await getSubject(sensorID);
  const message = await getMessage(sensorID);
  const attachments = await getAttachments(csvUrl);
  return mailer.send(
    emailFrom,
    emailTo,
    subject,
    message,
    attachments
  );
}

function getSubject(sensorID) {
  return mongo.getSensorForSensorID(sensorID).then(sensor => {
    return `Registration for sensor ${sensor.name} was successful`;
  });
}

function getMessage(sensorID) {
  return mongo.getSensorForSensorID(sensorID).then(sensor => {
    return `You have successfully registered to receive updates for sensor ${sensor.name}\n Kind regards, the Databroker DAO team`;
  });
}

module.exports = {
  send
}