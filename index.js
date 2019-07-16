const { create } = require('./subscriber');
const { connect, getTimestamp } = require('./mongo');

connect((err, db, dbClient) => {
  if (err) {
    console.log(err);
    return;
  }

  const mqttClient = create({
    topic: 'stove/#',
    onError: console.log,
    onMessage: (topic, message) => {
      const collection = db.collection(topic.replace('/', '_'));
      collection.insert([{ message }], { w:1 }, function(err, result) {
        if (err) {
          console.log(err);
          return;
        }

        console.log(result);
        console.log(getTimestamp(result._id));
      });
    }
  });

  process.on('exit', () => {
    dbClient.close();
    mqttClient.end();
  });
});
