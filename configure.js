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
    var body, choices, config, currConfig, domain, err, projDir, res, scss_warning, theme, themes, ___iced_passed_deferral, __iced_deferrals, __iced_k;
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
                  name: 'compile_sass',
                  message: "Would you like to enable automatic compiling for scss files?",
                  "default": (typeof currConfig !== "undefined" && currConfig !== null ? currConfig.compile_sass : void 0) || false
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
              config.compile_sass = choices.compile_sass;
              scss_warning = "You have enabled scss compiling.\n\nThe filename you enter below will be recompiled anytime ANY scss file changes while using 'quickshot watch'.\nYou will want to put all your @import calls in that file. Then in your theme.liquid you will only need to include the compiled css file.\nSee docs at https://github.com/internalfx/quickshot for more information.";
              (function(__iced_k) {
                if (config.compile_sass) {
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
                      lineno: 85
                    }));
                    __iced_deferrals._fulfill();
                  })(function() {
                    return __iced_k(config.primary_scss_file = choices.primary_scss_file);
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
