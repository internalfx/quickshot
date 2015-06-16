(function() {
  var colors, fs, iced, inquirer, mfs, path, request, shopifyQueue, __iced_k, __iced_k_noop;

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  fs = require('fs');

  path = require('path');

  mfs = require('machinepack-fs');

  request = require('request');

  colors = require('colors');

  inquirer = require("inquirer");

  shopifyQueue = {
    isRunning: false,
    throttle: 0,
    inFlight: 0,
    rate: 0,
    max: 40,
    queue: [],
    add: function(item) {
      this.queue.push(item);
      if (!this.isRunning) {
        return this.run();
      }
    },
    retry: function(item) {
      this.queue.unshift(item);
      if (!this.isRunning) {
        return this.run();
      }
    },
    run: function() {
      var exponent, headroom, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      this.isRunning = true;
      (function(_this) {
        return (function(__iced_k) {
          var _results, _while;
          _results = [];
          _while = function(__iced_k) {
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
            if (!(_this.queue.length > 0)) {
              return _break();
            } else {
              headroom = _this.max - (_this.rate + _this.inFlight);
              if (headroom <= 0) {
                headroom = 0;
              }
              exponent = (headroom * headroom) / 9;
              if (exponent <= 0) {
                exponent = 1;
              }
              _this.throttle = 500 / exponent;
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral,
                  filename: "src/helpers.iced"
                });
                setTimeout(__iced_deferrals.defer({
                  lineno: 36
                }), _this.throttle);
                __iced_deferrals._fulfill();
              })(function() {
                return _next(_this.request(_this.queue.shift()));
              });
            }
          };
          _while(__iced_k);
        });
      })(this)((function(_this) {
        return function() {
          return _this.isRunning = false;
        };
      })(this));
    },
    request: function(item) {
      var body, err, error, limit, res, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      this.inFlight += 1;
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "src/helpers.iced"
          });
          request(item.req, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                res = arguments[1];
                return body = arguments[2];
              };
            })(),
            lineno: 42
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          var _i, _len, _ref, _ref1, _results;
          _this.inFlight -= 1;
          if (typeof err !== "undefined" && err !== null) {
            return item.cb(err);
          }
          switch (res.statusCode) {
            case 200:
            case 201:
              try {
                body = JSON.parse(body);
              } catch (_error) {}
              if (body.errors) {
                console.log(colors.red(body.errors));
                return _this.retry(item);
              } else {
                limit = res.headers['x-shopify-shop-api-call-limit'];
                limit = limit.split('/');
                _this.rate = parseInt(_.first(limit));
                _this.max = parseInt(_.last(limit));
                return item.cb(null, res, body);
              }
              break;
            case 429:
              return _this.retry(item);
            case 422:
              try {
                body = JSON.parse(body);
              } catch (_error) {}
              if (_.isArray(body != null ? (_ref = body.errors) != null ? _ref.asset : void 0 : void 0)) {
                _ref1 = body.errors.asset;
                _results = [];
                for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                  error = _ref1[_i];
                  _results.push(console.log(colors.red("Error in " + item.req.filepath + " - " + error)));
                }
                return _results;
              }
              break;
            default:
              console.log(colors.red(res));
              return console.log(colors.red("Failed to transfer [" + res.statusCode + "] " + item.req.filepath));
          }
        };
      })(this));
    }
  };

  module.exports = {
    loadConfig: function(cb) {
      return mfs.readJson({
        source: 'quickshot.json',
        schema: {}
      }).exec({
        error: cb,
        doesNotExist: function() {
          return cb(new Error("Shop configuration is missing, have you run 'quickshot configure'?"));
        },
        couldNotParse: function() {
          return cb(new Error("Shop configuration is corrupt, you may need to delete 'quickshot.json', and run 'quickshot configure' again."));
        },
        success: function(data) {
          if ((data.configVersion == null) || data.configVersion < CONFIGVERSION) {
            cb(new Error("Shop configuration is from an older incompatible version of quickshot. You need to run 'quickshot configure' again."));
          }
          return cb(null, data);
        }
      });
    },
    shopifyRequest: function(req, cb) {
      return shopifyQueue.add({
        req: req,
        cb: cb
      });
    },
    getTarget: function(config, argv, cb) {
      var choice, target, targetChoices, targetName, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      if (argv['target']) {
        targetName = argv['target'];
      }
      target = null;
      if (_.isArray(config.targets)) {
        (function(_this) {
          return (function(__iced_k) {
            if (targetName) {
              target = _.find(config.targets, {
                target_name: targetName
              });
              if (target) {
                return cb(null, target);
              } else {
                return cb(new Error("Could not find target '" + targetName + "'"));
              }
              return __iced_k();
            } else {
              targetChoices = _.map(config.targets, function(target) {
                return "[" + target.target_name + "] - '" + target.theme_name + "' at " + target.domain + ".myshopify.com";
              });
              (function(__iced_k) {
                if (config.targets.length > 1) {
                  (function(__iced_k) {
                    __iced_deferrals = new iced.Deferrals(__iced_k, {
                      parent: ___iced_passed_deferral,
                      filename: "src/helpers.iced"
                    });
                    inquirer.prompt([
                      {
                        type: 'list',
                        name: 'target',
                        message: "Select target",
                        "default": null,
                        choices: targetChoices
                      }
                    ], __iced_deferrals.defer({
                      assign_fn: (function() {
                        return function() {
                          return choice = arguments[0];
                        };
                      })(),
                      lineno: 116
                    }));
                    __iced_deferrals._fulfill();
                  })(function() {
                    return __iced_k(target = config.targets[_.indexOf(targetChoices, choice.target)]);
                  });
                } else {
                  return __iced_k(config.targets.length === 1 ? target = _.first(config.targets) : void 0);
                }
              })(function() {
                return cb(null, target);
                return __iced_k();
              });
            }
          });
        })(this)(__iced_k);
      } else {
        return cb(new Error("No targets configured! Run 'quickshot configure' and create a new target."));
        return __iced_k();
      }
    },
    getShopPages: function(target, cb) {
      var chunkSize, err, page, pages, pagesBody, res, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      chunkSize = 250;
      page = 1;
      pages = [];
      pagesBody = {
        pages: [0]
      };
      (function(_this) {
        return (function(__iced_k) {
          var _results, _while;
          _results = [];
          _while = function(__iced_k) {
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
            if (pagesBody.pages.length === 0) {
              return _break();
            } else {
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral,
                  filename: "src/helpers.iced"
                });
                _this.shopifyRequest({
                  method: 'get',
                  url: "https://" + target.api_key + ":" + target.password + "@" + target.domain + ".myshopify.com/admin/pages.json?limit=" + chunkSize + "&page=" + page
                }, __iced_deferrals.defer({
                  assign_fn: (function() {
                    return function() {
                      err = arguments[0];
                      res = arguments[1];
                      return pagesBody = arguments[2];
                    };
                  })(),
                  lineno: 136
                }));
                __iced_deferrals._fulfill();
              })(function() {
                if (typeof err !== "undefined" && err !== null) {
                  return cb(err);
                }
                pages = pages.concat(pagesBody.pages);
                return _next(page += 1);
              });
            }
          };
          _while(__iced_k);
        });
      })(this)((function(_this) {
        return function() {
          return cb(null, pages);
        };
      })(this));
    }
  };

}).call(this);
