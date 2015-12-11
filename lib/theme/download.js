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

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_fs2.default.mkdirp = _mkdirp2.default;
_bluebird2.default.promisifyAll(_fs2.default);

var run = function* (argv) {
  var filter = _lodash2.default.first(argv['_']);

  var ignore = null;
  var config = yield helpers.loadConfig();

  if (config.ignore_file) {
    ignore = _gitignoreParser2.default.compile((yield _fs2.default.readFileAsync(config.ignore_file, 'utf8')));
  }

  var target = yield helpers.getTarget(config, argv);

  var assets = yield helpers.shopifyRequest({
    name: 'Retrieve Asset list',
    request: {
      method: 'get',
      url: `https://${ target.domain }.myshopify.com/admin/themes/${ target.theme_id }/assets.json`,
      headers: { 'Authorization': target.auth }
    }
  });

  assets = assets.data.assets;

  if (ignore) {
    assets = _lodash2.default.reject(assets, function (asset) {
      return ignore.denies(asset.key);
    });
  }

  if (filter) {
    assets = _lodash2.default.filter(assets, function (asset) {
      return new RegExp(`^${ filter }`).test(asset.key);
    });
  }

  var downloader = function (key) {
    return (0, _co2.default)(function* () {
      var res = yield helpers.shopifyRequest({
        name: `request: ${ key }`,
        request: {
          url: `https://${ target.domain }.myshopify.com/admin/themes/${ target.theme_id }/assets.json`,
          headers: { 'Authorization': target.auth },
          params: {
            'asset[key]': key,
            theme_id: target.theme_id
          }
        }
      });

      helpers.log(`downloaded ${ key }`, 'green');

      var data = res.data;
      var rawData = null;

      if (data.asset.attachment) {
        rawData = new Buffer(data.asset.attachment, 'base64');
      } else if (data.asset.value) {
        rawData = new Buffer(data.asset.value, 'utf8');
      }

      yield _fs2.default.mkdirpAsync(_path2.default.join(process.cwd(), 'theme', _path2.default.dirname(key)));
      yield _fs2.default.writeFileAsync(_path2.default.join(process.cwd(), 'theme', key), rawData);
    });
  };

  if (argv['sync']) {
    for (let asset of assets) {
      yield downloader(asset.key);
    }
  } else {
    var pending = [];

    for (let asset of assets) {
      pending.push(downloader(asset.key));
    }

    yield _bluebird2.default.all(pending);
  }

  return 'Done!';
};

exports.default = run;
//# sourceMappingURL=data:application/json;base64,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aW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IGNvIGZyb20gJ2NvJ1xuaW1wb3J0ICogYXMgaGVscGVycyBmcm9tICcuLi9oZWxwZXJzJ1xuaW1wb3J0IHBhcnNlciBmcm9tICdnaXRpZ25vcmUtcGFyc2VyJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBta2RpcnAgZnJvbSAnbWtkaXJwJ1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnXG5mcy5ta2RpcnAgPSBta2RpcnBcblByb21pc2UucHJvbWlzaWZ5QWxsKGZzKVxuXG52YXIgcnVuID0gZnVuY3Rpb24gKihhcmd2KSB7XG4gIHZhciBmaWx0ZXIgPSBfLmZpcnN0KGFyZ3ZbJ18nXSlcblxuICB2YXIgaWdub3JlID0gbnVsbFxuICB2YXIgY29uZmlnID0geWllbGQgaGVscGVycy5sb2FkQ29uZmlnKClcblxuICBpZiAoY29uZmlnLmlnbm9yZV9maWxlKSB7XG4gICAgaWdub3JlID0gcGFyc2VyLmNvbXBpbGUoeWllbGQgZnMucmVhZEZpbGVBc3luYyhjb25maWcuaWdub3JlX2ZpbGUsICd1dGY4JykpXG4gIH1cblxuICB2YXIgdGFyZ2V0ID0geWllbGQgaGVscGVycy5nZXRUYXJnZXQoY29uZmlnLCBhcmd2KVxuXG4gIHZhciBhc3NldHMgPSB5aWVsZCBoZWxwZXJzLnNob3BpZnlSZXF1ZXN0KHtcbiAgICBuYW1lOiAnUmV0cmlldmUgQXNzZXQgbGlzdCcsXG4gICAgcmVxdWVzdDoge1xuICAgICAgbWV0aG9kOiAnZ2V0JyxcbiAgICAgIHVybDogYGh0dHBzOi8vJHt0YXJnZXQuZG9tYWlufS5teXNob3BpZnkuY29tL2FkbWluL3RoZW1lcy8ke3RhcmdldC50aGVtZV9pZH0vYXNzZXRzLmpzb25gLFxuICAgICAgaGVhZGVyczogeydBdXRob3JpemF0aW9uJzogdGFyZ2V0LmF1dGh9XG4gICAgfVxuICB9KVxuXG4gIGFzc2V0cyA9IGFzc2V0cy5kYXRhLmFzc2V0c1xuXG4gIGlmIChpZ25vcmUpIHtcbiAgICBhc3NldHMgPSBfLnJlamVjdChhc3NldHMsIGZ1bmN0aW9uIChhc3NldCkge1xuICAgICAgcmV0dXJuIGlnbm9yZS5kZW5pZXMoYXNzZXQua2V5KVxuICAgIH0pXG4gIH1cblxuICBpZiAoZmlsdGVyKSB7XG4gICAgYXNzZXRzID0gXy5maWx0ZXIoYXNzZXRzLCBmdW5jdGlvbiAoYXNzZXQpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKGBeJHtmaWx0ZXJ9YCkudGVzdChhc3NldC5rZXkpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBkb3dubG9hZGVyID0gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBjbyhmdW5jdGlvbiAqKCkge1xuICAgICAgdmFyIHJlcyA9IHlpZWxkIGhlbHBlcnMuc2hvcGlmeVJlcXVlc3Qoe1xuICAgICAgICBuYW1lOiBgcmVxdWVzdDogJHtrZXl9YCxcbiAgICAgICAgcmVxdWVzdDoge1xuICAgICAgICAgIHVybDogYGh0dHBzOi8vJHt0YXJnZXQuZG9tYWlufS5teXNob3BpZnkuY29tL2FkbWluL3RoZW1lcy8ke3RhcmdldC50aGVtZV9pZH0vYXNzZXRzLmpzb25gLFxuICAgICAgICAgIGhlYWRlcnM6IHsnQXV0aG9yaXphdGlvbic6IHRhcmdldC5hdXRofSxcbiAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICdhc3NldFtrZXldJzoga2V5LFxuICAgICAgICAgICAgdGhlbWVfaWQ6IHRhcmdldC50aGVtZV9pZFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgaGVscGVycy5sb2coYGRvd25sb2FkZWQgJHtrZXl9YCwgJ2dyZWVuJylcblxuICAgICAgdmFyIGRhdGEgPSByZXMuZGF0YVxuICAgICAgdmFyIHJhd0RhdGEgPSBudWxsXG5cbiAgICAgIGlmIChkYXRhLmFzc2V0LmF0dGFjaG1lbnQpIHtcbiAgICAgICAgcmF3RGF0YSA9IG5ldyBCdWZmZXIoZGF0YS5hc3NldC5hdHRhY2htZW50LCAnYmFzZTY0JylcbiAgICAgIH0gZWxzZSBpZiAoZGF0YS5hc3NldC52YWx1ZSkge1xuICAgICAgICByYXdEYXRhID0gbmV3IEJ1ZmZlcihkYXRhLmFzc2V0LnZhbHVlLCAndXRmOCcpXG4gICAgICB9XG5cbiAgICAgIHlpZWxkIGZzLm1rZGlycEFzeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAndGhlbWUnLCBwYXRoLmRpcm5hbWUoa2V5KSkpXG4gICAgICB5aWVsZCBmcy53cml0ZUZpbGVBc3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3RoZW1lJywga2V5KSwgcmF3RGF0YSlcbiAgICB9KVxuICB9XG5cbiAgaWYgKGFyZ3ZbJ3N5bmMnXSkge1xuICAgIGZvciAobGV0IGFzc2V0IG9mIGFzc2V0cykge1xuICAgICAgeWllbGQgZG93bmxvYWRlcihhc3NldC5rZXkpXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBwZW5kaW5nID0gW11cblxuICAgIGZvciAobGV0IGFzc2V0IG9mIGFzc2V0cykge1xuICAgICAgcGVuZGluZy5wdXNoKGRvd25sb2FkZXIoYXNzZXQua2V5KSlcbiAgICB9XG5cbiAgICB5aWVsZCBQcm9taXNlLmFsbChwZW5kaW5nKVxuICB9XG5cbiAgcmV0dXJuICdEb25lISdcbn1cblxuZXhwb3J0IGRlZmF1bHQgcnVuXG4iXX0=