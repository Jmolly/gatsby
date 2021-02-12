const fetch = require('node-fetch');

const SENDINBLUE_API_KEY = process.env.SENDINBLUE_API_KEY;
const SENDINBLUE_FOLDER_ID = process.env.SENDINBLUE_FOLDER_ID;

exports.handler = async function (event, context, callback) {
  try {
    const { email, locale } = event.queryStringParameters;

    console.log({ email, locale });

    const lists = await fetch('https://api.sendinblue.com/v3/contacts/lists', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'api-key': SENDINBLUE_API_KEY,
      },
    })
      .then((response) => response.json())
      .catch((err) => console.error('error:' + err));

    console.log(lists, 'lists');

    let list = lists ? lists.lists.find((list) => list.name === locale) : null;
    console.log(typeof SENDINBLUE_FOLDER_ID, 'SENDINBLUE_FOLDER_ID');

    if (!list) {
      try {
        const response = await fetch(
          'https://api.sendinblue.com/v3/contacts/lists',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'api-key': SENDINBLUE_API_KEY,
            },
            body: JSON.stringify({
              name: locale,
              folderId: +SENDINBLUE_FOLDER_ID,
            }),
          },
        );
        list = await response.json();
        console.log({ response, list }, 'in create list');
      } catch (error) {
        console.error(error);
      }
    }

    const listId = list.id;

    console.log(listId, 'listId');

    try {
      const contact = await fetch('https://api.sendinblue.com/v3/contacts', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'api-key': SENDINBLUE_API_KEY,
        },
        body: JSON.stringify({
          listIds: [listId],
          updateEnabled: false,
          email: email,
        }),
      });

      console.log(contact, 'contact');
    } catch (error) {
      console.error(error);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success' }),
    };
  } catch (err) {
    console.error('Something went wrong:', err);
  }
};
