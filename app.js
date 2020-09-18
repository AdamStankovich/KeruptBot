// Import Libraries
const Banchojs = require("bancho.js");
const fetch = require("node-fetch");

// Personal info file (dont include)
const { CLIENTID, CLIENTSECRET, USERNAME, PASSWORD } = require("./secret");

// Commands file
const commands = require("./commands");

// Login to bancho server
const client = new Banchojs.BanchoClient({
	// Substitute for your osu! IRC username/password
	username: USERNAME,
	password: PASSWORD,
});

// Prefix for the commands(what the user types). i.e. (!, ., etc.)
const prefix = "!";

// Create the following dict
var followdict = new Object();
// Read from file and populate dictionary
// TODO

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

// The actual bot function
const startOsuBot = async () => {
	try {
		await client.connect();
		console.log("osu!bot Connected...");
		client.on("PM", async ({ message, user }) => {
			// Check if message was sent by ourselves
			if (user.ircUsername === USERNAME) return;

			// Check for command prefix
			if (message[0] !== "!") return;
			const command = message.split(" ")[0].toLowerCase();

			// Command list
			switch (command) {
				case prefix + "help":
					await commands.help(user);
					break;
				case prefix + "hello":
					await commands.hello(user);
					break;
				case prefix + "newmaps":
					await commands.newmaps(user, followdict);
					break;
				case prefix + "follow":
					await commands.follow(user, followdict, message);
					break;
				case prefix + "unfollow":
					await commands.unfollow(user, followdict, message);
					break;
			}
		});
	} catch (error) {
		console.error(error);
	}
};

// initiates osubot
startOsuBot();
