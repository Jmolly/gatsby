const fetch = require('node-fetch');

const SENDINBLUE_API_KEY = process.env.SENDINBLUE_API_KEY;
const SENDINBLUE_FOLDER_ID = process.env.SENDINBLUE_FOLDER_ID;

exports.handler = async function (event, context, callback) {
  try {
    const { email, locale } = event.queryStringParameters;

    // console.log({ email, locale });

    // const lists = await fetch('https://api.sendinblue.com/v3/contacts/lists', {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'api-key': SENDINBLUE_API_KEY,
    //   },
    // })
    //   .then((response) => response.json())
    //   .catch((err) => console.error('error:' + err));

    // console.log(lists, 'lists');

    // let list = lists ? lists.lists.find((list) => list.name === locale) : null;
    // console.log(typeof SENDINBLUE_FOLDER_ID, 'SENDINBLUE_FOLDER_ID');

    // if (!list) {
    //   try {
    //     const response = await fetch(
    //       'https://api.sendinblue.com/v3/contacts/lists',
    //       {
    //         method: 'POST',
    //         headers: {
    //           Accept: 'application/json',
    //           'Content-Type': 'application/json',
    //           'api-key': SENDINBLUE_API_KEY,
    //         },
    //         body: JSON.stringify({
    //           name: locale,
    //           folderId: +SENDINBLUE_FOLDER_ID,
    //         }),
    //       },
    //     );
    //     list = await response.json();
    //     console.log({ response, list }, 'in create list');
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }

    // const listId = list.id;

    // console.log(listId, 'listId');

    // const contact = await fetch('https://api.sendinblue.com/v3/contacts', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //     'api-key': SENDINBLUE_API_KEY,
    //   },
    //   body: JSON.stringify({
    //     listIds: [listId],
    //     updateEnabled: false,
    //     email: 'test2@gmail.com',
    //   }),
    // })
    //   .then((res) => res.json())
    //   .catch((err) => console.error('error:' + err));

    // console.log(contact, 'contact');

    const emailParams = {
      order: {
        id: 1,
        number: 555,
        placedAt: '19/02/2021',
        total: '80',
        languageCode: 'en',
        country: 'en',
      },

      shippingAddress: {
        firstName: 'Yulia',
        lastName: 'Bakhar',
        line1: '60 Rue Charlot',
        country: 'France',
        zipCode: '2300001',
        city: 'Paris',
        phone: '+375255400703',
        stateCode: '1111',
        intercom: '1',
        floor: '2',
        houseNumber: '3',
        note: 'note',
      },
      lineItems: [
        {
          id: 301,
          name: 'tropical old tom',
          price: '€35,00',
          quantity: 1,
          total: '€35,00',
          imageUrl:
            'https://www.datocms-assets.com/30257/1610759194-packshot-hunter-laing-highland-journey.png?auto=format',
          skuCode: '301',
        },
        {
          id: 302,
          name: 'HIGHLAND JOURNEY',
          price: '€55,00',
          quantity: 2,
          total: '€110,00',
          imageUrl:
            'https://www.datocms-assets.com/30257/1610759194-packshot-hunter-laing-highland-journey.png?auto=format',
          skuCode: '302',
        },
      ],
    };

    const response = await fetch('https://api.sendinblue.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'api-key': SENDINBLUE_API_KEY,
      },
      body: JSON.stringify({
        templateId: 2,
        to: [{ email: 'bakhar.yulia@gmail.com' }],
        params: emailParams,
      }),
    }).then((response) => response.json());

    console.log(response, 'response');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success' }),
    };
  } catch (err) {
    console.error('Something went wrong:', err);
  }
};
