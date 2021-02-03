const { google } = require('googleapis');
const { config: dotenvConfig } = require('dotenv');

dotenvConfig();

// const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
// const GOOGLE_SHEET_LIST_NAME = process.env.GOOGLE_SHEET_LIST_NAME;

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
    range: `orders!A${range}`,
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
    const response = await sheets.spreadsheets.values
      .update(request)
      .then((res) => console.log(res.data, 'res.data'));
    console.log(response, 'response');
  } catch (err) {
    console.error(err, 'some error here');
  }
}

async function getLength() {
  try {
    const sheets = await authorize();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: '1M73-c45jziO-QQgLNOTC5JL-FseZFhSLOMBLTdan9XU',
      range: `${'orders'}!A:A`,
    });
    const length = response.data.values.length;

    return length + 1;
  } catch (error) {
    return error;
  }
}

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

    const range = await getLength();

    console.log(range, 'range');

    const sheetsRes = sheetsParams.map(async (sheetsParam, i) => {
      try {
        await addOrderToSpreadsheet(sheetsParam, range + i);
      } catch (error) {
        console.log(error);
      }
    });
    console.log(sheetsRes, 'sheetsRes');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success' }),
    };
  } catch (err) {
    console.error('Something went wrong:', err);
  }
};
