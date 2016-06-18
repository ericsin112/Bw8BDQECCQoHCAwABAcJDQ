'use strict';

var Config = (function () {
  var instance;

  function init() {
    return {
      fivebeans_host: 'challenge.aftership.net',
      fivebeans_port: 11300,
      fivebeans_tubename: 'ericsin112',
      success_limit: 10,
      failure_limit: 3,
      mlab_username: 'client',
      mlab_pwd: 'ab1234cd',
      mlab_dbname: 'challenge',
      getMongooseUrl: function() {
        // return 'mongodb://' + this.mlab_username + ':' + this.mlab_pwd + '@ds015403.mlab.com:15403/' + this.mlab_dbname;
        return `mongodb://${this.mlab_username}:${this.mlab_pwd}@ds015403.mlab.com:15403/${this.mlab_dbname}`;
      }
    };
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = init();
      }

      return instance;
    }
  };
})();

module.exports = Config;
