(function() {
  var colors, fs, helpers, iced, inquirer, mkdirp, parser, path, request, walk, __iced_k, __iced_k_noop;

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

  parser = require('gitignore-parser');

  exports.run = function(argv, done) {
    var config, err, filter, ignore, pages, target, walker, ___iced_passed_deferral, __iced_deferrals, __iced_k;
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
              return config = arguments[1];
            };
          })(),
          lineno: 15
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
            filename: "lib/upload.iced",
            funcname: "run"
          });
          helpers.getTarget(config, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                return target = arguments[1];
              };
            })(),
            lineno: 21
          }));
          __iced_deferrals._fulfill();
        })(function() {
          if (typeof err !== "undefined" && err !== null) {
            return done(err);
          }
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "lib/upload.iced",
              funcname: "run"
            });
            helpers.getShopPages(target, __iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  err = arguments[0];
                  return pages = arguments[1];
                };
              })(),
              lineno: 24
            }));
            __iced_deferrals._fulfill();
          })(function() {
            if (typeof err !== "undefined" && err !== null) {
              return done(err);
            }
            walker = walk.walk(process.cwd(), {
              followLinks: false
            });
            return walker.on("file", function(root, fileStat, next) {
              var assetsBody, data, err, extension, fileHandle, filepath, page, res, ___iced_passed_deferral1, __iced_deferrals, __iced_k;
              __iced_k = __iced_k_noop;
              ___iced_passed_deferral1 = iced.findDeferral(arguments);
              filepath = path.join(root, fileStat.name).replace(process.cwd() + "/", "");
              if (filepath.match(/^quickshot.json$/)) {
                return next();
              }
              if (filepath.match(/^\..*$/)) {
                return next();
              }
              if (config.ignore_file) {
                if (ignore.denies(filepath)) {
                  return next();
                }
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
                  if (filepath.match(/^pages/)) {
                    fileHandle = path.basename(filepath, '.html');
                    page = _.find(pages, {
                      handle: fileHandle
                    });
                    (function(__iced_k) {
                      if (page) {
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
                            lineno: 57
                          }));
                          __iced_deferrals._fulfill();
                        })(function() {
                          (function(__iced_k) {
                            __iced_deferrals = new iced.Deferrals(__iced_k, {
                              parent: ___iced_passed_deferral1,
                              filename: "lib/upload.iced"
                            });
                            helpers.shopifyRequest({
                              filepath: filepath,
                              method: 'put',
                              url: "https://" + target.api_key + ":" + target.password + "@" + target.domain + ".myshopify.com/admin/pages/" + page.id + ".json",
                              json: {
                                page: {
                                  id: page.id,
                                  body_html: data.toString('utf8')
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
                              lineno: 68
                            }));
                            __iced_deferrals._fulfill();
                          })(__iced_k);
                        });
                      } else {
                        return __iced_k(console.log(colors.red("Page with handle " + fileHandle + " was not found in shop for " + filepath)));
                      }
                    })(__iced_k);
                  } else {
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
                        lineno: 74
                      }));
                      __iced_deferrals._fulfill();
                    })(function() {
                      (function(__iced_k) {
                        __iced_deferrals = new iced.Deferrals(__iced_k, {
                          parent: ___iced_passed_deferral1,
                          filename: "lib/upload.iced"
                        });
                        helpers.shopifyRequest({
                          filepath: filepath,
                          method: 'put',
                          url: "https://" + target.api_key + ":" + target.password + "@" + target.domain + ".myshopify.com/admin/themes/" + target.theme_id + "/assets.json",
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
                          lineno: 85
                        }));
                        __iced_deferrals._fulfill();
                      })(function() {
                        return __iced_k(err != null ? console.log(err) : void 0);
                      });
                    });
                  }
                });
              })(this)((function(_this) {
                return function() {
                  if (typeof err === "undefined" || err === null) {
                    return console.log(colors.green("Uploaded " + filepath));
                  }
                };
              })(this));
            });
          });
        });
      };
    })(this));
  };

}).call(this);
