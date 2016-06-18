'use strict';

const bluebird = require('bluebird');
const co = require('co');
const fivebeans = bluebird.promisifyAll(require('fivebeans'));
// const fivebeans = require('fivebeans');


let FivebeansHelper = (function () {
  let instance;

  function init(options) {
    options = options || {};

    if (!options.host) {
      throw new Error('Missing host');
    } else if (!options.port) {
      throw new Error('Missing port');
    }


    let host = options.host;
    let port = options.port;
    let tubename;
    let client;

    return {
      connectFivebeans: function () {
        client = new fivebeans.client(host, port);
        client = bluebird.promisifyAll(client, {multiArgs: true});

        return new bluebird(function (resolve, reject) {
      		client
      			.on('connect', function () {
              console.log('Connected.');
      				resolve(true);
      			})
      			.on('error', function (err) {
                console.error('Connection failed', err);
      				reject(err);
      			})
      			.on('close', function () {
              console.log('Fivebeans was closed.');
      				resolve('Fivebeans was closed.');
      			}).connect();
      	});
      },


      /**
       * @param {number} id - job id
       * @param {number} priority - job's priority
       */
      bury: function (id, priority) {
        return client.buryAsync(id, priority);
      },

      /**
       * @param {number} id - job id
       */
      destory: function (id) {
        return client.destroyAsync(id);
      },

      /**
       * @param {object} options
       * @param {string} options.tubename - fivebeans tubename
       * @param {object} options.payload - job's payload
       * @param {number} options.priority - job's priority
       * @param {number} options.delay - delay time
       * @param {ttr} options.ttr - job's time to run
       */
      put: function (options) {
        options = options || {}; //priority, delay, ttr, payload
        if (!options.tubename) {
          throw new Error('Missing tubename');
        } else if (!options.payload) {
          throw new Error('Missing payload');
        }
        options.tubename = options.tubename;
        options.payload = JSON.stringify(options.payload);
        options.priority = options.priority || 0;
        options.delay = options.delay || 0;
        options.ttr = options.ttr || 60;
        return co(function* () {
          yield client.useAsync(options.tubename);
          return client.putAsync(options.priority, options.delay, options.ttr, options.payload);
        }).catch(function (err) {
          return bluebird.reject(err);
        });
      },

      /**
       * @param {string} tubename - fivebeans tubename
       */
      reserve: function (tubename) {
        return new bluebird(function (resolve, reject) {
          return co(function* () {
            if (!tubename) {
              throw new Error('Missing tubename');
            }
            yield client.watchAsync(tubename);
            let data = yield client.reserveAsync();
            let job = {
              id: data[0],
              data: JSON.parse(data[1])
            };
            resolve(job);
          }).catch(function (err) {
            reject(err);
          });
        });
      }
    };
  }

  return {
    getInstance: function (options) {
      if (!instance) {
        instance = init(options);
      }

      return instance;
    }
  };
})();

module.exports = FivebeansHelper;
