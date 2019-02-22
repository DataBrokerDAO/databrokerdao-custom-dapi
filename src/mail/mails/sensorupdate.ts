import { getPurchasesForSensorKey } from "../../services/mongo/store";

const DELIMITER = '||';

require('dotenv').config();

export async function send(sensor, attachments) {
  const recipients = await getRecipients(sensor);
  if (recipients.length === 0) {
    return Promise.resolve();
  }

  const emailFrom = 'Databroker DAO <dao@databrokerdao.com>';
  const emailTo = recipients.join(',');
  const subject = await getSubject(sensor);
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

  const isSubscribed = (email: string, sensorid: string) => {
    return registry.isSubscribed(email, sensorid);
  };

  let emailTo = [];
  let purchases = await getPurchasesForSensorKey(sensor.key);
  for (let i = 0; i < purchases.length; i++) {
    // Fallback for purchases that still have email not encrypted.
    let email;
    if (typeof purchases[i].email === 'string') {
      email = purchases[i].email;
    } else {
      email = ecies
        .decryptMessage(
          Buffer.from(process.env.SERVER_PRIVATE_KEY, 'hex'),
          Buffer.from(purchases[i].email)
        )
        .toString('ascii');
    }

    if (notExpired(purchases[i]) && isSubscribed(email: string, sensor.sensorid)) {
      emailTo.push(email);
    }
  }

  return emailTo;
}

function getSubject(sensor) {
  return `New readings from '${sensor.name}'`;
}

function getUnsubscribeSingleUrl(sensor, email) {
  const unsubscribeHash = Buffer.from(
    `${email}${DELIMITER}${sensor.sensorid}`
  ).toString('base64');
  const unsubscribeUrl = `${
    process.env.MIDDLEWARE_URL
  }/unsubscribe?hash=${unsubscribeHash}`;
  return unsubscribeUrl;
}

function getUnsubscribeAllUrl(email) {
  const unsubscribeHash = Buffer.from(email).toString('base64');
  const unsubscribeUrl = `${
    process.env.MIDDLEWARE_URL
  }/unsubscribe?hash=${unsubscribeHash}`;
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
