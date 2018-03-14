const mongo = require('./../../mongo/store');
const rp = require('request-promise');
const mailer = require('./../mailer');
const registry = require('./../registry');
const Promise = require('bluebird');
const DELIMITER = '!#!';

require('dotenv').config();

async function send(sensorID, csvUrl) {
  const emailFrom = 'Databroker DAO <dao@databrokerdao.com>';
  const sensor = await mongo.getSensorForSensorID(sensorID);
  const subject = await getSubject(sensor);
  const attachments = await getAttachments(csvUrl);
  const emailAddresses = await getEmailAddresses(sensor);

  for (let i=0; i< emailAddresses.length; i++) {
    let emailTo = emailAddresses[i];
    const message = getMessage(sensor, emailTo);
    mailer.send(emailFrom, emailTo, subject, message, attachments);
  }
}

async function getEmailAddresses(sensor) {
  const notExpired = purchase => {
    return purchase.endtime >= new Date() / 1000;
  };

  const isSubscribed = (purchase, sensorID) => {
    return true;
    return registry.isSubscribed(purchase.email, sensor.sensorid);
  };

  let emailTo = [];
  await mongo.getPurchasesForSensorID(sensor.sensorid).then(purchases => {
    purchases.forEach(purchase => {
      if (notExpired(purchase) && isSubscribed(purchase, sensor.sensorid)) {
        emailTo.push(purchase.email);
      }
    });
  });

  return emailTo;
}

function getSubject(sensor) {
  return `New readings from '${sensor.name}'`;
}

function getMessage(sensor, emailAddress) {
  const unsubscribeHash = Buffer.from(`${sensor.sensorid}${DELIMITER}${emailAddress}`).toString('base64');
  const unsubscribeUrl = `${process.env.MIDDLEWARE_URL}/hash=${unsubscribeHash}`;
  return `Please find enclosed the new readings from sensor ${sensor.name}\n Kind regards, the Databroker DAO team\n <a href="${unsubscribeUrl}">Unsubscribe</a>`;
}

async function getAttachments(url) {
  return {
    filename: getFilename(url),
    content: getCsv(url)
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
