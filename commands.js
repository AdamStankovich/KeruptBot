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
	if (followdict[user.ircusername] !== undefined) {
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
					`https://osu.ppy.sh/beatmapsets/${json[j].id}/`
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
			return await user.sendMessage(
				`You already follow ${userid} dumbass.`
			);
		}
		// Append the mapper to the dictionary
		followdict[user.ircUsername].push(userid);
		return await user.sendMessage(`You followed ${userid}.`);
	}
	// If the user who sent the message is NOT already in the dictionary
	else {
		// Create the new key in the dictionary with the mapper as the value in an array
		followdict[user.ircUsername] = [userid];
		return await user.sendMessage(`You followed ${userid}.`);
	}
}

// Lets the user unfollow a mapper
async function unfollow(user, followdict, message) {
	var userid = message.split(" ")[1];
	if (followdict[user.ircUsername].includes(userid)) {
		unfollow = followdict[user.ircUsername].indexOf(userid);
		followdict[user.ircUsername].splice(unfollow, 1);
		return await user.sendMessage(`You unfollowed ${userid}`);
	} else {
		return await user.sendMessage(`You don't follow ${userid} dumbass.`);
	}
}

module.exports = { help, hello, newmaps, follow, unfollow };
