(function() {
  var HELPTEXT, colors, iced, inquirer, _, __iced_k, __iced_k_noop;

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  _ = require('lodash');

  inquirer = require("inquirer");

  colors = require('colors');

  HELPTEXT = "\nQuickshot Download\n==============================\n\nUsage:\n  quickshot download [options]\n";

  exports.run = function(argv, done) {
    var answer, confMessage, directClone, omitTables, pickTables, sHost, sourceDB, sourceHost, sourcePort, tHost, targetDB, targetHost, targetPort, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    sHost = argv.sh != null ? argv.sh : argv.sh = argv.sourceHost ? argv.sourceHost : 'localhost:28015';
    tHost = argv.th != null ? argv.th : argv.th = argv.targetHost ? argv.targetHost : 'localhost:28015';
    sourceHost = _.first(sHost.split(':'));
    targetHost = _.first(tHost.split(':'));
    sourcePort = Number(_.last(sHost.split(':'))) || 28015;
    targetPort = Number(_.last(tHost.split(':'))) || 28015;
    sourceDB = argv.sd != null ? argv.sd : argv.sd = argv.sourceDB ? argv.sourceDB : null;
    targetDB = argv.td != null ? argv.td : argv.td = argv.targetDB ? argv.targetDB : null;
    pickTables = argv.pt != null ? argv.pt : argv.pt = argv.pickTables ? argv.pickTables : null;
    omitTables = argv.ot != null ? argv.ot : argv.ot = argv.omitTables ? argv.omitTables : null;
    if (pickTables != null) {
      pickTables = pickTables.split(',');
    }
    if (omitTables != null) {
      omitTables = omitTables.split(',');
    }
    if (argv.h || argv.help) {
      console.log(HELPTEXT);
      return done();
    }
    if ((pickTables != null) && (omitTables != null)) {
      console.log("pickTables and omitTables are mutually exclusive options.");
      return done();
    }
    if (!((sourceDB != null) && (targetDB != null))) {
      console.log("Source and target databases are required!");
      console.log(HELPTEXT);
      return done();
    }
    if (("" + sourceHost + ":" + sourcePort) === ("" + targetHost + ":" + targetPort) && sourceDB === targetDB) {
      console.log("Source and target databases must be different if cloning on same server!");
      return done();
    }
    if (!_.contains(dbList, sourceDB)) {
      console.log("Source DB does not exist!");
      return done();
    }
    if ((pickTables != null) && !_.every(pickTables, function(table) {
      return _.contains(sourceTableList, table);
    })) {
      console.log(colors.red("Not all the tables specified in --pickTables exist!"));
      return done();
    }
    if ((omitTables != null) && !_.every(omitTables, function(table) {
      return _.contains(sourceTableList, table);
    })) {
      console.log(colors.red("Not all the tables specified in --omitTables exist!"));
      return done();
    }
    directClone = ("" + sourceHost + ":" + sourcePort) === ("" + targetHost + ":" + targetPort);
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "lib/download.iced",
          funcname: "run"
        });
        confMessage = "" + (colors.green("Ready to clone!")) + "\nThe database '" + (colors.yellow("" + sourceDB)) + "' on '" + (colors.yellow("" + sourceHost)) + ":" + (colors.yellow("" + sourcePort)) + "' will be cloned to the '" + (colors.yellow("" + targetDB)) + "' database on '" + (colors.yellow("" + targetHost)) + ":" + (colors.yellow("" + targetPort)) + "'\nThis will destroy(drop & create) the '" + (colors.yellow("" + targetDB)) + "' database on '" + (colors.yellow("" + targetHost)) + ":" + (colors.yellow("" + targetPort)) + "' if it exists!\n";
        if (pickTables != null) {
          confMessage += "ONLY the following tables will be copied: " + (colors.yellow("" + (pickTables.join(',')))) + "\n";
        }
        if (omitTables != null) {
          confMessage += "The following tables will NOT be copied: " + (colors.yellow("" + (omitTables.join(',')))) + "\n";
        }
        if (directClone) {
          confMessage += "Source RethinkDB Server is same as target. Cloning locally on server(this is faster).";
        } else {
          confMessage += "Source and target databases are on different servers. Cloning over network.";
        }
        console.log(confMessage);
        inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirmed',
            message: "Proceed?",
            "default": false
          }
        ], __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return answer = arguments[0];
            };
          })(),
          lineno: 100
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        if (!answer.confirmed) {
          console.log(colors.red("ABORT!"));
          return done();
        }
      };
    })(this));
  };

}).call(this);
