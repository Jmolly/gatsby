exports.handler = async function (event, context, callback) {
  try {
    console.log(event, 'event');
    console.log('click');
  } catch (err) {
    console.log(err);
    return { statusCode: 500, body: err.toString() };
  }
};
