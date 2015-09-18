(function() {
  var chokidar, colors, fs, helpers, iced, inquirer, mkdirp, parser, path, request, sass, __iced_k, __iced_k_noop;

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  helpers = require('../helpers');

  chokidar = require('chokidar');

  inquirer = require('inquirer');

  colors = require('colors');

  fs = require('fs');

  path = require('path');

  request = require('request');

  mkdirp = require('mkdirp');

  sass = require('node-sass');

  parser = require('gitignore-parser');

  exports.run = function(argv, done) {
    var config, err, ignore, pages, target, watcher, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "src/pages/watch.iced",
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
            filename: "src/pages/watch.iced",
            funcname: "run"
          });
          helpers.getTarget(config, argv, __iced_deferrals.defer({
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
              filename: "src/pages/watch.iced",
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
            watcher = chokidar.watch('./', {
              ignored: /[\/\\]\./,
              persistent: true,
              ignoreInitial: true,
              usePolling: true,
              interval: 250,
              binaryInterval: 250,
              cwd: path.join(process.cwd(), 'pages')
            });
            watcher.on('all', function(event, filepath) {
              var assetsBody, data, err, extension, fileHandle, page, res, ___iced_passed_deferral1, __iced_deferrals, __iced_k;
              __iced_k = __iced_k_noop;
              ___iced_passed_deferral1 = iced.findDeferral(arguments);
              extension = path.extname(filepath).substr(1);
              filepath = path.join('pages', filepath);
              if (filepath.match(/^\..*$/)) {
                return;
              }
              if (config.ignore_file) {
                if (ignore.denies(filepath)) {
                  return;
                }
              }
              switch (event) {
                case 'add':
                case 'change':
                  if (filepath.match(/[\(\)]/)) {
                    return helpers.log("Filename may not contain parentheses, please rename - \"" + filepath + "\"", 'red');
                  }
                  fileHandle = path.basename(filepath, '.html');
                  page = _.find(pages, {
                    handle: fileHandle
                  });
                  if (!page) {
                    return helpers.log("Page with handle " + fileHandle + " was not found in shop for " + filepath, 'red');
                  }
                  (function(_this) {
                    return (function(__iced_k) {
                      __iced_deferrals = new iced.Deferrals(__iced_k, {
                        parent: ___iced_passed_deferral1,
                        filename: "src/pages/watch.iced"
                      });
                      fs.readFile(filepath, __iced_deferrals.defer({
                        assign_fn: (function() {
                          return function() {
                            err = arguments[0];
                            return data = arguments[1];
                          };
                        })(),
                        lineno: 61
                      }));
                      __iced_deferrals._fulfill();
                    });
                  })(this)((function(_this) {
                    return function() {
                      (function(__iced_k) {
                        __iced_deferrals = new iced.Deferrals(__iced_k, {
                          parent: ___iced_passed_deferral1,
                          filename: "src/pages/watch.iced"
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
                          lineno: 72
                        }));
                        __iced_deferrals._fulfill();
                      })(function() {
                        return __iced_k(typeof err === "undefined" || err === null ? helpers.log("Added/Updated " + filepath, 'green') : void 0);
                      });
                    };
                  })(this));
                  break;
                case 'unlink':
                  (function(_this) {
                    return (function(__iced_k) {
                      __iced_deferrals = new iced.Deferrals(__iced_k, {
                        parent: ___iced_passed_deferral1,
                        filename: "src/pages/watch.iced"
                      });
                      helpers.shopifyRequest({
                        method: 'delete',
                        url: "https://" + target.api_key + ":" + target.password + "@" + target.domain + ".myshopify.com/admin/themes/" + target.theme_id + "/assets.json",
                        qs: {
                          asset: {
                            key: filepath
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
                        lineno: 83
                      }));
                      __iced_deferrals._fulfill();
                    });
                  })(this)((function(_this) {
                    return function() {
                      if (err != null) {
                        helpers.log(err, 'red');
                      }
                      return __iced_k(helpers.log("Deleted " + filepath, 'green'));
                    };
                  })(this));
                  break;
                default:
                  return __iced_k();
              }
            });
            return helpers.log("Watching Pages...");
          });
        });
      };
    })(this));
  };

}).call(this);
