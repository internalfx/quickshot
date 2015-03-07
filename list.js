(function() {
  var HELPTEXT, colors, fs, helpers, iced, inquirer, request, _, __iced_k, __iced_k_noop;

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  helpers = require('./helpers');

  _ = require('lodash');

  inquirer = require("inquirer");

  colors = require('colors');

  fs = require('fs');

  request = require('request');

  HELPTEXT = "\nQuickshot List\n==============================\n\nUsage:\n  quickshot list themes         View available themes for the current shop\n";

  exports.run = function(argv, done) {
    var body, command, config, err, output, res, theme, themes, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    command = _.first(argv['_']);
    argv['_'] = argv['_'].slice(1);
    switch (command) {
      case "themes":
        (function(_this) {
          return (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "lib/list.iced",
              funcname: "run"
            });
            helpers.loadConfig(__iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  err = arguments[0];
                  return config = arguments[1];
                };
              })(),
              lineno: 25
            }));
            __iced_deferrals._fulfill();
          });
        })(this)((function(_this) {
          return function() {
            if (typeof err !== "undefined" && err !== null) {
              done(err);
            }
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "lib/list.iced",
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
                lineno: 30
              }));
              __iced_deferrals._fulfill();
            })(function() {
              var _i, _len;
              if (typeof err !== "undefined" && err !== null) {
                done(err);
              }
              output = "\nCurrently Installed Themes\n==============================\n\n\nTheme name  |  Theme ID  |  Theme role  |  Date last updated\n---------------------------------------------------------\n";
              themes = JSON.parse(body).themes;
              if (_.isArray(themes)) {
                for (_i = 0, _len = themes.length; _i < _len; _i++) {
                  theme = themes[_i];
                  output += "" + theme.name + "  |  " + theme.id + "  |  " + theme.role + "  |  " + theme.updated_at + "\n";
                }
              }
              output += "\n";
              return __iced_k(console.log(output));
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
