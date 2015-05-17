(function() {
  var colors, fs, helpers, iced, inquirer, mkdirp, parser, path, request, walk, __iced_k, __iced_k_noop;

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  helpers = require('../helpers');

  inquirer = require("inquirer");

  colors = require('colors');

  fs = require('fs');

  path = require('path');

  request = require('request');

  mkdirp = require('mkdirp');

  walk = require('walk');

  parser = require('gitignore-parser');

  exports.run = function(argv, done) {
    var assetsBody, config, err, filter, ignore, metaData, metaJson, metafield, newProdData, prodData, prodImage, prodJson, prodPath, productDir, productDirs, res, target, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    filter = _.first(argv['_']);
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "src/products/upload.iced",
          funcname: "run"
        });
        helpers.loadConfig(__iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              err = arguments[0];
              return config = arguments[1];
            };
          })(),
          lineno: 16
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
            filename: "src/products/upload.iced",
            funcname: "run"
          });
          helpers.getTarget(config, argv, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                return target = arguments[1];
              };
            })(),
            lineno: 22
          }));
          __iced_deferrals._fulfill();
        })(function() {
          var _i, _len, _ref, _results, _while;
          if (typeof err !== "undefined" && err !== null) {
            return done(err);
          }
          productDirs = fs.readdirSync(path.join(process.cwd(), 'products')).filter(function(file) {
            return fs.statSync(path.join(process.cwd(), 'products', file)).isDirectory();
          });
          _ref = productDirs;
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
              productDir = _ref[_i];
              prodPath = path.join(process.cwd(), 'products', productDir);
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral,
                  filename: "src/products/upload.iced",
                  funcname: "run"
                });
                fs.readFile(path.join(prodPath, 'product.json'), __iced_deferrals.defer({
                  assign_fn: (function() {
                    return function() {
                      err = arguments[0];
                      return prodJson = arguments[1];
                    };
                  })(),
                  lineno: 32
                }));
                __iced_deferrals._fulfill();
              })(function() {
                prodData = JSON.parse(prodJson);
                (function(__iced_k) {
                  __iced_deferrals = new iced.Deferrals(__iced_k, {
                    parent: ___iced_passed_deferral,
                    filename: "src/products/upload.iced",
                    funcname: "run"
                  });
                  helpers.shopifyRequest({
                    method: 'post',
                    url: "https://" + target.api_key + ":" + target.password + "@" + target.domain + ".myshopify.com/admin/products.json",
                    json: {
                      product: _.omit(prodData, 'images', 'image')
                    }
                  }, __iced_deferrals.defer({
                    assign_fn: (function() {
                      return function() {
                        err = arguments[0];
                        res = arguments[1];
                        return assetsBody = arguments[2];
                      };
                    })(),
                    lineno: 39
                  }));
                  __iced_deferrals._fulfill();
                })(function() {
                  newProdData = assetsBody.product;
                  (function(__iced_k) {
                    var _fn, _j, _len1, _ref1;
                    __iced_deferrals = new iced.Deferrals(__iced_k, {
                      parent: ___iced_passed_deferral,
                      filename: "src/products/upload.iced",
                      funcname: "run"
                    });
                    _ref1 = prodData.images;
                    _fn = function(prodImage, cb) {
                      var err, image, imgData, newVariant, newVariantIds, requestBody, res, variant_id, ___iced_passed_deferral1, __iced_deferrals, __iced_k, _k, _len2, _ref2;
                      __iced_k = __iced_k_noop;
                      ___iced_passed_deferral1 = iced.findDeferral(arguments);
                      image = _.cloneDeep(prodImage);
                      newVariantIds = [];
                      _ref2 = image.variant_ids;
                      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                        variant_id = _ref2[_k];
                        newVariant = newProdData.variants[_.findIndex(prodData.variants, {
                          id: variant_id
                        })];
                        newVariantIds.push(newVariant.id);
                      }
                      image.variant_ids = newVariantIds;
                      delete image.src;
                      (function(_this) {
                        return (function(__iced_k) {
                          __iced_deferrals = new iced.Deferrals(__iced_k, {
                            parent: ___iced_passed_deferral1,
                            filename: "src/products/upload.iced"
                          });
                          fs.readFile(path.join(prodPath, image.id.toString()), __iced_deferrals.defer({
                            assign_fn: (function() {
                              return function() {
                                err = arguments[0];
                                return imgData = arguments[1];
                              };
                            })(),
                            lineno: 56
                          }));
                          __iced_deferrals._fulfill();
                        });
                      })(this)((function(_this) {
                        return function() {
                          if (err != null) {
                            console.log(colors.red("Image " + image.id + " missing for product " + prodData.handle));
                            return cb(err);
                          }
                          image.attachment = imgData.toString('base64');
                          (function(__iced_k) {
                            __iced_deferrals = new iced.Deferrals(__iced_k, {
                              parent: ___iced_passed_deferral1,
                              filename: "src/products/upload.iced"
                            });
                            helpers.shopifyRequest({
                              method: 'post',
                              url: "https://" + target.api_key + ":" + target.password + "@" + target.domain + ".myshopify.com/admin/products/" + newProdData.id + "/images.json",
                              json: {
                                image: image
                              }
                            }, __iced_deferrals.defer({
                              assign_fn: (function() {
                                return function() {
                                  err = arguments[0];
                                  res = arguments[1];
                                  return requestBody = arguments[2];
                                };
                              })(),
                              lineno: 67
                            }));
                            __iced_deferrals._fulfill();
                          })(function() {
                            if (err != null) {
                              return cb(err);
                            }
                            return cb();
                          });
                        };
                      })(this));
                    };
                    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                      prodImage = _ref1[_j];
                      _fn(prodImage, __iced_deferrals.defer({
                        assign_fn: (function() {
                          return function() {
                            return err = arguments[0];
                          };
                        })(),
                        lineno: 71
                      }));
                    }
                    __iced_deferrals._fulfill();
                  })(function() {
                    (function(__iced_k) {
                      __iced_deferrals = new iced.Deferrals(__iced_k, {
                        parent: ___iced_passed_deferral,
                        filename: "src/products/upload.iced",
                        funcname: "run"
                      });
                      fs.readFile(path.join(prodPath, 'metafields.json'), __iced_deferrals.defer({
                        assign_fn: (function() {
                          return function() {
                            err = arguments[0];
                            return metaJson = arguments[1];
                          };
                        })(),
                        lineno: 73
                      }));
                      __iced_deferrals._fulfill();
                    })(function() {
                      metaData = JSON.parse(metaJson);
                      (function(__iced_k) {
                        var _fn, _j, _len1, _ref1;
                        __iced_deferrals = new iced.Deferrals(__iced_k, {
                          parent: ___iced_passed_deferral,
                          filename: "src/products/upload.iced",
                          funcname: "run"
                        });
                        _ref1 = metaData.metafields;
                        _fn = function(metafield, cb) {
                          var err, requestBody, res, ___iced_passed_deferral1, __iced_deferrals, __iced_k;
                          __iced_k = __iced_k_noop;
                          ___iced_passed_deferral1 = iced.findDeferral(arguments);
                          (function(_this) {
                            return (function(__iced_k) {
                              __iced_deferrals = new iced.Deferrals(__iced_k, {
                                parent: ___iced_passed_deferral1,
                                filename: "src/products/upload.iced"
                              });
                              helpers.shopifyRequest({
                                method: 'post',
                                url: "https://" + target.api_key + ":" + target.password + "@" + target.domain + ".myshopify.com/admin/products/" + newProdData.id + "/metafields.json",
                                json: {
                                  metafield: metafield
                                }
                              }, __iced_deferrals.defer({
                                assign_fn: (function() {
                                  return function() {
                                    err = arguments[0];
                                    res = arguments[1];
                                    return requestBody = arguments[2];
                                  };
                                })(),
                                lineno: 83
                              }));
                              __iced_deferrals._fulfill();
                            });
                          })(this)((function(_this) {
                            return function() {
                              if (typeof err !== "undefined" && err !== null) {
                                return cb(err);
                              }
                              return cb();
                            };
                          })(this));
                        };
                        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                          metafield = _ref1[_j];
                          _fn(metafield, __iced_deferrals.defer({
                            assign_fn: (function() {
                              return function() {
                                return err = arguments[0];
                              };
                            })(),
                            lineno: 87
                          }));
                        }
                        __iced_deferrals._fulfill();
                      })(function() {
                        return _next(console.log(colors.green("Created " + newProdData.handle)));
                      });
                    });
                  });
                });
              });
            }
          };
          _while(__iced_k);
        });
      };
    })(this));
  };

}).call(this);
