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
    var config, err, filter, ignore, page, product, products, productsBody, productsDownloaded, res, target, ___iced_passed_deferral, __iced_deferrals, __iced_k, _next;
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
          page = 0;
          productsDownloaded = 0;
          (function(__iced_k) {
            var _while;
            _while = function(__iced_k) {
              var _break, _continue;
              _break = __iced_k;
              _continue = function() {
                return iced.trampoline(function() {
                  return _while(__iced_k);
                });
              };
              _next = _continue;
              if (!true) {
                return _break();
              } else {
                page += 1;
                (function(__iced_k) {
                  __iced_deferrals = new iced.Deferrals(__iced_k, {
                    parent: ___iced_passed_deferral,
                    filename: "src/products/download.iced",
                    funcname: "run"
                  });
                  helpers.shopifyRequest({
                    method: 'get',
                    url: "https://" + target.api_key + ":" + target.password + "@" + target.domain + ".myshopify.com/admin/products.json?page=" + page
                  }, __iced_deferrals.defer({
                    assign_fn: (function() {
                      return function() {
                        err = arguments[0];
                        res = arguments[1];
                        return productsBody = arguments[2];
                      };
                    })(),
                    lineno: 31
                  }));
                  __iced_deferrals._fulfill();
                })(function() {
                  if (typeof err !== "undefined" && err !== null) {
                    return done(err);
                  }
                  products = productsBody.products;
                  (function(__iced_k) {
                    if (!(_.isArray(products) && products.length !== 0)) {
                      (function(__iced_k) {
_break()
                      })(__iced_k);
                    } else {
                      return __iced_k();
                    }
                  })(function() {
                    productsDownloaded += products.length;
                    console.log("Products downloaded: " + productsDownloaded);
                    (function(__iced_k) {
                      var _fn, _i, _len;
                      __iced_deferrals = new iced.Deferrals(__iced_k, {
                        parent: ___iced_passed_deferral,
                        filename: "src/products/download.iced",
                        funcname: "run"
                      });
                      _fn = function(product, cb) {
                        var err, image, key, metafieldsBody, res, ___iced_passed_deferral1, __iced_deferrals, __iced_k;
                        __iced_k = __iced_k_noop;
                        ___iced_passed_deferral1 = iced.findDeferral(arguments);
                        key = "products/" + product.handle + "/product.json";
                        (function(_this) {
                          return (function(__iced_k) {
                            __iced_deferrals = new iced.Deferrals(__iced_k, {
                              parent: ___iced_passed_deferral1,
                              filename: "src/products/download.iced"
                            });
                            mkdirp(path.dirname(key), __iced_deferrals.defer({
                              assign_fn: (function() {
                                return function() {
                                  return err = arguments[0];
                                };
                              })(),
                              lineno: 47
                            }));
                            __iced_deferrals._fulfill();
                          });
                        })(this)((function(_this) {
                          return function() {
                            (function(__iced_k) {
                              __iced_deferrals = new iced.Deferrals(__iced_k, {
                                parent: ___iced_passed_deferral1,
                                filename: "src/products/download.iced"
                              });
                              fs.writeFile(key, JSON.stringify(product), __iced_deferrals.defer({
                                assign_fn: (function() {
                                  return function() {
                                    return err = arguments[0];
                                  };
                                })(),
                                lineno: 48
                              }));
                              __iced_deferrals._fulfill();
                            })(function() {
                              (function(__iced_k) {
                                __iced_deferrals = new iced.Deferrals(__iced_k, {
                                  parent: ___iced_passed_deferral1,
                                  filename: "src/products/download.iced"
                                });
                                helpers.shopifyRequest({
                                  method: 'get',
                                  url: "https://" + target.api_key + ":" + target.password + "@" + target.domain + ".myshopify.com/admin/products/" + product.id + "/metafields.json"
                                }, __iced_deferrals.defer({
                                  assign_fn: (function() {
                                    return function() {
                                      err = arguments[0];
                                      res = arguments[1];
                                      return metafieldsBody = arguments[2];
                                    };
                                  })(),
                                  lineno: 53
                                }));
                                __iced_deferrals._fulfill();
                              })(function() {
                                if (typeof err !== "undefined" && err !== null) {
                                  return cb(err);
                                }
                                (function(__iced_k) {
                                  __iced_deferrals = new iced.Deferrals(__iced_k, {
                                    parent: ___iced_passed_deferral1,
                                    filename: "src/products/download.iced"
                                  });
                                  fs.writeFile("products/" + product.handle + "/metafields.json", JSON.stringify(metafieldsBody), __iced_deferrals.defer({
                                    assign_fn: (function() {
                                      return function() {
                                        return err = arguments[0];
                                      };
                                    })(),
                                    lineno: 56
                                  }));
                                  __iced_deferrals._fulfill();
                                })(function() {
                                  (function(__iced_k) {
                                    var _j, _len1, _ref, _results, _while;
                                    _ref = product.images;
                                    _len1 = _ref.length;
                                    _j = 0;
                                    _while = function(__iced_k) {
                                      var _break, _continue;
                                      _break = __iced_k;
                                      _continue = function() {
                                        return iced.trampoline(function() {
                                          ++_j;
                                          return _while(__iced_k);
                                        });
                                      };
                                      _next = _continue;
                                      if (!(_j < _len1)) {
                                        return _break();
                                      } else {
                                        image = _ref[_j];
                                        (function(__iced_k) {
                                          __iced_deferrals = new iced.Deferrals(__iced_k, {
                                            parent: ___iced_passed_deferral1,
                                            filename: "src/products/download.iced"
                                          });
                                          request(image.src).pipe(fs.createWriteStream("products/" + product.handle + "/" + image.id)).on('close', __iced_deferrals.defer({
                                            assign_fn: (function() {
                                              return function() {
                                                return err = arguments[0];
                                              };
                                            })(),
                                            lineno: 59
                                          }));
                                          __iced_deferrals._fulfill();
                                        })(_next);
                                      }
                                    };
                                    _while(__iced_k);
                                  })(function() {
                                    console.log(colors.green("Downloaded " + key));
                                    return cb();
                                  });
                                });
                              });
                            });
                          };
                        })(this));
                      };
                      for (_i = 0, _len = products.length; _i < _len; _i++) {
                        product = products[_i];
                        _fn(product, __iced_deferrals.defer({
                          assign_fn: (function() {
                            return function() {
                              return err = arguments[0];
                            };
                          })(),
                          lineno: 64
                        }));
                      }
                      __iced_deferrals._fulfill();
                    })(_next);
                  });
                });
              }
            };
            _while(__iced_k);
          })(function() {
            return done();
          });
        });
      };
    })(this));
  };

}).call(this);
