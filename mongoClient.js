const logger = require('./logger');
const { MongoClient, ObjectId } = require('mongodb');

const url = process.env.DB_URL || 'mongodb://mongo:27017';
const dbName = process.env.DB_NAME || 'mqtt-watchdog';

module.exports = {
  connect: () => 
    MongoClient
      .connect(url, { useNewUrlParser: true })
      .then(client => {
        logger.info('Mongo Connected!');
        const db = client.db(dbName);
        return { db, client }
      }),
  getTimestamp: _id => ObjectId(_id).getTimestamp().getTime(), // milliseconds
  idFromEpoch: epoch => {  // milliseconds
    const date = new Date(Number(epoch)).getTime();
    return new ObjectId(Math.floor(date / 1000).toString(16) + "0000000000000000");
  }
};
