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
  } catch (err) {
    console.log(err);
    return { statusCode: 500, body: err.toString() };
  }
};
