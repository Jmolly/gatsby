const fetch = require('node-fetch');

const SENDINBLUE_API_KEY = process.env.SENDINBLUE_API_KEY;

exports.handler = async function (event, context, callback) {
  try {
    console.log(event, 'event');
    console.log('click');

    const lists = await fetch('https://api.sendinblue.com/v3/contacts/lists', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'api-key': SENDINBLUE_API_KEY,
      },
    })
      .then((response) => response.json())
      .catch((err) => console.error('error:' + err));

    console.log(lists, 'list');

    const location = 'en';
    let list = lists.find((list) => list.name === location);

    if (!list) {
      list = await fetch('https://api.sendinblue.com/v3/contacts/lists', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'api-key': SENDINBLUE_API_KEY,
        },
      })
        .then((res) => res.json())
        .catch((err) => console.error('error:' + err));
    }

    const listId = list.id;

    console.log(listId, 'listId');
  } catch (err) {
    console.log(err);
    return { statusCode: 500, body: err.toString() };
  }
};
