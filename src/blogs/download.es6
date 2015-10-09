
import helpers from '../helpers'
import fs from 'fs'
import mkdirp from 'mkdirp'
import Promise from 'bluebird'
import path from 'path'

Promise.promisifyAll(fs)
Promise.promisifyAll(mkdirp)

var asyncEach = function *(array, fn) {
  for (var i = 0; i < array.length; i++) yield fn(array[i], i)
}

var Download = function *(argv) {
  var config = yield helpers.loadConfigAsync()
  var totalArticles = 0

  var target = yield helpers.getTargetAsync(config, argv)

  var blogs = yield helpers.shopifyRequestAsync({
    method: 'get',
    url: `https://${target.api_key}:${target.password}@${target.domain}.myshopify.com/admin/blogs.json`
  })

  blogs = blogs[1].blogs

  yield asyncEach(blogs, function *(blog, idx) {
    var articles = []
    var pageNum = 1
    var page = []

    let blogKey = `blogs/${blog.handle}/blog.json`

    yield mkdirp.mkdirpAsync(path.dirname(blogKey))
    yield fs.writeFileAsync(blogKey, JSON.stringify(blog))

    var metafields = yield helpers.shopifyRequestAsync({
      method: 'get',
      url: `https://${target.api_key}:${target.password}@${target.domain}.myshopify.com/admin/blogs/${blog.id}/metafields.json`
    })
    metafields = metafields[1].metafields

    yield fs.writeFileAsync(`blogs/${blog.handle}/metafields.json`, JSON.stringify(metafields))

    do {
      page = yield helpers.shopifyRequestAsync({
        method: 'get',
        url: `https://${target.api_key}:${target.password}@${target.domain}.myshopify.com/admin/blogs/${blog.id}/articles.json?page=${pageNum}`
      })
      page = page[1].articles
      pageNum += 1
      articles = articles.concat(page)
    } while (page.length > 0)

    yield asyncEach(articles, function *(article, jdx) {
      let key = `blogs/${blog.handle}/${article.id}/article.json`

      yield mkdirp.mkdirpAsync(path.dirname(key))
      yield fs.writeFileAsync(key, JSON.stringify(article))

      var metafields = yield helpers.shopifyRequestAsync({
        method: 'get',
        url: `https://${target.api_key}:${target.password}@${target.domain}.myshopify.com/admin/articles/${article.id}/metafields.json`
      })
      metafields = metafields[1].metafields

      yield fs.writeFileAsync(`blogs/${blog.handle}/${article.id}/metafields.json`, JSON.stringify(metafields))
    })

    totalArticles += articles.length
  })

  return `Downloaded ${blogs.length} blogs containing ${totalArticles} articles.`
}

export default Download
