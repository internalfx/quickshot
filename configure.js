(function() {
  var colors, fs, helpers, iced, inquirer, mfs, request, __iced_k, __iced_k_noop;

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  helpers = require('./helpers');

  inquirer = require("inquirer");

  colors = require('colors');

  fs = require('fs');

  mfs = require('machinepack-fs');

  request = require('request');

  exports.run = function(argv, done) {
    var body, choices, config, currConfig, data, domain, err, notes, projDir, res, scss_warning, theme, themes, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "lib/configure.iced",
          funcname: "run"
        });
        helpers.loadConfig(__iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              err = arguments[0];
              currConfig = arguments[1];
              return projDir = arguments[2];
            };
          })(),
          lineno: 11
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "lib/configure.iced",
            funcname: "run"
          });
          inquirer.prompt([
            {
              type: 'input',
              name: 'api_key',
              message: "Shopify Private APP API key?",
              "default": (typeof currConfig !== "undefined" && currConfig !== null ? currConfig.api_key : void 0) || null
            }, {
              type: 'input',
              name: 'password',
              message: "Shopify Private APP Password?",
              "default": (typeof currConfig !== "undefined" && currConfig !== null ? currConfig.password : void 0) || null
            }, {
              type: 'input',
              name: 'domain',
              message: "Store URL?",
              "default": (typeof currConfig !== "undefined" && currConfig !== null ? currConfig.domain : void 0) || null
            }
          ], __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                return config = arguments[0];
              };
            })(),
            lineno: 32
          }));
          __iced_deferrals._fulfill();
        })(function() {
          domain = config.domain;
          domain = domain.replace(new RegExp('^https?://'), '');
          domain = domain.replace(new RegExp('\.myshopify\.com.*'), '');
          config.domain = domain;
          console.log(colors.green("\nShop credentials set! Fetching themes...\n"));
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "lib/configure.iced",
              funcname: "run"
            });
            request({
              method: 'get',
              url: "https://" + config.api_key + ":" + config.password + "@" + config.domain + ".myshopify.com/admin/themes.json"
            }, __iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  err = arguments[0];
                  res = arguments[1];
                  return body = arguments[2];
                };
              })(),
              lineno: 43
            }));
            __iced_deferrals._fulfill();
          })(function() {
            if (typeof err !== "undefined" && err !== null) {
              done(err);
            }
            themes = JSON.parse(body).themes;
            (function(__iced_k) {
              var _ref;
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "lib/configure.iced",
                funcname: "run"
              });
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'theme',
                  message: "Select theme",
                  "default": ((_ref = _.find(themes, {
                    id: typeof currConfig !== "undefined" && currConfig !== null ? currConfig.theme_id : void 0
                  })) != null ? _ref.name : void 0) || null,
                  choices: _.map(themes, function(theme) {
                    return theme.name;
                  })
                }, {
                  type: 'confirm',
                  name: 'compile_scss',
                  message: "Would you like to enable automatic compiling for scss files?",
                  "default": (typeof currConfig !== "undefined" && currConfig !== null ? currConfig.compile_scss : void 0) || false
                }
              ], __iced_deferrals.defer({
                assign_fn: (function() {
                  return function() {
                    return choices = arguments[0];
                  };
                })(),
                lineno: 62
              }));
              __iced_deferrals._fulfill();
            })(function() {
              theme = _.find(themes, {
                name: choices.theme
              });
              config.theme_id = theme.id;
              config.compile_scss = choices.compile_scss;
              scss_warning = "You have enabled scss compiling.\n\nThe filename entered below will be recompiled anytime ANY scss file changes while using 'quickshot watch'.\nThe file will be created for you if it does not exist.\nYou will want to put all your @import calls in that file.\nThen in your theme.liquid you will only need to include the compiled css file.\n\nSee docs at https://github.com/internalfx/quickshot#autocompiling-scss for more information.";
              (function(__iced_k) {
                if (config.compile_scss) {
                  console.log(colors.yellow(scss_warning));
                  (function(__iced_k) {
                    __iced_deferrals = new iced.Deferrals(__iced_k, {
                      parent: ___iced_passed_deferral,
                      filename: "lib/configure.iced",
                      funcname: "run"
                    });
                    inquirer.prompt([
                      {
                        type: 'input',
                        name: 'primary_scss_file',
                        message: "Enter relative path to primary scss file.",
                        "default": (typeof currConfig !== "undefined" && currConfig !== null ? currConfig.primary_scss_file : void 0) || 'assets/application.scss',
                        choices: _.map(themes, function(theme) {
                          return theme.name;
                        })
                      }
                    ], __iced_deferrals.defer({
                      assign_fn: (function() {
                        return function() {
                          return choices = arguments[0];
                        };
                      })(),
                      lineno: 87
                    }));
                    __iced_deferrals._fulfill();
                  })(function() {
                    config.primary_scss_file = choices.primary_scss_file;
                    (function(__iced_k) {
                      __iced_deferrals = new iced.Deferrals(__iced_k, {
                        parent: ___iced_passed_deferral,
                        filename: "lib/configure.iced",
                        funcname: "run"
                      });
                      fs.readFile(config.primary_scss_file, __iced_deferrals.defer({
                        assign_fn: (function() {
                          return function() {
                            err = arguments[0];
                            return data = arguments[1];
                          };
                        })(),
                        lineno: 89
                      }));
                      __iced_deferrals._fulfill();
                    })(function() {
                      (function(__iced_k) {
                        if (typeof err !== "undefined" && err !== null) {
                          notes = "//  Sass extends the CSS @import rule to allow it to import SCSS and Sass files. All imported SCSS\n//  and Sass files will be merged together into a single CSS output file.\n//  In addition, any variables or mixins defined in imported files can be used in the main file.\n//  Sass looks for other Sass files in the current directory, and the Sass file directory under Rack, Rails, or Merb.\n//  Additional search directories may be specified using the :load_paths option, or the --load-path option on the command line.\n//  @import takes a filename to import. By default, it looks for a Sass file to import directly,\n//  but there are a few circumstances under which it will compile to a CSS @import rule:\n\n//    If the file’s extension is .css.\n//    If the filename begins with http://.\n//    If the filename is a url().\n//    If the @import has any media queries.\n\n//  If none of the above conditions are met and the extension is .scss or .sass, then the named Sass or SCSS file will be imported.\n//  If there is no extension, Sass will try to find a file with that name and the .scss or .sass extension and import it.\n\n//  For example,\n//    @import \"foo.scss\";\n\n//  or\n//    @import \"foo\";";
                          (function(__iced_k) {
                            __iced_deferrals = new iced.Deferrals(__iced_k, {
                              parent: ___iced_passed_deferral,
                              filename: "lib/configure.iced",
                              funcname: "run"
                            });
                            fs.writeFile(config.primary_scss_file, notes, __iced_deferrals.defer({
                              assign_fn: (function() {
                                return function() {
                                  return err = arguments[0];
                                };
                              })(),
                              lineno: 114
                            }));
                            __iced_deferrals._fulfill();
                          })(__iced_k);
                        } else {
                          return __iced_k();
                        }
                      })(__iced_k);
                    });
                  });
                } else {
                  return __iced_k();
                }
              })(function() {
                return mfs.writeJson({
                  json: config,
                  destination: "quickshot.json",
                  force: true
                }).exec({
                  error: function(err) {
                    console.log(colors.red(err));
                    return done();
                  },
                  success: function() {
                    console.log(colors.green("\nConfiguration saved!\n"));
                    return done();
                  }
                });
              });
            });
          });
        });
      };
    })(this));
  };

}).call(this);
