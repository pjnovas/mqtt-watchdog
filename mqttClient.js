const logger = require('./logger');
const mqtt = require('mqtt');
const { connect } = require('./mongoClient');

const options = {
  host: process.env.HOST,
  port: process.env.PORT || 1883,
  // username: process.env.USR,
  // password: process.env.PWD,
  connectTimeout: 10 * 1000
};

module.exports = {
  create: ({ topics }) => connect().then(({ db, client }) => {
    const clientId = 'watchdog';
    const statusTopic = `${clientId}/status`;

    logger.info('Connecting to MQTT', { options, clientId });
    const mqttClient = mqtt.connect({
      ...options,
      clientId,

      will: {
        topic: statusTopic,
        payload: 'OFFLINE',
        qos: 0,
        retain: false
      }
    });

    mqttClient
      .on('error', logger.error)
      .on('connect', res => {
        logger.info('Connected to MQTT!', res);
        mqttClient.publish(statusTopic, 'ONLINE');

        topics.forEach(topic => {
          mqttClient.subscribe(topic, { qos: 0 }, (err, granted) => {
            if (err) {
              logger.error('Error Subscribing to MQTT!', err);
              return;
            }

            logger.info('Subscribed to MQTT!', granted)
          });
        });
      })
      .on('message', (topic, msg) => {
        const message = msg.toString();
        logger.debug('Message Received', { topic, message });

        const collection = db.collection(topic.replace(/\//g, '_'));
        collection.insertOne({ message }, { w:1 }).catch(logger.error);
      });

    process.on('exit', () => {
      client.close();
      mqttClient.end();
    });

    return mqttClient;
  })
};
