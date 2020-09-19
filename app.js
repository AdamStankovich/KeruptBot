
// Import Libraries
const Banchojs = require("bancho.js");
const fs = require("fs");
const fetch = require("node-fetch");

// Personal info file
const { CLIENTID, CLIENTSECRET, USERNAME, PASSWORD } = require("./secret");

// Commands file
const commands = require("./commands");

// Login to bancho server
const client = new Banchojs.BanchoClient({
	// osu! IRC username/password
	username: USERNAME,
	password: PASSWORD,
	apiKey: CLIENTSECRET,
});

// Prefix for the commands(what the user types). i.e. (!, ., etc.)
const prefix = "!";

// Create the following dict
var followdict = new Object();

// Read from file and populate dictionary
if (fs.existsSync("follow.json")) {
	var rawdata = fs.readFileSync('follow.json');
	followdict = JSON.parse(rawdata);
}

// The actual bot function
const startOsuBot = async () => {
	try {
		await client.connect();
		console.log("osu!bot Connected...");
		client.on("PM", async ({ message, user }) => {
			// Check if message was sent by ourselves
			if (user.ircUsername === USERNAME) return;
			user.id = commands.getUserId(user.ircUsername);

			// Check for command prefix
			if (message[0] !== "!") return;
			const command = message.split(" ")[0].toLowerCase();

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
		});
	} catch (error) {
		console.error(error);
	}
};

// initiates osubot
startOsuBot();
