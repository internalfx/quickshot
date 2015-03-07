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
    var body, command, config, err, res, theme, themeSelection, themes, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    command = _.first(argv['_']);
    argv['_'] = argv['_'].slice(1);
    (function(_this) {
      return (function(__iced_k) {
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
            "default": null
          }, {
            type: 'input',
            name: 'password',
            message: "Shopify Private APP Password?",
            "default": null
          }, {
            type: 'input',
            name: 'domain',
            message: "Shopify Domain? If your store is at 'https://your-domain.myshopify.com/' enter 'your-domain'.",
            "default": null
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
      });
    })(this)((function(_this) {
      return function() {
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
            lineno: 38
          }));
          __iced_deferrals._fulfill();
        })(function() {
          if (typeof err !== "undefined" && err !== null) {
            done(err);
          }
          themes = JSON.parse(body).themes;
          (function(__iced_k) {
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
                "default": null,
                choices: _.map(themes, function(theme) {
                  return theme.name;
                })
              }
            ], __iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  return themeSelection = arguments[0];
                };
              })(),
              lineno: 51
            }));
            __iced_deferrals._fulfill();
          })(function() {
            theme = _.find(themes, {
              name: themeSelection.theme
            });
            config.theme_id = theme.id;
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
      };
    })(this));
  };

}).call(this);
