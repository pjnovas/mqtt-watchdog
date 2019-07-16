const mqtt = require('mqtt');

const options = {
  host: process.env.HOST,
  port: process.env.PORT || 1883

  // Uncomment if using Mosquitto (MQTT v3 only)
  // protocolId: 'MQIsdp',
  // protocolVersion: 3
};

module.exports = {
  create: ({ topic, onMessage, onError }) => {
    const client = mqtt.connect(options);

    client.on('connect', function (err) {
      if (err) {
        onError(err); 
        return;
      }

      client.subscribe(topic, err => {
        if (err) onError(err);
      });
    });

    client.on('message', (topic, message) => {
      onMessage(topic, message.toString());
    });

    return client;
  }
};

