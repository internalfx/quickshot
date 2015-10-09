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
//# sourceMappingURL=data:application/json;base64,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SUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUM7O0FBRXpCLFVBQU0sU0FBUyxDQUFDLFFBQVEsRUFBRSxXQUFXLE9BQU8sRUFBRSxHQUFHLEVBQUU7QUFDakQsVUFBSSxHQUFHLGlCQUFlLElBQUksQ0FBQyxNQUFNLFNBQUksT0FBTyxDQUFDLEVBQUUsa0JBQWUsQ0FBQTs7QUFFOUQsWUFBTSxvQkFBTyxXQUFXLENBQUMsa0JBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFDM0MsWUFBTSxnQkFBRyxjQUFjLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtLQUN0RCxDQUFDLENBQUE7O0FBRUYsaUJBQWEsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFBO0dBQ2pDLENBQUMsQ0FBQTs7QUFFRix5QkFBcUIsS0FBSyxDQUFDLE1BQU0sMEJBQXFCLGFBQWEsZ0JBQVk7Q0FDaEYsQ0FBQTs7cUJBRWMsUUFBUSIsImZpbGUiOiJibG9ncy91cGxvYWQuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgaGVscGVycyBmcm9tICcuLi9oZWxwZXJzJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IG1rZGlycCBmcm9tICdta2RpcnAnXG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cblByb21pc2UucHJvbWlzaWZ5QWxsKGZzKVxuUHJvbWlzZS5wcm9taXNpZnlBbGwobWtkaXJwKVxuXG52YXIgYXN5bmNFYWNoID0gZnVuY3Rpb24gKihhcnJheSwgZm4pIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykgeWllbGQgZm4oYXJyYXlbaV0sIGkpXG59XG5cbnZhciBEb3dubG9hZCA9IGZ1bmN0aW9uICooYXJndikge1xuICB2YXIgY29uZmlnID0geWllbGQgaGVscGVycy5sb2FkQ29uZmlnQXN5bmMoKVxuICB2YXIgdG90YWxBcnRpY2xlcyA9IDBcblxuICB2YXIgdGFyZ2V0ID0geWllbGQgaGVscGVycy5nZXRUYXJnZXRBc3luYyhjb25maWcsIGFyZ3YpXG5cbiAgdmFyIGJsb2dzID0geWllbGQgaGVscGVycy5zaG9waWZ5UmVxdWVzdEFzeW5jKHtcbiAgICBtZXRob2Q6ICdnZXQnLFxuICAgIHVybDogYGh0dHBzOi8vJHt0YXJnZXQuYXBpX2tleX06JHt0YXJnZXQucGFzc3dvcmR9QCR7dGFyZ2V0LmRvbWFpbn0ubXlzaG9waWZ5LmNvbS9hZG1pbi9ibG9ncy5qc29uYFxuICB9KVxuXG4gIGJsb2dzID0gYmxvZ3NbMV0uYmxvZ3NcblxuICB5aWVsZCBhc3luY0VhY2goYmxvZ3MsIGZ1bmN0aW9uICooYmxvZywgaWR4KSB7XG4gICAgdmFyIGFydGljbGVzID0gW11cbiAgICB2YXIgcGFnZU51bSA9IDFcbiAgICB2YXIgcGFnZSA9IFtdXG5cbiAgICBsZXQgYmxvZ0tleSA9IGBhcnRpY2xlcy8ke2Jsb2cuaGFuZGxlfS9ibG9nLmpzb25gXG5cbiAgICB5aWVsZCBta2RpcnAubWtkaXJwQXN5bmMocGF0aC5kaXJuYW1lKGJsb2dLZXkpKVxuICAgIHlpZWxkIGZzLndyaXRlRmlsZUFzeW5jKGJsb2dLZXksIEpTT04uc3RyaW5naWZ5KGJsb2cpKVxuXG4gICAgdmFyIG1ldGFmaWVsZHMgPSB5aWVsZCBoZWxwZXJzLnNob3BpZnlSZXF1ZXN0QXN5bmMoe1xuICAgICAgbWV0aG9kOiAnZ2V0JyxcbiAgICAgIHVybDogYGh0dHBzOi8vJHt0YXJnZXQuYXBpX2tleX06JHt0YXJnZXQucGFzc3dvcmR9QCR7dGFyZ2V0LmRvbWFpbn0ubXlzaG9waWZ5LmNvbS9hZG1pbi9ibG9ncy8ke2Jsb2cuaWR9L21ldGFmaWVsZHMuanNvbmBcbiAgICB9KVxuICAgIG1ldGFmaWVsZHMgPSBtZXRhZmllbGRzWzFdLm1ldGFmaWVsZHNcblxuICAgIHlpZWxkIGZzLndyaXRlRmlsZUFzeW5jKGBhcnRpY2xlcy8ke2Jsb2cuaGFuZGxlfS9tZXRhZmllbGRzLmpzb25gLCBKU09OLnN0cmluZ2lmeShtZXRhZmllbGRzKSlcblxuICAgIGRvIHtcbiAgICAgIHBhZ2UgPSB5aWVsZCBoZWxwZXJzLnNob3BpZnlSZXF1ZXN0QXN5bmMoe1xuICAgICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgICB1cmw6IGBodHRwczovLyR7dGFyZ2V0LmFwaV9rZXl9OiR7dGFyZ2V0LnBhc3N3b3JkfUAke3RhcmdldC5kb21haW59Lm15c2hvcGlmeS5jb20vYWRtaW4vYmxvZ3MvJHtibG9nLmlkfS9hcnRpY2xlcy5qc29uP3BhZ2U9JHtwYWdlTnVtfWBcbiAgICAgIH0pXG4gICAgICBwYWdlID0gcGFnZVsxXS5hcnRpY2xlc1xuICAgICAgcGFnZU51bSArPSAxXG4gICAgICBhcnRpY2xlcyA9IGFydGljbGVzLmNvbmNhdChwYWdlKVxuICAgIH0gd2hpbGUgKHBhZ2UubGVuZ3RoID4gMClcblxuICAgIHlpZWxkIGFzeW5jRWFjaChhcnRpY2xlcywgZnVuY3Rpb24gKihhcnRpY2xlLCBqZHgpIHtcbiAgICAgIGxldCBrZXkgPSBgYXJ0aWNsZXMvJHtibG9nLmhhbmRsZX0vJHthcnRpY2xlLmlkfS9hcnRpY2xlLmpzb25gXG5cbiAgICAgIHlpZWxkIG1rZGlycC5ta2RpcnBBc3luYyhwYXRoLmRpcm5hbWUoa2V5KSlcbiAgICAgIHlpZWxkIGZzLndyaXRlRmlsZUFzeW5jKGtleSwgSlNPTi5zdHJpbmdpZnkoYXJ0aWNsZSkpXG4gICAgfSlcblxuICAgIHRvdGFsQXJ0aWNsZXMgKz0gYXJ0aWNsZXMubGVuZ3RoXG4gIH0pXG5cbiAgcmV0dXJuIGBEb3dubG9hZGVkICR7YmxvZ3MubGVuZ3RofSBibG9ncyBjb250YWluaW5nICR7dG90YWxBcnRpY2xlc30gYXJ0aWNsZXMuYFxufVxuXG5leHBvcnQgZGVmYXVsdCBEb3dubG9hZFxuIl19