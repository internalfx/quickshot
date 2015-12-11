# Quickshot 2.0

A (nearly) full rewrite from Iced Coffee Script to ES2015 JavaScript. Runs on node.js v5.2.

The changes consist of mostly cleanup and cruft removal. Adding new features is not the primary goal.

However, there are a few:

- Allow to upload synchronously with `--sync` flag
- Show timestamps on all log output

[![Join the chat at https://gitter.im/internalfx/quickshot](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/internalfx/quickshot?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![license](https://img.shields.io/npm/l/quickshot.svg)](https://github.com/internalfx/quickshot/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/quickshot.svg)](https://www.npmjs.com/package/quickshot)

A Shopify theme development tool.

[![NPM](https://nodei.co/npm/quickshot.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.org/package/quickshot)

## Features

- Supports uploading to multiple Shopify stores and themes
- Easy to use configuration wizard
- Uploads/downloads in parallel greatly reducing transfer times
- Supports autocompiling scss locally before uploading to Shopify
- Supports autocompiling CoffeeScript locally before uploading to Shopify
- Supports autocompiling Babel/ES6 into modules which are easily used by Requirejs
- Can use with `.gitignore` files or a custom `.quickshotignore` file.
- Can `download/upload/watch` any Shopify Page. Allowing you to edit your pages locally in your favorite editor.
- Can `download/upload` Shopify Products. Easily transfer products between stores! Even the images and metafields!
- Can `download/upload` Shopify Blogs. Easily transfer blogs between stores! Even the metafields!

[Read the Docs!](http://quickshot.io/) (http://quickshot.io/)


### Repos
- Main Project: https://github.com/internalfx/quickshot
- Documentation: https://github.com/internalfx/quickshot-docs
