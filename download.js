(function() {
  var HELPTEXT, colors, fs, helpers, iced, inquirer, mkdirp, path, request, __iced_k, __iced_k_noop;

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  helpers = require('./helpers');

  inquirer = require("inquirer");

  colors = require('colors');

  fs = require('fs');

  path = require('path');

  request = require('request');

  mkdirp = require('mkdirp');

  HELPTEXT = "\nQuickshot Download\n==============================\n\nUsage:\n  quickshot download [filter]      Download theme files, optionally only files/folders specified in the filter\n";

  exports.run = function(argv, done) {
    var asset, assets, assetsBody, config, err, filter, res, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    filter = _.first(argv['_']);
    argv['_'] = argv['_'].slice(1);
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
          lineno: 24
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "lib/download.iced",
            funcname: "run"
          });
          request({
            method: 'get',
            url: "https://" + config.api_key + ":" + config.password + "@" + config.domain + ".myshopify.com/admin/themes/" + config.theme_id + "/assets.json"
          }, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                res = arguments[1];
                return assetsBody = arguments[2];
              };
            })(),
            lineno: 29
          }));
          __iced_deferrals._fulfill();
        })(function() {
          if (typeof err !== "undefined" && err !== null) {
            done(err);
          }
          assets = JSON.parse(assetsBody).assets;
          (function(__iced_k) {
            var _fn, _i, _len;
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "lib/download.iced",
              funcname: "run"
            });
            _fn = function(cb, asset) {
              var data, err, rawData, ___iced_passed_deferral1, __iced_deferrals, __iced_k;
              __iced_k = __iced_k_noop;
              ___iced_passed_deferral1 = iced.findDeferral(arguments);
              (function(_this) {
                return (function(__iced_k) {
                  __iced_deferrals = new iced.Deferrals(__iced_k, {
                    parent: ___iced_passed_deferral1,
                    filename: "lib/download.iced"
                  });
                  helpers.shopifyRequest({
                    method: 'get',
                    url: "https://" + config.api_key + ":" + config.password + "@" + config.domain + ".myshopify.com/admin/themes/" + config.theme_id + "/assets.json",
                    qs: {
                      asset: {
                        key: asset.key
                      }
                    }
                  }, __iced_deferrals.defer({
                    assign_fn: (function() {
                      return function() {
                        err = arguments[0];
                        return data = arguments[1];
                      };
                    })(),
                    lineno: 43
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
                      lineno: 51
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
                        lineno: 52
                      }));
                      __iced_deferrals._fulfill();
                    })(function() {
                      if (typeof err !== "undefined" && err !== null) {
                        return cb(err);
                      }
                    });
                  });
                };
              })(this));
            };
            for (_i = 0, _len = assets.length; _i < _len; _i++) {
              asset = assets[_i];
              _fn(__iced_deferrals.defer({
                assign_fn: (function() {
                  return function() {
                    return err = arguments[0];
                  };
                })(),
                lineno: 54
              }), asset);
            }
            __iced_deferrals._fulfill();
          })(function() {
            console.log(HELPTEXT);
            return done();
          });
        });
      };
    })(this));
  };

}).call(this);
