const mongo = require('./../../mongo/store');
const rp = require('request-promise');
const mailer = require('./../mailer');
const registry = require('./../registry');

async function send(sensorID, csvUrl) {
  const emailFrom = 'Databroker DAO <dao@databroker.com>';
  const emailTo = await getEmailTo(sensorID);
  const subject = await getSubject(sensorID);
  const message = await getMessage(sensorID);
  const attachments = await getAttachments(csvUrl);
  return mailer.send(emailFrom, emailTo, subject, message, attachments);
}

async function getEmailTo(sensorID) {
  const isExpired = purchase => {
    return purchase.endtime >= new Date() / 1000;
  };

  const isSubscribed = (purchase, sensorID) => {
    return registry.isSubscribed(purhcase.email, sensorID);
  };

  return mongo.getPurchasesForSensorID(sensorID).then(purchases => {
    purchases.forEach(purchase => {
      if (!isExpired(purchase) && isSubscribed(purchase, sensorID)) {
        purchasers.push(purchase.email);
      }
    });
    return purchasers.join(', ');
  });
}

function getSubject(sensorID) {
  return mongo.getSensorForSensorID(sensorID).then(sensor => {
    return `New readings from ${sensor.name}`;
  });
}

function getMessage(sensorID) {
  return mongo.getSensorForSensorID(sensorID).then(sensor => {
    return `Please find enclosed the new readings from sensor ${sensor.name}\n Kind regards, the Databroker DAO team`;
  });
}

async function getAttachments(url) {
  return {
    filename: getFilename(csvUrl),
    content: getCsv(csvUrl)
  };
}

function getFilename(url) {
  const regexp = /\/\/.*\/(.*.csv)/g;
  const match = regexp.exec(url);
  const filename = match[1];
  return filename;
}

function getCsv(url) {
  return rp({ url: url });
}

module.exports = {
  send
};
