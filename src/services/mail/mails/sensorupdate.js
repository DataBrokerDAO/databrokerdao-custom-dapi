const mongo = require('./../../mongo/store');
const rp = require('request-promise');
const mailer = require('./../mailer');
const registry = require('./../registry');
const Promise = require('bluebird');
const DELIMITER = '||';

require('dotenv').config();

async function send(sensorID, csvUrl) {
  const emailFrom = 'Databroker DAO <dao@databrokerdao.com>';
  const sensor = await mongo.getSensorForSensorID(sensorID);
  const recipients = await getRecipients(sensor);
  const emailTo = recipients.join(',');
  const subject = await getSubject(sensor);
  const attachments = await getAttachments(csvUrl);
  const globalMergeVars = getGlobalMergeVars(sensor);
  const mergeVars = getMergeVars(sensor, recipients);
  mailer.send(
    emailFrom,
    emailTo,
    subject,
    attachments,
    globalMergeVars,
    mergeVars,
    process.env.MANDRILL_TEMPLATE_SLUG_SENSOR_UPDATE
  );
}

async function getRecipients(sensor) {
  const notExpired = purchase => {
    return purchase.endtime >= new Date() / 1000;
  };

  const isSubscribed = (purchase, sensorID) => {
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

function getUnsubscribeSingleUrl(sensor, emailAddress) {
  const unsubscribeHash = Buffer.from(`${emailAddress}${DELIMITER}${sensor.sensorid}`).toString('base64');
  const unsubscribeUrl = `${process.env.MIDDLEWARE_URL}/unsubscribe?hash=${unsubscribeHash}`;
  return unsubscribeUrl;
}

function getUnsubscribeAllUrl(emailAddress) {
  const unsubscribeHash = Buffer.from(emailAddress).toString('base64');
  const unsubscribeUrl = `${process.env.MIDDLEWARE_URL}/unsubscribe?hash=${unsubscribeHash}`;
  return unsubscribeUrl;
}

function getGlobalMergeVars(sensor) {
  return [
    {
      name: 'SENSOR_NAME',
      content: sensor.name
    }
  ];
}

function getMergeVars(sensor, recipients) {
  let mergeVars = [];
  for (let i = 0; i < recipients.length; i++) {
    mergeVars.push({
      rcpt: recipients[i],
      vars: [
        {
          name: 'SENSOR_UNSUBSCRIBE_SINGLE',
          content: getUnsubscribeSingleUrl(sensor, recipients[i])
        },
        {
          name: 'SENSOR_UNSUBSCRIBE_URL',
          content: getUnsubscribeAllUrl(recipients[i])
        }
      ]
    });
  }
  return mergeVars;
}

async function getAttachments(url) {
  let data = await getCsv(url);
  data = data.replace(/;/g, ','); // Change delimiter so mail clients can parse it;
  const content = Buffer.from(data).toString('base64');
  return [
    {
      type: 'text/csv',
      name: getFilename(url),
      content: content
    }
  ];
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
