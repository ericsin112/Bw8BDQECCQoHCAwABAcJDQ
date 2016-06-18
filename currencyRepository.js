const bluebird = require('bluebird');
const mongoose = bluebird.promisifyAll(require('mongoose')), Schema = mongoose.Schema;
const Config = require('./config');
const config = Config.getInstance();

mongoose.connect(config.getMongooseUrl());

var currencyRepositorySchema = Schema({
  from: {type: String, trim: true, required: true, uppercase: true},
  to: {type: String, trim: true, required: true, uppercase: true},
  created_at: {type: Date, required: true, default: Date.now()},
  rate: {type: String, required: true}
});

/**
 * @param {object} _currency
 * @param {string} _currency.from - currency converted from
 * @param {string} _currency.to - currency converted to
 * @param {date} _currency.created_at - currency created time 
 * @param {string} _currency.rate - currency rate
 */
currencyRepositorySchema.statics.saveCurrency = function (_currency) {
	var self = this;

  var newCurrency = new self(_currency);
  return newCurrency.saveAsync()
    .then(console.log)
    .catch(function (err) {
      console.error('catch', err);
    })
    .error(console.error);
};

module.exports = mongoose.model('Currency', currencyRepositorySchema);
