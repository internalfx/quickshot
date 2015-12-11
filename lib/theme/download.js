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

  console.log(assets);
};

exports.default = run;

// downloader = (ctx, cb) ->
//
//   await helpers.shopifyRequest({
//     filepath: ctx.key
//     method: 'get'
//     url: "https://#{ctx.target.api_key}:#{ctx.target.password}@#{ctx.target.domain}.myshopify.com/admin/themes/#{ctx.target.theme_id}/assets.json"
//     qs: {
//       asset: {key: ctx.key}
//     }
//   }, defer(err, res, data))
//   if err?
//     helpers.log(err, 'red')
//     cb(err)
//
//   helpers.log("Downloaded #{ctx.key}", 'green')
//
//   if data.asset.attachment
//     rawData = new Buffer(data.asset.attachment, 'base64')
//   else if data.asset.value
//     rawData = new Buffer(data.asset.value, 'utf8')
//
//   await mkdirp(path.join(process.cwd(), 'theme', path.dirname(data.asset.key)), defer(err))
//   await fs.writeFile(path.join(process.cwd(), 'theme', data.asset.key), rawData, defer(err))
//   if err?
//     helpers.log(err, 'red')
//     cb(err)
//
//   cb()
//
//
// exports.run = (argv, done) ->
//   filter = _.first(argv['_'])
//
//   await helpers.loadConfig(defer(err, config))
//   if err? then return done(err)
//
//   if config.ignore_file
//     ignore = parser.compile(fs.readFileSync(config.ignore_file, 'utf8'))
//
//   await helpers.getTarget(config, argv, defer(err, target))
//   if err? then return done(err)
//
//   await helpers.shopifyRequest({
//     method: 'get'
//     url: "https://#{target.api_key}:#{target.password}@#{target.domain}.myshopify.com/admin/themes/#{target.theme_id}/assets.json"
//   }, defer(err, res, assetsBody))
//   if err? then return done(err)
//
//   assets = assetsBody.assets
//
//   if ignore?
//     assets = _.reject(assets, (asset) ->
//       ignore.denies(asset.key)
//     )
//
//   if filter?
//     assets = _.filter(assets, (asset) ->
//       asset.key.match(new RegExp("^#{filter}"))
//     )
//
//   # console.log assets
//
//   if argv['sync']
//     for asset in assets
//       await downloader({key: asset.key, target: target}, defer(err))
//   else
//     await
//       for asset in assets
//         downloader({key: asset.key, target: target}, defer(err))
//
//   done()
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRoZW1lL2Rvd25sb2FkLmVzNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0lBR1ksT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtuQixtQkFBUSxZQUFZLGNBQUksQ0FBQTs7QUFFeEIsSUFBSSxHQUFHLEdBQUcsV0FBVyxJQUFJLEVBQUU7QUFDekIsTUFBSSxNQUFNLEdBQUcsaUJBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBOztBQUUvQixNQUFJLE1BQU0sR0FBRyxJQUFJLENBQUE7QUFDakIsTUFBSSxNQUFNLEdBQUcsTUFBTSxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUE7O0FBRXZDLE1BQUksTUFBTSxDQUFDLFdBQVcsRUFBRTtBQUN0QixVQUFNLEdBQUcsMEJBQU8sT0FBTyxFQUFDLE1BQU0sYUFBRyxhQUFhLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQSxDQUFDLENBQUE7R0FDNUU7O0FBRUQsTUFBSSxNQUFNLEdBQUcsTUFBTSxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQTs7QUFFbEQsTUFBSSxNQUFNLEdBQUcsTUFBTSxPQUFPLENBQUMsY0FBYyxDQUFDO0FBQ3hDLFFBQUksRUFBRSxxQkFBcUI7QUFDM0IsV0FBTyxFQUFFO0FBQ1AsWUFBTSxFQUFFLEtBQUs7QUFDYixTQUFHLEVBQUUsQ0FBQyxRQUFRLEdBQUUsTUFBTSxDQUFDLE1BQU0sRUFBQyw0QkFBNEIsR0FBRSxNQUFNLENBQUMsUUFBUSxFQUFDLFlBQVksQ0FBQztBQUN6RixhQUFPLEVBQUUsRUFBQyxlQUFlLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBQztLQUN4QztHQUNGLENBQUMsQ0FBQTs7QUFFRixRQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUE7O0FBRTNCLE1BQUksTUFBTSxFQUFFO0FBQ1YsVUFBTSxHQUFHLGlCQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUUsVUFBVSxLQUFLLEVBQUU7QUFDekMsYUFBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUNoQyxDQUFDLENBQUE7R0FDSDs7QUFFRCxNQUFJLE1BQU0sRUFBRTtBQUNWLFVBQU0sR0FBRyxpQkFBRSxNQUFNLENBQUMsTUFBTSxFQUFFLFVBQVUsS0FBSyxFQUFFO0FBQ3pDLGFBQU8sSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7S0FDaEQsQ0FBQyxDQUFBO0dBQ0g7O0FBRUQsU0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtDQUVwQixDQUFBOztrQkFFYyxHQUFHIiwiZmlsZSI6InRoZW1lL2Rvd25sb2FkLmVzNiIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IGNvIGZyb20gJ2NvJ1xuaW1wb3J0ICogYXMgaGVscGVycyBmcm9tICcuLi9oZWxwZXJzJ1xuaW1wb3J0IHBhcnNlciBmcm9tICdnaXRpZ25vcmUtcGFyc2VyJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJ1xuUHJvbWlzZS5wcm9taXNpZnlBbGwoZnMpXG5cbnZhciBydW4gPSBmdW5jdGlvbiAqKGFyZ3YpIHtcbiAgdmFyIGZpbHRlciA9IF8uZmlyc3QoYXJndlsnXyddKVxuXG4gIHZhciBpZ25vcmUgPSBudWxsXG4gIHZhciBjb25maWcgPSB5aWVsZCBoZWxwZXJzLmxvYWRDb25maWcoKVxuXG4gIGlmIChjb25maWcuaWdub3JlX2ZpbGUpIHtcbiAgICBpZ25vcmUgPSBwYXJzZXIuY29tcGlsZSh5aWVsZCBmcy5yZWFkRmlsZUFzeW5jKGNvbmZpZy5pZ25vcmVfZmlsZSwgJ3V0ZjgnKSlcbiAgfVxuXG4gIHZhciB0YXJnZXQgPSB5aWVsZCBoZWxwZXJzLmdldFRhcmdldChjb25maWcsIGFyZ3YpXG5cbiAgdmFyIGFzc2V0cyA9IHlpZWxkIGhlbHBlcnMuc2hvcGlmeVJlcXVlc3Qoe1xuICAgIG5hbWU6ICdSZXRyaWV2ZSBBc3NldCBsaXN0JyxcbiAgICByZXF1ZXN0OiB7XG4gICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgdXJsOiBgaHR0cHM6Ly8ke3RhcmdldC5kb21haW59Lm15c2hvcGlmeS5jb20vYWRtaW4vdGhlbWVzLyR7dGFyZ2V0LnRoZW1lX2lkfS9hc3NldHMuanNvbmAsXG4gICAgICBoZWFkZXJzOiB7J0F1dGhvcml6YXRpb24nOiB0YXJnZXQuYXV0aH1cbiAgICB9XG4gIH0pXG5cbiAgYXNzZXRzID0gYXNzZXRzLmRhdGEuYXNzZXRzXG5cbiAgaWYgKGlnbm9yZSkge1xuICAgIGFzc2V0cyA9IF8ucmVqZWN0KGFzc2V0cywgZnVuY3Rpb24gKGFzc2V0KSB7XG4gICAgICByZXR1cm4gaWdub3JlLmRlbmllcyhhc3NldC5rZXkpXG4gICAgfSlcbiAgfVxuXG4gIGlmIChmaWx0ZXIpIHtcbiAgICBhc3NldHMgPSBfLmZpbHRlcihhc3NldHMsIGZ1bmN0aW9uIChhc3NldCkge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoYF4ke2ZpbHRlcn1gKS50ZXN0KGFzc2V0LmtleSlcbiAgICB9KVxuICB9XG5cbiAgY29uc29sZS5sb2coYXNzZXRzKVxuICBcbn1cblxuZXhwb3J0IGRlZmF1bHQgcnVuXG5cbi8vIGRvd25sb2FkZXIgPSAoY3R4LCBjYikgLT5cbi8vXG4vLyAgIGF3YWl0IGhlbHBlcnMuc2hvcGlmeVJlcXVlc3Qoe1xuLy8gICAgIGZpbGVwYXRoOiBjdHgua2V5XG4vLyAgICAgbWV0aG9kOiAnZ2V0J1xuLy8gICAgIHVybDogXCJodHRwczovLyN7Y3R4LnRhcmdldC5hcGlfa2V5fToje2N0eC50YXJnZXQucGFzc3dvcmR9QCN7Y3R4LnRhcmdldC5kb21haW59Lm15c2hvcGlmeS5jb20vYWRtaW4vdGhlbWVzLyN7Y3R4LnRhcmdldC50aGVtZV9pZH0vYXNzZXRzLmpzb25cIlxuLy8gICAgIHFzOiB7XG4vLyAgICAgICBhc3NldDoge2tleTogY3R4LmtleX1cbi8vICAgICB9XG4vLyAgIH0sIGRlZmVyKGVyciwgcmVzLCBkYXRhKSlcbi8vICAgaWYgZXJyP1xuLy8gICAgIGhlbHBlcnMubG9nKGVyciwgJ3JlZCcpXG4vLyAgICAgY2IoZXJyKVxuLy9cbi8vICAgaGVscGVycy5sb2coXCJEb3dubG9hZGVkICN7Y3R4LmtleX1cIiwgJ2dyZWVuJylcbi8vXG4vLyAgIGlmIGRhdGEuYXNzZXQuYXR0YWNobWVudFxuLy8gICAgIHJhd0RhdGEgPSBuZXcgQnVmZmVyKGRhdGEuYXNzZXQuYXR0YWNobWVudCwgJ2Jhc2U2NCcpXG4vLyAgIGVsc2UgaWYgZGF0YS5hc3NldC52YWx1ZVxuLy8gICAgIHJhd0RhdGEgPSBuZXcgQnVmZmVyKGRhdGEuYXNzZXQudmFsdWUsICd1dGY4Jylcbi8vXG4vLyAgIGF3YWl0IG1rZGlycChwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3RoZW1lJywgcGF0aC5kaXJuYW1lKGRhdGEuYXNzZXQua2V5KSksIGRlZmVyKGVycikpXG4vLyAgIGF3YWl0IGZzLndyaXRlRmlsZShwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3RoZW1lJywgZGF0YS5hc3NldC5rZXkpLCByYXdEYXRhLCBkZWZlcihlcnIpKVxuLy8gICBpZiBlcnI/XG4vLyAgICAgaGVscGVycy5sb2coZXJyLCAncmVkJylcbi8vICAgICBjYihlcnIpXG4vL1xuLy8gICBjYigpXG4vL1xuLy9cbi8vIGV4cG9ydHMucnVuID0gKGFyZ3YsIGRvbmUpIC0+XG4vLyAgIGZpbHRlciA9IF8uZmlyc3QoYXJndlsnXyddKVxuLy9cbi8vICAgYXdhaXQgaGVscGVycy5sb2FkQ29uZmlnKGRlZmVyKGVyciwgY29uZmlnKSlcbi8vICAgaWYgZXJyPyB0aGVuIHJldHVybiBkb25lKGVycilcbi8vXG4vLyAgIGlmIGNvbmZpZy5pZ25vcmVfZmlsZVxuLy8gICAgIGlnbm9yZSA9IHBhcnNlci5jb21waWxlKGZzLnJlYWRGaWxlU3luYyhjb25maWcuaWdub3JlX2ZpbGUsICd1dGY4JykpXG4vL1xuLy8gICBhd2FpdCBoZWxwZXJzLmdldFRhcmdldChjb25maWcsIGFyZ3YsIGRlZmVyKGVyciwgdGFyZ2V0KSlcbi8vICAgaWYgZXJyPyB0aGVuIHJldHVybiBkb25lKGVycilcbi8vXG4vLyAgIGF3YWl0IGhlbHBlcnMuc2hvcGlmeVJlcXVlc3Qoe1xuLy8gICAgIG1ldGhvZDogJ2dldCdcbi8vICAgICB1cmw6IFwiaHR0cHM6Ly8je3RhcmdldC5hcGlfa2V5fToje3RhcmdldC5wYXNzd29yZH1AI3t0YXJnZXQuZG9tYWlufS5teXNob3BpZnkuY29tL2FkbWluL3RoZW1lcy8je3RhcmdldC50aGVtZV9pZH0vYXNzZXRzLmpzb25cIlxuLy8gICB9LCBkZWZlcihlcnIsIHJlcywgYXNzZXRzQm9keSkpXG4vLyAgIGlmIGVycj8gdGhlbiByZXR1cm4gZG9uZShlcnIpXG4vL1xuLy8gICBhc3NldHMgPSBhc3NldHNCb2R5LmFzc2V0c1xuLy9cbi8vICAgaWYgaWdub3JlP1xuLy8gICAgIGFzc2V0cyA9IF8ucmVqZWN0KGFzc2V0cywgKGFzc2V0KSAtPlxuLy8gICAgICAgaWdub3JlLmRlbmllcyhhc3NldC5rZXkpXG4vLyAgICAgKVxuLy9cbi8vICAgaWYgZmlsdGVyP1xuLy8gICAgIGFzc2V0cyA9IF8uZmlsdGVyKGFzc2V0cywgKGFzc2V0KSAtPlxuLy8gICAgICAgYXNzZXQua2V5Lm1hdGNoKG5ldyBSZWdFeHAoXCJeI3tmaWx0ZXJ9XCIpKVxuLy8gICAgIClcbi8vXG4vLyAgICMgY29uc29sZS5sb2cgYXNzZXRzXG4vL1xuLy8gICBpZiBhcmd2WydzeW5jJ11cbi8vICAgICBmb3IgYXNzZXQgaW4gYXNzZXRzXG4vLyAgICAgICBhd2FpdCBkb3dubG9hZGVyKHtrZXk6IGFzc2V0LmtleSwgdGFyZ2V0OiB0YXJnZXR9LCBkZWZlcihlcnIpKVxuLy8gICBlbHNlXG4vLyAgICAgYXdhaXRcbi8vICAgICAgIGZvciBhc3NldCBpbiBhc3NldHNcbi8vICAgICAgICAgZG93bmxvYWRlcih7a2V5OiBhc3NldC5rZXksIHRhcmdldDogdGFyZ2V0fSwgZGVmZXIoZXJyKSlcbi8vXG4vLyAgIGRvbmUoKVxuIl19