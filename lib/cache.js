const Promise = require('bluebird');

const redis = require('redis');
const db = require('../lib/db.js');
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const config = require('../config.js').cache;
const client = redis.createClient(config.port, config.host);


const setAsync = function(key, data) {
  return client.setAsync(key, JSON.stringify(data), 'EX', 3600);
}

// We can generalize this function by change the interface to (key, udpateFunc)
// But we only have 1 use case only, don't waste time on it
const getAsync = function(uuid) {
  return client.getAsync(uuid)
    .then(function(data) {
      if (data) {
        console.log(`HIT ${uuid}`);
        return JSON.parse(data);
      } else {
        console.log(`MISS ${uuid}`);
        return db.selectAsync(uuid)
          .then(function(data) {
            if (data.length > 0) {
              const datum = data[0];
              return {
                uuid: datum.uuid,
                name: datum.name,
                phone: datum.phone,
                currency: datum.currency,
                price: datum.price,
              };
            } else {
              return null;
            }
          })
          .then(function(record) {
            // Async set the cache
            setAsync(uuid, record);
            return record;
          });
      }
    });
}

module.exports = {
  setAsync: setAsync,
  getAsync: getAsync,
};