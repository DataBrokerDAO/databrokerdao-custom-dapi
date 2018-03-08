const Spreadsheet = require('google-spreadsheet');
const async = require('async');

require('dotenv').load();

let sheet;

async function publish(row) {
  if (typeof sheet === 'undefined') {
    await init();
  }

  return new Promise((resolve, reject) => {
    try {
      sheet.addRow(row, function(error) {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    } catch (error) {
      resolve();
    }
  });
}

function init() {
  console.log('Init spreadsheet');
  const doc = new Spreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
  async.series(
    [
      function setAuth(step) {
        const creds = require('./../../../creds/databrokerdao-datagateway-creds.json');
        doc.useServiceAccountAuth(creds, step);
      },
      function getInfoAndWorksheets(step) {
        doc.getInfo(function(err, info) {
          console.log(`Google Spreadsheet loaded: '${info.title}'`);
          sheet = info.worksheets[0];
          step();
        });
      }
    ],
    function(err) {
      if (err) {
        console.log('Error: ' + err);
      }
    }
  );
}

init();

module.exports = {
  publish
};
