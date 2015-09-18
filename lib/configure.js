(function() {
  var colors, configureBabel, configureCoffeeScript, configureIgnoreFile, configureScss, configureTargets, fs, helpers, iced, inquirer, mfs, request, __iced_k, __iced_k_noop;

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  helpers = require('./helpers');

  inquirer = require("inquirer");

  colors = require('colors');

  fs = require('fs');

  mfs = require('machinepack-fs');

  request = require('request');

  exports.run = function(argv, done) {
    var config, configAction, currConfig, err, ___iced_passed_deferral, __iced_deferrals, __iced_k, _next;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "src/configure.iced",
          funcname: "run"
        });
        helpers.loadConfig(__iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              err = arguments[0];
              return currConfig = arguments[1];
            };
          })(),
          lineno: 11
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        config = currConfig || {};
        (function(__iced_k) {
          var _while;
          _while = function(__iced_k) {
            var _break, _continue;
            _break = __iced_k;
            _continue = function() {
              return iced.trampoline(function() {
                return _while(__iced_k);
              });
            };
            _next = _continue;
            if ((typeof configAction !== "undefined" && configAction !== null ? configAction.action : void 0) === 'Save configuration and exit') {
              return _break();
            } else {
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral,
                  filename: "src/configure.iced",
                  funcname: "run"
                });
                inquirer.prompt([
                  {
                    type: 'list',
                    name: 'action',
                    message: 'Main Menu',
                    choices: ['Configure targets', 'Configure scss', 'Configure CoffeeScript', 'Configure Babel', 'Configure ignore file', 'Save configuration and exit']
                  }
                ], __iced_deferrals.defer({
                  assign_fn: (function() {
                    return function() {
                      return configAction = arguments[0];
                    };
                  })(),
                  lineno: 30
                }));
                __iced_deferrals._fulfill();
              })(function() {
                (function(__iced_k) {
                  switch (typeof configAction !== "undefined" && configAction !== null ? configAction.action : void 0) {
                    case 'Configure targets':
                      (function(__iced_k) {
                        __iced_deferrals = new iced.Deferrals(__iced_k, {
                          parent: ___iced_passed_deferral,
                          filename: "src/configure.iced",
                          funcname: "run"
                        });
                        configureTargets(config, __iced_deferrals.defer({
                          assign_fn: (function() {
                            return function() {
                              err = arguments[0];
                              return config = arguments[1];
                            };
                          })(),
                          lineno: 34
                        }));
                        __iced_deferrals._fulfill();
                      })(__iced_k);
                      break;
                    case 'Configure scss':
                      (function(__iced_k) {
                        __iced_deferrals = new iced.Deferrals(__iced_k, {
                          parent: ___iced_passed_deferral,
                          filename: "src/configure.iced",
                          funcname: "run"
                        });
                        configureScss(config, __iced_deferrals.defer({
                          assign_fn: (function() {
                            return function() {
                              err = arguments[0];
                              return config = arguments[1];
                            };
                          })(),
                          lineno: 36
                        }));
                        __iced_deferrals._fulfill();
                      })(__iced_k);
                      break;
                    case 'Configure CoffeeScript':
                      (function(__iced_k) {
                        __iced_deferrals = new iced.Deferrals(__iced_k, {
                          parent: ___iced_passed_deferral,
                          filename: "src/configure.iced",
                          funcname: "run"
                        });
                        configureCoffeeScript(config, __iced_deferrals.defer({
                          assign_fn: (function() {
                            return function() {
                              err = arguments[0];
                              return config = arguments[1];
                            };
                          })(),
                          lineno: 38
                        }));
                        __iced_deferrals._fulfill();
                      })(__iced_k);
                      break;
                    case 'Configure Babel':
                      (function(__iced_k) {
                        __iced_deferrals = new iced.Deferrals(__iced_k, {
                          parent: ___iced_passed_deferral,
                          filename: "src/configure.iced",
                          funcname: "run"
                        });
                        configureBabel(config, __iced_deferrals.defer({
                          assign_fn: (function() {
                            return function() {
                              err = arguments[0];
                              return config = arguments[1];
                            };
                          })(),
                          lineno: 40
                        }));
                        __iced_deferrals._fulfill();
                      })(__iced_k);
                      break;
                    case 'Configure ignore file':
                      (function(__iced_k) {
                        __iced_deferrals = new iced.Deferrals(__iced_k, {
                          parent: ___iced_passed_deferral,
                          filename: "src/configure.iced",
                          funcname: "run"
                        });
                        configureIgnoreFile(config, __iced_deferrals.defer({
                          assign_fn: (function() {
                            return function() {
                              err = arguments[0];
                              return config = arguments[1];
                            };
                          })(),
                          lineno: 42
                        }));
                        __iced_deferrals._fulfill();
                      })(__iced_k);
                      break;
                    default:
                      return __iced_k();
                  }
                })(_next);
              });
            }
          };
          _while(__iced_k);
        })(function() {
          config.configVersion = CONFIGVERSION;
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
      };
    })(this));
  };

  configureTargets = function(config, cb) {
    var choices, currTarget, defaultTheme, deleteTarget, editIndex, editTarget, err, item, reqResult, res, targetAction, targetChoices, targetOpts, theme, themeChoices, themes, ___iced_passed_deferral, __iced_deferrals, __iced_k, _next;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    (function(_this) {
      return (function(__iced_k) {
        var _while;
        _while = function(__iced_k) {
          var _break, _continue;
          _break = __iced_k;
          _continue = function() {
            return iced.trampoline(function() {
              return _while(__iced_k);
            });
          };
          _next = _continue;
          if ((typeof targetAction !== "undefined" && targetAction !== null ? targetAction.action : void 0) === 'Done Managing Targets') {
            return _break();
          } else {
            targetOpts = ['Create Target'];
            if (_.any(config.targets)) {
              targetOpts.push('Edit Target');
              targetOpts.push('Delete Target');
              targetOpts.push('List Targets');
              targetOpts.push('Done Managing Targets');
            }
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "src/configure.iced"
              });
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'action',
                  message: "Manage Targets",
                  choices: targetOpts
                }
              ], __iced_deferrals.defer({
                assign_fn: (function() {
                  return function() {
                    return targetAction = arguments[0];
                  };
                })(),
                lineno: 78
              }));
              __iced_deferrals._fulfill();
            })(function() {
              targetChoices = _.map(config.targets, function(target) {
                return "[" + target.target_name + "] - '" + target.theme_name + "' at " + target.domain + ".myshopify.com";
              });
              (function(__iced_k) {
                var _i, _len;
                switch (targetAction.action) {
                  case 'Create Target':
                  case 'Edit Target':
                    currTarget = {};
                    editIndex = null;
                    (function(__iced_k) {
                      if (targetAction.action === 'Edit Target') {
                        (function(__iced_k) {
                          __iced_deferrals = new iced.Deferrals(__iced_k, {
                            parent: ___iced_passed_deferral,
                            filename: "src/configure.iced"
                          });
                          inquirer.prompt([
                            {
                              type: 'list',
                              name: 'target',
                              message: "Select target to edit",
                              "default": null,
                              choices: targetChoices
                            }
                          ], __iced_deferrals.defer({
                            assign_fn: (function() {
                              return function() {
                                return editTarget = arguments[0];
                              };
                            })(),
                            lineno: 97
                          }));
                          __iced_deferrals._fulfill();
                        })(function() {
                          editIndex = _.indexOf(targetChoices, editTarget.target);
                          return __iced_k(currTarget = config.targets[editIndex]);
                        });
                      } else {
                        return __iced_k();
                      }
                    })(function() {
                      (function(__iced_k) {
                        __iced_deferrals = new iced.Deferrals(__iced_k, {
                          parent: ___iced_passed_deferral,
                          filename: "src/configure.iced"
                        });
                        inquirer.prompt([
                          {
                            type: 'input',
                            name: 'target_name',
                            message: "Enter a name for this target",
                            "default": currTarget.target_name || null
                          }, {
                            type: 'input',
                            name: 'api_key',
                            message: "Shopify Private APP API key?",
                            "default": currTarget.api_key || null
                          }, {
                            type: 'input',
                            name: 'password',
                            message: "Shopify Private APP Password?",
                            "default": currTarget.password || null
                          }, {
                            type: 'input',
                            name: 'domain',
                            message: "Store URL?",
                            "default": currTarget.domain || null
                          }
                        ], __iced_deferrals.defer({
                          assign_fn: (function() {
                            return function() {
                              return choices = arguments[0];
                            };
                          })(),
                          lineno: 126
                        }));
                        __iced_deferrals._fulfill();
                      })(function() {
                        currTarget.target_name = choices.target_name;
                        currTarget.api_key = choices.api_key;
                        currTarget.password = choices.password;
                        currTarget.domain = choices.domain.replace(new RegExp('^https?://'), '').replace(new RegExp('\.myshopify\.com.*'), '');
                        (function(__iced_k) {
                          __iced_deferrals = new iced.Deferrals(__iced_k, {
                            parent: ___iced_passed_deferral,
                            filename: "src/configure.iced"
                          });
                          helpers.shopifyRequest({
                            method: 'get',
                            url: "https://" + currTarget.api_key + ":" + currTarget.password + "@" + currTarget.domain + ".myshopify.com/admin/themes.json"
                          }, __iced_deferrals.defer({
                            assign_fn: (function() {
                              return function() {
                                err = arguments[0];
                                res = arguments[1];
                                return reqResult = arguments[2];
                              };
                            })(),
                            lineno: 136
                          }));
                          __iced_deferrals._fulfill();
                        })(function() {
                          themes = reqResult.themes;
                          defaultTheme = _.find(themes, {
                            id: currTarget.theme_id
                          });
                          if (defaultTheme) {
                            defaultTheme = "" + defaultTheme.name + " (" + defaultTheme.role + ")";
                          }
                          themeChoices = _.map(themes, function(theme) {
                            return "" + theme.name + " (" + theme.role + ")";
                          });
                          (function(__iced_k) {
                            __iced_deferrals = new iced.Deferrals(__iced_k, {
                              parent: ___iced_passed_deferral,
                              filename: "src/configure.iced"
                            });
                            inquirer.prompt([
                              {
                                type: 'list',
                                name: 'theme',
                                message: "Select theme",
                                "default": defaultTheme || null,
                                choices: themeChoices
                              }
                            ], __iced_deferrals.defer({
                              assign_fn: (function() {
                                return function() {
                                  return choices = arguments[0];
                                };
                              })(),
                              lineno: 151
                            }));
                            __iced_deferrals._fulfill();
                          })(function() {
                            theme = themes[_.indexOf(themeChoices, choices.theme)];
                            currTarget.theme_name = theme.name;
                            currTarget.theme_id = theme.id;
                            return __iced_k((editIndex != null) && editIndex !== -1 ? (config.targets[editIndex] = currTarget, console.log(colors.yellow("Target Modified!\n\n"))) : (_.isArray(config.targets) ? config.targets.push(currTarget) : config.targets = [currTarget], console.log(colors.yellow("Target Created!\n\n"))));
                          });
                        });
                      });
                    });
                    break;
                  case 'Delete Target':
                    (function(__iced_k) {
                      __iced_deferrals = new iced.Deferrals(__iced_k, {
                        parent: ___iced_passed_deferral,
                        filename: "src/configure.iced"
                      });
                      inquirer.prompt([
                        {
                          type: 'list',
                          name: 'target',
                          message: "Select target to delete",
                          "default": null,
                          choices: targetChoices
                        }
                      ], __iced_deferrals.defer({
                        assign_fn: (function() {
                          return function() {
                            return deleteTarget = arguments[0];
                          };
                        })(),
                        lineno: 176
                      }));
                      __iced_deferrals._fulfill();
                    })(function() {
                      editIndex = _.indexOf(targetChoices, deleteTarget.target);
                      return __iced_k(_.pullAt(config.targets, editIndex));
                    });
                    break;
                  case 'List Targets':
                    console.log("");
                    for (_i = 0, _len = targetChoices.length; _i < _len; _i++) {
                      item = targetChoices[_i];
                      console.log(colors.cyan(item));
                    }
                    return __iced_k(console.log(""));
                  default:
                    return __iced_k();
                }
              })(_next);
            });
          }
        };
        _while(__iced_k);
      });
    })(this)((function(_this) {
      return function() {
        return cb(null, config);
      };
    })(this));
  };

  configureScss = function(config, cb) {
    var choices, data, err, notes, scss_warning, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "src/configure.iced"
        });
        inquirer.prompt([
          {
            type: 'confirm',
            name: 'compile_scss',
            message: "Would you like to enable automatic compiling for scss files?",
            "default": (config != null ? config.compile_scss : void 0) || false
          }
        ], __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return choices = arguments[0];
            };
          })(),
          lineno: 196
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        config.compile_scss = choices.compile_scss;
        scss_warning = "You have enabled scss compiling.\n\nThe filename entered below will be recompiled anytime ANY scss file changes while using 'quickshot watch'.\nThe file will be created for you if it does not exist.\nYou will want to put all your @import calls in that file.\nThen in your theme.liquid you will only need to include the compiled css file.\n\nSee docs at https://github.com/internalfx/quickshot#autocompiling-scss for more information.";
        (function(__iced_k) {
          if (config.compile_scss) {
            console.log(colors.yellow(scss_warning));
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "src/configure.iced"
              });
              inquirer.prompt([
                {
                  type: 'input',
                  name: 'primary_scss_file',
                  message: "Enter relative path to primary scss file.",
                  "default": (config != null ? config.primary_scss_file : void 0) || 'assets/application.scss'
                }
              ], __iced_deferrals.defer({
                assign_fn: (function() {
                  return function() {
                    return choices = arguments[0];
                  };
                })(),
                lineno: 218
              }));
              __iced_deferrals._fulfill();
            })(function() {
              config.primary_scss_file = choices.primary_scss_file;
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral,
                  filename: "src/configure.iced"
                });
                fs.readFile(config.primary_scss_file, __iced_deferrals.defer({
                  assign_fn: (function() {
                    return function() {
                      err = arguments[0];
                      return data = arguments[1];
                    };
                  })(),
                  lineno: 220
                }));
                __iced_deferrals._fulfill();
              })(function() {
                (function(__iced_k) {
                  if (typeof err !== "undefined" && err !== null) {
                    notes = "//  Sass extends the CSS @import rule to allow it to import SCSS and Sass files. All imported SCSS\n//  and Sass files will be merged together into a single CSS output file.\n//  In addition, any variables or mixins defined in imported files can be used in the main file.\n//  Sass looks for other Sass files in the current directory, and the Sass file directory under Rack, Rails, or Merb.\n//  Additional search directories may be specified using the :load_paths option, or the --load-path option on the command line.\n//  @import takes a filename to import. By default, it looks for a Sass file to import directly,\n//  but there are a few circumstances under which it will compile to a CSS @import rule:\n\n//    If the file’s extension is .css.\n//    If the filename begins with http://.\n//    If the filename is a url().\n//    If the @import has any media queries.\n\n//  If none of the above conditions are met and the extension is .scss or .sass, then the named Sass or SCSS file will be imported.\n//  If there is no extension, Sass will try to find a file with that name and the .scss or .sass extension and import it.\n\n//  For example,\n//    @import \"foo.scss\";\n\n//  or\n//    @import \"foo\";";
                    (function(__iced_k) {
                      __iced_deferrals = new iced.Deferrals(__iced_k, {
                        parent: ___iced_passed_deferral,
                        filename: "src/configure.iced"
                      });
                      fs.writeFile(config.primary_scss_file, notes, __iced_deferrals.defer({
                        assign_fn: (function() {
                          return function() {
                            return err = arguments[0];
                          };
                        })(),
                        lineno: 245
                      }));
                      __iced_deferrals._fulfill();
                    })(__iced_k);
                  } else {
                    return __iced_k();
                  }
                })(__iced_k);
              });
            });
          } else {
            return __iced_k();
          }
        })(function() {
          return cb(null, config);
        });
      };
    })(this));
  };

  configureCoffeeScript = function(config, cb) {
    var choices, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "src/configure.iced"
        });
        inquirer.prompt([
          {
            type: 'confirm',
            name: 'compile_coffeescript',
            message: "Would you like to enable automatic compiling for CoffeeScript files?",
            "default": (config != null ? config.compile_coffeescript : void 0) || false
          }
        ], __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return choices = arguments[0];
            };
          })(),
          lineno: 257
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        config.compile_coffeescript = choices.compile_coffeescript;
        return cb(null, config);
      };
    })(this));
  };

  configureBabel = function(config, cb) {
    var choices, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "src/configure.iced"
        });
        inquirer.prompt([
          {
            type: 'confirm',
            name: 'compile_babel',
            message: "Would you like to enable automatic compiling for babel (es6, jsx) files?",
            "default": (config != null ? config.compile_babel : void 0) || false
          }
        ], __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return choices = arguments[0];
            };
          })(),
          lineno: 271
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        config.compile_babel = choices.compile_babel;
        return cb(null, config);
      };
    })(this));
  };

  configureIgnoreFile = function(config, cb) {
    var choice, data, err, notes, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    console.log(colors.yellow("\nYou have two options for ignoring files in quickshot.\nYou can use a '.gitignore' file which allows you to have all your ignores in one place.\nOr you can use a '.quickshotignore'. Which allows git and quickshot to ignore different files.\n"));
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "src/configure.iced"
        });
        inquirer.prompt([
          {
            type: 'list',
            name: 'ignore_file',
            message: "What would you like to use as the quickshot ignore file?",
            "default": (config != null ? config.ignore_file : void 0) || '.gitignore',
            choices: ['.gitignore', '.quickshotignore']
          }
        ], __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return choice = arguments[0];
            };
          })(),
          lineno: 296
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        config.ignore_file = choice.ignore_file;
        (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "src/configure.iced"
          });
          fs.readFile(config.ignore_file, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                return data = arguments[1];
              };
            })(),
            lineno: 298
          }));
          __iced_deferrals._fulfill();
        })(function() {
          (function(__iced_k) {
            if ((typeof err !== "undefined" && err !== null ? err.code : void 0) === 'ENOENT') {
              if (config.ignore_file === '.gitignore') {
                notes = "# This your '" + config.ignore_file + "' file. Anything you put in here will be ignored by quickshot and git.";
              } else {
                notes = "# This your '" + config.ignore_file + "' file. Anything you put in here will be ignored by quickshot.\n# This file uses the same format as a '.gitignore' file.";
              }
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral,
                  filename: "src/configure.iced"
                });
                fs.writeFile(config.ignore_file, notes, __iced_deferrals.defer({
                  assign_fn: (function() {
                    return function() {
                      return err = arguments[0];
                    };
                  })(),
                  lineno: 309
                }));
                __iced_deferrals._fulfill();
              })(__iced_k);
            } else {
              return __iced_k();
            }
          })(function() {
            return cb(null, config);
          });
        });
      };
    })(this));
  };

}).call(this);
