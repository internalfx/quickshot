'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.promisifyAll(_fs2.default);
_bluebird2.default.promisifyAll(_mkdirp2.default);

var Download = function* (argv) {
  var config = yield _helpers2.default.loadConfigAsync();
  var totalArticles = 0;

  var target = yield _helpers2.default.getTargetAsync(config, argv);

  var blogs = yield _helpers2.default.shopifyRequestAsync({
    method: 'get',
    url: `https://${ target.api_key }:${ target.password }@${ target.domain }.myshopify.com/admin/blogs.json`
  });

  blogs = blogs[1].blogs;

  yield (0, _coEach2.default)(blogs, function* (blog, idx) {
    var articles = [];
    var pageNum = 1;
    var page = [];

    let blogKey = `blogs/${ blog.handle }/blog.json`;

    yield _mkdirp2.default.mkdirpAsync(_path2.default.dirname(blogKey));
    yield _fs2.default.writeFileAsync(blogKey, JSON.stringify(blog));

    var metafields = yield _helpers2.default.shopifyRequestAsync({
      method: 'get',
      url: `https://${ target.api_key }:${ target.password }@${ target.domain }.myshopify.com/admin/blogs/${ blog.id }/metafields.json`
    });
    metafields = metafields[1].metafields;

    yield _fs2.default.writeFileAsync(`blogs/${ blog.handle }/metafields.json`, JSON.stringify(metafields));

    do {
      page = yield _helpers2.default.shopifyRequestAsync({
        method: 'get',
        url: `https://${ target.api_key }:${ target.password }@${ target.domain }.myshopify.com/admin/blogs/${ blog.id }/articles.json?page=${ pageNum }`
      });
      page = page[1].articles;
      pageNum += 1;
      articles = articles.concat(page);
    } while (page.length > 0);

    yield (0, _coEach2.default)(articles, function* (article, jdx) {
      let key = `blogs/${ blog.handle }/${ article.id }/article.json`;

      yield _mkdirp2.default.mkdirpAsync(_path2.default.dirname(key));
      yield _fs2.default.writeFileAsync(key, JSON.stringify(article));

      var metafields = yield _helpers2.default.shopifyRequestAsync({
        method: 'get',
        url: `https://${ target.api_key }:${ target.password }@${ target.domain }.myshopify.com/admin/articles/${ article.id }/metafields.json`
      });
      metafields = metafields[1].metafields;

      yield _fs2.default.writeFileAsync(`blogs/${ blog.handle }/${ article.id }/metafields.json`, JSON.stringify(metafields));
    });

    totalArticles += articles.length;
  });

  return `Downloaded ${ blogs.length } blogs containing ${ totalArticles } articles.`;
};

exports.default = Download;
//# sourceMappingURL=data:application/json;base64,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b2FkLmVzNiIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IGhlbHBlcnMgZnJvbSAnLi4vaGVscGVycydcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBta2RpcnAgZnJvbSAnbWtkaXJwJ1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IGFzeW5jRWFjaCBmcm9tICdjby1lYWNoJ1xuXG5Qcm9taXNlLnByb21pc2lmeUFsbChmcylcblByb21pc2UucHJvbWlzaWZ5QWxsKG1rZGlycClcblxudmFyIERvd25sb2FkID0gZnVuY3Rpb24gKihhcmd2KSB7XG4gIHZhciBjb25maWcgPSB5aWVsZCBoZWxwZXJzLmxvYWRDb25maWdBc3luYygpXG4gIHZhciB0b3RhbEFydGljbGVzID0gMFxuXG4gIHZhciB0YXJnZXQgPSB5aWVsZCBoZWxwZXJzLmdldFRhcmdldEFzeW5jKGNvbmZpZywgYXJndilcblxuICB2YXIgYmxvZ3MgPSB5aWVsZCBoZWxwZXJzLnNob3BpZnlSZXF1ZXN0QXN5bmMoe1xuICAgIG1ldGhvZDogJ2dldCcsXG4gICAgdXJsOiBgaHR0cHM6Ly8ke3RhcmdldC5hcGlfa2V5fToke3RhcmdldC5wYXNzd29yZH1AJHt0YXJnZXQuZG9tYWlufS5teXNob3BpZnkuY29tL2FkbWluL2Jsb2dzLmpzb25gXG4gIH0pXG5cbiAgYmxvZ3MgPSBibG9nc1sxXS5ibG9nc1xuXG4gIHlpZWxkIGFzeW5jRWFjaChibG9ncywgZnVuY3Rpb24gKihibG9nLCBpZHgpIHtcbiAgICB2YXIgYXJ0aWNsZXMgPSBbXVxuICAgIHZhciBwYWdlTnVtID0gMVxuICAgIHZhciBwYWdlID0gW11cblxuICAgIGxldCBibG9nS2V5ID0gYGJsb2dzLyR7YmxvZy5oYW5kbGV9L2Jsb2cuanNvbmBcblxuICAgIHlpZWxkIG1rZGlycC5ta2RpcnBBc3luYyhwYXRoLmRpcm5hbWUoYmxvZ0tleSkpXG4gICAgeWllbGQgZnMud3JpdGVGaWxlQXN5bmMoYmxvZ0tleSwgSlNPTi5zdHJpbmdpZnkoYmxvZykpXG5cbiAgICB2YXIgbWV0YWZpZWxkcyA9IHlpZWxkIGhlbHBlcnMuc2hvcGlmeVJlcXVlc3RBc3luYyh7XG4gICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgdXJsOiBgaHR0cHM6Ly8ke3RhcmdldC5hcGlfa2V5fToke3RhcmdldC5wYXNzd29yZH1AJHt0YXJnZXQuZG9tYWlufS5teXNob3BpZnkuY29tL2FkbWluL2Jsb2dzLyR7YmxvZy5pZH0vbWV0YWZpZWxkcy5qc29uYFxuICAgIH0pXG4gICAgbWV0YWZpZWxkcyA9IG1ldGFmaWVsZHNbMV0ubWV0YWZpZWxkc1xuXG4gICAgeWllbGQgZnMud3JpdGVGaWxlQXN5bmMoYGJsb2dzLyR7YmxvZy5oYW5kbGV9L21ldGFmaWVsZHMuanNvbmAsIEpTT04uc3RyaW5naWZ5KG1ldGFmaWVsZHMpKVxuXG4gICAgZG8ge1xuICAgICAgcGFnZSA9IHlpZWxkIGhlbHBlcnMuc2hvcGlmeVJlcXVlc3RBc3luYyh7XG4gICAgICAgIG1ldGhvZDogJ2dldCcsXG4gICAgICAgIHVybDogYGh0dHBzOi8vJHt0YXJnZXQuYXBpX2tleX06JHt0YXJnZXQucGFzc3dvcmR9QCR7dGFyZ2V0LmRvbWFpbn0ubXlzaG9waWZ5LmNvbS9hZG1pbi9ibG9ncy8ke2Jsb2cuaWR9L2FydGljbGVzLmpzb24/cGFnZT0ke3BhZ2VOdW19YFxuICAgICAgfSlcbiAgICAgIHBhZ2UgPSBwYWdlWzFdLmFydGljbGVzXG4gICAgICBwYWdlTnVtICs9IDFcbiAgICAgIGFydGljbGVzID0gYXJ0aWNsZXMuY29uY2F0KHBhZ2UpXG4gICAgfSB3aGlsZSAocGFnZS5sZW5ndGggPiAwKVxuXG4gICAgeWllbGQgYXN5bmNFYWNoKGFydGljbGVzLCBmdW5jdGlvbiAqKGFydGljbGUsIGpkeCkge1xuICAgICAgbGV0IGtleSA9IGBibG9ncy8ke2Jsb2cuaGFuZGxlfS8ke2FydGljbGUuaWR9L2FydGljbGUuanNvbmBcblxuICAgICAgeWllbGQgbWtkaXJwLm1rZGlycEFzeW5jKHBhdGguZGlybmFtZShrZXkpKVxuICAgICAgeWllbGQgZnMud3JpdGVGaWxlQXN5bmMoa2V5LCBKU09OLnN0cmluZ2lmeShhcnRpY2xlKSlcblxuICAgICAgdmFyIG1ldGFmaWVsZHMgPSB5aWVsZCBoZWxwZXJzLnNob3BpZnlSZXF1ZXN0QXN5bmMoe1xuICAgICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgICB1cmw6IGBodHRwczovLyR7dGFyZ2V0LmFwaV9rZXl9OiR7dGFyZ2V0LnBhc3N3b3JkfUAke3RhcmdldC5kb21haW59Lm15c2hvcGlmeS5jb20vYWRtaW4vYXJ0aWNsZXMvJHthcnRpY2xlLmlkfS9tZXRhZmllbGRzLmpzb25gXG4gICAgICB9KVxuICAgICAgbWV0YWZpZWxkcyA9IG1ldGFmaWVsZHNbMV0ubWV0YWZpZWxkc1xuXG4gICAgICB5aWVsZCBmcy53cml0ZUZpbGVBc3luYyhgYmxvZ3MvJHtibG9nLmhhbmRsZX0vJHthcnRpY2xlLmlkfS9tZXRhZmllbGRzLmpzb25gLCBKU09OLnN0cmluZ2lmeShtZXRhZmllbGRzKSlcbiAgICB9KVxuXG4gICAgdG90YWxBcnRpY2xlcyArPSBhcnRpY2xlcy5sZW5ndGhcbiAgfSlcblxuICByZXR1cm4gYERvd25sb2FkZWQgJHtibG9ncy5sZW5ndGh9IGJsb2dzIGNvbnRhaW5pbmcgJHt0b3RhbEFydGljbGVzfSBhcnRpY2xlcy5gXG59XG5cbmV4cG9ydCBkZWZhdWx0IERvd25sb2FkXG4iXX0=