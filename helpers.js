(function() {
  var fs, iced, __iced_k, __iced_k_noop;

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  fs = require('fs');

  module.exports = {
    loadConfig: function(cb) {
      var config, err, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "lib/helpers.iced"
          });
          fs.readFile('./config.json', __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                return config = arguments[1];
              };
            })(),
            lineno: 6
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          if (typeof err !== "undefined" && err !== null) {
            cb(err);
          }
          return cb(null, JSON.parse(config));
        };
      })(this));
    }
  };

}).call(this);
