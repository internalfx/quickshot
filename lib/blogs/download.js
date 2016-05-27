
let helpers = require('../helpers')
let fs = require('fs')
let mkdirp = require('mkdirp')
let Promise = require('bluebird')
let path = require('path')
let asyncEach = require('co-each')
let requestify = require('../requestify')

Promise.promisifyAll(fs)
Promise.promisifyAll(mkdirp)

var Download = function *(argv) {
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

    yield mkdirp.mkdirpAsync(path.dirname(blogKey))
    yield fs.writeFileAsync(blogKey, JSON.stringify(blog))

    var {metafields} = yield requestify(target, {
      method: 'get',
      url: `/admin/blogs/${blog.id}/metafields.json`
    })

    yield fs.writeFileAsync(`blogs/${blog.handle}/metafields.json`, JSON.stringify(metafields))

    do {
      data = yield requestify(target, {
        method: 'get',
        url: `/admin/blogs/${blog.id}/articles.json?page=${pageNum}`
      })
      pageNum += 1
      articles = articles.concat(data.articles)
    } while (data.articles.length > 0)

    yield asyncEach(articles, function *(article, jdx) {
      let key = `blogs/${blog.handle}/${article.id}/article.json`

      yield mkdirp.mkdirpAsync(path.dirname(key))
      yield fs.writeFileAsync(key, JSON.stringify(article))

      let {metafields} = yield requestify(target, {
        method: 'get',
        url: `/admin/articles/${article.id}/metafields.json`
      })

      yield fs.writeFileAsync(`blogs/${blog.handle}/${article.id}/metafields.json`, JSON.stringify(metafields))
    })

    totalArticles += articles.length
  })

  return `Downloaded ${blogs.length} blogs containing ${totalArticles} articles.`
}

module.exports = Download
