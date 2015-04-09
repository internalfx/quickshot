(function() {
  var colors, fs, helpers, iced, inquirer, mkdirp, parser, path, request, __iced_k, __iced_k_noop;

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  helpers = require('./helpers');

  inquirer = require("inquirer");

  colors = require('colors');

  fs = require('fs');

  path = require('path');

  request = require('request');

  mkdirp = require('mkdirp');

  parser = require('gitignore-parser');

  exports.run = function(argv, done) {
    var asset, assets, assetsBody, config, err, filter, ignore, key, page, pages, pagesBody, res, target, ___iced_passed_deferral, __iced_deferrals, __iced_k, _next;
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
          lineno: 14
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        if (typeof err !== "undefined" && err !== null) {
          done(err);
        }
        if (config.ignore_file) {
          ignore = parser.compile(fs.readFileSync(config.ignore_file, 'utf8'));
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
            lineno: 20
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
              url: "https://" + target.api_key + ":" + target.password + "@" + target.domain + ".myshopify.com/admin/pages.json?limit=250"
            }, __iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  err = arguments[0];
                  res = arguments[1];
                  return pagesBody = arguments[2];
                };
              })(),
              lineno: 26
            }));
            __iced_deferrals._fulfill();
          })(function() {
            if (typeof err !== "undefined" && err !== null) {
              done(err);
            }
            pages = pagesBody.pages;
            (function(__iced_k) {
              var _i, _len, _ref, _while;
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "lib/download.iced",
                funcname: "run"
              });
              _ref = pages;
              _len = _ref.length;
              _i = 0;
              _while = function(__iced_k) {
                var _break, _continue;
                _break = __iced_k;
                _continue = function() {
                  return iced.trampoline(function() {
                    ++_i;
                    return _while(__iced_k);
                  });
                };
                _next = _continue;
                if (!(_i < _len)) {
                  return _break();
                } else {
                  page = _ref[_i];
                  key = "pages/" + page.handle + ".html";
                  (function(__iced_k) {
                    if (ignore && ignore.denies(key)) {
                      (function(__iced_k) {
_continue()
                      })(__iced_k);
                    } else {
                      return __iced_k();
                    }
                  })(function() {
                    (function(__iced_k) {
                      if ((filter == null) || key.match(new RegExp("^" + filter))) {
                        (function(__iced_k) {
                          __iced_deferrals = new iced.Deferrals(__iced_k, {
                            parent: ___iced_passed_deferral,
                            filename: "lib/download.iced",
                            funcname: "run"
                          });
                          mkdirp(path.dirname(key), __iced_deferrals.defer({
                            assign_fn: (function() {
                              return function() {
                                return err = arguments[0];
                              };
                            })(),
                            lineno: 38
                          }));
                          __iced_deferrals._fulfill();
                        })(function() {
                          (function(__iced_k) {
                            __iced_deferrals = new iced.Deferrals(__iced_k, {
                              parent: ___iced_passed_deferral,
                              filename: "lib/download.iced",
                              funcname: "run"
                            });
                            fs.writeFile(key, page.body_html, __iced_deferrals.defer({
                              assign_fn: (function() {
                                return function() {
                                  return err = arguments[0];
                                };
                              })(),
                              lineno: 39
                            }));
                            __iced_deferrals._fulfill();
                          })(function() {
                            return __iced_k(console.log(colors.green("Downloaded " + key)));
                          });
                        });
                      } else {
                        return __iced_k();
                      }
                    })(_next);
                  });
                }
              };
              _while(__iced_k);
              __iced_deferrals._fulfill();
            })(function() {
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
                  lineno: 46
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
                    key = asset.key;
                    if (ignore && ignore.denies(key)) {
                      continue;
                    }
                    if ((filter == null) || key.match(new RegExp("^" + filter))) {
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
                              filepath: key,
                              method: 'get',
                              url: "https://" + target.api_key + ":" + target.password + "@" + target.domain + ".myshopify.com/admin/themes/" + target.theme_id + "/assets.json",
                              qs: {
                                asset: {
                                  key: key
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
                              lineno: 67
                            }));
                            __iced_deferrals._fulfill();
                          });
                        })(this)((function(_this) {
                          return function() {
                            if (err != null) {
                              console.log(colors.red(err));
                              cb(err);
                            }
                            console.log(colors.green("Downloaded " + key));
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
                                lineno: 78
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
                                  lineno: 79
                                }));
                                __iced_deferrals._fulfill();
                              })(function() {
                                if (err != null) {
                                  console.log(colors.red(err));
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
                        lineno: 84
                      }), asset);
                    }
                  }
                  __iced_deferrals._fulfill();
                })(function() {
                  return done();
                });
              });
            });
          });
        });
      };
    })(this));
  };

}).call(this);
