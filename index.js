require('dotenv').config();

const mqttClient = require('./mqttClient');
const webServer = require('./webServer');

mqttClient.create({
  topics: [
    'tower-1/#'
  ]
});

webServer.start();
