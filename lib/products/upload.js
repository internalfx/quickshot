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
    var config, err, filter, ignore, pages, target, walker, ___iced_passed_deferral, __iced_deferrals, __iced_k;
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
          if (typeof err !== "undefined" && err !== null) {
            return done(err);
          }
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "src/products/upload.iced",
              funcname: "run"
            });
            helpers.getShopPages(target, __iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  err = arguments[0];
                  return pages = arguments[1];
                };
              })(),
              lineno: 25
            }));
            __iced_deferrals._fulfill();
          })(function() {
            if (typeof err !== "undefined" && err !== null) {
              return done(err);
            }
            walker = walk.walk(path.join(process.cwd(), 'pages'), {
              followLinks: false
            });
            return walker.on("file", function(root, fileStat, next) {
              var assetsBody, err, extension, fileContent, fileHandle, filepath, page, res, ___iced_passed_deferral1, __iced_deferrals, __iced_k;
              __iced_k = __iced_k_noop;
              ___iced_passed_deferral1 = iced.findDeferral(arguments);
              filepath = path.join(root, fileStat.name).replace(process.cwd() + "/", "");
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
              fileHandle = path.basename(filepath, '.html');
              page = _.find(pages, {
                handle: fileHandle
              });
              (function(_this) {
                return (function(__iced_k) {
                  __iced_deferrals = new iced.Deferrals(__iced_k, {
                    parent: ___iced_passed_deferral1,
                    filename: "src/products/upload.iced"
                  });
                  fs.readFile(filepath, __iced_deferrals.defer({
                    assign_fn: (function() {
                      return function() {
                        err = arguments[0];
                        return fileContent = arguments[1];
                      };
                    })(),
                    lineno: 53
                  }));
                  __iced_deferrals._fulfill();
                });
              })(this)((function(_this) {
                return function() {
                  (function(__iced_k) {
                    if (page) {
                      (function(__iced_k) {
                        __iced_deferrals = new iced.Deferrals(__iced_k, {
                          parent: ___iced_passed_deferral1,
                          filename: "src/products/upload.iced"
                        });
                        helpers.shopifyRequest({
                          filepath: filepath,
                          method: 'put',
                          url: "https://" + target.api_key + ":" + target.password + "@" + target.domain + ".myshopify.com/admin/pages/" + page.id + ".json",
                          json: {
                            page: {
                              id: page.id,
                              body_html: fileContent.toString('utf8')
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
                          lineno: 66
                        }));
                        __iced_deferrals._fulfill();
                      })(__iced_k);
                    } else {
                      (function(__iced_k) {
                        __iced_deferrals = new iced.Deferrals(__iced_k, {
                          parent: ___iced_passed_deferral1,
                          filename: "src/products/upload.iced"
                        });
                        helpers.shopifyRequest({
                          filepath: filepath,
                          method: 'post',
                          url: "https://" + target.api_key + ":" + target.password + "@" + target.domain + ".myshopify.com/admin/pages.json",
                          json: {
                            page: {
                              title: _.startCase(fileHandle),
                              body_html: fileContent.toString('utf8'),
                              handle: fileHandle
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
                          lineno: 79
                        }));
                        __iced_deferrals._fulfill();
                      })(function() {
                        return __iced_k(console.log(colors.yellow("Created new Page with handle " + fileHandle + "...")));
                      });
                    }
                  })(function() {
                    if (typeof err === "undefined" || err === null) {
                      return console.log(colors.green("Uploaded " + filepath));
                    }
                  });
                };
              })(this));
            });
          });
        });
      };
    })(this));
  };

}).call(this);
