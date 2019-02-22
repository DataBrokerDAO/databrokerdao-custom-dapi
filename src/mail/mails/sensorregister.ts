import mailer from '../mailer';

require('dotenv').config();

export async function send(recipient: string, sensor) {
  const emailFrom = 'Databroker DAO <dao@databrokerdao.com>';
  const subject = `Sensor Registration '${sensor.name}'`;
  const globalMergeVars = getGlobalMergeVars(sensor);
  mailer.send(
    emailFrom,
    recipient,
    subject,
    [], // No attachments
    globalMergeVars,
    [], // No merge vars
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