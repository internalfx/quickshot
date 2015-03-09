(function() {
  var colors, fs, helpers, iced, inquirer, mkdirp, path, request, walk, __iced_k, __iced_k_noop;

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  helpers = require('./helpers');

  inquirer = require("inquirer");

  colors = require('colors');

  fs = require('fs');

  path = require('path');

  request = require('request');

  mkdirp = require('mkdirp');

  walk = require('walk');

  exports.run = function(argv, done) {
    var config, err, filter, projDir, walker, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    filter = _.first(argv['_']);
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "lib/upload.iced",
          funcname: "run"
        });
        helpers.loadConfig(__iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              err = arguments[0];
              config = arguments[1];
              return projDir = arguments[2];
            };
          })(),
          lineno: 14
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        walker = walk.walk(projDir, {
          followLinks: false
        });
        return walker.on("file", function(root, fileStat, next) {
          var assetsBody, data, err, extension, filepath, res, ___iced_passed_deferral1, __iced_deferrals, __iced_k;
          __iced_k = __iced_k_noop;
          ___iced_passed_deferral1 = iced.findDeferral(arguments);
          filepath = path.join(root, fileStat.name).replace(projDir + "/", "");
          if (filepath.match(new RegExp('^quickshot.json$'))) {
            return next();
          }
          if ((filter != null) && !filepath.match(new RegExp("^" + filter))) {
            return next();
          }
          extension = path.extname(filepath).substr(1);
          next();
          if (filepath.match(/[\(\)]/)) {
            return console.log(colors.red("Filename may not contain parentheses, please rename - \"" + filepath + "\""));
          }
          (function(_this) {
            return (function(__iced_k) {
              if (helpers.isBinary(extension)) {
                (function(__iced_k) {
                  __iced_deferrals = new iced.Deferrals(__iced_k, {
                    parent: ___iced_passed_deferral1,
                    filename: "lib/upload.iced"
                  });
                  fs.readFile(filepath, __iced_deferrals.defer({
                    assign_fn: (function() {
                      return function() {
                        err = arguments[0];
                        return data = arguments[1];
                      };
                    })(),
                    lineno: 33
                  }));
                  __iced_deferrals._fulfill();
                })(function() {
                  (function(__iced_k) {
                    __iced_deferrals = new iced.Deferrals(__iced_k, {
                      parent: ___iced_passed_deferral1,
                      filename: "lib/upload.iced"
                    });
                    helpers.shopifyRequest({
                      method: 'put',
                      url: "https://" + config.api_key + ":" + config.password + "@" + config.domain + ".myshopify.com/admin/themes/" + config.theme_id + "/assets.json",
                      json: {
                        asset: {
                          key: filepath,
                          attachment: data.toString('base64')
                        }
                      }
                    }, __iced_deferrals.defer({
                      assign_fn: (function() {
                        return function() {
                          err = arguments[0];
                          res = arguments[1];
                          return assetsBody = arguments[2];
                        };
                      })(),
                      lineno: 43
                    }));
                    __iced_deferrals._fulfill();
                  })(function() {
                    return __iced_k(typeof err !== "undefined" && err !== null ? done(err) : void 0);
                  });
                });
              } else {
                (function(__iced_k) {
                  __iced_deferrals = new iced.Deferrals(__iced_k, {
                    parent: ___iced_passed_deferral1,
                    filename: "lib/upload.iced"
                  });
                  fs.readFile(filepath, {
                    encoding: 'utf8'
                  }, __iced_deferrals.defer({
                    assign_fn: (function() {
                      return function() {
                        err = arguments[0];
                        return data = arguments[1];
                      };
                    })(),
                    lineno: 46
                  }));
                  __iced_deferrals._fulfill();
                })(function() {
                  (function(__iced_k) {
                    __iced_deferrals = new iced.Deferrals(__iced_k, {
                      parent: ___iced_passed_deferral1,
                      filename: "lib/upload.iced"
                    });
                    helpers.shopifyRequest({
                      method: 'put',
                      url: "https://" + config.api_key + ":" + config.password + "@" + config.domain + ".myshopify.com/admin/themes/" + config.theme_id + "/assets.json",
                      json: {
                        asset: {
                          key: filepath,
                          value: data
                        }
                      }
                    }, __iced_deferrals.defer({
                      assign_fn: (function() {
                        return function() {
                          err = arguments[0];
                          res = arguments[1];
                          return assetsBody = arguments[2];
                        };
                      })(),
                      lineno: 56
                    }));
                    __iced_deferrals._fulfill();
                  })(function() {
                    return __iced_k(err != null ? done(err) : void 0);
                  });
                });
              }
            });
          })(this)((function(_this) {
            return function() {
              return console.log(colors.green("Uploaded " + filepath));
            };
          })(this));
        });
      };
    })(this));
  };

}).call(this);