const mongo = require('./../../mongo/store');
const rp = require('request-promise');
const mailer = require('./../mailer');
const registry = require('./../registry');
const DELIMITER = '||';

require('dotenv').config();

async function send(sensorid, csvUrl) {
  const sensor = await mongo.getSensorForSensorId(sensorid);
  const recipients = await getRecipients(sensor);
  if (recipients.length === 0) {
    return Promise.resolve();
  }

  const emailFrom = 'Databroker DAO <dao@databrokerdao.com>';
  const emailTo = recipients.join(',');
  const subject = await getSubject(sensor);
  const attachments = await getAttachments(csvUrl);
  const globalMergeVars = getGlobalMergeVars(sensor);
  const mergeVars = getMergeVars(sensor, recipients);
  return mailer.send(
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

  const isSubscribed = (purchase, sensorid) => {
    return registry.isSubscribed(purchase.email, sensorid);
  };

  let emailTo = [];
  let purchases = await mongo.getPurchasesForSensorKey(sensor.key);
  for (let i = 0; i < purchases.length; i++) {
    if (notExpired(purchases[i]) && isSubscribed(purchases[i], sensor.sensorid)) {
      emailTo.push(purchases[i].email);
    }
  }

  return emailTo;
}

function getSubject(sensor) {
  return `New readings from '${sensor.name}'`;
}

function getUnsubscribeSingleUrl(sensor, email) {
  const unsubscribeHash = Buffer.from(`${email}${DELIMITER}${sensor.sensorid}`).toString('base64');
  const unsubscribeUrl = `${process.env.MIDDLEWARE_URL}/unsubscribe?hash=${unsubscribeHash}`;
  return unsubscribeUrl;
}

function getUnsubscribeAllUrl(email) {
  const unsubscribeHash = Buffer.from(email).toString('base64');
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
          name: 'SENSOR_UNSUBSCRIBE_ALL',
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
