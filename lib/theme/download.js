(function() {
  var colors, downloader, fs, helpers, iced, inquirer, mkdirp, parser, path, request, target, __iced_k, __iced_k_noop;

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

  target = null;

  downloader = function(ctx, cb) {
    var data, err, rawData, res, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "src/theme/download.iced"
        });
        helpers.shopifyRequest({
          filepath: ctx.key,
          method: 'get',
          url: "https://" + ctx.target.api_key + ":" + ctx.target.password + "@" + ctx.target.domain + ".myshopify.com/admin/themes/" + ctx.target.theme_id + "/assets.json",
          qs: {
            asset: {
              key: ctx.key
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
          lineno: 22
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        if (typeof err !== "undefined" && err !== null) {
          console.log(colors.red(err));
          cb(err);
        }
        console.log(colors.green("Downloaded " + ctx.key));
        if (data.asset.attachment) {
          rawData = new Buffer(data.asset.attachment, 'base64');
        } else if (data.asset.value) {
          rawData = new Buffer(data.asset.value, 'utf8');
        }
        (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "src/theme/download.iced"
          });
          mkdirp(path.join(process.cwd(), 'theme', path.dirname(data.asset.key)), __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                return err = arguments[0];
              };
            })(),
            lineno: 33
          }));
          __iced_deferrals._fulfill();
        })(function() {
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "src/theme/download.iced"
            });
            fs.writeFile(path.join(process.cwd(), 'theme', data.asset.key), rawData, __iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  return err = arguments[0];
                };
              })(),
              lineno: 34
            }));
            __iced_deferrals._fulfill();
          })(function() {
            if (typeof err !== "undefined" && err !== null) {
              console.log(colors.red(err));
              cb(err);
            }
            return cb();
          });
        });
      };
    })(this));
  };

  exports.run = function(argv, done) {
    var asset, assets, assetsBody, config, err, filter, ignore, res, target, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    filter = _.first(argv['_']);
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "src/theme/download.iced",
          funcname: "run"
        });
        helpers.loadConfig(__iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              err = arguments[0];
              return config = arguments[1];
            };
          })(),
          lineno: 45
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
            filename: "src/theme/download.iced",
            funcname: "run"
          });
          helpers.getTarget(config, argv, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                return target = arguments[1];
              };
            })(),
            lineno: 51
          }));
          __iced_deferrals._fulfill();
        })(function() {
          if (typeof err !== "undefined" && err !== null) {
            return done(err);
          }
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "src/theme/download.iced",
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
              lineno: 57
            }));
            __iced_deferrals._fulfill();
          })(function() {
            if (typeof err !== "undefined" && err !== null) {
              return done(err);
            }
            assets = assetsBody.assets;
            if (ignore != null) {
              assets = _.reject(assets, function(asset) {
                return ignore.denies(asset.key);
              });
            }
            if (filter != null) {
              assets = _.filter(assets, function(asset) {
                return asset.key.match(new RegExp("^" + filter));
              });
            }
            (function(__iced_k) {
              if (argv['sync']) {
                (function(__iced_k) {
                  var _i, _len, _ref, _results, _while;
                  _ref = assets;
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
                      asset = _ref[_i];
                      (function(__iced_k) {
                        __iced_deferrals = new iced.Deferrals(__iced_k, {
                          parent: ___iced_passed_deferral,
                          filename: "src/theme/download.iced",
                          funcname: "run"
                        });
                        downloader({
                          key: asset.key,
                          target: target
                        }, __iced_deferrals.defer({
                          assign_fn: (function() {
                            return function() {
                              return err = arguments[0];
                            };
                          })(),
                          lineno: 76
                        }));
                        __iced_deferrals._fulfill();
                      })(_next);
                    }
                  };
                  _while(__iced_k);
                })(__iced_k);
              } else {
                (function(__iced_k) {
                  var _i, _len;
                  __iced_deferrals = new iced.Deferrals(__iced_k, {
                    parent: ___iced_passed_deferral,
                    filename: "src/theme/download.iced",
                    funcname: "run"
                  });
                  for (_i = 0, _len = assets.length; _i < _len; _i++) {
                    asset = assets[_i];
                    downloader({
                      key: asset.key,
                      target: target
                    }, __iced_deferrals.defer({
                      assign_fn: (function() {
                        return function() {
                          return err = arguments[0];
                        };
                      })(),
                      lineno: 80
                    }));
                  }
                  __iced_deferrals._fulfill();
                })(__iced_k);
              }
            })(function() {
              return done();
            });
          });
        });
      };
    })(this));
  };

}).call(this);
