const mailer = require('./../mailer');

require('dotenv').config();

async function send(recipient, sensor, credentials) {
  const emailFrom = 'Databroker DAO <dao@databrokerdao.com>';
  const subject = `You successfully purchased '${sensor.name}'`;
  const globalMergeVars = getGlobalMergeVars(sensor, credentials);

  await mailer.send(
    emailFrom,
    recipient,
    subject,
    [], // no attachments
    globalMergeVars,
    [], // no merge vars
    process.env.MANDRILL_TEMPLATE_SLUG_DATASET_CREDENTIALS
  );
}

function getGlobalMergeVars(sensor, credentials) {
  return [
    {
      name: 'SENSOR_NAME',
      content: sensor.name
    },
    {
      name: 'DATASET_URL',
      content: credentials.url
    }
  ];
}

module.exports = {
  send
};
