(function() {
  var colors, fs, helpers, inquirer, mkdirp, parser, path, request, walk;

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
    return console.log(colors.red("product upload is not implemented yet."));
  };

}).call(this);
