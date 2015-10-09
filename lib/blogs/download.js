'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

var Download = function* Download(argv) {
  var config = yield _helpers2['default'].loadConfigAsync();
  var totalArticles = 0;

  var target = yield _helpers2['default'].getTargetAsync(config, argv);

  var blogs = yield _helpers2['default'].shopifyRequestAsync({
    method: 'get',
    url: 'https://' + target.api_key + ':' + target.password + '@' + target.domain + '.myshopify.com/admin/blogs.json'
  });

  blogs = blogs[1].blogs;

  yield (0, _coEach2['default'])(blogs, function* (blog, idx) {
    var articles = [];
    var pageNum = 1;
    var page = [];

    var blogKey = 'blogs/' + blog.handle + '/blog.json';

    yield _mkdirp2['default'].mkdirpAsync(_path2['default'].dirname(blogKey));
    yield _fs2['default'].writeFileAsync(blogKey, JSON.stringify(blog));

    var metafields = yield _helpers2['default'].shopifyRequestAsync({
      method: 'get',
      url: 'https://' + target.api_key + ':' + target.password + '@' + target.domain + '.myshopify.com/admin/blogs/' + blog.id + '/metafields.json'
    });
    metafields = metafields[1].metafields;

    yield _fs2['default'].writeFileAsync('blogs/' + blog.handle + '/metafields.json', JSON.stringify(metafields));

    do {
      page = yield _helpers2['default'].shopifyRequestAsync({
        method: 'get',
        url: 'https://' + target.api_key + ':' + target.password + '@' + target.domain + '.myshopify.com/admin/blogs/' + blog.id + '/articles.json?page=' + pageNum
      });
      page = page[1].articles;
      pageNum += 1;
      articles = articles.concat(page);
    } while (page.length > 0);

    yield (0, _coEach2['default'])(articles, function* (article, jdx) {
      var key = 'blogs/' + blog.handle + '/' + article.id + '/article.json';

      yield _mkdirp2['default'].mkdirpAsync(_path2['default'].dirname(key));
      yield _fs2['default'].writeFileAsync(key, JSON.stringify(article));

      var metafields = yield _helpers2['default'].shopifyRequestAsync({
        method: 'get',
        url: 'https://' + target.api_key + ':' + target.password + '@' + target.domain + '.myshopify.com/admin/articles/' + article.id + '/metafields.json'
      });
      metafields = metafields[1].metafields;

      yield _fs2['default'].writeFileAsync('blogs/' + blog.handle + '/' + article.id + '/metafields.json', JSON.stringify(metafields));
    });

    totalArticles += articles.length;
  });

  return 'Downloaded ' + blogs.length + ' blogs containing ' + totalArticles + ' articles.';
};

exports['default'] = Download;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QyxHQUFHLENBQUMsQ0FBQyxDQUFBO0FBQzNDLFlBQU0sZ0JBQUcsY0FBYyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7O0FBRXJELFVBQUksVUFBVSxHQUFHLE1BQU0scUJBQVEsbUJBQW1CLENBQUM7QUFDakQsY0FBTSxFQUFFLEtBQUs7QUFDYixXQUFHLGVBQWEsTUFBTSxDQUFDLE9BQU8sU0FBSSxNQUFNLENBQUMsUUFBUSxTQUFJLE1BQU0sQ0FBQyxNQUFNLHNDQUFpQyxPQUFPLENBQUMsRUFBRSxxQkFBa0I7T0FDaEksQ0FBQyxDQUFBO0FBQ0YsZ0JBQVUsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFBOztBQUVyQyxZQUFNLGdCQUFHLGNBQWMsWUFBVSxJQUFJLENBQUMsTUFBTSxTQUFJLE9BQU8sQ0FBQyxFQUFFLHVCQUFvQixJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUE7S0FDMUcsQ0FBQyxDQUFBOztBQUVGLGlCQUFhLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQTtHQUNqQyxDQUFDLENBQUE7O0FBRUYseUJBQXFCLEtBQUssQ0FBQyxNQUFNLDBCQUFxQixhQUFhLGdCQUFZO0NBQ2hGLENBQUE7O3FCQUVjLFFBQVEiLCJmaWxlIjoiYmxvZ3MvZG93bmxvYWQuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgaGVscGVycyBmcm9tICcuLi9oZWxwZXJzJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IG1rZGlycCBmcm9tICdta2RpcnAnXG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgYXN5bmNFYWNoIGZyb20gJ2NvLWVhY2gnXG5cblByb21pc2UucHJvbWlzaWZ5QWxsKGZzKVxuUHJvbWlzZS5wcm9taXNpZnlBbGwobWtkaXJwKVxuXG52YXIgRG93bmxvYWQgPSBmdW5jdGlvbiAqKGFyZ3YpIHtcbiAgdmFyIGNvbmZpZyA9IHlpZWxkIGhlbHBlcnMubG9hZENvbmZpZ0FzeW5jKClcbiAgdmFyIHRvdGFsQXJ0aWNsZXMgPSAwXG5cbiAgdmFyIHRhcmdldCA9IHlpZWxkIGhlbHBlcnMuZ2V0VGFyZ2V0QXN5bmMoY29uZmlnLCBhcmd2KVxuXG4gIHZhciBibG9ncyA9IHlpZWxkIGhlbHBlcnMuc2hvcGlmeVJlcXVlc3RBc3luYyh7XG4gICAgbWV0aG9kOiAnZ2V0JyxcbiAgICB1cmw6IGBodHRwczovLyR7dGFyZ2V0LmFwaV9rZXl9OiR7dGFyZ2V0LnBhc3N3b3JkfUAke3RhcmdldC5kb21haW59Lm15c2hvcGlmeS5jb20vYWRtaW4vYmxvZ3MuanNvbmBcbiAgfSlcblxuICBibG9ncyA9IGJsb2dzWzFdLmJsb2dzXG5cbiAgeWllbGQgYXN5bmNFYWNoKGJsb2dzLCBmdW5jdGlvbiAqKGJsb2csIGlkeCkge1xuICAgIHZhciBhcnRpY2xlcyA9IFtdXG4gICAgdmFyIHBhZ2VOdW0gPSAxXG4gICAgdmFyIHBhZ2UgPSBbXVxuXG4gICAgbGV0IGJsb2dLZXkgPSBgYmxvZ3MvJHtibG9nLmhhbmRsZX0vYmxvZy5qc29uYFxuXG4gICAgeWllbGQgbWtkaXJwLm1rZGlycEFzeW5jKHBhdGguZGlybmFtZShibG9nS2V5KSlcbiAgICB5aWVsZCBmcy53cml0ZUZpbGVBc3luYyhibG9nS2V5LCBKU09OLnN0cmluZ2lmeShibG9nKSlcblxuICAgIHZhciBtZXRhZmllbGRzID0geWllbGQgaGVscGVycy5zaG9waWZ5UmVxdWVzdEFzeW5jKHtcbiAgICAgIG1ldGhvZDogJ2dldCcsXG4gICAgICB1cmw6IGBodHRwczovLyR7dGFyZ2V0LmFwaV9rZXl9OiR7dGFyZ2V0LnBhc3N3b3JkfUAke3RhcmdldC5kb21haW59Lm15c2hvcGlmeS5jb20vYWRtaW4vYmxvZ3MvJHtibG9nLmlkfS9tZXRhZmllbGRzLmpzb25gXG4gICAgfSlcbiAgICBtZXRhZmllbGRzID0gbWV0YWZpZWxkc1sxXS5tZXRhZmllbGRzXG5cbiAgICB5aWVsZCBmcy53cml0ZUZpbGVBc3luYyhgYmxvZ3MvJHtibG9nLmhhbmRsZX0vbWV0YWZpZWxkcy5qc29uYCwgSlNPTi5zdHJpbmdpZnkobWV0YWZpZWxkcykpXG5cbiAgICBkbyB7XG4gICAgICBwYWdlID0geWllbGQgaGVscGVycy5zaG9waWZ5UmVxdWVzdEFzeW5jKHtcbiAgICAgICAgbWV0aG9kOiAnZ2V0JyxcbiAgICAgICAgdXJsOiBgaHR0cHM6Ly8ke3RhcmdldC5hcGlfa2V5fToke3RhcmdldC5wYXNzd29yZH1AJHt0YXJnZXQuZG9tYWlufS5teXNob3BpZnkuY29tL2FkbWluL2Jsb2dzLyR7YmxvZy5pZH0vYXJ0aWNsZXMuanNvbj9wYWdlPSR7cGFnZU51bX1gXG4gICAgICB9KVxuICAgICAgcGFnZSA9IHBhZ2VbMV0uYXJ0aWNsZXNcbiAgICAgIHBhZ2VOdW0gKz0gMVxuICAgICAgYXJ0aWNsZXMgPSBhcnRpY2xlcy5jb25jYXQocGFnZSlcbiAgICB9IHdoaWxlIChwYWdlLmxlbmd0aCA+IDApXG5cbiAgICB5aWVsZCBhc3luY0VhY2goYXJ0aWNsZXMsIGZ1bmN0aW9uICooYXJ0aWNsZSwgamR4KSB7XG4gICAgICBsZXQga2V5ID0gYGJsb2dzLyR7YmxvZy5oYW5kbGV9LyR7YXJ0aWNsZS5pZH0vYXJ0aWNsZS5qc29uYFxuXG4gICAgICB5aWVsZCBta2RpcnAubWtkaXJwQXN5bmMocGF0aC5kaXJuYW1lKGtleSkpXG4gICAgICB5aWVsZCBmcy53cml0ZUZpbGVBc3luYyhrZXksIEpTT04uc3RyaW5naWZ5KGFydGljbGUpKVxuXG4gICAgICB2YXIgbWV0YWZpZWxkcyA9IHlpZWxkIGhlbHBlcnMuc2hvcGlmeVJlcXVlc3RBc3luYyh7XG4gICAgICAgIG1ldGhvZDogJ2dldCcsXG4gICAgICAgIHVybDogYGh0dHBzOi8vJHt0YXJnZXQuYXBpX2tleX06JHt0YXJnZXQucGFzc3dvcmR9QCR7dGFyZ2V0LmRvbWFpbn0ubXlzaG9waWZ5LmNvbS9hZG1pbi9hcnRpY2xlcy8ke2FydGljbGUuaWR9L21ldGFmaWVsZHMuanNvbmBcbiAgICAgIH0pXG4gICAgICBtZXRhZmllbGRzID0gbWV0YWZpZWxkc1sxXS5tZXRhZmllbGRzXG5cbiAgICAgIHlpZWxkIGZzLndyaXRlRmlsZUFzeW5jKGBibG9ncy8ke2Jsb2cuaGFuZGxlfS8ke2FydGljbGUuaWR9L21ldGFmaWVsZHMuanNvbmAsIEpTT04uc3RyaW5naWZ5KG1ldGFmaWVsZHMpKVxuICAgIH0pXG5cbiAgICB0b3RhbEFydGljbGVzICs9IGFydGljbGVzLmxlbmd0aFxuICB9KVxuXG4gIHJldHVybiBgRG93bmxvYWRlZCAke2Jsb2dzLmxlbmd0aH0gYmxvZ3MgY29udGFpbmluZyAke3RvdGFsQXJ0aWNsZXN9IGFydGljbGVzLmBcbn1cblxuZXhwb3J0IGRlZmF1bHQgRG93bmxvYWRcbiJdfQ==