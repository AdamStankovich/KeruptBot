# IRC osu! Map Request Bot

## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Installation](#installation)
* [Contact](#contact)

## About The Project

This is a basic IRC bot created with the intention of users being able to request a list of beatmaps from a specified map creator, Using commands such as 
```sh
!maps [mapper]
```

### Built With
* [Node.js](https://nodejs.org/en/)
* [Bancho.js](https://bancho.js.org/)

# Installation

This is a surface level tutorial on intializing an osu! IRC bot from this repository.

## 1. NPM
 - Initialize NPM in an integrated terminal. 
```sh
npm init
```
 - The following will be prompted, enter the corresponding inputs:
```sh
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
```sh
npm install bancho.js
```
## 3. app.js:
 - Import "app.js" from this repository into your directory
 - Retrieve your IRC username/password at [https://osu.ppy.sh/p/irc](https://osu.ppy.sh/p/irc)
 


# Contact

* Adam Stankovich - apsofatl@gmail.com
* Jeremy Pasquino - jeremypasquino@gmail.com

# References

* https://osu.ppy.sh/docs/index.html?javascript#introduction
* https://www.youtube.com/watch?v=QfeZjpQApIw&ab_channel=AntoNosu%21
* https://osu.ppy.sh/p/irc
