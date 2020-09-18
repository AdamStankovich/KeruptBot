
// Import Libraries
const Banchojs = require("bancho.js");

// Personal info file
const { CLIENTID, CLIENTSECRET, USERNAME, PASSWORD } = require("./secret");

// Commands file
const commands = require("./commands");

// Login to bancho server
const client = new Banchojs.BanchoClient({
	// osu! IRC username/password
	username: USERNAME,
	password: PASSWORD,
});

// Prefix for the commands(what the user types). i.e. (!, ., etc.)
const prefix = "!";

// Create the following dict
var followdict = new Object();
// Read from file and populate dictionary
// TODO

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
					followdict = await commands.follow(user, followdict, message);
					break;
				case prefix + "unfollow":
					followdict = await commands.unfollow(user, followdict, message);
					break;
				case prefix + "following":
					await commands.following(user, followdict);
					break;
			}
		});
	} catch (error) {
		console.error(error);
	}
};

// initiates osubot
startOsuBot();
