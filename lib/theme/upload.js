(function() {
  var colors, fs, helpers, iced, inquirer, mkdirp, parser, path, request, walk, __iced_k, __iced_k_noop;

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  helpers = require('../helpers');

  inquirer = require("inquirer");

  colors = require('colors');

  fs = require('fs');

  path = require('path');

  request = require('request');

  mkdirp = require('mkdirp');

  walk = require('walk');

  parser = require('gitignore-parser');

  exports.run = function(argv, done) {
    var config, err, filter, ignore, target, walker, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    filter = _.first(argv['_']);
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "src/theme/upload.iced",
          funcname: "run"
        });
        helpers.loadConfig(__iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              err = arguments[0];
              return config = arguments[1];
            };
          })(),
          lineno: 16
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        if (typeof err !== "undefined" && err !== null) {
          done(err);
        }
        if (config.ignore_file) {
          ignore = parser.compile(fs.readFileSync(config.ignore_file, 'utf8'));
        }
        (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "src/theme/upload.iced",
            funcname: "run"
          });
          helpers.getTarget(config, argv, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                return target = arguments[1];
              };
            })(),
            lineno: 22
          }));
          __iced_deferrals._fulfill();
        })(function() {
          if (typeof err !== "undefined" && err !== null) {
            return done(err);
          }
          walker = walk.walk(path.join(process.cwd(), 'theme'), {
            followLinks: false
          });
          return walker.on("file", function(root, fileStat, next) {
            var assetsBody, data, err, extension, filepath, pathParts, res, trimmedParts, ___iced_passed_deferral1, __iced_deferrals, __iced_k;
            __iced_k = __iced_k_noop;
            ___iced_passed_deferral1 = iced.findDeferral(arguments);
            filepath = path.join(root, fileStat.name);
            pathParts = filepath.split(path.sep);
            trimmedParts = _.drop(pathParts, _.lastIndexOf(pathParts, 'theme') + 1);
            filepath = trimmedParts.join(path.sep);
            if (filepath.match(/^\..*$/)) {
              return next();
            }
            if (config.ignore_file) {
              if (ignore.denies(filepath)) {
                return next();
              }
            }
            if ((filter != null) && !filepath.match(new RegExp("^" + filter))) {
              return next();
            }
            extension = path.extname(filepath).substr(1);
            next();
            console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            console.log("UPLOAD +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            if (filepath.match(/[\(\)]/)) {
              return console.log(colors.red("Filename may not contain parentheses, please rename - \"" + filepath + "\""));
            }
            (function(_this) {
              return (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral1,
                  filename: "src/theme/upload.iced"
                });
                fs.readFile(path.join('theme', filepath), __iced_deferrals.defer({
                  assign_fn: (function() {
                    return function() {
                      err = arguments[0];
                      return data = arguments[1];
                    };
                  })(),
                  lineno: 54
                }));
                __iced_deferrals._fulfill();
              });
            })(this)((function(_this) {
              return function() {
                if (typeof err !== "undefined" && err !== null) {
                  console.log(err);
                }
                console.log("successfully loaded " + filepath + " from disk.");
                console.log("sending data to: https://" + target.api_key + ":" + target.password + "@" + target.domain + ".myshopify.com/admin/themes/" + target.theme_id + "/assets.json");
                (function(__iced_k) {
                  __iced_deferrals = new iced.Deferrals(__iced_k, {
                    parent: ___iced_passed_deferral1,
                    filename: "src/theme/upload.iced"
                  });
                  helpers.shopifyRequest({
                    filepath: filepath.split(path.sep).join('/'),
                    method: 'put',
                    url: "https://" + target.api_key + ":" + target.password + "@" + target.domain + ".myshopify.com/admin/themes/" + target.theme_id + "/assets.json",
                    json: {
                      asset: {
                        key: filepath.split(path.sep).join('/'),
                        attachment: data.toString('base64')
                      }
                    }
                  }, __iced_deferrals.defer({
                    assign_fn: (function() {
                      return function() {
                        err = arguments[0];
                        res = arguments[1];
                        return assetsBody = arguments[2];
                      };
                    })(),
                    lineno: 69
                  }));
                  __iced_deferrals._fulfill();
                })(function() {
                  console.log(assetsBody);
                  if (typeof err !== "undefined" && err !== null) {
                    console.log(err);
                  }
                  if (typeof err === "undefined" || err === null) {
                    return console.log(colors.green("Uploaded " + filepath));
                  }
                });
              };
            })(this));
          });
        });
      };
    })(this));
  };

}).call(this);
