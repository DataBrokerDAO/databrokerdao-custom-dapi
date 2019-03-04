// import { MANDRILL_TEMPLATE_SLUG_DATASET_CREDENTIALS } from '../../config/dapi-config';
// import { ISensor } from '../../types';
// import { send as sendEmail } from '../mailer';

// export async function sendDataSetCredentials(
//   recipient: string,
//   sensor: ISensor,
//   credentials
// ) {
//   const emailFrom = 'Databroker DAO <dao@databrokerdao.com>';
//   const subject = `You successfully purchased '${sensor.name}'`;
//   const globalMergeVars = getGlobalMergeVars(sensor, credentials);

//   await sendEmail(
//     emailFrom,
//     recipient,
//     subject,
//     [], // no attachments
//     globalMergeVars,
//     [], // no merge vars
//     MANDRILL_TEMPLATE_SLUG_DATASET_CREDENTIALS
//   );
// }

// function getGlobalMergeVars(sensor: ISensor, credentials:) {
//   return [
//     {
//       name: 'SENSOR_NAME',
//       content: sensor.name
//     },
//     {
//       name: 'DATASET_URL',
//       content: credentials.url
//     }
//   ];
// }
