(function() {
  var HELPTEXT, colors, iced, __iced_k, __iced_k_noop;

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  colors = require('colors');

  HELPTEXT = "\nQuickshot " + VERSION + "\n==============================\n\nCommands:\n  quickshot configure              Creates/Updates the configuration file in current directory\n  quickshot download [filter]      Download theme files, optionally providing a filter\n  quickshot upload [filter]        Upload theme files, optionally providing a filter\n  quickshot watch                  Watch project folder and synchronize changes automatically\n  quickshot                        Show this screen.\n";

  exports.run = function(argv) {
    var command, err, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    command = _.first(argv['_']);
    argv['_'] = argv['_'].slice(1);
    (function(_this) {
      return (function(__iced_k) {
        switch (command) {
          case "configure":
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "src/main.iced",
                funcname: "run"
              });
              require('./configure').run(argv, __iced_deferrals.defer({
                assign_fn: (function() {
                  return function() {
                    return err = arguments[0];
                  };
                })(),
                lineno: 22
              }));
              __iced_deferrals._fulfill();
            })(__iced_k);
            break;
          case "download":
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "src/main.iced",
                funcname: "run"
              });
              require('./download').run(argv, __iced_deferrals.defer({
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
          case "upload":
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "src/main.iced",
                funcname: "run"
              });
              require('./upload').run(argv, __iced_deferrals.defer({
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
          case "watch":
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "src/main.iced",
                funcname: "run"
              });
              require('./watch').run(argv, __iced_deferrals.defer({
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
