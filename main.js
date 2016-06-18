'use strict';

const co = require('co');
const Config = require('./config');
const config = Config.getInstance();
const FivebeansHelper = require('./fivebeansHelper');
const fivebeansHelper = FivebeansHelper.getInstance({
  host: config.fivebeans_host,
  port: config.fivebeans_port
});

const consumer = require('./consumer');
const producer = require('./producer');

co(function* () {
  yield fivebeansHelper.connectFivebeans();
  yield producer.start();
  yield consumer.start();
});
