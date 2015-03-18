#Quickshot

[![Join the chat at https://gitter.im/internalfx/quickshot](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/internalfx/quickshot?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A Shopify theme development tool.

## Features

- Easy to use configuration wizard
- Uploads/downloads in parallel greatly reducing transfer times
- Supports autocompiling scss locally before uploading to shopify

##Installation

#####TL;DR;

`npm install -g quickshot`

#####Verbose

Quickshot is written in coffeescript (sort of) and runs on node.js and io.js.

If you have neither of those installed visit https://nodejs.org/download/

After installing one of the above, open a terminal and run `npm install -g quickshot`

If you have errors, you may need to run the above command with `sudo`. Try `sudo npm install -g quickshot`

##Getting started

### Setting up Quickshot

First, you will need to set up a new private app to generate an API key and password. Go to **your_store.com**/admin/apps/private in your web browser.

Click on “Create a Private App” to generate the credentials for a new app. You will need the API key and the password of this newly generated app:

![api-key-and-password](doc/API-key-and-password.jpg)

Navigate to the directory where your theme files live, or where you'd like them to be, and execute the following command:

`quickshot configure`

The configuration wizard will guide you through creating your quickshot.json file. **You do not need to make or edit this file by hand!** (but you certainly can if you wish)

`quickshot configure` can be run multiple times. If you have an existing configuration, it will remember all of your previous choices.

### The quickshot.json File
The quickshot.json file contains the information needed for Shopify to authenticate requests and edit/update the theme files in the manner specified. Here is an example of what the contents in a typical `quickshot.json` file would look like:

```json
{
  "api_key":  "7a8da86d3dd730b67a357dedabaac5d6",
  "password": "552338ce0d3aba7fc501dcf99bc57a81",
  "domain": "little-plastics.myshopify.com",
  "theme_id": 99999999,
  "compile_scss": true,
  "primary_scss_file": "assets/application.scss"
}
```


#### Here is a Breakdown of the Fields:

`api_key`

The API key generated in your private app.

`password`

The password generated in your private app.

`domain`

The address of your store (note there is no leading http:// or https://)

`theme_id`

The theme id of the theme that should be responding to commands.

`compile_scss`

Do you want scss files to be compiled for you?

`primary_scss_file`

The scss file that will be compiled anytime ANY scss file changes. You should put all of your `@import` statements in here.

*Special Thanks to Shopify for letting me use some of their documentation*

##Autocompiling scss

Quickshot has the ability to compile scss before uploading to Shopify. This can make your workflow easier, and keep your pages loading fast by only needing to include one css file in `theme.liquid`.

####Enabling scss compiling

Run `quickshot configure` from your project directory. When the configuration wizard asks `Would you like to enable automatic compiling for scss files?` press `y`. You will then be asked for the relative path to the file you wish to be compiled automatically. If you are unsure, accept the default.

**The rest of the instructions will assume the default settings were used**

####General Usage

For this example lets assume you have 3 css files in your project.

```
main.css
navigation.css
typography.css
```

After running the `quickshot configure` we now have

```
application.scss
main.css
navigation.css
typography.css
```

Rename all your css files to have a `.scss` extension

```
application.scss
main.scss
navigation.scss
typography.scss
```

Then edit your `application.scss` similarly to below.

```scss
@import "main";
@import "navigation";
@import "typography";
```

When compiled this will create one `application.css` file containing all your merged css styles. Now we just need to include this in our `theme.liquid` file.

```html
<!doctype html>
<head>
    <!-- application.css is recompiled and uploaded anytime you change ANY .scss file in your project. -->
    {{ 'application.css' | asset_url | stylesheet_tag }}

    {{content_for_header}}

</head>
```

After that you can use all the benefits of scss! For more information on what you can do check out the [Sass documentation](http://sass-lang.com/documentation/file.SASS_REFERENCE)
