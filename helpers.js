(function() {
  var colors, cwd, fs, iced, mfs, path, request, shopifyQueue, __iced_k, __iced_k_noop;

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  fs = require('fs');

  path = require('path');

  cwd = process.cwd();

  mfs = require('machinepack-fs');

  request = require('request');

  colors = require('colors');

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
              exponent = (headroom * headroom) / 8;
              if (exponent <= 0) {
                exponent = 1;
              }
              _this.throttle = 550 / exponent;
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral,
                  filename: "lib/helpers.iced"
                });
                setTimeout(__iced_deferrals.defer({
                  lineno: 38
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
      var body, err, limit, res, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      this.inFlight += 1;
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "lib/helpers.iced"
          });
          request(item.req, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                res = arguments[1];
                return body = arguments[2];
              };
            })(),
            lineno: 44
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          _this.inFlight -= 1;
          if (typeof err !== "undefined" && err !== null) {
            item.cb(err);
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
            default:
              console.log(colors.red(res.statusCode));
              return console.log(colors.red(res.body));
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
    isBinary: function(extension) {
      if (_.includes(['gif', 'png', 'jpg', 'mp4', 'm4v', 'otf', 'eot', 'svg', 'ttf', 'woff', 'woff2'], extension)) {
        return true;
      } else {
        return false;
      }
    }
  };

}).call(this);
