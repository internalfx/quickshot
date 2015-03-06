(function() {
  var HELPTEXT, colors, config, fs, iced, inquirer, _, __iced_k, __iced_k_noop;

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  _ = require('lodash');

  inquirer = require("inquirer");

  colors = require('colors');

  config = require('config');

  fs = require('fs');

  HELPTEXT = "\nQuickshot Config\n==============================\nCreate a new shopify theme project, and configures shopify sync.\n\nUsage:\n  quickshot config                  Create new project.\n  quickshot config -h | --help      Show this screen.\n";

  exports.run = function(argv, done) {
    var answers, err, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    if (argv.h || argv.help) {
      console.log(HELPTEXT);
      return done();
    }
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
              return answers = arguments[0];
            };
          })(),
          lineno: 45
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        console.log(answers);
        (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "lib/config.iced",
            funcname: "run"
          });
          fs.writeFile('./config.json', JSON.stringify(answers), __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                return err = arguments[0];
              };
            })(),
            lineno: 49
          }));
          __iced_deferrals._fulfill();
        })(function() {
          return done();
        });
      };
    })(this));
  };

}).call(this);
