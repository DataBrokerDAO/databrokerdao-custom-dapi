const mongo = require('./../../mongo/store');
const rp = require('request-promise');
const mailer = require('./../mailer');
const registry = require('./../registry');
const Promise = require('bluebird');
const DELIMITER = '!#!';

require('dotenv').config();

async function send(sensorID, csvUrl) {
  const emailFrom = 'Databroker DAO <dao@databroker.com>';
  const subject = await getSubject(sensorID);
  const attachments = await getAttachments(csvUrl);
  const emailTo = await getEmailTo(sensorID);
  Promise.all(
    emailTo,
    emailAddress => {
      const message = await getMessage(sensorID, emailTo[i]);
      return mailer.send(emailFrom, emailTo, subject, message, attachments);
    }
  );
}

async function getEmailTo(sensorID) {
  const isExpired = purchase => {
    return purchase.endtime >= new Date() / 1000;
  };

  const isSubscribed = (purchase, sensorID) => {
    return registry.isSubscribed(purhcase.email, sensorID);
  };

  let emailTo = [];
  return mongo.getPurchasesForSensorID(sensorID).then(purchases => {
    purchases.forEach(purchase => {
      if (!isExpired(purchase) && isSubscribed(purchase, sensorID)) {
        emailTo.push(purchase.email);
      }
    });
    return emailTo;
  });
}

function getSubject(sensorID) {
  return mongo.getSensorForSensorID(sensorID).then(sensor => {
    return `New readings from ${sensor.name}`;
  });
}

function getMessage(sensorID, emailAddress) {
  return mongo.getSensorForSensorID(sensorID).then(sensor => {
    const unsubscribeHash = Buffer.from(`${sensorID}${DELIMITER}${emailAddress}`).toString('base64');
    const unsubscribeUrl = `${process.env.MIDDLEWARE_URL}/hash=${unsubscribeHash}`;
    return `Please find enclosed the new readings from sensor ${sensor.name}\n Kind regards, the Databroker DAO team\n <a href="${unsubscribeUrl}">Unsubscribe</a>`;
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
