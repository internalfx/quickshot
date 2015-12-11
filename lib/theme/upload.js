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

var run = function* (argv) {
  var filter = _lodash2.default.first(argv['_']);
  var ignore = null;

  var config = yield helpers.loadConfig();

  if (config.ignore_file) {
    ignore = _gitignoreParser2.default.compile((yield _fs2.default.readFileAsync(config.ignore_file, 'utf8')));
  }

  var target = yield helpers.getTarget(config, argv);

  var files = yield helpers.listFiles('theme');

  files = files.map(file => {
    let pathParts = file.split(_path2.default.sep);
    let trimmedParts = _lodash2.default.drop(pathParts, _lodash2.default.lastIndexOf(pathParts, 'theme') + 1);
    let filepath = trimmedParts.join(_path2.default.sep);

    return {
      key: filepath,
      name: _path2.default.basename(filepath),
      fullpath: file
    };
  });

  if (ignore) {
    files = _lodash2.default.reject(files, function (file) {
      return ignore.denies(file.key);
    });
  }

  if (filter) {
    files = _lodash2.default.filter(files, function (file) {
      return new RegExp(`^${ filter }`).test(file.key);
    });
  }

  files = _lodash2.default.reject(files, function (file) {
    return file.name.match(/^\..*$/);
  });

  var uploader = function (file) {
    return (0, _co2.default)(function* () {
      var data = yield _fs2.default.readFileAsync(file.fullpath);

      var cleanPath = file.key.split(_path2.default.sep).join('/');

      yield helpers.shopifyRequest({
        name: `upload: ${ cleanPath }`,
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
    });
  };

  if (argv['sync']) {
    for (let file of files) {
      yield uploader(file);
    }
  } else {
    var pending = [];

    for (let file of files) {
      pending.push(uploader(file));
    }

    yield _bluebird2.default.all(pending);
  }

  return 'Done!';
};

exports.default = run;
//# sourceMappingURL=data:application/json;base64,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QUFFLEtBQUs7QUFDYixhQUFHLEVBQUUsQ0FBQyxRQUFRLEdBQUUsTUFBTSxDQUFDLE1BQU0sRUFBQyw0QkFBNEIsR0FBRSxNQUFNLENBQUMsUUFBUSxFQUFDLFlBQVksQ0FBQztBQUN6RixpQkFBTyxFQUFFLEVBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUM7QUFDdkMsY0FBSSxFQUFFO0FBQ0osaUJBQUssRUFBRTtBQUNMLGlCQUFHLEVBQUUsU0FBUztBQUNkLHdCQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7YUFDcEM7V0FDRjtTQUNGO09BQ0YsQ0FBQyxDQUFBOztBQUVGLGFBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLEdBQUUsU0FBUyxFQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQTtLQUM5QyxDQUFDLENBQUE7R0FDSCxDQUFBOztBQUVELE1BQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQ2hCLFNBQUssSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFO0FBQ3RCLFlBQU0sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3JCO0dBQ0YsTUFBTTtBQUNMLFFBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQTs7QUFFaEIsU0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUU7QUFDdEIsYUFBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtLQUM3Qjs7QUFFRCxVQUFNLG1CQUFRLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtHQUMzQjs7QUFFRCxTQUFPLE9BQU8sQ0FBQTtDQUNmLENBQUE7O2tCQUVjLEdBQUciLCJmaWxlIjoidGhlbWUvdXBsb2FkLmVzNiIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IGNvIGZyb20gJ2NvJ1xuaW1wb3J0ICogYXMgaGVscGVycyBmcm9tICcuLi9oZWxwZXJzJ1xuaW1wb3J0IHBhcnNlciBmcm9tICdnaXRpZ25vcmUtcGFyc2VyJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJ1xuUHJvbWlzZS5wcm9taXNpZnlBbGwoZnMpXG5cbnZhciBydW4gPSBmdW5jdGlvbiAqKGFyZ3YpIHtcbiAgdmFyIGZpbHRlciA9IF8uZmlyc3QoYXJndlsnXyddKVxuICB2YXIgaWdub3JlID0gbnVsbFxuXG4gIHZhciBjb25maWcgPSB5aWVsZCBoZWxwZXJzLmxvYWRDb25maWcoKVxuXG4gIGlmIChjb25maWcuaWdub3JlX2ZpbGUpIHtcbiAgICBpZ25vcmUgPSBwYXJzZXIuY29tcGlsZSh5aWVsZCBmcy5yZWFkRmlsZUFzeW5jKGNvbmZpZy5pZ25vcmVfZmlsZSwgJ3V0ZjgnKSlcbiAgfVxuXG4gIHZhciB0YXJnZXQgPSB5aWVsZCBoZWxwZXJzLmdldFRhcmdldChjb25maWcsIGFyZ3YpXG5cbiAgdmFyIGZpbGVzID0geWllbGQgaGVscGVycy5saXN0RmlsZXMoJ3RoZW1lJylcblxuICBmaWxlcyA9IGZpbGVzLm1hcCgoZmlsZSkgPT4ge1xuICAgIGxldCBwYXRoUGFydHMgPSBmaWxlLnNwbGl0KHBhdGguc2VwKVxuICAgIGxldCB0cmltbWVkUGFydHMgPSBfLmRyb3AocGF0aFBhcnRzLCAoXy5sYXN0SW5kZXhPZihwYXRoUGFydHMsICd0aGVtZScpICsgMSkpXG4gICAgbGV0IGZpbGVwYXRoID0gdHJpbW1lZFBhcnRzLmpvaW4ocGF0aC5zZXApXG5cbiAgICByZXR1cm4ge1xuICAgICAga2V5OiBmaWxlcGF0aCxcbiAgICAgIG5hbWU6IHBhdGguYmFzZW5hbWUoZmlsZXBhdGgpLFxuICAgICAgZnVsbHBhdGg6IGZpbGVcbiAgICB9XG4gIH0pXG5cbiAgaWYgKGlnbm9yZSkge1xuICAgIGZpbGVzID0gXy5yZWplY3QoZmlsZXMsIGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICByZXR1cm4gaWdub3JlLmRlbmllcyhmaWxlLmtleSlcbiAgICB9KVxuICB9XG5cbiAgaWYgKGZpbHRlcikge1xuICAgIGZpbGVzID0gXy5maWx0ZXIoZmlsZXMsIGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChgXiR7ZmlsdGVyfWApLnRlc3QoZmlsZS5rZXkpXG4gICAgfSlcbiAgfVxuXG4gIGZpbGVzID0gXy5yZWplY3QoZmlsZXMsIGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgcmV0dXJuIGZpbGUubmFtZS5tYXRjaCgvXlxcLi4qJC8pXG4gIH0pXG5cbiAgdmFyIHVwbG9hZGVyID0gZnVuY3Rpb24gKGZpbGUpIHtcbiAgICByZXR1cm4gY28oZnVuY3Rpb24gKigpIHtcbiAgICAgIHZhciBkYXRhID0geWllbGQgZnMucmVhZEZpbGVBc3luYyhmaWxlLmZ1bGxwYXRoKVxuXG4gICAgICB2YXIgY2xlYW5QYXRoID0gZmlsZS5rZXkuc3BsaXQocGF0aC5zZXApLmpvaW4oJy8nKVxuXG4gICAgICB5aWVsZCBoZWxwZXJzLnNob3BpZnlSZXF1ZXN0KHtcbiAgICAgICAgbmFtZTogYHVwbG9hZDogJHtjbGVhblBhdGh9YCxcbiAgICAgICAgcmVxdWVzdDoge1xuICAgICAgICAgIG1ldGhvZDogJ3B1dCcsXG4gICAgICAgICAgdXJsOiBgaHR0cHM6Ly8ke3RhcmdldC5kb21haW59Lm15c2hvcGlmeS5jb20vYWRtaW4vdGhlbWVzLyR7dGFyZ2V0LnRoZW1lX2lkfS9hc3NldHMuanNvbmAsXG4gICAgICAgICAgaGVhZGVyczogeydBdXRob3JpemF0aW9uJzogdGFyZ2V0LmF1dGh9LFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGFzc2V0OiB7XG4gICAgICAgICAgICAgIGtleTogY2xlYW5QYXRoLFxuICAgICAgICAgICAgICBhdHRhY2htZW50OiBkYXRhLnRvU3RyaW5nKCdiYXNlNjQnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgaGVscGVycy5sb2coYHVwbG9hZGVkICR7Y2xlYW5QYXRofWAsICdncmVlbicpXG4gICAgfSlcbiAgfVxuXG4gIGlmIChhcmd2WydzeW5jJ10pIHtcbiAgICBmb3IgKGxldCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICB5aWVsZCB1cGxvYWRlcihmaWxlKVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgcGVuZGluZyA9IFtdXG5cbiAgICBmb3IgKGxldCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICBwZW5kaW5nLnB1c2godXBsb2FkZXIoZmlsZSkpXG4gICAgfVxuXG4gICAgeWllbGQgUHJvbWlzZS5hbGwocGVuZGluZylcbiAgfVxuXG4gIHJldHVybiAnRG9uZSEnXG59XG5cbmV4cG9ydCBkZWZhdWx0IHJ1blxuIl19