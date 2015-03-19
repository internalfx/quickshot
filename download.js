(function() {
  var colors, fs, helpers, iced, inquirer, mkdirp, path, request, __iced_k, __iced_k_noop;

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  helpers = require('./helpers');

  inquirer = require("inquirer");

  colors = require('colors');

  fs = require('fs');

  path = require('path');

  request = require('request');

  mkdirp = require('mkdirp');

  exports.run = function(argv, done) {
    var asset, assets, assetsBody, config, err, filter, res, target, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    filter = _.first(argv['_']);
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "lib/download.iced",
          funcname: "run"
        });
        helpers.loadConfig(__iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              err = arguments[0];
              return config = arguments[1];
            };
          })(),
          lineno: 13
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        if (typeof err !== "undefined" && err !== null) {
          done(err);
        }
        (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "lib/download.iced",
            funcname: "run"
          });
          helpers.getTarget(config, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                return target = arguments[1];
              };
            })(),
            lineno: 16
          }));
          __iced_deferrals._fulfill();
        })(function() {
          if (typeof err !== "undefined" && err !== null) {
            done(err);
          }
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "lib/download.iced",
              funcname: "run"
            });
            helpers.shopifyRequest({
              method: 'get',
              url: "https://" + target.api_key + ":" + target.password + "@" + target.domain + ".myshopify.com/admin/themes/" + target.theme_id + "/assets.json"
            }, __iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  err = arguments[0];
                  res = arguments[1];
                  return assetsBody = arguments[2];
                };
              })(),
              lineno: 22
            }));
            __iced_deferrals._fulfill();
          })(function() {
            if (typeof err !== "undefined" && err !== null) {
              done(err);
            }
            assets = assetsBody.assets;
            (function(__iced_k) {
              var _i, _len;
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "lib/download.iced",
                funcname: "run"
              });
              for (_i = 0, _len = assets.length; _i < _len; _i++) {
                asset = assets[_i];
                if ((filter == null) || asset.key.match(new RegExp("^" + filter))) {
                  (function(cb, asset) {
                    var data, err, rawData, res, ___iced_passed_deferral1, __iced_deferrals, __iced_k;
                    __iced_k = __iced_k_noop;
                    ___iced_passed_deferral1 = iced.findDeferral(arguments);
                    (function(_this) {
                      return (function(__iced_k) {
                        __iced_deferrals = new iced.Deferrals(__iced_k, {
                          parent: ___iced_passed_deferral1,
                          filename: "lib/download.iced"
                        });
                        helpers.shopifyRequest({
                          filepath: asset.key,
                          method: 'get',
                          url: "https://" + target.api_key + ":" + target.password + "@" + target.domain + ".myshopify.com/admin/themes/" + target.theme_id + "/assets.json",
                          qs: {
                            asset: {
                              key: asset.key
                            }
                          }
                        }, __iced_deferrals.defer({
                          assign_fn: (function() {
                            return function() {
                              err = arguments[0];
                              res = arguments[1];
                              return data = arguments[2];
                            };
                          })(),
                          lineno: 38
                        }));
                        __iced_deferrals._fulfill();
                      });
                    })(this)((function(_this) {
                      return function() {
                        console.log(colors.green("Downloaded " + asset.key));
                        if (data.asset.attachment) {
                          rawData = new Buffer(data.asset.attachment, 'base64');
                        } else if (data.asset.value) {
                          rawData = new Buffer(data.asset.value, 'utf8');
                        }
                        (function(__iced_k) {
                          __iced_deferrals = new iced.Deferrals(__iced_k, {
                            parent: ___iced_passed_deferral1,
                            filename: "lib/download.iced"
                          });
                          mkdirp(path.dirname(data.asset.key), __iced_deferrals.defer({
                            assign_fn: (function() {
                              return function() {
                                return err = arguments[0];
                              };
                            })(),
                            lineno: 46
                          }));
                          __iced_deferrals._fulfill();
                        })(function() {
                          (function(__iced_k) {
                            __iced_deferrals = new iced.Deferrals(__iced_k, {
                              parent: ___iced_passed_deferral1,
                              filename: "lib/download.iced"
                            });
                            fs.writeFile(data.asset.key, rawData, __iced_deferrals.defer({
                              assign_fn: (function() {
                                return function() {
                                  return err = arguments[0];
                                };
                              })(),
                              lineno: 47
                            }));
                            __iced_deferrals._fulfill();
                          })(function() {
                            if (err != null) {
                              return cb(err);
                            }
                          });
                        });
                      };
                    })(this));
                  })(__iced_deferrals.defer({
                    assign_fn: (function() {
                      return function() {
                        return err = arguments[0];
                      };
                    })(),
                    lineno: 50
                  }), asset);
                }
              }
              __iced_deferrals._fulfill();
            })(function() {
              return done();
            });
          });
        });
      };
    })(this));
  };

}).call(this);
