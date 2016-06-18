'use strict';

const Config = require('./config');
const config = Config.getInstance();
const co = require('co');

/**
 * Currency constructor
 *
 * @param {object} _currency
 * @param {string} _currency.from - currency converted from
 * @param {string} _currency.to - currency converted to
 * @param {date} _currency.created_at - currency created time
 * @param {string} _currency.rate - currency rate
 * @constructor
 */
function Currency (options) {
  options = options || {};

  this.from = (options.from) ? options.from.toUpperCase() : '';
  this.to = (options.to) ? options.to.toUpperCase() : '';
  this.created_at = options.created_at || Date.now();
  this.rate = (options.rate) ? Number(options.rate).toFixed(2).toString() : '';
}

Currency.prototype.save = function () {
  const CurrencyRepository = require('./currencyRepository');
  var self = this;

  return co(function* () {
    CurrencyRepository.saveCurrency(self);
  }).catch(function (err) {
    console.log('currency model err', err);
  });
};

module.exports = Currency;
