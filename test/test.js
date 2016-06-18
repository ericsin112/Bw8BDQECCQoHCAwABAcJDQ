'use strict';

const should = require("should");

const Config = require('../config');
const config = Config.getInstance();
const FivebeansHelper = require('../fivebeansHelper');
const fivebeansHelper = FivebeansHelper.getInstance({
  host: config.fivebeans_host,
  port: config.fivebeans_port
});
const consumer = require('../consumer');
const producer = require('../producer');

/*********************************************
 * Tests
 *********************************************/
describe('testing all', function () {
  this.timeout(10000);

	it("should connected to Fivebeans", function (done) {

    let connection = fivebeansHelper.connectFivebeans();
    connection.then(function(isConnected) {
      isConnected.should.be.equal(true);
      done();
    });
	});


});
/*********************************************
 * End
*********************************************/
