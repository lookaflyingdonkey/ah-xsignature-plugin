var crypto = require('crypto');

exports.xsignature = function(api, next) {
  api.xsignature = {
    generate: function(algorithm, data) {
      var hash = crypto.createHash(algorithm).update(api.config.xsignature.secret + data).digest('base64');
      return hash;
    },
    validate: function(algorithm, checksum, data) {
      var hash = api.xsignature.generate(algorithm, data);
      console.log("Expecting: ", hash);
      return hash == checksum;
    },
    checkAlgorithm: function(algorithm) {
      var supported = crypto.getHashes();
      return supported.indexOf(algorithm) >= 0;
    }
  };
  next();
};