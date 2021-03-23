const fetch = require('node-fetch');

const SENDINBLUE_API_KEY = process.env.SENDINBLUE_API_KEY;

const token = 'znjZAMJK0WeQVmzONQJO';
const USER_EMAIL_TEMPLATE = 19;
const LEXIR_EMAIL_TEMPLATE = 18;

exports.handler = async function (event, context, callback) {
  try {
    console.log({ event, context, callback });

    if (event.queryStringParameters.token !== token) {
      return {
        statusCode: 401,
      };
    }

    // console.log(event.body, "event body");

    // const { attributes } = JSON.parse(event.body);

    // const params = {
    //   email: attributes.default_email,
    //   name: attributes.default_name,
    //   message: attributes.MessageToLexir,
    //   messageType: "General message",
    //   content: [
    //     `Thanks for reaching out to Lexir. We have received your message and will get back to you as soon as possible!`,
    //   ],
    //   ending: "Cheers!",
    // };

    const { sender } = await fetch(
      'https://api.sendinblue.com/v3/smtp/templates/3',
      {
        method: 'GET',
        headers: { Accept: 'application/json', 'api-key': SENDINBLUE_API_KEY },
      },
    ).then((res) => res.json());

    console.log(sender, 'sender');

    // Letter for user
    // const lexirLetter = await fetch("https://api.sendinblue.com/v3/smtp/email", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "api-key": SENDINBLUE_API_KEY,
    //   },
    //   body: JSON.stringify({
    //     templateId: USER_EMAIL_TEMPLATE,
    //     to: [{ email: userInfo.default_email }],
    //     params: params,
    //   }),
    // });

    // console.log(lexirLetter, "lexirLetter");

    // Letter for lexir
    // const userLetter = await fetch("https://api.sendinblue.com/v3/smtp/email", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "api-key": SENDINBLUE_API_KEY,
    //   },
    //   body: JSON.stringify({
    //     templateId: LEXIR_EMAIL_TEMPLATE,
    //     to: [{ email: "bakhar.yulia@gmail.com" }],
    //     params: params,
    //   }),
    // });

    // console.log(userLetter, "userLetter");

    return {
      statusCode: 201,
      body: event.queryStringParameters.challenge,
    };

    // event.queryStringParameters.challenge;
  } catch (err) {
    console.error('Something went wrong:', err);
  }
};
