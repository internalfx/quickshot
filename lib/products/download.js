(function() {
  var colors, fs, helpers, iced, inquirer, mkdirp, parser, path, request, __iced_k, __iced_k_noop;

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  helpers = require('../helpers');

  inquirer = require("inquirer");

  colors = require('colors');

  fs = require('fs');

  path = require('path');

  request = require('request');

  mkdirp = require('mkdirp');

  parser = require('gitignore-parser');

  exports.run = function(argv, done) {
    var config, err, filter, ignore, key, product, products, target, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    filter = _.first(argv['_']);
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "src/products/download.iced",
          funcname: "run"
        });
        helpers.loadConfig(__iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              err = arguments[0];
              return config = arguments[1];
            };
          })(),
          lineno: 14
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        if (typeof err !== "undefined" && err !== null) {
          return done(err);
        }
        if (config.ignore_file) {
          ignore = parser.compile(fs.readFileSync(config.ignore_file, 'utf8'));
        }
        (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "src/products/download.iced",
            funcname: "run"
          });
          helpers.getTarget(config, argv, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                return target = arguments[1];
              };
            })(),
            lineno: 20
          }));
          __iced_deferrals._fulfill();
        })(function() {
          if (typeof err !== "undefined" && err !== null) {
            return done(err);
          }
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "src/products/download.iced",
              funcname: "run"
            });
            helpers.getShopProducts(target, __iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  err = arguments[0];
                  return products = arguments[1];
                };
              })(),
              lineno: 23
            }));
            __iced_deferrals._fulfill();
          })(function() {
            if (typeof err !== "undefined" && err !== null) {
              return cb(err);
            }
            (function(__iced_k) {
              var _i, _len, _ref, _results, _while;
              _ref = products;
              _len = _ref.length;
              _i = 0;
              _results = [];
              _while = function(__iced_k) {
                var _break, _continue, _next;
                _break = function() {
                  return __iced_k(_results);
                };
                _continue = function() {
                  return iced.trampoline(function() {
                    ++_i;
                    return _while(__iced_k);
                  });
                };
                _next = function(__iced_next_arg) {
                  _results.push(__iced_next_arg);
                  return _continue();
                };
                if (!(_i < _len)) {
                  return _break();
                } else {
                  product = _ref[_i];
                  key = "products/" + product.handle + ".json";
                  (function(__iced_k) {
                    __iced_deferrals = new iced.Deferrals(__iced_k, {
                      parent: ___iced_passed_deferral,
                      filename: "src/products/download.iced",
                      funcname: "run"
                    });
                    mkdirp(path.dirname(key), __iced_deferrals.defer({
                      assign_fn: (function() {
                        return function() {
                          return err = arguments[0];
                        };
                      })(),
                      lineno: 29
                    }));
                    __iced_deferrals._fulfill();
                  })(function() {
                    (function(__iced_k) {
                      __iced_deferrals = new iced.Deferrals(__iced_k, {
                        parent: ___iced_passed_deferral,
                        filename: "src/products/download.iced",
                        funcname: "run"
                      });
                      fs.writeFile(key, JSON.stringify(product), __iced_deferrals.defer({
                        assign_fn: (function() {
                          return function() {
                            return err = arguments[0];
                          };
                        })(),
                        lineno: 30
                      }));
                      __iced_deferrals._fulfill();
                    })(function() {
                      return _next(console.log(colors.green("Downloaded " + key)));
                    });
                  });
                }
              };
              _while(__iced_k);
            })(function() {
              return done();
            });
          });
        });
      };
    })(this));
  };

}).call(this);
