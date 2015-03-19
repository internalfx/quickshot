#Quickshot

[![Join the chat at https://gitter.im/internalfx/quickshot](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/internalfx/quickshot?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A Shopify theme development tool.

## Features

- Supports uploading to multiple Shopify stores and themes
- Easy to use configuration wizard
- Uploads/downloads in parallel greatly reducing transfer times
- Supports autocompiling scss locally before uploading to Shopify

##Installation

#####TL;DR;

`npm install -g quickshot`

#####Verbose

Quickshot is written in Iced CoffeeScript and runs on node.js and io.js.

If you have neither of those installed visit https://nodejs.org/download/

After installing one of the above, open a terminal and run `npm install -g quickshot`

If you have errors, you may need to run the above command with `sudo`. Try `sudo npm install -g quickshot`

##Getting started

###Getting an API key

First, you will need to set up a new private app to generate an API key and password. Go to **your_store.com**/admin/apps/private in your web browser.

Click on “Create a Private App” to generate the credentials for a new app. You will need the API key and the password of this newly generated app:

![api-key-and-password](doc/API-key-and-password.jpg)

*Special Thanks to Shopify for letting me use some of their documentation*

###The configuration wizard

The configuration wizard will guide you through creating your quickshot.json file. **You do not need to make or edit this file by hand!** (but you certainly can if you wish).

*Also note the configuration wizard is designed be run multiple times. If you want to change your configuration, just run it again!*

Navigate to the directory where your theme files live, or where you'd like them to be, and execute the following command:

`quickshot configure`

After the wizard starts you will be shown options for managing `targets`

#####Whats a target?

A `target` is a specific theme at a specific shop. Here are some examples of different targets you could make.

- a theme called `shoe store test` at `dev-shoe-store.myshopify.com`
- a theme called `staging shoe store` at `shoe-store.myshopify.com`
- a theme called `production store` at `shoe-store.myshopify.com`

####Creating your first target

```
? Manage Targets: (Use arrow keys)
❯ Create Target
  Edit Target
  Delete Target
  List Targets
  Done Managing Targets
```

Select `Create Target` from the menu using the arrow keys.

You will then be asked for all of the following information:

- **Target Name** *Staging, Development or whatever you wish*
- **API Key** *Copied from the private app settings page on Shopify*
- **Password** *Copied from the private app settings page on Shopify*
- **Store URL** *URL to the shopify store you want to connect to*
- **Theme** *quickshot will display all the available themes from your shop, use your arrow keys to select which one you want to connect to*

After configuring a target, you are returned to the main menu. From there you can edit, delete, and display a list of all configured targets. If you are finished adding targets select `Done Managing Targets` to continue.

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
