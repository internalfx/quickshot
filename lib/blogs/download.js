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

    yield asyncEach(articles, function* (article, jdx) {
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
//# sourceMappingURL=data:application/json;base64,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LElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFDOztBQUV6QixVQUFNLFNBQVMsQ0FBQyxRQUFRLEVBQUUsV0FBVyxPQUFPLEVBQUUsR0FBRyxFQUFFO0FBQ2pELFVBQUksR0FBRyxjQUFZLElBQUksQ0FBQyxNQUFNLFNBQUksT0FBTyxDQUFDLEVBQUUsa0JBQWUsQ0FBQTs7QUFFM0QsWUFBTSxvQkFBTyxXQUFXLENBQUMsa0JBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFDM0MsWUFBTSxnQkFBRyxjQUFjLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTs7QUFFckQsVUFBSSxVQUFVLEdBQUcsTUFBTSxxQkFBUSxtQkFBbUIsQ0FBQztBQUNqRCxjQUFNLEVBQUUsS0FBSztBQUNiLFdBQUcsZUFBYSxNQUFNLENBQUMsT0FBTyxTQUFJLE1BQU0sQ0FBQyxRQUFRLFNBQUksTUFBTSxDQUFDLE1BQU0sc0NBQWlDLE9BQU8sQ0FBQyxFQUFFLHFCQUFrQjtPQUNoSSxDQUFDLENBQUE7QUFDRixnQkFBVSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUE7O0FBRXJDLFlBQU0sZ0JBQUcsY0FBYyxZQUFVLElBQUksQ0FBQyxNQUFNLFNBQUksT0FBTyxDQUFDLEVBQUUsdUJBQW9CLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQTtLQUMxRyxDQUFDLENBQUE7O0FBRUYsaUJBQWEsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFBO0dBQ2pDLENBQUMsQ0FBQTs7QUFFRix5QkFBcUIsS0FBSyxDQUFDLE1BQU0sMEJBQXFCLGFBQWEsZ0JBQVk7Q0FDaEYsQ0FBQTs7cUJBRWMsUUFBUSIsImZpbGUiOiJibG9ncy9kb3dubG9hZC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBoZWxwZXJzIGZyb20gJy4uL2hlbHBlcnMnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgbWtkaXJwIGZyb20gJ21rZGlycCdcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuUHJvbWlzZS5wcm9taXNpZnlBbGwoZnMpXG5Qcm9taXNlLnByb21pc2lmeUFsbChta2RpcnApXG5cbnZhciBhc3luY0VhY2ggPSBmdW5jdGlvbiAqKGFycmF5LCBmbikge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB5aWVsZCBmbihhcnJheVtpXSwgaSlcbn1cblxudmFyIERvd25sb2FkID0gZnVuY3Rpb24gKihhcmd2KSB7XG4gIHZhciBjb25maWcgPSB5aWVsZCBoZWxwZXJzLmxvYWRDb25maWdBc3luYygpXG4gIHZhciB0b3RhbEFydGljbGVzID0gMFxuXG4gIHZhciB0YXJnZXQgPSB5aWVsZCBoZWxwZXJzLmdldFRhcmdldEFzeW5jKGNvbmZpZywgYXJndilcblxuICB2YXIgYmxvZ3MgPSB5aWVsZCBoZWxwZXJzLnNob3BpZnlSZXF1ZXN0QXN5bmMoe1xuICAgIG1ldGhvZDogJ2dldCcsXG4gICAgdXJsOiBgaHR0cHM6Ly8ke3RhcmdldC5hcGlfa2V5fToke3RhcmdldC5wYXNzd29yZH1AJHt0YXJnZXQuZG9tYWlufS5teXNob3BpZnkuY29tL2FkbWluL2Jsb2dzLmpzb25gXG4gIH0pXG5cbiAgYmxvZ3MgPSBibG9nc1sxXS5ibG9nc1xuXG4gIHlpZWxkIGFzeW5jRWFjaChibG9ncywgZnVuY3Rpb24gKihibG9nLCBpZHgpIHtcbiAgICB2YXIgYXJ0aWNsZXMgPSBbXVxuICAgIHZhciBwYWdlTnVtID0gMVxuICAgIHZhciBwYWdlID0gW11cblxuICAgIGxldCBibG9nS2V5ID0gYGJsb2dzLyR7YmxvZy5oYW5kbGV9L2Jsb2cuanNvbmBcblxuICAgIHlpZWxkIG1rZGlycC5ta2RpcnBBc3luYyhwYXRoLmRpcm5hbWUoYmxvZ0tleSkpXG4gICAgeWllbGQgZnMud3JpdGVGaWxlQXN5bmMoYmxvZ0tleSwgSlNPTi5zdHJpbmdpZnkoYmxvZykpXG5cbiAgICB2YXIgbWV0YWZpZWxkcyA9IHlpZWxkIGhlbHBlcnMuc2hvcGlmeVJlcXVlc3RBc3luYyh7XG4gICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgdXJsOiBgaHR0cHM6Ly8ke3RhcmdldC5hcGlfa2V5fToke3RhcmdldC5wYXNzd29yZH1AJHt0YXJnZXQuZG9tYWlufS5teXNob3BpZnkuY29tL2FkbWluL2Jsb2dzLyR7YmxvZy5pZH0vbWV0YWZpZWxkcy5qc29uYFxuICAgIH0pXG4gICAgbWV0YWZpZWxkcyA9IG1ldGFmaWVsZHNbMV0ubWV0YWZpZWxkc1xuXG4gICAgeWllbGQgZnMud3JpdGVGaWxlQXN5bmMoYGJsb2dzLyR7YmxvZy5oYW5kbGV9L21ldGFmaWVsZHMuanNvbmAsIEpTT04uc3RyaW5naWZ5KG1ldGFmaWVsZHMpKVxuXG4gICAgZG8ge1xuICAgICAgcGFnZSA9IHlpZWxkIGhlbHBlcnMuc2hvcGlmeVJlcXVlc3RBc3luYyh7XG4gICAgICAgIG1ldGhvZDogJ2dldCcsXG4gICAgICAgIHVybDogYGh0dHBzOi8vJHt0YXJnZXQuYXBpX2tleX06JHt0YXJnZXQucGFzc3dvcmR9QCR7dGFyZ2V0LmRvbWFpbn0ubXlzaG9waWZ5LmNvbS9hZG1pbi9ibG9ncy8ke2Jsb2cuaWR9L2FydGljbGVzLmpzb24/cGFnZT0ke3BhZ2VOdW19YFxuICAgICAgfSlcbiAgICAgIHBhZ2UgPSBwYWdlWzFdLmFydGljbGVzXG4gICAgICBwYWdlTnVtICs9IDFcbiAgICAgIGFydGljbGVzID0gYXJ0aWNsZXMuY29uY2F0KHBhZ2UpXG4gICAgfSB3aGlsZSAocGFnZS5sZW5ndGggPiAwKVxuXG4gICAgeWllbGQgYXN5bmNFYWNoKGFydGljbGVzLCBmdW5jdGlvbiAqKGFydGljbGUsIGpkeCkge1xuICAgICAgbGV0IGtleSA9IGBibG9ncy8ke2Jsb2cuaGFuZGxlfS8ke2FydGljbGUuaWR9L2FydGljbGUuanNvbmBcblxuICAgICAgeWllbGQgbWtkaXJwLm1rZGlycEFzeW5jKHBhdGguZGlybmFtZShrZXkpKVxuICAgICAgeWllbGQgZnMud3JpdGVGaWxlQXN5bmMoa2V5LCBKU09OLnN0cmluZ2lmeShhcnRpY2xlKSlcblxuICAgICAgdmFyIG1ldGFmaWVsZHMgPSB5aWVsZCBoZWxwZXJzLnNob3BpZnlSZXF1ZXN0QXN5bmMoe1xuICAgICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgICB1cmw6IGBodHRwczovLyR7dGFyZ2V0LmFwaV9rZXl9OiR7dGFyZ2V0LnBhc3N3b3JkfUAke3RhcmdldC5kb21haW59Lm15c2hvcGlmeS5jb20vYWRtaW4vYXJ0aWNsZXMvJHthcnRpY2xlLmlkfS9tZXRhZmllbGRzLmpzb25gXG4gICAgICB9KVxuICAgICAgbWV0YWZpZWxkcyA9IG1ldGFmaWVsZHNbMV0ubWV0YWZpZWxkc1xuXG4gICAgICB5aWVsZCBmcy53cml0ZUZpbGVBc3luYyhgYmxvZ3MvJHtibG9nLmhhbmRsZX0vJHthcnRpY2xlLmlkfS9tZXRhZmllbGRzLmpzb25gLCBKU09OLnN0cmluZ2lmeShtZXRhZmllbGRzKSlcbiAgICB9KVxuXG4gICAgdG90YWxBcnRpY2xlcyArPSBhcnRpY2xlcy5sZW5ndGhcbiAgfSlcblxuICByZXR1cm4gYERvd25sb2FkZWQgJHtibG9ncy5sZW5ndGh9IGJsb2dzIGNvbnRhaW5pbmcgJHt0b3RhbEFydGljbGVzfSBhcnRpY2xlcy5gXG59XG5cbmV4cG9ydCBkZWZhdWx0IERvd25sb2FkXG4iXX0=