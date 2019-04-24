
// let co = require('co')
let helpers = require('../helpers')
let fs = require('fs')
fs.mkdirp = require('mkdirp')
Promise.promisifyAll(fs)
let path = require('path')
let asyncEach = require('../asyncEach')
let requestify = require('../requestify')

// Promise.promisifyAll(fs)
// Promise.promisifyAll(mkdirp)

module.exports = function *(argv) {
  var config = yield helpers.loadConfig()
  var totalArticles = 0

  var target = yield helpers.getTarget(config, argv)

  var {blogs} = yield requestify(target, {
    method: 'get',
    url: `/admin/blogs.json`
  })

  yield asyncEach(blogs, function *(blog, idx) {
    var articles = []
    var pageNum = 1
    var data

    let blogKey = `blogs/${blog.handle}/blog.json`

    yield fs.mkdirpAsync(path.dirname(blogKey))
    yield fs.writeFileAsync(blogKey, JSON.stringify(blog))

    var {metafields} = yield requestify(target, {
      method: 'get',
      url: `/admin/blogs/${blog.id}/metafields.json`
    })

    yield fs.writeFileAsync(`blogs/${blog.handle}/metafields.json`, JSON.stringify(metafields))

    do {
      data = yield requestify(target, {
        method: 'get',
        url: `/admin/blogs/${blog.id}/articles.json?limit=250&page=${pageNum}`
      })
      pageNum += 1
      articles = articles.concat(data.articles)
    } while (data.articles.length > 0)

    yield asyncEach(articles, function *(article, jdx) {
      let cleanName = article.title.replace(/\s/g, '_').replace(/[^a-zA-Z0-9_-]/g, '')
      let jsonKey = `blogs/${blog.handle}/${article.id}-${cleanName}/article.json`
      let htmlKey = `blogs/${blog.handle}/${article.id}-${cleanName}/article.html`

      yield fs.mkdirpAsync(path.dirname(jsonKey))

      let body_html = article.body_html
      delete article.body_html

      yield fs.writeFileAsync(jsonKey, JSON.stringify(article))
      yield fs.writeFileAsync(htmlKey, body_html)

      let {metafields} = yield requestify(target, {
        method: 'get',
        url: `/admin/articles/${article.id}/metafields.json`
      })

      yield fs.writeFileAsync(`blogs/${blog.handle}/${article.id}-${cleanName}/metafields.json`, JSON.stringify(metafields))
    }, {concurrency: config.concurrency})

    totalArticles += articles.length
  }, {concurrency: config.concurrency})

  return `Downloaded ${blogs.length} blogs containing ${totalArticles} articles.`
}
