<h1 align="center">IRC osu! Map Request Bot</h1>

## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
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


## Getting Started

This is a surface level tutorial on intializing the osu! IRC bot from this repository.

### Prerequisites

Before you get started, there are a few prerequisites to get installed in order for the bot to function properly.
* Node.js
```sh
npm install npm@latest -g
```

### Installation

1. Open your directory with code
2. In an integrated terminal, initialize NPM (creates package.json):
```sh
npm init
```
When prompted for an entry point, we will be using app.js
3. Install bancho.js:
```sh
npm install bancho.js
```
4. Create "app.js" in directory
4. Retrieve your IRC username/password at [https://osu.ppy.sh/p/irc](https://osu.ppy.sh/p/irc)

## Contact

* Adam Stankovich - apsofatl@gmail.com
* Jeremy Pasquino - jeremypasquino@gmail.com

## References

* https://osu.ppy.sh/docs/index.html?javascript#introduction
* https://www.youtube.com/watch?v=QfeZjpQApIw&ab_channel=AntoNosu%21
* https://osu.ppy.sh/p/irc
