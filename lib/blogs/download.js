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

_bluebird2['default'].promisifyAll(_fs2['default']);
_bluebird2['default'].promisifyAll(_mkdirp2['default']);

var asyncEach = function* asyncEach(array, fn) {
  for (var i = 0; i < array.length; i++) yield fn(array[i], i);
};

var Download = function* Download(argv) {
  var config = yield _helpers2['default'].loadConfigAsync();
  var totalArticles = 0;

  var target = yield _helpers2['default'].getTargetAsync(config, argv);

  var blogs = yield _helpers2['default'].shopifyRequestAsync({
    method: 'get',
    url: 'https://' + target.api_key + ':' + target.password + '@' + target.domain + '.myshopify.com/admin/blogs.json'
  });

  blogs = blogs[1].blogs;

  yield asyncEach(blogs, function* (blog, idx) {
    var articles = [];
    var pageNum = 1;
    var page = [];

    var blogKey = 'articles/' + blog.handle + '/blog.json';

    yield _mkdirp2['default'].mkdirpAsync(_path2['default'].dirname(blogKey));
    yield _fs2['default'].writeFileAsync(blogKey, JSON.stringify(blog));

    var metafields = yield _helpers2['default'].shopifyRequestAsync({
      method: 'get',
      url: 'https://' + target.api_key + ':' + target.password + '@' + target.domain + '.myshopify.com/admin/blogs/' + blog.id + '/metafields.json'
    });
    metafields = metafields[1].metafields;

    yield _fs2['default'].writeFileAsync('articles/' + blog.handle + '/metafields.json', JSON.stringify(metafields));

    do {
      page = yield _helpers2['default'].shopifyRequestAsync({
        method: 'get',
        url: 'https://' + target.api_key + ':' + target.password + '@' + target.domain + '.myshopify.com/admin/blogs/' + blog.id + '/articles.json?page=' + pageNum
      });
      page = page[1].articles;
      pageNum += 1;
      articles = articles.concat(page);
    } while (page.length > 0);

    yield asyncEach(articles, function* (article, jdx) {
      var key = 'articles/' + blog.handle + '/' + article.id + '/article.json';

      yield _mkdirp2['default'].mkdirpAsync(_path2['default'].dirname(key));
      yield _fs2['default'].writeFileAsync(key, JSON.stringify(article));
    });

    totalArticles += articles.length;
  });

  return 'Downloaded ' + blogs.length + ' blogs containing ' + totalArticles + ' articles.';
};

exports['default'] = Download;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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USxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBQzs7QUFFekIsVUFBTSxTQUFTLENBQUMsUUFBUSxFQUFFLFdBQVcsT0FBTyxFQUFFLEdBQUcsRUFBRTtBQUNqRCxVQUFJLEdBQUcsaUJBQWUsSUFBSSxDQUFDLE1BQU0sU0FBSSxPQUFPLENBQUMsRUFBRSxrQkFBZSxDQUFBOztBQUU5RCxZQUFNLG9CQUFPLFdBQVcsQ0FBQyxrQkFBSyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtBQUMzQyxZQUFNLGdCQUFHLGNBQWMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0tBQ3RELENBQUMsQ0FBQTs7QUFFRixpQkFBYSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUE7R0FDakMsQ0FBQyxDQUFBOztBQUVGLHlCQUFxQixLQUFLLENBQUMsTUFBTSwwQkFBcUIsYUFBYSxnQkFBWTtDQUNoRixDQUFBOztxQkFFYyxRQUFRIiwiZmlsZSI6ImJsb2dzL2Rvd25sb2FkLmVzNiIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IGhlbHBlcnMgZnJvbSAnLi4vaGVscGVycydcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBta2RpcnAgZnJvbSAnbWtkaXJwJ1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuXG5Qcm9taXNlLnByb21pc2lmeUFsbChmcylcblByb21pc2UucHJvbWlzaWZ5QWxsKG1rZGlycClcblxudmFyIGFzeW5jRWFjaCA9IGZ1bmN0aW9uICooYXJyYXksIGZuKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHlpZWxkIGZuKGFycmF5W2ldLCBpKVxufVxuXG52YXIgRG93bmxvYWQgPSBmdW5jdGlvbiAqKGFyZ3YpIHtcbiAgdmFyIGNvbmZpZyA9IHlpZWxkIGhlbHBlcnMubG9hZENvbmZpZ0FzeW5jKClcbiAgdmFyIHRvdGFsQXJ0aWNsZXMgPSAwXG5cbiAgdmFyIHRhcmdldCA9IHlpZWxkIGhlbHBlcnMuZ2V0VGFyZ2V0QXN5bmMoY29uZmlnLCBhcmd2KVxuXG4gIHZhciBibG9ncyA9IHlpZWxkIGhlbHBlcnMuc2hvcGlmeVJlcXVlc3RBc3luYyh7XG4gICAgbWV0aG9kOiAnZ2V0JyxcbiAgICB1cmw6IGBodHRwczovLyR7dGFyZ2V0LmFwaV9rZXl9OiR7dGFyZ2V0LnBhc3N3b3JkfUAke3RhcmdldC5kb21haW59Lm15c2hvcGlmeS5jb20vYWRtaW4vYmxvZ3MuanNvbmBcbiAgfSlcblxuICBibG9ncyA9IGJsb2dzWzFdLmJsb2dzXG5cbiAgeWllbGQgYXN5bmNFYWNoKGJsb2dzLCBmdW5jdGlvbiAqKGJsb2csIGlkeCkge1xuICAgIHZhciBhcnRpY2xlcyA9IFtdXG4gICAgdmFyIHBhZ2VOdW0gPSAxXG4gICAgdmFyIHBhZ2UgPSBbXVxuXG4gICAgbGV0IGJsb2dLZXkgPSBgYXJ0aWNsZXMvJHtibG9nLmhhbmRsZX0vYmxvZy5qc29uYFxuXG4gICAgeWllbGQgbWtkaXJwLm1rZGlycEFzeW5jKHBhdGguZGlybmFtZShibG9nS2V5KSlcbiAgICB5aWVsZCBmcy53cml0ZUZpbGVBc3luYyhibG9nS2V5LCBKU09OLnN0cmluZ2lmeShibG9nKSlcblxuICAgIHZhciBtZXRhZmllbGRzID0geWllbGQgaGVscGVycy5zaG9waWZ5UmVxdWVzdEFzeW5jKHtcbiAgICAgIG1ldGhvZDogJ2dldCcsXG4gICAgICB1cmw6IGBodHRwczovLyR7dGFyZ2V0LmFwaV9rZXl9OiR7dGFyZ2V0LnBhc3N3b3JkfUAke3RhcmdldC5kb21haW59Lm15c2hvcGlmeS5jb20vYWRtaW4vYmxvZ3MvJHtibG9nLmlkfS9tZXRhZmllbGRzLmpzb25gXG4gICAgfSlcbiAgICBtZXRhZmllbGRzID0gbWV0YWZpZWxkc1sxXS5tZXRhZmllbGRzXG5cbiAgICB5aWVsZCBmcy53cml0ZUZpbGVBc3luYyhgYXJ0aWNsZXMvJHtibG9nLmhhbmRsZX0vbWV0YWZpZWxkcy5qc29uYCwgSlNPTi5zdHJpbmdpZnkobWV0YWZpZWxkcykpXG5cbiAgICBkbyB7XG4gICAgICBwYWdlID0geWllbGQgaGVscGVycy5zaG9waWZ5UmVxdWVzdEFzeW5jKHtcbiAgICAgICAgbWV0aG9kOiAnZ2V0JyxcbiAgICAgICAgdXJsOiBgaHR0cHM6Ly8ke3RhcmdldC5hcGlfa2V5fToke3RhcmdldC5wYXNzd29yZH1AJHt0YXJnZXQuZG9tYWlufS5teXNob3BpZnkuY29tL2FkbWluL2Jsb2dzLyR7YmxvZy5pZH0vYXJ0aWNsZXMuanNvbj9wYWdlPSR7cGFnZU51bX1gXG4gICAgICB9KVxuICAgICAgcGFnZSA9IHBhZ2VbMV0uYXJ0aWNsZXNcbiAgICAgIHBhZ2VOdW0gKz0gMVxuICAgICAgYXJ0aWNsZXMgPSBhcnRpY2xlcy5jb25jYXQocGFnZSlcbiAgICB9IHdoaWxlIChwYWdlLmxlbmd0aCA+IDApXG5cbiAgICB5aWVsZCBhc3luY0VhY2goYXJ0aWNsZXMsIGZ1bmN0aW9uICooYXJ0aWNsZSwgamR4KSB7XG4gICAgICBsZXQga2V5ID0gYGFydGljbGVzLyR7YmxvZy5oYW5kbGV9LyR7YXJ0aWNsZS5pZH0vYXJ0aWNsZS5qc29uYFxuXG4gICAgICB5aWVsZCBta2RpcnAubWtkaXJwQXN5bmMocGF0aC5kaXJuYW1lKGtleSkpXG4gICAgICB5aWVsZCBmcy53cml0ZUZpbGVBc3luYyhrZXksIEpTT04uc3RyaW5naWZ5KGFydGljbGUpKVxuICAgIH0pXG5cbiAgICB0b3RhbEFydGljbGVzICs9IGFydGljbGVzLmxlbmd0aFxuICB9KVxuXG4gIHJldHVybiBgRG93bmxvYWRlZCAke2Jsb2dzLmxlbmd0aH0gYmxvZ3MgY29udGFpbmluZyAke3RvdGFsQXJ0aWNsZXN9IGFydGljbGVzLmBcbn1cblxuZXhwb3J0IGRlZmF1bHQgRG93bmxvYWRcbiJdfQ==