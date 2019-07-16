const logger = require('./logger');
const mqtt = require('mqtt');

const options = {
  host: process.env.HOST,
  port: process.env.PORT || 1883,
  // username: process.env.USR,
  // password: process.env.PWD,
  connectTimeout: 10 * 1000

  // Uncomment if using Mosquitto (MQTT v3 only)
  // protocolId: 'MQIsdp',
  // protocolVersion: 3
};

module.exports = {
  create: ({ topic, onMessage, onError }) => {
    const clientId = `watchdog-${topic.replace('/', '-')}`;
    // const statusTopic = `${clientId}/status`;

    logger.info('Connecting to MQTT', { options, clientId });
    const client = mqtt.connect({
      ...options,
      // clientId

      // DOES NOT WORK - not sure why
      // will: {
      //   topic: statusTopic,
      //   payload: 'OFFLINE',
      //   qos: 0,
      //   retain: false
      // }
    });

    return client
      .on('error', onError)
      .on('connect', res => {
        logger.info('Connected to MQTT!', res);
        // When [will] message is fixed
        // client.publish(statusTopic, 'ONLINE');
        client.subscribe(topic, { qos: 0 }, (err, granted) => {
          if (err) {
            logger.error('Error Subscribing to MQTT!', err);
            return;
          }

          logger.info('Subscribed to MQTT!', granted)
        });
      })
      .on('message', (topic, message) => {
        onMessage(topic, message.toString());
      });
  }
};
