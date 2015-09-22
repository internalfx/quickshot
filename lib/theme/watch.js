(function() {
  var babel, chokidar, coffee, colors, fs, helpers, iced, inquirer, mkdirp, parser, path, request, sass, __iced_k, __iced_k_noop;

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

  coffee = require('coffee-script');

  babel = require('babel-core');

  exports.run = function(argv, done) {
    var config, err, ignore, pages, target, watcher, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "src/theme/watch.iced",
          funcname: "run"
        });
        helpers.loadConfig(__iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              err = arguments[0];
              return config = arguments[1];
            };
          })(),
          lineno: 17
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
            filename: "src/theme/watch.iced",
            funcname: "run"
          });
          helpers.getTarget(config, argv, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                return target = arguments[1];
              };
            })(),
            lineno: 23
          }));
          __iced_deferrals._fulfill();
        })(function() {
          if (typeof err !== "undefined" && err !== null) {
            return done(err);
          }
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "src/theme/watch.iced",
              funcname: "run"
            });
            helpers.getShopPages(target, __iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  err = arguments[0];
                  return pages = arguments[1];
                };
              })(),
              lineno: 26
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
              cwd: path.join(process.cwd(), 'theme')
            });
            watcher.on('all', function(event, filepath) {
              var assetsBody, compiledSource, data, err, extension, mainscss, res, result, source, sourceBabel, sourceCoffee, targetscss, ___iced_passed_deferral1, __iced_deferrals, __iced_k;
              __iced_k = __iced_k_noop;
              ___iced_passed_deferral1 = iced.findDeferral(arguments);
              extension = path.extname(filepath).substr(1);
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
                  (function(_this) {
                    return (function(__iced_k) {
                      if (config.compile_scss && filepath.match(/\.scss$/)) {
                        mainscss = config.primary_scss_file;
                        targetscss = mainscss.replace('.scss', '.css.liquid');
                        helpers.log("Compiling Sass: \"" + mainscss + "\" -> \"" + targetscss + "\"", 'yellow');
                        (function(__iced_k) {
                          __iced_deferrals = new iced.Deferrals(__iced_k, {
                            parent: ___iced_passed_deferral1,
                            filename: "src/theme/watch.iced"
                          });
                          sass.render({
                            file: path.join('theme', mainscss),
                            outFile: path.join('theme', targetscss)
                          }, __iced_deferrals.defer({
                            assign_fn: (function() {
                              return function() {
                                err = arguments[0];
                                return result = arguments[1];
                              };
                            })(),
                            lineno: 61
                          }));
                          __iced_deferrals._fulfill();
                        })(function() {
                          if (err != null) {
                            done(err);
                          }
                          (function(__iced_k) {
                            __iced_deferrals = new iced.Deferrals(__iced_k, {
                              parent: ___iced_passed_deferral1,
                              filename: "src/theme/watch.iced"
                            });
                            fs.writeFile(path.join('theme', targetscss), result.css, __iced_deferrals.defer({
                              assign_fn: (function() {
                                return function() {
                                  return err = arguments[0];
                                };
                              })(),
                              lineno: 63
                            }));
                            __iced_deferrals._fulfill();
                          })(function() {
                            return __iced_k(err != null ? done(err) : void 0);
                          });
                        });
                      } else {
                        return __iced_k();
                      }
                    });
                  })(this)((function(_this) {
                    return function() {
                      (function(__iced_k) {
                        if (config.compile_coffeescript && filepath.match(/\.coffee$/)) {
                          sourceCoffee = path.join('theme', filepath);
                          helpers.log("Compiling CoffeeScript: \"" + filepath + "\"", 'yellow');
                          (function(__iced_k) {
                            __iced_deferrals = new iced.Deferrals(__iced_k, {
                              parent: ___iced_passed_deferral1,
                              filename: "src/theme/watch.iced"
                            });
                            fs.readFile(sourceCoffee, 'utf8', __iced_deferrals.defer({
                              assign_fn: (function() {
                                return function() {
                                  err = arguments[0];
                                  return source = arguments[1];
                                };
                              })(),
                              lineno: 69
                            }));
                            __iced_deferrals._fulfill();
                          })(function() {
                            if (err != null) {
                              done(err);
                            }
                            compiledSource = coffee.compile(source);
                            (function(__iced_k) {
                              __iced_deferrals = new iced.Deferrals(__iced_k, {
                                parent: ___iced_passed_deferral1,
                                filename: "src/theme/watch.iced"
                              });
                              fs.writeFile(sourceCoffee.replace('.coffee', '.js'), compiledSource, __iced_deferrals.defer({
                                assign_fn: (function() {
                                  return function() {
                                    return err = arguments[0];
                                  };
                                })(),
                                lineno: 72
                              }));
                              __iced_deferrals._fulfill();
                            })(function() {
                              return __iced_k(err != null ? done(err) : void 0);
                            });
                          });
                        } else {
                          return __iced_k();
                        }
                      })(function() {
                        (function(__iced_k) {
                          if (config.compile_babel && filepath.match(/\.(jsx|es6)$/)) {
                            sourceBabel = path.join('theme', filepath);
                            helpers.log("Compiling Babel: \"" + filepath + "\"", 'yellow');
                            (function(__iced_k) {
                              __iced_deferrals = new iced.Deferrals(__iced_k, {
                                parent: ___iced_passed_deferral1,
                                filename: "src/theme/watch.iced"
                              });
                              fs.readFile(sourceBabel, 'utf8', __iced_deferrals.defer({
                                assign_fn: (function() {
                                  return function() {
                                    err = arguments[0];
                                    return source = arguments[1];
                                  };
                                })(),
                                lineno: 78
                              }));
                              __iced_deferrals._fulfill();
                            })(function() {
                              if (err != null) {
                                return helpers.log(err, 'red');
                              }
                              try {
                                compiledSource = babel.transform(source, {
                                  modules: 'umd'
                                });
                              } catch (_error) {
                                err = _error;
                                helpers.log(err, 'red');
                              }
                              (function(__iced_k) {
                                if (compiledSource) {
                                  (function(__iced_k) {
                                    __iced_deferrals = new iced.Deferrals(__iced_k, {
                                      parent: ___iced_passed_deferral1,
                                      filename: "src/theme/watch.iced"
                                    });
                                    fs.writeFile(sourceBabel.replace(/\.(jsx|es6)$/, '.js'), compiledSource.code, __iced_deferrals.defer({
                                      assign_fn: (function() {
                                        return function() {
                                          return err = arguments[0];
                                        };
                                      })(),
                                      lineno: 85
                                    }));
                                    __iced_deferrals._fulfill();
                                  })(function() {
                                    if (err != null) {
                                      return helpers.log(err, 'red');
                                    }
                                    return __iced_k();
                                  });
                                } else {
                                  return __iced_k();
                                }
                              })(__iced_k);
                            });
                          } else {
                            return __iced_k();
                          }
                        })(function() {
                          (function(__iced_k) {
                            __iced_deferrals = new iced.Deferrals(__iced_k, {
                              parent: ___iced_passed_deferral1,
                              filename: "src/theme/watch.iced"
                            });
                            fs.readFile(path.join('theme', filepath), __iced_deferrals.defer({
                              assign_fn: (function() {
                                return function() {
                                  err = arguments[0];
                                  return data = arguments[1];
                                };
                              })(),
                              lineno: 88
                            }));
                            __iced_deferrals._fulfill();
                          })(function() {
                            if (typeof err !== "undefined" && err !== null) {
                              helpers.log(err, 'red');
                            }
                            (function(__iced_k) {
                              __iced_deferrals = new iced.Deferrals(__iced_k, {
                                parent: ___iced_passed_deferral1,
                                filename: "src/theme/watch.iced"
                              });
                              helpers.shopifyRequest({
                                filepath: filepath.split(path.sep).join('/'),
                                method: 'put',
                                url: "https://" + target.api_key + ":" + target.password + "@" + target.domain + ".myshopify.com/admin/themes/" + target.theme_id + "/assets.json",
                                json: {
                                  asset: {
                                    key: filepath.split(path.sep).join('/'),
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
                                lineno: 100
                              }));
                              __iced_deferrals._fulfill();
                            })(function() {
                              if (typeof err !== "undefined" && err !== null) {
                                helpers.log(err, 'red');
                              }
                              return __iced_k(typeof err === "undefined" || err === null ? helpers.log("Added/Updated " + filepath, 'green') : void 0);
                            });
                          });
                        });
                      });
                    };
                  })(this));
                  break;
                case 'unlink':
                  (function(_this) {
                    return (function(__iced_k) {
                      __iced_deferrals = new iced.Deferrals(__iced_k, {
                        parent: ___iced_passed_deferral1,
                        filename: "src/theme/watch.iced"
                      });
                      helpers.shopifyRequest({
                        method: 'delete',
                        url: "https://" + target.api_key + ":" + target.password + "@" + target.domain + ".myshopify.com/admin/themes/" + target.theme_id + "/assets.json",
                        qs: {
                          asset: {
                            key: filepath.split(path.sep).join('/')
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
                        lineno: 112
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
            return helpers.log("Watching Theme...");
          });
        });
      };
    })(this));
  };

}).call(this);
