# Quickshot 2.0

A (nearly) full rewrite from Iced Coffee Script to ES2015 JavaScript. Runs on node.js v6+.

The changes consist of mostly cleanup and cruft removal. Adding new features has not been the primary goal.

However, there are a few:

- Allow configurable concurrency level (number of concurrent API requests)
- Show timestamps on all log output

### Installation

`npm install -g quickshot`

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
- Supports autocompiling Babel/ES6 into modules which are easily used by Requirejs and others
- Can use with `.gitignore` files or a custom `.quickshotignore` file.
- Can `download/upload` Shopify Blogs, Pages and Products! Easily transfer them between stores! Even the metafields! And edit them locally in your favorite editor.

[Read the Docs!](https://quickshot.readme.io/) (https://quickshot.readme.io/)
