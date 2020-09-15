# IRC osu! Map Request Bot

## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Installation](#installation)
* [Contact](#contact)

## About The Project

This is a basic IRC bot created with the intention of users being able to request a list of beatmaps from a specified map creator, Using commands such as 
```
!maps [mapper]
```

### Built With
* [Node.js](https://nodejs.org/en/)
* [Bancho.js](https://bancho.js.org/)

# Installation

This is a surface level tutorial on intializing an osu! IRC bot from this repository.

## 1. NPM
 - Initialize NPM in an integrated terminal. 
```js
npm init
```
 - The following will be prompted, enter the corresponding inputs:
```js
package name: arbitrary
version: hit enter
description: arbitrary
entry point: app.js
test command: hit enter
git repository: hit enter
keywords: hit enter
liscense: hit enter
Is this OK? (yes): yes
```

## 2. bancho.js:
```js
npm install bancho.js
```
## 3. app.js:
 - Import "app.js" from this repository into your directory
 - Retrieve your IRC username/password at [https://osu.ppy.sh/p/irc](https://osu.ppy.sh/p/irc)
 - Inside of the app.js file, you will see two constants: remove the first two lines, these were used to import our own personal bancho IRC username/password into the file. In the "client" const, substitute "USERNAME" and "PASSWORD" for your own username and server password retrieved from the link above.
 ```js
 // Personal info file (dont include)
const { CLIENTID, CLIENTSECRET, USERNAME, PASSWORD } = require("./secret");

const client = new Banchojs.BanchoClient({
  // Substitute for your osu! IRC username/password
  username: USERNAME,
  password: PASSWORD,
});
 ```
 


# Contact

* Adam Stankovich - apsofatl@gmail.com
* Jeremy Pasquino - jeremypasquino@gmail.com

# References

* https://osu.ppy.sh/docs/index.html?javascript#introduction
* https://www.youtube.com/watch?v=QfeZjpQApIw&ab_channel=AntoNosu%21
* https://osu.ppy.sh/p/irc
