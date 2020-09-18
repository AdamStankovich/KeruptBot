
// Import Libraries
const fetch = require("node-fetch");

// Personal info file (dont include)
const { CLIENTID, CLIENTSECRET, USERNAME, PASSWORD } = require("./secret");


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


////////////////////////////////// COMMANDS //////////////////////////////////

// List commands for the user
async function help(user) {
	return await user.sendMessage(
		`List of commands: !hello, !newmaps, !follow [mapperID], !unfollow [mapperID]`
	);
}

// Says hello to the user
async function hello(user) {
	return await user.sendMessage(`Sup ${user.ircUsername}`);
}

// Gets the user new maps
async function newmaps(user, followdict) {
	if (followdict[user.ircUsername] !== undefined) {
		var json = await getAccessTokenPromise();
		var key = json.access_token;
		for (var i = 0; i < followdict[user.ircUsername].length; i++) {
			json = await getBeatmaps(
				followdict[user.ircUsername][i],
				"unranked",
				key
			);
			for (var j = 0; j < json.length; j++) {
				await user.sendMessage(
					`${json[j].creator} - [https://osu.ppy.sh/b/${json[j].beatmaps[0].id} ${json[j].artist} - ${json[j].title}] | Length: ${secondsToMinutes(json[j].beatmaps[0].total_length)} ⌛ | BPM: ${json[j].beatmaps[0].bpm} ♪ | AR: ${json[j].beatmaps[0].ar} ☉`
				);
			}
		}
	} else {
		return await user.sendMessage(`You aren't following any mappers yet.`);
	}
}

// Lets the user follow a mapper
async function follow(user, followdict, message) {
	// Get the userID from the message
	var userid = message.split(" ")[1];
	// If the user who sent the message is already in the dictionary
	if (followdict[user.ircUsername]) {
		// If the user already follows the mapper, return
		if (followdict[user.ircUsername].includes(userid)) {
			await user.sendMessage(`You already follow ${userid}, dumbass.`);
			return followdict;
		}
		// Append the mapper to the dictionary
		followdict[user.ircUsername].push(userid);
		await user.sendMessage(`You followed ${userid}.`);
		return followdict;
	}
	// If the user who sent the message is NOT already in the dictionary
	else {
		// Create the new key in the dictionary with the mapper as the value in an array
		followdict[user.ircUsername] = [userid];
		await user.sendMessage(`You followed ${userid}.`);
		return followdict;
	}
}

// Lets the user unfollow a mapper
async function unfollow(user, followdict, message) {
	var userid = message.split(" ")[1];
	if (followdict[user.ircUsername].includes(userid)) {
		unfollow = followdict[user.ircUsername].indexOf(userid);
		followdict[user.ircUsername].splice(unfollow, 1);
		await user.sendMessage(`You unfollowed ${userid}`);
		return followdict;
	} else {
		await user.sendMessage(`You don't follow ${userid}, dumbass.`);
		return followdict;
	}
}

async function following(user, followdict) {
	var str = ``
	for (var i = 0; i < followdict[user.ircUsername].length; i++) {
		if (i !== followdict[user.ircUsername].length - 1) {
			str += `${followdict[user.ircUsername][i]}, `
		}
		else {
			str += `${followdict[user.ircUsername][i]}`
		}

	}
	await user.sendMessage(`You are following: ${str}`);
}

module.exports = { help, hello, newmaps, follow, unfollow, following };
