# IRC osu! Map Request Bot
*Contributors:* [apsofatl](https://github.com/apsofatl), [jpasqui](https://github.com/jpasqui)

## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [How it works](#how-it-works)
  *  [App.js](#app.js)
  *  [Commands.js](#commands.js)
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

# How it works
- An OAuth application was registered via the osu! website: https://osu.ppy.sh/home/account/edit#oauth. 
- This displays a personalized Client ID and Client Secret. <br> ![OAuth2](/tutorial/newoauth2.png)
- NPM, Bancho.js, Node-fetch, & sync-request intialized

## App.js
- Libraries; and personal credentials from .gitignore'd file that contains username/password information stored in variables are all required.
```js
// Import Libraries
const Banchojs = require("bancho.js");
const fs = require("fs");
const fetch = require("node-fetch");

// Personal info file
const { CLIENTID, CLIENTSECRET, USERNAME, PASSWORD } = require("./secret");

// Commands file
const commands = require("./commands");
```
Application connects to IRC bancho server using IRC Username/Password.
```js
// Login to bancho server
const client = new Banchojs.BanchoClient({
	// osu! IRC username/password
	username: USERNAME,
	password: PASSWORD,
	apiKey: CLIENTSECRET,
});
```
Dictionary object created for read/write. This dictionary holds a list of Users and mapper arrays (.gitignored).
```js
// Create the following dict
var followdict = new Object();

// Read from file and populate dictionary
if (fs.existsSync("follow.json")) {
	var rawdata = fs.readFileSync('follow.json');
	followdict = JSON.parse(rawdata);
```
- OsuBot Function checks for proper connection.
```js
const startOsuBot = async () => {
	try {
		await client.connect();
		console.log("osu!bot Connected...");
		client.on("PM", async ({ message, user }) => {
  	} catch (error) {
		console.error(error);
	}
};
```
- Command functions called from commands.js trailing case prefix statements.
```js
// Command list
switch (command) {
	case prefix + "about":
		await commands.about(user);
		break;
	case prefix + "help":
		await commands.help(user);
		break;
	case prefix + "newmaps":
		await commands.newmaps(user, followdict);
		break;
	case prefix + "follow":
		// Write to file
		followdict = await commands.follow(user, followdict, message);
		var data = JSON.stringify(followdict);
		fs.writeFileSync('follow.json', data);
		break;
	case prefix + "unfollow":
		// Write to file
		followdict = await commands.unfollow(user, followdict, message);
		var data = JSON.stringify(followdict);
		fs.writeFileSync('follow.json', data);
		break;
	case prefix + "following":
		await commands.following(user, followdict);
		break;
	default:
		return await user.sendMessage(`This is not a valid command. Type !help for a list of available commands.`);
}
```
- OsuBot function is intiated
```js
// initiates osubot
startOsuBot();

```
## Commands.js
- Libraries; and personal credentials from .gitignore'd file that contains username/password information stored in variables are all required.
```js
// Import Libraries
const fetch = require("node-fetch");
const request = require("sync-request");

// Personal info file
const { CLIENTID, CLIENTSECRET } = require("./secret");
```
- Function created to retrieve our Bancho access token from osu! APIv2
```js
// Retrieve access_token
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
- Retrieve unranked beatmaps (uploaded in the past 30 days) from a specified mapper
```js
// Retrieve beatmaps from mapper
async function getBeatmaps(user, type, key) {
	const res = await fetch(
		`https://osu.ppy.sh/api/v2/users/${user}/beatmapsets/${type}`,
		{
			method: "get",
			headers: {
				// Authenticate OAuth2 using access_token ($key)
				Authorization: `Bearer ${key}`,
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		}
	);
	return res.json();
}
```
- Split seconds into minutes/seconds for map length.
```js
// Timer for beatmap length
function secondsToMinutes(seconds) {
	newseconds = Math.floor(seconds % 60)
	minutes = Math.floor(seconds / 60)
	if (newseconds < 10) {
		return `${minutes}:0${newseconds}`;
	}
	else {
		return `${minutes}:${newseconds}`;
	}
}
```
- Retrieve the Username of a specified UserID
```js
function getUserId(username) {
	var url = `https://osu.ppy.sh/users/${username}`;
	var userid;
	r = request("GET", url)
	userid = parseInt(r.url.split('/')[4]);
	return userid;
}
```
- Fetch players UserID
```js
async function getUsername(userid, key) {
	const res = await fetch(
		`https://osu.ppy.sh/api/v2/users/${userid}`,
		{
			method: "get",
			headers: {
				// Authenticate OAuth2 using access_token ($key)
				Authorization: `Bearer ${key}`,
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		}
	);
	return res.json();
}
```
- Command functions !about and !help to allow the user to reach this repository
```js
// List commands for the user
async function help(user) {
	return await user.sendMessage(
		`Find a list of commands here: [https://github.com/apsofatl/OsuMapBot/wiki Commands]`
	);
}

// About this bot
async function about(user) {
	return await user.sendMessage(`You can use this bot to follow your favorite mappers. It can send links to any beatmaps they've uploaded in the last 30 days. Created by [https://osu.ppy.sh/users/4398740 Kerupt] and [https://osu.ppy.sh/users/7965914 SouthTTV]. Repository can be found [https://github.com/apsofatl/OsuMapBot here]`);
}
```
- Command function to retrieve and return new maps from a specified mapper.
```js
async function newmaps(user, followdict) {
	if (followdict[user.id] !== undefined) {
		var json = await getAccessTokenPromise();
		var key = json.access_token;
		for (var i = 0; i < followdict[user.id].length; i++) {
			json = await getBeatmaps(
				followdict[user.id][i],
				"unranked",
				key
			);
			for (var j = 0; j < json.length; j++) {
				await user.sendMessage(
					`${json[j].creator} - [https://osu.ppy.sh/b/${json[j].beatmaps[0].id} ${json[j].artist} - ${json[j].title}] | Length: ${secondsToMinutes(json[j].beatmaps[0].total_length)} ⌛ | BPM: ${json[j].beatmaps[0].bpm} ♪ | AR: ${json[j].beatmaps[0].ar} ☉`
				);
			}
		}
	}
	else {
		return await user.sendMessage(`You aren't following any mappers yet.`);
	}
}
```
- Command function to allow the user to follow a mapper. Writes to dictionary object from app.js.
```js
// Lets the user follow a mapper
async function follow(user, followdict, message) {

	// Get the user from the message
	var username = message.split(" ")[1];

	var userid = getUserId(username);

	// If the user who sent the message is already in the dictionary
	if (followdict[user.id]) {
		// If the user already follows the mapper, return
		if (followdict[user.id].includes(userid)) {
			await user.sendMessage(`You already follow ${username}, dumbass.`);
			return followdict;
		}
		// Append the mapper to the dictionary
		followdict[user.id].push(userid);
		await user.sendMessage(`You followed ${username}.`);
		return followdict;
	}
	// If the user who sent the message is NOT already in the dictionary
	else {
		// Create the new key in the dictionary with the mapper as the value in an array
		followdict[user.id] = [userid];
		await user.sendMessage(`You followed ${username}.`);
		return followdict;
	}
}
```
- Command function that allows a user to unfollow a specified mapper. Removes from the dictionary object in app.js.
```js
// Lets the user unfollow a mapper
async function unfollow(user, followdict, message) {
	// Get the user from the message
	var username = message.split(" ")[1];
	var userid = getUserId(username);
	if (followdict[user.id].includes(userid)) {
		unfollow = followdict[user.id].indexOf(userid);
		followdict[user.id].splice(unfollow, 1);
		await user.sendMessage(`You unfollowed ${username}`);
		return followdict;
	} else {
		await user.sendMessage(`You don't follow ${username}, dumbass.`);
		return followdict;
	}
}
```
- Command function to allow the user to see what mappers they are following on the bot.
```js
// Shows a list of mappers the user is following
async function following(user, followdict) {
	var str = ``
	var json = await getAccessTokenPromise();
	var key = json.access_token;
	str = `You are following: `
	for (var i = 0; i < followdict[user.id].length; i++) {
		var username = await getUsername(followdict[user.id][i], key);
		username = username.username;
		
		// If not last iteration
		if (i !== followdict[user.id].length - 1) {
			// If length will be less than or equal to 450 characters
			if ((str + `[https://osu.ppy.sh/users/${followdict[user.id][i]} ${username}]`).length <= 450) {
				// Add next username
				str += `[https://osu.ppy.sh/users/${followdict[user.id][i]} ${username}], `
			}
			// Otherwise
			else {
				// Cut off comma and space
				str = str.substring(0, str.length - 2)
				// Send the message
				await user.sendMessage(`${str}`);
				// Start building next string
				str = `[https://osu.ppy.sh/users/${followdict[user.id][i]} ${username}], `
			}
		}
		// Otherwise
		else {
			// If length will be less than or equal to 450 characters
			if ((str + `[https://osu.ppy.sh/users/${followdict[user.id][i]} ${username}]`).length <= 450) {
				// Add last username without comma
				str += `[https://osu.ppy.sh/users/${followdict[user.id][i]} ${username}]`
				// Send finished string
				return await user.sendMessage(`${str}`);
			}
			// Otherwise
			else {
				// Cut off comma and space
				str = str.substring(0, str.length - 2)
				// Send message
				await user.sendMessage(`${str}`);
				// Rebuild string with last username
				str = `[https://osu.ppy.sh/users/${followdict[user.id][i]} ${username}]`
				// Send last username
				return await user.sendMessage(`${str}`);
			}
		}
	}
}
```
- Functions exported
```js
module.exports = { about, help, newmaps, follow, unfollow, following, getUserId };
```
# Contact

* Adam Stankovich - apsofatl@gmail.com
* Jeremy Pasquino - jeremypasquino@gmail.com
