'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.promisifyAll(_fs2.default);
_bluebird2.default.promisifyAll(_mkdirp2.default);

var Upload = function* (argv) {
  var config = yield _helpers2.default.loadConfigAsync();
  var totalArticles = 0;

  var target = yield _helpers2.default.getTargetAsync(config, argv);

  var blogDirs = _fs2.default.readdirSync(_path2.default.join(process.cwd(), 'blogs')).filter(function (file) {
    return _fs2.default.statSync(_path2.default.join(process.cwd(), 'blogs', file)).isDirectory();
  });

  yield (0, _coEach2.default)(blogDirs, function* (blogDir) {
    var blogPath = _path2.default.join(process.cwd(), 'blogs', blogDir);

    let blogJson = yield _fs2.default.readFileAsync(_path2.default.join(blogPath, 'blog.json'));
    let blogData = JSON.parse(blogJson);

    var newBlog = yield _helpers2.default.shopifyRequestAsync({
      method: 'post',
      url: `https://${ target.api_key }:${ target.password }@${ target.domain }.myshopify.com/admin/blogs.json`,
      json: { blog: blogData }
    });

    newBlog = newBlog[1].blog;

    var articleDirs = _fs2.default.readdirSync(blogPath).filter(function (file) {
      return _fs2.default.statSync(_path2.default.join(blogPath, file)).isDirectory();
    });

    yield (0, _coEach2.default)(articleDirs, function* (articleDir) {
      var articlePath = _path2.default.join(blogPath, articleDir);

      var articleJson = yield _fs2.default.readFileAsync(_path2.default.join(articlePath, 'article.json'));
      var articleData = _lodash2.default.omit(JSON.parse(articleJson), 'id', 'blog_id');

      var newArticle = yield _helpers2.default.shopifyRequestAsync({
        method: 'post',
        url: `https://${ target.api_key }:${ target.password }@${ target.domain }.myshopify.com/admin/blogs/${ newBlog.id }/articles.json`,
        json: { article: articleData }
      });

      newArticle = newArticle[1].article;

      var metaJson = yield _fs2.default.readFileAsync(_path2.default.join(articlePath, 'metafields.json'));
      var metafields = JSON.parse(metaJson);

      yield (0, _coEach2.default)(metafields, function* (metafield) {
        yield _helpers2.default.shopifyRequestAsync({
          method: 'post',
          url: `https://${ target.api_key }:${ target.password }@${ target.domain }.myshopify.com/admin/articles/${ newArticle.id }/metafields.json`,
          json: { metafield: metafield }
        });
      });

      totalArticles += 1;
    });
  });

  return `Uploaded ${ blogDirs.length } blogs containing ${ totalArticles } articles.`;
};

exports.default = Upload;
//# sourceMappingURL=data:application/json;base64,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QUEyQixHQUFFLE9BQU8sQ0FBQyxFQUFFLEVBQUMsY0FBYyxDQUFDO0FBQzFILFlBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUU7T0FDL0IsQ0FBQyxDQUFBOztBQUVGLGdCQUFVLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQTs7QUFFbEMsVUFBSSxRQUFRLEdBQUcsTUFBTSxhQUFHLGFBQWEsQ0FBQyxlQUFLLElBQUksQ0FBQyxXQUFXLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFBO0FBQ2hGLFVBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUE7O0FBRXJDLFlBQU0sc0JBQVUsVUFBVSxFQUFFLFdBQVcsU0FBUyxFQUFFO0FBQ2hELGNBQU0sa0JBQVEsbUJBQW1CLENBQUM7QUFDaEMsZ0JBQU0sRUFBRSxNQUFNO0FBQ2QsYUFBRyxFQUFFLENBQUMsUUFBUSxHQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUMsQ0FBQyxHQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUMsQ0FBQyxHQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUMsOEJBQThCLEdBQUUsVUFBVSxDQUFDLEVBQUUsRUFBQyxnQkFBZ0IsQ0FBQztBQUNsSSxjQUFJLEVBQUUsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFO1NBQy9CLENBQUMsQ0FBQTtPQUNILENBQUMsQ0FBQTs7QUFFRixtQkFBYSxJQUFJLENBQUMsQ0FBQTtLQUNuQixDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7O0FBRUYsU0FBTyxDQUFDLFNBQVMsR0FBRSxRQUFRLENBQUMsTUFBTSxFQUFDLGtCQUFrQixHQUFFLGFBQWEsRUFBQyxVQUFVLENBQUMsQ0FBQTtDQUNqRixDQUFBOztrQkFFYyxNQUFNIiwiZmlsZSI6ImJsb2dzL3VwbG9hZC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBoZWxwZXJzIGZyb20gJy4uL2hlbHBlcnMnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgbWtkaXJwIGZyb20gJ21rZGlycCdcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBhc3luY0VhY2ggZnJvbSAnY28tZWFjaCdcblxuUHJvbWlzZS5wcm9taXNpZnlBbGwoZnMpXG5Qcm9taXNlLnByb21pc2lmeUFsbChta2RpcnApXG5cbnZhciBVcGxvYWQgPSBmdW5jdGlvbiAqKGFyZ3YpIHtcbiAgdmFyIGNvbmZpZyA9IHlpZWxkIGhlbHBlcnMubG9hZENvbmZpZ0FzeW5jKClcbiAgdmFyIHRvdGFsQXJ0aWNsZXMgPSAwXG5cbiAgdmFyIHRhcmdldCA9IHlpZWxkIGhlbHBlcnMuZ2V0VGFyZ2V0QXN5bmMoY29uZmlnLCBhcmd2KVxuXG4gIHZhciBibG9nRGlycyA9IGZzLnJlYWRkaXJTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnYmxvZ3MnKSkuZmlsdGVyKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgcmV0dXJuIGZzLnN0YXRTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnYmxvZ3MnLCBmaWxlKSkuaXNEaXJlY3RvcnkoKVxuICB9KVxuXG4gIHlpZWxkIGFzeW5jRWFjaChibG9nRGlycywgZnVuY3Rpb24gKihibG9nRGlyKSB7XG4gICAgdmFyIGJsb2dQYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdibG9ncycsIGJsb2dEaXIpXG5cbiAgICBsZXQgYmxvZ0pzb24gPSB5aWVsZCBmcy5yZWFkRmlsZUFzeW5jKHBhdGguam9pbihibG9nUGF0aCwgJ2Jsb2cuanNvbicpKVxuICAgIGxldCBibG9nRGF0YSA9IEpTT04ucGFyc2UoYmxvZ0pzb24pXG5cbiAgICB2YXIgbmV3QmxvZyA9IHlpZWxkIGhlbHBlcnMuc2hvcGlmeVJlcXVlc3RBc3luYyh7XG4gICAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICAgIHVybDogYGh0dHBzOi8vJHt0YXJnZXQuYXBpX2tleX06JHt0YXJnZXQucGFzc3dvcmR9QCR7dGFyZ2V0LmRvbWFpbn0ubXlzaG9waWZ5LmNvbS9hZG1pbi9ibG9ncy5qc29uYCxcbiAgICAgIGpzb246IHsgYmxvZzogYmxvZ0RhdGEgfVxuICAgIH0pXG5cbiAgICBuZXdCbG9nID0gbmV3QmxvZ1sxXS5ibG9nXG5cbiAgICB2YXIgYXJ0aWNsZURpcnMgPSBmcy5yZWFkZGlyU3luYyhibG9nUGF0aCkuZmlsdGVyKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICByZXR1cm4gZnMuc3RhdFN5bmMocGF0aC5qb2luKGJsb2dQYXRoLCBmaWxlKSkuaXNEaXJlY3RvcnkoKVxuICAgIH0pXG5cbiAgICB5aWVsZCBhc3luY0VhY2goYXJ0aWNsZURpcnMsIGZ1bmN0aW9uICooYXJ0aWNsZURpcikge1xuICAgICAgdmFyIGFydGljbGVQYXRoID0gcGF0aC5qb2luKGJsb2dQYXRoLCBhcnRpY2xlRGlyKVxuXG4gICAgICB2YXIgYXJ0aWNsZUpzb24gPSB5aWVsZCBmcy5yZWFkRmlsZUFzeW5jKHBhdGguam9pbihhcnRpY2xlUGF0aCwgJ2FydGljbGUuanNvbicpKVxuICAgICAgdmFyIGFydGljbGVEYXRhID0gXy5vbWl0KEpTT04ucGFyc2UoYXJ0aWNsZUpzb24pLCAnaWQnLCAnYmxvZ19pZCcpXG5cbiAgICAgIHZhciBuZXdBcnRpY2xlID0geWllbGQgaGVscGVycy5zaG9waWZ5UmVxdWVzdEFzeW5jKHtcbiAgICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICAgIHVybDogYGh0dHBzOi8vJHt0YXJnZXQuYXBpX2tleX06JHt0YXJnZXQucGFzc3dvcmR9QCR7dGFyZ2V0LmRvbWFpbn0ubXlzaG9waWZ5LmNvbS9hZG1pbi9ibG9ncy8ke25ld0Jsb2cuaWR9L2FydGljbGVzLmpzb25gLFxuICAgICAgICBqc29uOiB7IGFydGljbGU6IGFydGljbGVEYXRhIH1cbiAgICAgIH0pXG5cbiAgICAgIG5ld0FydGljbGUgPSBuZXdBcnRpY2xlWzFdLmFydGljbGVcblxuICAgICAgdmFyIG1ldGFKc29uID0geWllbGQgZnMucmVhZEZpbGVBc3luYyhwYXRoLmpvaW4oYXJ0aWNsZVBhdGgsICdtZXRhZmllbGRzLmpzb24nKSlcbiAgICAgIHZhciBtZXRhZmllbGRzID0gSlNPTi5wYXJzZShtZXRhSnNvbilcblxuICAgICAgeWllbGQgYXN5bmNFYWNoKG1ldGFmaWVsZHMsIGZ1bmN0aW9uICoobWV0YWZpZWxkKSB7XG4gICAgICAgIHlpZWxkIGhlbHBlcnMuc2hvcGlmeVJlcXVlc3RBc3luYyh7XG4gICAgICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICAgICAgdXJsOiBgaHR0cHM6Ly8ke3RhcmdldC5hcGlfa2V5fToke3RhcmdldC5wYXNzd29yZH1AJHt0YXJnZXQuZG9tYWlufS5teXNob3BpZnkuY29tL2FkbWluL2FydGljbGVzLyR7bmV3QXJ0aWNsZS5pZH0vbWV0YWZpZWxkcy5qc29uYCxcbiAgICAgICAgICBqc29uOiB7IG1ldGFmaWVsZDogbWV0YWZpZWxkIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIHRvdGFsQXJ0aWNsZXMgKz0gMVxuICAgIH0pXG4gIH0pXG5cbiAgcmV0dXJuIGBVcGxvYWRlZCAke2Jsb2dEaXJzLmxlbmd0aH0gYmxvZ3MgY29udGFpbmluZyAke3RvdGFsQXJ0aWNsZXN9IGFydGljbGVzLmBcbn1cblxuZXhwb3J0IGRlZmF1bHQgVXBsb2FkXG4iXX0=