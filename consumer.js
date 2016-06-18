'use strict';

const Config = require('./config');
const config = Config.getInstance();
const bluebird = require('bluebird');
const co = require('co');
const rp = require('request-promise');
const FivebeansHelper = require('./fivebeansHelper');
const fivebeansHelper = FivebeansHelper.getInstance();

function reserveJob () {
  let success_times = 0;
  let failure_times = 0;
  let job;
  return function start () {
    console.log('started');
    co(function* () {
      job = yield fivebeansHelper.reserve(config.fivebeans_tubename);
      let exchange_rate = yield getExchangeRate(job.data);
      yield fivebeansHelper.destory(job.id);
      yield exchange_rate.save();
      success_times++;
      console.log('Successful times: ', success_times);
      if (success_times < config.success_limit) {
        yield fivebeansHelper.put({
          tubename: config.fivebeans_tubename,
          payload: job.data
          // delay: 60
        });
        start();
      } else {
        console.log('successful 10 times.');
        process.exit(0);
      }
    }).catch(function (err) {
      failure_times++;
      console.error('Failure times: ', failure_times);
      if (failure_times < config.failure_limit) {
        setTimeout(start, 3000);
      } else {
        console.log('Failed 3 times.');
        fivebeansHelper.bury(job.id, 0);
        console.log('Buried');
        process.exit(0);
      }
    });
  };
}


function getExchangeRate (job) {
  job = job || {};

  if (job.from && job.from !== '' && job.to && job.to !== '') {
    return new bluebird(function (resolve, reject) {
      return co(function* () {
        const cheerio = require('cheerio');
        let html = yield rp.get('http://www.xe.com/currencyconverter/convert/?From=' + job.from + '&To=' + job.to);
        let $ = cheerio.load(html);
        let _from = $('.leftCol');
        let _to = $('.rightCol');

        if (_from && _from.length > 0 && _from.eq(0).text() && _from.eq(0).text().indexOf('---') !== -1) {
          reject(new Error('Invalid currency from'));
        }

        if (_to && _to.length > 0 && _to.eq(0).text() && _to.eq(0).text().indexOf('---') !== -1) {
          reject(new Error('Invalid currency to'));
        }

        job.rate = _to.eq(0).text().split(/\s{1}/)[0];
        const Currency = require('./currency');
        resolve(new Currency(job));
      });
    });
  } else {
    throw new Error ('missing exchange rate from or to.');
  }
}

module.exports = {
  start: reserveJob()
};
