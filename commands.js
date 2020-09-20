
// Import Libraries
const fetch = require("node-fetch");
const request = require("sync-request");

// Personal info file
const { CLIENTID, CLIENTSECRET } = require("./secret");


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

function getUserId(username) {
	var url = `https://osu.ppy.sh/users/${username}`;
	var userid;
	r = request("GET", url)
	userid = parseInt(r.url.split('/')[4]);
	return userid;
}

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

////////////////////////////////// COMMANDS //////////////////////////////////

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

// Gets the user new maps
async function newmaps(user, followdict) {
	if (followdict[user.id].length == 0) {
		return await user.sendMessage(`You aren't following any mappers yet. Type !follow [mappername] to follow someone.`);
	}
	if (followdict[user.id] !== undefined) {
		var json = await getAccessTokenPromise();
		var key = json.access_token;
		for (var i = 0; i < followdict[user.id].length; i++) {
			json = await getBeatmaps(followdict[user.id][i], "unranked", key);

			// Check if any new beatmaps
			if (json.length !== 0) {
				// Loop through all new beatmaps
				for (var j = 0; j < json.length; j++) {
					await user.sendMessage(`${json[j].creator} - [https://osu.ppy.sh/b/${json[j].beatmaps[0].id} ${json[j].artist} - ${json[j].title}] | Length: ${secondsToMinutes(json[j].beatmaps[0].total_length)} ⌛ | BPM: ${json[j].beatmaps[0].bpm} ♪ | AR: ${json[j].beatmaps[0].ar} ☉`);
				}
			}
			// If no beatmaps have recently been uploaded
			else {
				await user.sendMessage("The mappers you follow have not uploaded any beatmaps recently.")
			}
		}
	}
	// If the user doesn't follow any mappers
	else {
		return await user.sendMessage(`You aren't following any mappers yet.`);
	}
}

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

// Shows a list of mappers the user is following
async function following(user, followdict) {
	var str = ``
	var json = await getAccessTokenPromise();
	var key = json.access_token;
	str = `You are following: `
	if (followdict[user.id].length == 0) {
		return await user.sendMessage(`You aren't following any mappers yet. Type !follow [mappername] to follow someone.`);
	}
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

module.exports = { about, help, newmaps, follow, unfollow, following, getUserId };
