
import _ from 'lodash'
import helpers from '../helpers'
import fs from 'fs'
import mkdirp from 'mkdirp'
import Promise from 'bluebird'
import path from 'path'
import asyncEach from 'co-each'

Promise.promisifyAll(fs)
Promise.promisifyAll(mkdirp)

var Upload = function *(argv) {
  var config = yield helpers.loadConfigAsync()
  var totalArticles = 0

  var target = yield helpers.getTargetAsync(config, argv)

  var blogDirs = fs.readdirSync(path.join(process.cwd(), 'blogs')).filter(function (file) {
    return fs.statSync(path.join(process.cwd(), 'blogs', file)).isDirectory()
  })

  yield asyncEach(blogDirs, function *(blogDir) {
    var blogPath = path.join(process.cwd(), 'blogs', blogDir)

    let blogJson = yield fs.readFileAsync(path.join(blogPath, 'blog.json'))
    let blogData = JSON.parse(blogJson)

    var newBlog = yield helpers.shopifyRequestAsync({
      method: 'post',
      url: `https://${target.api_key}:${target.password}@${target.domain}.myshopify.com/admin/blogs.json`,
      json: { blog: blogData }
    })

    newBlog = newBlog[1].blog

    var articleDirs = fs.readdirSync(blogPath).filter(function (file) {
      return fs.statSync(path.join(blogPath, file)).isDirectory()
    })

    yield asyncEach(articleDirs, function *(articleDir) {
      var articlePath = path.join(blogPath, articleDir)

      var articleJson = yield fs.readFileAsync(path.join(articlePath, 'article.json'))
      var articleData = _.omit(JSON.parse(articleJson), 'id', 'blog_id')

      var newArticle = yield helpers.shopifyRequestAsync({
        method: 'post',
        url: `https://${target.api_key}:${target.password}@${target.domain}.myshopify.com/admin/blogs/${newBlog.id}/articles.json`,
        json: { article: articleData }
      })

      newArticle = newArticle[1].article

      var metaJson = yield fs.readFileAsync(path.join(articlePath, 'metafields.json'))
      var metafields = JSON.parse(metaJson)

      yield asyncEach(metafields, function *(metafield) {
        yield helpers.shopifyRequestAsync({
          method: 'post',
          url: `https://${target.api_key}:${target.password}@${target.domain}.myshopify.com/admin/articles/${newArticle.id}/metafields.json`,
          json: { metafield: metafield }
        })
      })

      totalArticles += 1
    })
  })

  return `Uploaded ${blogDirs.length} blogs containing ${totalArticles} articles.`
}

export default Upload
