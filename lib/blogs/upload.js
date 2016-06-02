
let _ = require('lodash')
let helpers = require('../helpers')
let fs = require('fs')
fs.mkdirp = require('mkdirp')
Promise.promisifyAll(fs)
let path = require('path')
let asyncEach = require('../asyncEach')
let requestify = require('../requestify')

var Upload = function *(argv) {
  var config = yield helpers.loadConfig()
  var totalArticles = 0

  var target = yield helpers.getTarget(config, argv)

  var blogDirs = fs.readdirSync(path.join(process.cwd(), 'blogs')).filter(function (file) {
    return fs.statSync(path.join(process.cwd(), 'blogs', file)).isDirectory()
  })

  yield asyncEach(blogDirs, function *(blogDir) {
    var blogPath = path.join(process.cwd(), 'blogs', blogDir)

    let blogJson = yield fs.readFileAsync(path.join(blogPath, 'blog.json'), 'utf8')
    let blogData = JSON.parse(blogJson)

    let metaJson = yield fs.readFileAsync(path.join(blogPath, 'metafields.json'), 'utf8')
    let metafields = JSON.parse(metaJson)

    var newBlog = yield requestify(target, {
      method: 'post',
      url: `/admin/blogs.json`,
      data: { blog: blogData }
    })

    newBlog = newBlog.blog

    yield asyncEach(metafields, function *(metafield) {
      yield requestify(target, {
        method: 'post',
        url: `/admin/blogs/${newBlog.id}/metafields.json`,
        data: { metafield: metafield }
      })
    }, {concurrency: config.concurrency})

    var articleDirs = fs.readdirSync(blogPath).filter(function (file) {
      return fs.statSync(path.join(blogPath, file)).isDirectory()
    })

    yield asyncEach(articleDirs, function *(articleDir) {
      var articlePath = path.join(blogPath, articleDir)

      var articleJson = yield fs.readFileAsync(path.join(articlePath, 'article.json'), 'utf8')
      var articleData = _.omit(JSON.parse(articleJson), 'id', 'blog_id')
      articleData.body_html = yield fs.readFileAsync(path.join(articlePath, 'article.html'), 'utf8')

      var newArticle = yield requestify(target, {
        method: 'post',
        url: `/admin/blogs/${newBlog.id}/articles.json`,
        data: { article: articleData }
      })

      newArticle = newArticle.article

      var metaJson = yield fs.readFileAsync(path.join(articlePath, 'metafields.json'), 'utf8')
      var metafields = JSON.parse(metaJson)

      yield asyncEach(metafields, function *(metafield) {
        yield requestify(target, {
          method: 'post',
          url: `/admin/articles/${newArticle.id}/metafields.json`,
          data: { metafield: metafield }
        })
      }, {concurrency: config.concurrency})

      totalArticles += 1
    })
  }, {concurrency: config.concurrency})

  return `Uploaded ${blogDirs.length} blogs containing ${totalArticles} articles.`
}

module.exports = Upload
