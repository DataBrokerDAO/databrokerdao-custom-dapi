const mailer = require('./../mailer');

require('dotenv').config();

async function send(sensor, recipient) {
  const emailFrom = 'Databroker DAO <dao@databrokerdao.com>';
  const subject = `Sensor Registration '${sensor.name}'`;
  const globalMergeVars = getGlobalMergeVars(sensor);
  mailer.send(
    emailFrom,
    recipient,
    subject,
    [],
    globalMergeVars,
    [],
    process.env.MANDRILL_TEMPLATE_SLUG_SENSOR_REGISTRATION
  );
}

function getGlobalMergeVars(sensor) {
  return [
    {
      name: 'SENSOR_NAME',
      content: sensor.name
    }
  ];
}

module.exports = {
  send
};
