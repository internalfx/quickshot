# Quickshot 3

### A Shopify theme development tool.

[![Join the chat at https://gitter.im/internalfx/quickshot](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/internalfx/quickshot?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![license](https://img.shields.io/npm/l/quickshot.svg)](https://github.com/internalfx/quickshot/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/quickshot.svg)](https://www.npmjs.com/package/quickshot)

## Features

- Super fast file transfers
- Uploads and downloads multiple files in parallel
- Easily switch between Shopify stores and themes
- Easy to use configuration wizard
- Can be configured to ignore certain files when syncing
- Uploads and downloads Shopify pages.

Runs on node.js v10+.

## TLDR, Installation


`npm install -g quickshot`

#### Getting nodejs

Quickshot is written in JavaScript and needs nodejs to run.
Quickshot recommends getting nodejs with [NVM](https://github.com/nvm-sh/nvm).
Once you have nodejs installed you can run `npm install -g quickshot`.

## Getting started

Quickshot is run from the command line (terminal). You can start quickshot with `quickshot` or `qs`.

> For the remainder of the docs we will give examples using the `qs` shortcut.

#### Viewing command help

Run `qs` by itself to see all the possible commands.

```
    Quickshot 3.0.1
    ==============================

    Commands:
      quickshot config                        Creates/Updates the configuration file in current directory
      quickshot theme                         Manage Shopify themes
      quickshot                               Show this screen.
```

## Configuring

Run `qs config` to run the configuration wizard, which will guide you through creating your Configuration file.
You do not need to make or edit this file by hand.

#### Targets Configuration

Targets allow you to direct Quickshot to send files to one of multiple locations. Almost every command in qs requires a target. A target is basically a specific theme at a specific shop.

Targets have a name, shop, and theme.
This is very powerful as you can direct Shopify information wherever you wish.

For example, you could download all the theme files from your live store, and then upload them to your development shop in just 2 commands.

#### Create Targets

Run `qs config`

Go to `targets` > `Create target`

You will then be asked for all of the following information.

- Target Name - Staging, Development or whatever you wish
- Store URL - URL to the Shopify store you want to connect to (quickshot needs the full "example URL" as this also has the keys used to connect)
- Theme - Quickshot will display all the available themes from your shop, use your arrow keys to select which one you want to connect to

After configuring a target, you are returned to the Manage targets menu. From there you can edit, delete, and display a list of all configured targets. If you are finished adding targets select `< Go Back` to continue.

#### Edit Targets

Run `qs config`

Go to `targets` > `Edit target`

You will then be asked for all of the following information. However, previous values will be pre-filled in for you. To keep the previous value press Enter.

- Target Name - Staging, Development or whatever you wish
- Store URL - URL to the Shopify store you want to connect to (quickshot needs the full "example URL" as this also has the keys used to connect)
- Theme - Quickshot will display all the available themes from your shop, use your arrow keys to select which one you want to connect to

#### Delete Targets

Run `qs config`

Go to `targets` > `Delete target`

Select the target you wish to delete and press enter.

#### List Targets

Run `qs config`

Go to `targets` > `List targets`

#### Ignoring Files

you can use a `.quickshot-ignore` file to prevent quickshot from uploading files you don't want in Shopify.

`.quickshot-ignore` uses gitignore syntax

For gitignore syntax see the (Gitignore Docs)[https://git-scm.com/docs/gitignore]

## Theme Download

`qs theme download`

Downloads theme files from the chosen target.

| Option | Description |
| --- | --- |
| target | Explicitly select target. Allows you to bypass "Select target" prompt. |
| filter | Only transfer files matching specified filter. |

## Theme Upload

`qs theme upload`

Uploads theme files to the chosen target.

| Option | Description |
| --- | --- |
| target | Explicitly select target. Allows you to bypass "Select target" prompt. |
| filter | Only transfer files matching specified filter. |

## Theme Watch

`qs theme watch [--sync]`

Watches files for changes and uploads them to Shopify.

| Option | Description |
| --- | --- |
| target | Explicitly select target. Allows you to bypass "Select target" prompt. |
| --sync | Enable two-way sync. Quickshot will also watch remote files on Shopify and download them when they change. |

## Pages Download

`qs pages download`

Downloads pages from the chosen target.

| Option | Description |
| --- | --- |
| target | Explicitly select target. Allows you to bypass "Select target" prompt. |
| filter | Only transfer pages matching specified filter. |

## Pages Upload

`qs pages upload`

Uploads pages to the chosen target.

| Option | Description |
| --- | --- |
| target | Explicitly select target. Allows you to bypass "Select target" prompt. |
| filter | Only transfer pages matching specified filter. |


## Migrating from 2.x, breaking changes.

The format of `quickshot.json` has changed.

The API URL used to be constructed from three separate settings.

```
"api_key": "123abc",
"password": "789xyz",
"domain": "shop",
```

Now it only uses one.

```
url": "https://123abc:789xyz@shop.myshopify.com/admin/api",
```

`.quickshotignore` has been renamed to `.quickshot-ignore`

Quickshot no longer reads your `.gitignore` file. Put files you need to ignore in your `.quickshot-ignore` file instead.
