// const { google } = require("googleapis");

// const { config: dotenvConfig } = require("dotenv");

// dotenvConfig()

// const getClient = ({ scopes }) => {
//   console.log(Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT, 'base64').toString(
//     'ascii'
//   ), 'PROCESS');
//   console.log(Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT, 'base64'), 'PROCESS123151221');

//   return google.auth.getClient({
//     credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
//     scopes: scopes,
//   })
// }

// const authorizeSheets = async () => {
//   const client = await getClient({
//     scopes: ['https://www.googleapis.com/auth/spreadsheets'],
//   })
//   return google.sheets({
//     version: 'v4',
//     auth: client,
//   })
// }

// const addToCol = async (range, emailAddress) => {
//   const sheets = await authorizeSheets();

//   return new Promise((resolve, reject) => {
//     sheets.spreadsheets.values.append(
//       {
//         spreadsheetId: '1M73-c45jziO-QQgLNOTC5JL-FseZFhSLOMBLTdan9XU',
//         range,
//         valueInputOption: 'USER_ENTERED',
//         resource: {
//           values: [[emailAddress]],
//         },
//       },
//       (err, response) => {
//         if (err) {
//           reject(err)
//         } else {
//           resolve(response)
//         }
//       }
//     )
//   })
// }

// exports.handler = async function(event, context, callback) {
//   try {
//     // const emailToSignup = JSON.parse(event.body).email;
//     const emailToSignup = 'bakhar.yulia@gmail.com';

//     const sheetsRes = await addToCol('Test!F2', emailToSignup) // don't resolve though. Not going to fix if failure.
//     return {
//       statusCode: sheetsRes.status,
//       body: JSON.stringify(sheetsRes),
//     }
//   } catch (err) {
//     console.log(err)
//     return { statusCode: 500, body: err.toString() }
//   }
// }

const { google } = require('googleapis');
const { config: dotenvConfig } = require('dotenv');

dotenvConfig();

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_SHEET_LIST_NAME = process.env.GOOGLE_SHEET_LIST_NAME;

const getClient = ({ scopes }) => {
  return google.auth.getClient({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
    scopes: scopes,
  });
};

async function authorize() {
  const client = await getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({
    version: 'v4',
    auth: client,
  });
}

async function addOrderToSpreadsheet(params, range) {
  const sheets = await authorize();
  const request = {
    spreadsheetId: '1M73-c45jziO-QQgLNOTC5JL-FseZFhSLOMBLTdan9XU',
    range: `${'orders'}!A${range}`,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [[params.date, params.email, params.skuCode, params.quantity]],
    },
  };

  console.log(
    {
      ...request,
    },
    'request',
  );

  try {
    console.log('here');
    const response = await sheets.spreadsheets.values.update(
      request,
      (err, res) => {
        if (err) console.error('something is wrong: ', err);
        console.log(res, 'res here');
      },
    );
    console.log(response, 'response');
  } catch (err) {
    console.error(err, 'some error here');
  }
}

// async function getLength() {
//   const sheets = await authorize();

//   const length = await sheets.spreadsheets.values
//     .get({
//       spreadsheetId: '1M73-c45jziO-QQgLNOTC5JL-FseZFhSLOMBLTdan9XU',
//       range: `${'orders'}!A:A`,
//     })
//     .then((res) => res.data.values.length);

//   return length + 1;
// }

exports.handler = async function (event, context, callback) {
  try {
    const params = {
      email: 'test@gmail.com',
      date: 'date',
      lineItems: [
        {
          skuCode: 'sku1',
          quantity: 1,
        },
        {
          skuCode: 'sku2',
          quantity: 2,
        },
      ],
    };

    const sheetsParams = params.lineItems.map((lineItem) => ({
      date: params.date,
      email: params.email,
      skuCode: lineItem.skuCode,
      quantity: lineItem.quantity,
    }));

    // const range = await getLength();

    const sheetsRes = await sheetsParams.map((sheetsParam, i) =>
      addOrderToSpreadsheet(sheetsParam, 13 + i),
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success' }),
    };
  } catch (err) {
    console.error('Something went wrong:', err);
  }
};
