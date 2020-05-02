
const _ = require(`lodash`)
const Promise = require(`bluebird`)
const { log, getTarget, loadConfig, parseArticle, parseBlog } = require(`../../helpers`)
// const path = require(`path`)
const fs = require(`fs`)
Promise.promisifyAll(fs)
const requestify = require(`../../requestify`)
const glob = require(`glob`)

module.exports = async function (argv) {
  const config = await loadConfig()
  const target = await getTarget(config, argv)

  let total = 0

  const blogFilePaths = glob.sync(`blogs/*.json`, { nodir: true })

  await Promise.map(blogFilePaths, async function (blogFilePath) {
    const blogSource = await fs.readFileAsync(blogFilePath, `utf8`)
    const blog = parseBlog(blogSource)

    // Get shopify blog
    let res = await requestify(target, {
      method: `get`,
      url: `/blogs.json`,
      qs: {
        handle: blog.handle
      }
    })

    let shopifyBlog = _.get(res, `body.blogs[0]`)

    if (shopifyBlog != null) {
      blog.id = shopifyBlog.id

      res = await requestify(target, {
        method: `put`,
        url: `/blogs/${blog.id}.json`,
        body: {
          blog: _.pick(blog, `id`, `title`, `handle`, `commentable`, `tags`)
        }
      })
    } else {
      res = await requestify(target, {
        method: `post`,
        url: `/blogs.json`,
        body: {
          blog: _.pick(blog, `title`, `handle`, `commentable`, `tags`)
        }
      })

      shopifyBlog = _.get(res, `body.blog`)
    }

    log(`Blog "${blog.handle}" uploading...`, `green`)

    const articleFilePaths = glob.sync(`blogs/${blog.handle}/*.html`, { nodir: true })

    await Promise.map(articleFilePaths, async function (articleFilePath) {
      const articleSource = await fs.readFileAsync(articleFilePath, `utf8`)
      const article = parseArticle(articleSource)

      res = await requestify(target, {
        method: `get`,
        url: `/blogs/${shopifyBlog.id}/articles.json`,
        qs: {
          handle: article.handle
        }
      })

      let shopifyArticle = _.get(res, `body.articles[0]`)

      if (shopifyArticle != null) {
        article.id = shopifyArticle.id

        res = await requestify(target, {
          method: `put`,
          url: `/blogs/${shopifyBlog.id}/articles/${article.id}.json`,
          body: {
            article: _.pick(article, `id`, `body_html`, `summary_html`, `title`, `handle`, `author`, `tags`, `image`, `template_suffix`)
          }
        })
      } else {
        res = await requestify(target, {
          method: `post`,
          url: `/blogs/${shopifyBlog.id}/articles.json`,
          body: {
            article: _.pick(article, `body_html`, `summary_html`, `title`, `handle`, `author`, `tags`, `image`, `template_suffix`)
          }
        })

        shopifyArticle = _.get(res, `body.article`)
      }

      log(`    ${article.handle}`)
      total += 1
    }, { concurrency: 1 })
  })

  return `Uploaded ${total} blog articles.`
}
