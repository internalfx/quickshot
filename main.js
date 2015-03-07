(function() {
  var HELPTEXT, colors, iced, _, __iced_k, __iced_k_noop;

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  _ = require('lodash');

  colors = require('colors');

  HELPTEXT = "\nQuickshot " + VERSION + "\n==============================\n\nCommands:\n  quickshot new\n  quickshot download\n  quickshot list\n  quickshot --help        Show this screen.\n";

  exports.run = function(argv) {
    var command, err, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    command = _.first(argv['_']);
    argv['_'] = argv['_'].slice(1);
    (function(_this) {
      return (function(__iced_k) {
        switch (command) {
          case "new":
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "lib/main.iced",
                funcname: "run"
              });
              require('./new').run(argv, __iced_deferrals.defer({
                assign_fn: (function() {
                  return function() {
                    return err = arguments[0];
                  };
                })(),
                lineno: 24
              }));
              __iced_deferrals._fulfill();
            })(__iced_k);
            break;
          case "download":
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "lib/main.iced",
                funcname: "run"
              });
              require('./download').run(argv, __iced_deferrals.defer({
                assign_fn: (function() {
                  return function() {
                    return err = arguments[0];
                  };
                })(),
                lineno: 26
              }));
              __iced_deferrals._fulfill();
            })(__iced_k);
            break;
          case "list":
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "lib/main.iced",
                funcname: "run"
              });
              require('./list').run(argv, __iced_deferrals.defer({
                assign_fn: (function() {
                  return function() {
                    return err = arguments[0];
                  };
                })(),
                lineno: 28
              }));
              __iced_deferrals._fulfill();
            })(__iced_k);
            break;
          default:
            return __iced_k(console.log(HELPTEXT));
        }
      });
    })(this)((function(_this) {
      return function() {
        if (typeof err !== "undefined" && err !== null) {
          console.log(colors.red(err));
        }
        return process.exit();
      };
    })(this));
  };

}).call(this);
