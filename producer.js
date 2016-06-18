'use strict';

const co = require('co');
const Config = require('./config');
const config = Config.getInstance();
const FivebeansHelper = require('./fivebeansHelper');
const fivebeansHelper = FivebeansHelper.getInstance();


module.exports = {
  start: function () {
    return co(function* () {
      yield fivebeansHelper.put({
        tubename: config.fivebeans_tubename,
        payload: { from: 'HKD', to: 'USD' }
      });
      console.log('Seeded a job');
    });
  }
};
