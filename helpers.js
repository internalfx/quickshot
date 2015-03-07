(function() {
  var cwd, fs, iced, mfs, path, __iced_k, __iced_k_noop;

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  fs = require('fs');

  path = require('path');

  cwd = process.cwd();

  mfs = require('machinepack-fs');

  module.exports = {
    loadConfig: function(cb) {
      var configpath, ___iced_passed_deferral, __iced_k, _results, _while;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      configpath = path.join(cwd, 'quickshot.json');
      _results = [];
      _while = (function(_this) {
        var callback, config, err, pathArr, __iced_deferrals;
        return function(__iced_k) {
          var _break, _continue, _next;
          _break = function() {
            return __iced_k(_results);
          };
          _continue = function() {
            return iced.trampoline(function() {
              return _while(__iced_k);
            });
          };
          _next = function(__iced_next_arg) {
            _results.push(__iced_next_arg);
            return _continue();
          };
          if (!!((typeof config !== "undefined" && config !== null) || (typeof err !== "undefined" && err !== null))) {
            return _break();
          } else {
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "lib/helpers.iced"
              });
              callback = __iced_deferrals.defer({
                assign_fn: (function() {
                  return function() {
                    err = arguments[0];
                    return config = arguments[1];
                  };
                })(),
                lineno: 12
              });
              mfs.readJson({
                source: configpath,
                schema: {}
              }).exec({
                error: callback,
                doesNotExist: function() {
                  return callback();
                },
                couldNotParse: function() {
                  return callback(new Error("Shop configuration is corrupt, you may need to recreate your configuration"));
                },
                success: function(data) {
                  return callback(null, data);
                }
              });
              __iced_deferrals._fulfill();
            })(function() {
              if (config) {
                cb(null, config);
              } else {
                pathArr = configpath.split(path.sep);
                if ((pathArr.length - 2) >= 0) {
                  _.pullAt(pathArr, pathArr.length - 2);
                } else {
                  return cb(new Error("Shop configuration is missing, have you run 'quickshot new shop'?"));
                }
                configpath = '/' + path.join.apply(_this, pathArr);
              }
              return _next();
            });
          }
        };
      })(this);
      _while(__iced_k);
    },
    saveConfig: function(config, cb) {
      var err, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "lib/helpers.iced"
          });
          fs.writeFile('./quickshot.json', JSON.stringify(config), __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                return err = arguments[0];
              };
            })(),
            lineno: 36
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          if (typeof err !== "undefined" && err !== null) {
            cb(err);
          }
          return cb(null);
        };
      })(this));
    }
  };

}).call(this);
