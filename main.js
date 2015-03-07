(function() {
  var HELPTEXT, iced, _, __iced_k, __iced_k_noop;

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  _ = require('lodash');

  HELPTEXT = "\nQuickshot " + VERSION + "\n==============================\n\nCommands:\n  quickshot config\n  quickshot download\n  quickshot --help        Show this screen.\n";

  exports.run = function(argv) {
    var command, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    command = _.first(argv['_']);
    argv['_'] = argv['_'].slice(1);
    (function(_this) {
      return (function(__iced_k) {
        switch (command) {
          case "config":
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "lib/main.iced",
                funcname: "run"
              });
              require('./config').run(argv, __iced_deferrals.defer({
                lineno: 22
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
                lineno: 24
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
        return process.exit();
      };
    })(this));
  };

}).call(this);
