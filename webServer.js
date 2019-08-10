const logger = require('./logger');
const http = require('http');
const express = require('express');
const { connect, idFromEpoch, getTimestamp } = require('./mongoClient');

const port = process.env.WEB_PORT || 80;

module.exports = {
  start: () => connect().then(({ db, client }) => {
    const app = express();
    const server = http.createServer(app);

    app.get('/:collection', async (req, res) => {
      const query = req.query;
      if (!query || !query.from) {
        return res.status(400).json({ message: 'expected a query' });
      }

      const { from, to } = query;
      const collection = db.collection(req.params.collection);
      collection.find({
        _id: {
          $gt: idFromEpoch(from),
          $lt: to ? idFromEpoch(to) : (new Date()).getTime(),
        }
      }).toArray(function(err, docs) {
        res.json(docs.map(({_id, message}) => ({
          time: getTimestamp(_id),
          value: message
        })));
      });
    });

    server.listen(port, () => logger.info(`webserver listening on port ${port}!`));
    return server;
    
    process.on('exit', () => {
      client.close();
      server.close();
    });
  }).catch(logger.error)
};
