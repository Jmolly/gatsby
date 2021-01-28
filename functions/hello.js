const { google } = require("googleapis");

const { config: dotenvConfig } = require("dotenv");

dotenvConfig()

const getClient = ({ scopes }) => {
  console.log(Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT, 'base64').toString(
    'ascii'
  ), 'PROCESS');
  console.log(Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT, 'base64'), 'PROCESS123151221');

  return google.auth.getClient({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
    scopes: scopes,
  })
}

const authorizeSheets = async () => {
  const client = await getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  return google.sheets({
    version: 'v4',
    auth: client,
  })
}

const addToCol = async (range, emailAddress) => {
  const sheets = await authorizeSheets();

  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.append(
      {
        spreadsheetId: '1M73-c45jziO-QQgLNOTC5JL-FseZFhSLOMBLTdan9XU',
        range,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[emailAddress]],
        },
      },
      (err, response) => {
        if (err) {
          reject(err)
        } else {
          resolve(response)
        }
      }
    )
  })
}

exports.handler = async function(event, context, callback) {
  try {
    // const emailToSignup = JSON.parse(event.body).email;
    const emailToSignup = 'bakhar.yulia@gmail.com';

    const sheetsRes = await addToCol('Local!F2', emailToSignup) // don't resolve though. Not going to fix if failure.
    return {
      statusCode: sheetsRes.status,
      body: JSON.stringify(sheetsRes),
    }
  } catch (err) {
    console.log(err)
    return { statusCode: 500, body: err.toString() }
  }
}