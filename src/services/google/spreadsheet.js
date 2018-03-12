const Spreadsheet = require('./index');
const async = require('async');

require('dotenv').load();

const creds = {
  luftdaten: 'databrokerdao-datagateway-luftdaten-creds.json',
  citybikenyc: 'databrokerdao-datagateway-citybikenyc-creds.json'
};

const sheetids = {
  luftdaten: '1Vxd68I6NRTL2wZ2ZEzgSzIdNO_p6EMCWs7u4265SWdE',
  citybikenyc: '1lkHpM2udJu_3FhS1u_55SNztY5v9qSi0AFaF05ztgvo'
};

let sheets = {};

async function publish(sheet, row) {
  if (typeof sheets[sheet] === 'undefined') {
    await init(sheet);
  }

  return new Promise((resolve, reject) => {
    try {
      console.log(JSON.stringify(row));
      sheets[sheet].addRow(row, function(error) {
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

function init(sheet) {
  console.log(`Init spreadsheet ${sheet}`);
  const doc = new Spreadsheet(sheetids[sheet]);

  async.series(
    [
      function setAuth(step) {
        const credentials = require(`./../../../creds/${creds[sheet]}`);
        doc.useServiceAccountAuth(credentials, step);
      },
      function getInfoAndWorksheets(step) {
        doc.getInfo(function(err, info) {
          console.log(`Google Spreadsheet loaded: '${info.title}'`);
          sheets[sheet] = info.worksheets[0];
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

init('luftdaten');
init('citybikenyc');

module.exports = {
  publish
};
