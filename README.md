# IRC osu! Map Request Bot
*Contributors:* [apsofatl](https://github.com/apsofatl), [jpasqui](https://github.com/jpasqui)

## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Installation](#installation)
* [Contact](#contact)

## About The Project

An expansion of the open source project Bancho.js, used to interact with the official osu! server (Bancho). This is a basic IRC bot created with the intention of users being able to request a list of beatmaps from a specified map creator, Using commands such as 

```!follow [mapper]```
```!newmaps```

### Built With
* [Node.js](https://nodejs.org/en/)
* [Bancho.js](https://bancho.js.org/)
* [Node-fetch](https://www.npmjs.com/package/node-fetch)
* [sync-request](https://www.npmjs.com/package/sync-request)

# 1. OAuth
- An OAuth application needs to be registered via the osu! website: https://osu.ppy.sh/home/account/edit#oauth. 
- Create the application with "New OAuth Application" <br> ![OAuth](/tutorial/newoauth.png)
- This will display a personalized Client ID and Client Secret. (Keep these noted for later.) <br> ![OAuth2](/tutorial/newoauth2.png)

# Contact

* Adam Stankovich - apsofatl@gmail.com
* Jeremy Pasquino - jeremypasquino@gmail.com
