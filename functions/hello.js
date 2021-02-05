const { google } = require('googleapis');

const { config: dotenvConfig } = require('dotenv');

dotenvConfig();

const getClient = ({ scopes }) => {
  console.log(
    Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT, 'base64').toString('ascii'),
    'PROCESS',
  );
  console.log(
    Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT, 'base64'),
    'PROCESS123151221',
  );

  return google.auth.getClient({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
    scopes: scopes,
  });
};

const authorizeSheets = async () => {
  const client = await getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({
    version: 'v4',
    auth: client,
  });
};

const addToCol = async (range, params) => {
  const { date, email, skuCode, quantity } = params;
  const sheets = await authorizeSheets();

  console.log(date, email, skuCode, quantity, 'params');
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.append(
      {
        spreadsheetId: '1M73-c45jziO-QQgLNOTC5JL-FseZFhSLOMBLTdan9XU',
        range,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [[date, email, skuCode, quantity]],
        },
      },
      (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      },
    );
  });
};

exports.handler = async function (event, context, callback) {
  try {
    // const emailToSignup = JSON.parse(event.body).email;
    // const emailToSignup = 'bakhar.yulia@gmail.com';

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

    console.log(sheetsParams, 'sheetsParams');

    const sheetsRes = sheetsParams.map(async (sheetsParam, i) => {
      try {
        await addToCol(`orders!F${2 + i}`, sheetsParam);
      } catch (error) {
        console.log(error);
      }
    });

    try {
      await addToCol(`orders!F${2 + 2}`, sheetsParams[0]);
    } catch (error) {
      console.log(error);
    }

    try {
      await addToCol(`orders!F5`, sheetsParams[0]);
    } catch (error) {
      console.log(error);
    }
    console.log('HEREE');
    // don't resolve though. Not going to fix if failure.
    return {
      statusCode: sheetsRes.status,
      body: JSON.stringify(sheetsRes),
    };
  } catch (err) {
    console.log(err);
    return { statusCode: 500, body: err.toString() };
  }
};
