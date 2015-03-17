#Quickshot

A Shopify theme development tool.

##Installation

#####TL;DR;

`npm install -g quickshot`

#####Verbose

Quickshot is written in coffeescript (sort of) and runs on node.js and io.js.

If you have neither of those installed visit https://nodejs.org/download/

After installing one of the above, open a terminal and run `npm install -g quickshot`

##Getting started

#### Setting up Quickshot

First, you will need to set up a new private app to generate an API key and password. Go to **your_store.com**/admin/apps/private in your web browser.

Click on “Create a Private App” to generate the credentials for a new app. You will need the API key and the password of this newly generated app:

![api-key-and-password](doc/API-key-and-password.jpg)

Navigate to the directory where you theme files live, or where you'd like them to be, and execute the following command:

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
  "compile_sass": true,
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

*Special Thanks to Shopify for letting me use some of their documentation*

##Autocompiling Scss

Quickshot has the ability to compile scss before uploading to Shopify. This can make your workflow easier, and keep your pages loading fast by only needing to include one large css file in `theme.liquid`.

{{ 'application.css' | asset_url | stylesheet_tag }}
