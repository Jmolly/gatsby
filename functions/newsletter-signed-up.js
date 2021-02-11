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

    console.log(lists, 'lists');

    const location = 'fr';
    let list = lists
      ? lists.lists.find((list) => list.name === location)
      : null;

    console.log(list, 'list 1');
    if (!list) {
      list = await fetch('https://api.sendinblue.com/v3/contacts/lists', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'api-key': SENDINBLUE_API_KEY,
        },
        body: JSON.stringify({ name: location, folderId: 7 }),
      })
        .then((res) => res.json())
        .then((json) => console.log(json))
        .catch((err) => console.error('error:' + err));

      console.log(list, 'list 2');
    }

    const listId = list.id;

    console.log(listId, 'listId');

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
        email: 'test2@gmail.com',
      }),
    })
      .then((res) => res.json())
      .catch((err) => console.error('error:' + err));

    console.log(contact, 'contact');
  } catch (err) {
    console.log(err);
    return { statusCode: 500, body: err.toString() };
  }
};
