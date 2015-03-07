(function() {
  var HELPTEXT, colors, fs, helpers, iced, inquirer, _, __iced_k, __iced_k_noop;

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  _ = require('lodash');

  inquirer = require("inquirer");

  colors = require('colors');

  fs = require('fs');

  helpers = require('./helpers');

  HELPTEXT = "\nQuickshot Config\n==============================\nCreate a new shopify theme project, and configures shopify sync.\n\nUsage:\n  quickshot config edit             Create/edit config file\n  quickshot congig show             Show current config\n  quickshot config --help           Show this screen\n";

  exports.run = function(argv, done) {
    var command, config, err, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    command = _.first(argv['_']);
    argv['_'] = argv['_'].slice(1);
    switch (command) {
      case "edit":
        (function(_this) {
          return (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "lib/config.iced",
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
              lineno: 46
            }));
            __iced_deferrals._fulfill();
          });
        })(this)((function(_this) {
          return function() {
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "lib/config.iced",
                funcname: "run"
              });
              fs.writeFile('./config.json', JSON.stringify(config), __iced_deferrals.defer({
                assign_fn: (function() {
                  return function() {
                    return err = arguments[0];
                  };
                })(),
                lineno: 47
              }));
              __iced_deferrals._fulfill();
            })(function() {
              if (typeof err !== "undefined" && err !== null) {
                console.log(colors.red(err));
              }
              console.log("CONFIGURATION FILE WRITTEN");
              return done();
              return __iced_k();
            });
          };
        })(this));
        break;
      case "show":
        (function(_this) {
          return (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "lib/config.iced",
              funcname: "run"
            });
            helpers.loadConfig(__iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  err = arguments[0];
                  return config = arguments[1];
                };
              })(),
              lineno: 52
            }));
            __iced_deferrals._fulfill();
          });
        })(this)((function(_this) {
          return function() {
            if (err != null) {
              console.log(colors.red(err));
            }
            console.log(colors.cyan("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"));
            console.log(config);
            console.log(colors.cyan("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"));
            return done();
            return __iced_k();
          };
        })(this));
        break;
      default:
        console.log(HELPTEXT);
        return done();
        return __iced_k();
    }
  };

}).call(this);
