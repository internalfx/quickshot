'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _helpers = require('../helpers');

var helpers = _interopRequireWildcard(_helpers);

var _gitignoreParser = require('gitignore-parser');

var _gitignoreParser2 = _interopRequireDefault(_gitignoreParser);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.promisifyAll(_fs2.default);
// var helpers = require('../helpers')
//
// var _ = require('lodash')
// var inquirer = require("inquirer")
// var colors = require('colors')
// var fs = require('fs')
// var path = require('path')
// var request = require('request')
// var mkdirp = require('mkdirp')
// var walk = require('walk')
// var parser = require('gitignore-parser')

var run = function* (argv) {
  var filter = _lodash2.default.first(argv['_']);
  var ignore = null;

  var config = yield helpers.loadConfig();

  if (config.ignore_file) {
    ignore = _gitignoreParser2.default.compile((yield _fs2.default.readFileAsync(config.ignore_file, 'utf8')));
  }

  var target = yield helpers.getTarget(config, argv);

  var files = yield helpers.listFiles('theme');

  var fileProcesses = files.reduce(function (list, file) {
    let pathParts = file.split(_path2.default.sep);
    let trimmedParts = _lodash2.default.drop(pathParts, _lodash2.default.lastIndexOf(pathParts, 'theme') + 1);
    let filepath = trimmedParts.join(_path2.default.sep);
    let filename = _path2.default.basename(filepath);

    // Ignore hidden files
    if (filename.match(/^\..*$/)) {
      return list;
    }

    // Ignore paths configured in ignore file
    if (ignore && ignore.denies(filepath)) {
      return list;
    }

    if (filter && !filepath.match(new RegExp(`^${ filter }`))) {
      return list;
    }

    list.push((0, _co2.default)(function* () {
      var data = yield _fs2.default.readFileAsync(_path2.default.join('theme', filepath));

      var cleanPath = filepath.split(_path2.default.sep).join('/');

      yield helpers.shopifyRequest({
        name: cleanPath,
        request: {
          method: 'put',
          url: `https://${ target.domain }.myshopify.com/admin/themes/${ target.theme_id }/assets.json`,
          headers: { 'Authorization': target.auth },
          data: {
            asset: {
              key: cleanPath,
              attachment: data.toString('base64')
            }
          }
        }
      });

      helpers.log(`uploaded ${ cleanPath }`, 'green');
    }));

    return list;
  }, []);

  yield _bluebird2.default.all(fileProcesses);

  return 'Done!';
};

exports.default = run;
//# sourceMappingURL=data:application/json;base64,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RjtPQUNGLENBQUMsQ0FBQTs7QUFFRixhQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxHQUFFLFNBQVMsRUFBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUE7S0FDOUMsQ0FBQyxDQUFDLENBQUE7O0FBRUgsV0FBTyxJQUFJLENBQUE7R0FDWixFQUFFLEVBQUUsQ0FBQyxDQUFBOztBQUVOLFFBQU0sbUJBQVEsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFBOztBQUVoQyxTQUFPLE9BQU8sQ0FBQTtDQUNmLENBQUE7O2tCQUVjLEdBQUciLCJmaWxlIjoidGhlbWUvdXBsb2FkLmVzNiIsInNvdXJjZXNDb250ZW50IjpbIlxuLy8gdmFyIGhlbHBlcnMgPSByZXF1aXJlKCcuLi9oZWxwZXJzJylcbi8vXG4vLyB2YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG4vLyB2YXIgaW5xdWlyZXIgPSByZXF1aXJlKFwiaW5xdWlyZXJcIilcbi8vIHZhciBjb2xvcnMgPSByZXF1aXJlKCdjb2xvcnMnKVxuLy8gdmFyIGZzID0gcmVxdWlyZSgnZnMnKVxuLy8gdmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbi8vIHZhciByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpXG4vLyB2YXIgbWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJylcbi8vIHZhciB3YWxrID0gcmVxdWlyZSgnd2FsaycpXG4vLyB2YXIgcGFyc2VyID0gcmVxdWlyZSgnZ2l0aWdub3JlLXBhcnNlcicpXG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBjbyBmcm9tICdjbydcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi4vaGVscGVycydcbmltcG9ydCBwYXJzZXIgZnJvbSAnZ2l0aWdub3JlLXBhcnNlcidcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCdcblByb21pc2UucHJvbWlzaWZ5QWxsKGZzKVxuXG52YXIgcnVuID0gZnVuY3Rpb24gKihhcmd2KSB7XG4gIHZhciBmaWx0ZXIgPSBfLmZpcnN0KGFyZ3ZbJ18nXSlcbiAgdmFyIGlnbm9yZSA9IG51bGxcblxuICB2YXIgY29uZmlnID0geWllbGQgaGVscGVycy5sb2FkQ29uZmlnKClcblxuICBpZiAoY29uZmlnLmlnbm9yZV9maWxlKSB7XG4gICAgaWdub3JlID0gcGFyc2VyLmNvbXBpbGUoeWllbGQgZnMucmVhZEZpbGVBc3luYyhjb25maWcuaWdub3JlX2ZpbGUsICd1dGY4JykpXG4gIH1cblxuICB2YXIgdGFyZ2V0ID0geWllbGQgaGVscGVycy5nZXRUYXJnZXQoY29uZmlnLCBhcmd2KVxuXG4gIHZhciBmaWxlcyA9IHlpZWxkIGhlbHBlcnMubGlzdEZpbGVzKCd0aGVtZScpXG5cbiAgdmFyIGZpbGVQcm9jZXNzZXMgPSBmaWxlcy5yZWR1Y2UoZnVuY3Rpb24gKGxpc3QsIGZpbGUpIHtcbiAgICBsZXQgcGF0aFBhcnRzID0gZmlsZS5zcGxpdChwYXRoLnNlcClcbiAgICBsZXQgdHJpbW1lZFBhcnRzID0gXy5kcm9wKHBhdGhQYXJ0cywgKF8ubGFzdEluZGV4T2YocGF0aFBhcnRzLCAndGhlbWUnKSArIDEpKVxuICAgIGxldCBmaWxlcGF0aCA9IHRyaW1tZWRQYXJ0cy5qb2luKHBhdGguc2VwKVxuICAgIGxldCBmaWxlbmFtZSA9IHBhdGguYmFzZW5hbWUoZmlsZXBhdGgpXG5cbiAgICAvLyBJZ25vcmUgaGlkZGVuIGZpbGVzXG4gICAgaWYgKGZpbGVuYW1lLm1hdGNoKC9eXFwuLiokLykpIHsgcmV0dXJuIGxpc3QgfVxuXG4gICAgLy8gSWdub3JlIHBhdGhzIGNvbmZpZ3VyZWQgaW4gaWdub3JlIGZpbGVcbiAgICBpZiAoaWdub3JlICYmIGlnbm9yZS5kZW5pZXMoZmlsZXBhdGgpKSB7IHJldHVybiBsaXN0IH1cblxuICAgIGlmIChmaWx0ZXIgJiYgIWZpbGVwYXRoLm1hdGNoKG5ldyBSZWdFeHAoYF4ke2ZpbHRlcn1gKSkpIHsgcmV0dXJuIGxpc3QgfVxuXG4gICAgbGlzdC5wdXNoKGNvKGZ1bmN0aW9uICooKSB7XG4gICAgICB2YXIgZGF0YSA9IHlpZWxkIGZzLnJlYWRGaWxlQXN5bmMocGF0aC5qb2luKCd0aGVtZScsIGZpbGVwYXRoKSlcblxuICAgICAgdmFyIGNsZWFuUGF0aCA9IGZpbGVwYXRoLnNwbGl0KHBhdGguc2VwKS5qb2luKCcvJylcblxuICAgICAgeWllbGQgaGVscGVycy5zaG9waWZ5UmVxdWVzdCh7XG4gICAgICAgIG5hbWU6IGNsZWFuUGF0aCxcbiAgICAgICAgcmVxdWVzdDoge1xuICAgICAgICAgIG1ldGhvZDogJ3B1dCcsXG4gICAgICAgICAgdXJsOiBgaHR0cHM6Ly8ke3RhcmdldC5kb21haW59Lm15c2hvcGlmeS5jb20vYWRtaW4vdGhlbWVzLyR7dGFyZ2V0LnRoZW1lX2lkfS9hc3NldHMuanNvbmAsXG4gICAgICAgICAgaGVhZGVyczogeydBdXRob3JpemF0aW9uJzogdGFyZ2V0LmF1dGh9LFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGFzc2V0OiB7XG4gICAgICAgICAgICAgIGtleTogY2xlYW5QYXRoLFxuICAgICAgICAgICAgICBhdHRhY2htZW50OiBkYXRhLnRvU3RyaW5nKCdiYXNlNjQnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgaGVscGVycy5sb2coYHVwbG9hZGVkICR7Y2xlYW5QYXRofWAsICdncmVlbicpXG4gICAgfSkpXG5cbiAgICByZXR1cm4gbGlzdFxuICB9LCBbXSlcblxuICB5aWVsZCBQcm9taXNlLmFsbChmaWxlUHJvY2Vzc2VzKVxuXG4gIHJldHVybiAnRG9uZSEnXG59XG5cbmV4cG9ydCBkZWZhdWx0IHJ1blxuIl19