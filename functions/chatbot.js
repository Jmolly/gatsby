const fetch = require('node-fetch');

const SENDINBLUE_API_KEY = process.env.SENDINBLUE_API_KEY;

const token = 'znjZAMJK0WeQVmzONQJO';
const USER_EMAIL_TEMPLATE = 19;
const LEXIR_EMAIL_TEMPLATE = 18;

exports.handler = async function (event, context, callback) {
  try {
    if (event.queryStringParameters.token !== token) {
      return {
        statusCode: 401,
      };
    }

    const attributes = event.body
      ? JSON.parse(event.body.attributes)
      : {
          default_email: '',
          default_name: '',
          country: '',
          MessageToLexir: '',
        };

    const params = {
      email: attributes && attributes.default_email,
      name: attributes && attributes.default_name,
      message: attributes && attributes.MessageToLexir,
      messageType: 'General message',
      content: [
        `Thanks for reaching out to Lexir. We have received your message and will get back to you as soon as possible!`,
      ],
      ending: 'Cheers!',
    };

    const { sender } = await fetch(
      'https://api.sendinblue.com/v3/smtp/templates/3',
      {
        method: 'GET',
        headers: { Accept: 'application/json', 'api-key': SENDINBLUE_API_KEY },
      },
    ).then((res) => res.json());

    //Letter for user
    await fetch('https://api.sendinblue.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': SENDINBLUE_API_KEY,
      },
      body: JSON.stringify({
        templateId: USER_EMAIL_TEMPLATE,
        to: [{ email: attributes && attributes.default_email }],
        params: params,
      }),
    });

    // Letter for lexir
    await fetch('https://api.sendinblue.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': SENDINBLUE_API_KEY,
      },
      body: JSON.stringify({
        templateId: LEXIR_EMAIL_TEMPLATE,
        to: [{ email: 'bakhar.yulia@gmail.com' }],
        params: params,
      }),
    });

    return {
      statusCode: 200,
      body: event.queryStringParameters.challenge,
    };
  } catch (err) {
    console.error('Something went wrong:', err);
  }
};
