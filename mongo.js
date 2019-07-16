const { MongoClient, ObjectId } = require('mongodb');

const url = process.env.DB_URL || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'mqtt-watchdog';

module.exports = {
  connect: done => {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
      if (err) {
        done(err)
        return;
      }

      const db = client.db(dbName);
      done(null, db, client);
    });
  },
  getTimestamp: _id => ObjectId(_id).getTimestamp()
};
