# IRC osu! Map Request Bot
*Contributors:* [apsofatl](https://github.com/apsofatl), [jpasqui](https://github.com/jpasqui)

## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Installation](#installation)
* [Contact](#contact)

## About The Project

An expansion of the open source project Bancho.js, used to interact with the official osu! server (Bancho). This is a basic IRC bot created with the intention of users being able to request a list of beatmaps from a specified map creator, Using commands such as 
```
!maps [mapper]
```

### Built With
* [Node.js](https://nodejs.org/en/)
* [Bancho.js](https://bancho.js.org/)

# Installation

This is a surface level tutorial on intializing an osu! IRC bot from this repository.

## 1. OAuth
- An OAuth application needs to be registered via the osu! website: https://osu.ppy.sh/home/account/edit#oauth. 
- Create the application with "New OAuth Application" <br> ![OAuth](/tutorial/newoauth.png)
- This will display a personalized Client ID and Client Secret. (Keep these noted for later.) <br> ![OAuth2](/tutorial/newoauth2.png)

## 2. NPM
 - Initialize NPM in an integrated terminal. 
```js
npm init
```
 - The following will be prompted, enter the corresponding inputs:
```
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

## 3. bancho.js:
```
npm install bancho.js
```
## 4. app.js:
 - Import "app.js" from this repository into your directory
 - Retrieve your IRC username/password at [https://osu.ppy.sh/p/irc](https://osu.ppy.sh/p/irc) (Keep these noted for later.) <br> ![ircsetup](/tutorial/ircsetup.png)
 - Inside of the app.js file, there are two constants. Remove the first two lines as these were used to import personalized credentials into the file. In the "client" const, *USERNAME* and *PASSWORD* are substituted for personal username / server password retrieved from the IRC link above.
 ```js
 // Personal info file (dont include)
const { CLIENTID, CLIENTSECRET, USERNAME, PASSWORD } = require("./secret");

const client = new Banchojs.BanchoClient({
  // Substitute for your osu! IRC username/password
  username: USERNAME,
  password: PASSWORD,
});
 ```
  - Next is the function created to retrieve your OAuth2 token. This is specific to the owner of the bot. Replace "CLIENTID" and "CLIENTSECRET" with personal credentials. (these are variables imported from another file in the original project.)
  ```js
  // Function to retrieve access_token
async function getAccessTokenPromise() {
  const res = await fetch("https://osu.ppy.sh/oauth/token", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
      // Insert own clientid/secret
      client_id: CLIENTID,
      client_secret: CLIENTSECRET,
      scope: "public",
    }),
  });
  return res.json();
}
  ```
 - **The Command List:** The command list will be found and edited through app.js. Commands are added using the case prefix variable set earlier in the file concatinated with the desired phrase.
 ```js
 // Command list
switch (command) {
  case prefix + "help":
    return await user.sendMessage(
      `List of commands: !hello`
    );
   case prefix + "hello":
     return await user.sendMessage(`Sup ${user.ircUsername}`);
}
 ```
## Initializing the IRC bot:
 -  Once the file is set up appropriately with the users personalized information and commands, osu!bot can be initialized with the following command:
 ```
 node app.js
 ```
 If successful, "osu!bot Connected..." will be logged.

# Contact

* Adam Stankovich - apsofatl@gmail.com
* Jeremy Pasquino - jeremypasquino@gmail.com
