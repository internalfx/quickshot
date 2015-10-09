'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _helpers = require('../helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _coEach = require('co-each');

var _coEach2 = _interopRequireDefault(_coEach);

_bluebird2['default'].promisifyAll(_fs2['default']);
_bluebird2['default'].promisifyAll(_mkdirp2['default']);

var Upload = function* Upload(argv) {
  var config = yield _helpers2['default'].loadConfigAsync();
  var totalArticles = 0;

  var target = yield _helpers2['default'].getTargetAsync(config, argv);

  var blogDirs = _fs2['default'].readdirSync(_path2['default'].join(process.cwd(), 'blogs')).filter(function (file) {
    return _fs2['default'].statSync(_path2['default'].join(process.cwd(), 'blogs', file)).isDirectory();
  });

  yield (0, _coEach2['default'])(blogDirs, function* (blogDir) {
    var blogPath = _path2['default'].join(process.cwd(), 'blogs', blogDir);

    var blogJson = yield _fs2['default'].readFileAsync(_path2['default'].join(blogPath, 'blog.json'));
    var blogData = JSON.parse(blogJson);

    var newBlog = yield _helpers2['default'].shopifyRequestAsync({
      method: 'post',
      url: 'https://' + target.api_key + ':' + target.password + '@' + target.domain + '.myshopify.com/admin/blogs.json',
      json: { blog: blogData }
    });

    newBlog = newBlog[1].blog;

    var articleDirs = _fs2['default'].readdirSync(blogPath).filter(function (file) {
      return _fs2['default'].statSync(_path2['default'].join(blogPath, file)).isDirectory();
    });

    yield (0, _coEach2['default'])(articleDirs, function* (articleDir) {
      var articlePath = _path2['default'].join(blogPath, articleDir);

      var articleJson = yield _fs2['default'].readFileAsync(_path2['default'].join(articlePath, 'article.json'));
      var articleData = _lodash2['default'].omit(JSON.parse(articleJson), 'id', 'blog_id');

      var newArticle = yield _helpers2['default'].shopifyRequestAsync({
        method: 'post',
        url: 'https://' + target.api_key + ':' + target.password + '@' + target.domain + '.myshopify.com/admin/blogs/' + newBlog.id + '/articles.json',
        json: { article: articleData }
      });

      newArticle = newArticle[1].article;

      var metaJson = yield _fs2['default'].readFileAsync(_path2['default'].join(articlePath, 'metafields.json'));
      var metafields = JSON.parse(metaJson);

      yield (0, _coEach2['default'])(metafields, function* (metafield) {
        yield _helpers2['default'].shopifyRequestAsync({
          method: 'post',
          url: 'https://' + target.api_key + ':' + target.password + '@' + target.domain + '.myshopify.com/admin/articles/' + newArticle.id + '/metafields.json',
          json: { metafield: metafield }
        });
      });

      totalArticles += 1;
    });
  });

  return 'Uploaded ' + blogDirs.length + ' blogs containing ' + totalArticles + ' articles.';
};

exports['default'] = Upload;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QUFDLE1BQU0sbUNBQThCLE9BQU8sQ0FBQyxFQUFFLG1CQUFnQjtBQUMxSCxZQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFO09BQy9CLENBQUMsQ0FBQTs7QUFFRixnQkFBVSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUE7O0FBRWxDLFVBQUksUUFBUSxHQUFHLE1BQU0sZ0JBQUcsYUFBYSxDQUFDLGtCQUFLLElBQUksQ0FBQyxXQUFXLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFBO0FBQ2hGLFVBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUE7O0FBRXJDLFlBQU0seUJBQVUsVUFBVSxFQUFFLFdBQVcsU0FBUyxFQUFFO0FBQ2hELGNBQU0scUJBQVEsbUJBQW1CLENBQUM7QUFDaEMsZ0JBQU0sRUFBRSxNQUFNO0FBQ2QsYUFBRyxlQUFhLE1BQU0sQ0FBQyxPQUFPLFNBQUksTUFBTSxDQUFDLFFBQVEsU0FBSSxNQUFNLENBQUMsTUFBTSxzQ0FBaUMsVUFBVSxDQUFDLEVBQUUscUJBQWtCO0FBQ2xJLGNBQUksRUFBRSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUU7U0FDL0IsQ0FBQyxDQUFBO09BQ0gsQ0FBQyxDQUFBOztBQUVGLG1CQUFhLElBQUksQ0FBQyxDQUFBO0tBQ25CLENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTs7QUFFRix1QkFBbUIsUUFBUSxDQUFDLE1BQU0sMEJBQXFCLGFBQWEsZ0JBQVk7Q0FDakYsQ0FBQTs7cUJBRWMsTUFBTSIsImZpbGUiOiJibG9ncy91cGxvYWQuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgaGVscGVycyBmcm9tICcuLi9oZWxwZXJzJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IG1rZGlycCBmcm9tICdta2RpcnAnXG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgYXN5bmNFYWNoIGZyb20gJ2NvLWVhY2gnXG5cblByb21pc2UucHJvbWlzaWZ5QWxsKGZzKVxuUHJvbWlzZS5wcm9taXNpZnlBbGwobWtkaXJwKVxuXG52YXIgVXBsb2FkID0gZnVuY3Rpb24gKihhcmd2KSB7XG4gIHZhciBjb25maWcgPSB5aWVsZCBoZWxwZXJzLmxvYWRDb25maWdBc3luYygpXG4gIHZhciB0b3RhbEFydGljbGVzID0gMFxuXG4gIHZhciB0YXJnZXQgPSB5aWVsZCBoZWxwZXJzLmdldFRhcmdldEFzeW5jKGNvbmZpZywgYXJndilcblxuICB2YXIgYmxvZ0RpcnMgPSBmcy5yZWFkZGlyU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ2Jsb2dzJykpLmZpbHRlcihmdW5jdGlvbiAoZmlsZSkge1xuICAgIHJldHVybiBmcy5zdGF0U3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ2Jsb2dzJywgZmlsZSkpLmlzRGlyZWN0b3J5KClcbiAgfSlcblxuICB5aWVsZCBhc3luY0VhY2goYmxvZ0RpcnMsIGZ1bmN0aW9uICooYmxvZ0Rpcikge1xuICAgIHZhciBibG9nUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnYmxvZ3MnLCBibG9nRGlyKVxuXG4gICAgbGV0IGJsb2dKc29uID0geWllbGQgZnMucmVhZEZpbGVBc3luYyhwYXRoLmpvaW4oYmxvZ1BhdGgsICdibG9nLmpzb24nKSlcbiAgICBsZXQgYmxvZ0RhdGEgPSBKU09OLnBhcnNlKGJsb2dKc29uKVxuXG4gICAgdmFyIG5ld0Jsb2cgPSB5aWVsZCBoZWxwZXJzLnNob3BpZnlSZXF1ZXN0QXN5bmMoe1xuICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICB1cmw6IGBodHRwczovLyR7dGFyZ2V0LmFwaV9rZXl9OiR7dGFyZ2V0LnBhc3N3b3JkfUAke3RhcmdldC5kb21haW59Lm15c2hvcGlmeS5jb20vYWRtaW4vYmxvZ3MuanNvbmAsXG4gICAgICBqc29uOiB7IGJsb2c6IGJsb2dEYXRhIH1cbiAgICB9KVxuXG4gICAgbmV3QmxvZyA9IG5ld0Jsb2dbMV0uYmxvZ1xuXG4gICAgdmFyIGFydGljbGVEaXJzID0gZnMucmVhZGRpclN5bmMoYmxvZ1BhdGgpLmZpbHRlcihmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgcmV0dXJuIGZzLnN0YXRTeW5jKHBhdGguam9pbihibG9nUGF0aCwgZmlsZSkpLmlzRGlyZWN0b3J5KClcbiAgICB9KVxuXG4gICAgeWllbGQgYXN5bmNFYWNoKGFydGljbGVEaXJzLCBmdW5jdGlvbiAqKGFydGljbGVEaXIpIHtcbiAgICAgIHZhciBhcnRpY2xlUGF0aCA9IHBhdGguam9pbihibG9nUGF0aCwgYXJ0aWNsZURpcilcblxuICAgICAgdmFyIGFydGljbGVKc29uID0geWllbGQgZnMucmVhZEZpbGVBc3luYyhwYXRoLmpvaW4oYXJ0aWNsZVBhdGgsICdhcnRpY2xlLmpzb24nKSlcbiAgICAgIHZhciBhcnRpY2xlRGF0YSA9IF8ub21pdChKU09OLnBhcnNlKGFydGljbGVKc29uKSwgJ2lkJywgJ2Jsb2dfaWQnKVxuXG4gICAgICB2YXIgbmV3QXJ0aWNsZSA9IHlpZWxkIGhlbHBlcnMuc2hvcGlmeVJlcXVlc3RBc3luYyh7XG4gICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICB1cmw6IGBodHRwczovLyR7dGFyZ2V0LmFwaV9rZXl9OiR7dGFyZ2V0LnBhc3N3b3JkfUAke3RhcmdldC5kb21haW59Lm15c2hvcGlmeS5jb20vYWRtaW4vYmxvZ3MvJHtuZXdCbG9nLmlkfS9hcnRpY2xlcy5qc29uYCxcbiAgICAgICAganNvbjogeyBhcnRpY2xlOiBhcnRpY2xlRGF0YSB9XG4gICAgICB9KVxuXG4gICAgICBuZXdBcnRpY2xlID0gbmV3QXJ0aWNsZVsxXS5hcnRpY2xlXG5cbiAgICAgIHZhciBtZXRhSnNvbiA9IHlpZWxkIGZzLnJlYWRGaWxlQXN5bmMocGF0aC5qb2luKGFydGljbGVQYXRoLCAnbWV0YWZpZWxkcy5qc29uJykpXG4gICAgICB2YXIgbWV0YWZpZWxkcyA9IEpTT04ucGFyc2UobWV0YUpzb24pXG5cbiAgICAgIHlpZWxkIGFzeW5jRWFjaChtZXRhZmllbGRzLCBmdW5jdGlvbiAqKG1ldGFmaWVsZCkge1xuICAgICAgICB5aWVsZCBoZWxwZXJzLnNob3BpZnlSZXF1ZXN0QXN5bmMoe1xuICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICAgIHVybDogYGh0dHBzOi8vJHt0YXJnZXQuYXBpX2tleX06JHt0YXJnZXQucGFzc3dvcmR9QCR7dGFyZ2V0LmRvbWFpbn0ubXlzaG9waWZ5LmNvbS9hZG1pbi9hcnRpY2xlcy8ke25ld0FydGljbGUuaWR9L21ldGFmaWVsZHMuanNvbmAsXG4gICAgICAgICAganNvbjogeyBtZXRhZmllbGQ6IG1ldGFmaWVsZCB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICB0b3RhbEFydGljbGVzICs9IDFcbiAgICB9KVxuICB9KVxuXG4gIHJldHVybiBgVXBsb2FkZWQgJHtibG9nRGlycy5sZW5ndGh9IGJsb2dzIGNvbnRhaW5pbmcgJHt0b3RhbEFydGljbGVzfSBhcnRpY2xlcy5gXG59XG5cbmV4cG9ydCBkZWZhdWx0IFVwbG9hZFxuIl19