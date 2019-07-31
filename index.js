require('dotenv').config();
const logger = require('./logger');
const { create } = require('./mqttClient');
const { connect, getTimestamp } = require('./mongoClient');

const onError = logger.error;

connect()
  .then(({ db, client }) => {
    const mqttClient = create({
      topics: [
        'tower-1/#'
      ],
      onError,
      onMessage: (topic, message) => {
        logger.debug('Message Received', { topic, message });
        const collection = db.collection(topic.replace('/', '_'));
        collection.insertOne({ message }, { w:1 }).catch(onError);
      }
    });

    process.on('exit', () => {
      client.close();
      mqttClient.end();
    });
  }).catch(onError);
