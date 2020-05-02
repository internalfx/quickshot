
const _ = require(`lodash`)
const Promise = require(`bluebird`)
const { log, getTarget, loadConfig, mkdir, stringifyArticle } = require(`../../helpers`)
// const ignoreParser = require(`gitignore-parser`)
const path = require(`path`)
const fs = require(`fs`)
Promise.promisifyAll(fs)
const requestify = require(`../../requestify`)

module.exports = async function (argv) {
  // let ignore = null
  const config = await loadConfig()
  const target = await getTarget(config, argv)

  let total = 0
  // var filter = argv.filter ? new RegExp(`^${argv.filter}`) : null

  // try {
  //   const ignoreFile = await fs.readFileAsync(`.quickshot-ignore`, `utf8`)
  //   ignore = ignoreParser.compile(ignoreFile)
  // } catch (err) {}

  const processBlogs = async function (blogs) {
    await Promise.map(blogs, async function (blog) {
      let res = await requestify(target, {
        method: `get`,
        url: `/blogs/${blog.id}/articles.json`,
        qs: {
          limit: 100
        }
      })

      let articlesDone = false

      if (_.get(res, `body.articles.length`) === 0) {
        articlesDone = true
      }

      await mkdir(path.join(process.cwd(), `blogs`, blog.handle))
      await fs.writeFileAsync(path.join(process.cwd(), `blogs`, `${blog.handle}.json`), JSON.stringify(_.omit(blog, `id`), null, 2))

      log(`Blog "${blog.handle}"`, `green`)

      // Process Articles
      while (articlesDone === false) {
        const articles = _.get(res, `body.articles`)

        await Promise.map(articles, async function (article) {
          await fs.writeFileAsync(path.join(process.cwd(), `blogs`, blog.handle, `${article.handle}.html`), stringifyArticle(article))

          log(`    ${article.handle}`)
          total += 1
        })

        if (res.linkNext == null) {
          articlesDone = true
          break
        }

        res = await requestify(target, {
          method: `get`,
          url: `/blogs/${blog.id}/articles.json`,
          qs: {
            limit: 100,
            page_info: res.linkNext.searchParams.get(`page_info`)
          }
        })
      }
    })
  }

  let res = await requestify(target, {
    method: `get`,
    url: `/blogs.json`,
    qs: {
      limit: 100
    }
  })

  let blogsDone = false

  if (_.get(res, `body.blogs.length`) === 0) {
    blogsDone = true
  }

  await mkdir(path.join(process.cwd(), `blogs`))

  // Process Blogs
  while (blogsDone === false) {
    const blogs = _.get(res, `body.blogs`)

    await processBlogs(blogs)

    if (res.linkNext == null) {
      blogsDone = true
      break
    }

    res = await requestify(target, {
      method: `get`,
      url: `/blogs.json`,
      qs: {
        limit: 100,
        page_info: res.linkNext.searchParams.get(`page_info`)
      }
    })
  }

  return `Downloaded ${total} articles.`
}
