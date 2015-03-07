(function() {
  var HELPTEXT, colors, fs, helpers, iced, inquirer, mfs, _, __iced_k, __iced_k_noop;

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  _ = require('lodash');

  inquirer = require("inquirer");

  colors = require('colors');

  fs = require('fs');

  helpers = require('./helpers');

  mfs = require('machinepack-fs');

  HELPTEXT = "\nQuickshot New\n==============================\nCreate a new shopify theme project, and configures shopify sync.\n\nUsage:\n  quickshot new shop              Connect to shop and create project directory\n";

  exports.run = function(argv, done) {
    var cb, command, config, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    command = _.first(argv['_']);
    argv['_'] = argv['_'].slice(1);
    switch (command) {
      case "shop":
        (function(_this) {
          return (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "lib/new.iced",
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
              lineno: 45
            }));
            __iced_deferrals._fulfill();
          });
        })(this)((function(_this) {
          return function() {
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "lib/new.iced",
                funcname: "run"
              });
              cb = __iced_deferrals.defer({
                lineno: 48
              });
              mfs.mkdir({
                destination: "./" + config.domain
              }).exec({
                error: done,
                success: function() {
                  return cb();
                }
              });
              __iced_deferrals._fulfill();
            })(function() {
              return __iced_k(mfs.writeJson({
                json: config,
                destination: "./" + config.domain + "/quickshot.json"
              }).exec({
                error: function(err) {
                  console.log(colors.red(err));
                  return done();
                },
                success: function() {
                  console.log(colors.green("Configuration saved!"));
                  return done();
                }
              }));
            });
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
