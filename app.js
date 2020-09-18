const Banchojs = require("bancho.js");
const fetch = require("node-fetch");

// Personal info file (dont include)
const { CLIENTID, CLIENTSECRET, USERNAME, PASSWORD } = require("./secret");

const client = new Banchojs.BanchoClient({
  // Substitute for your osu! IRC username/password
  username: USERNAME,
  password: PASSWORD,
});

// Prefix for the commands(what the user types). i.e. (!, ., etc.)
const prefix = "!";

var followdict = new Object();
// TODO
// Read from file and populate dictionary

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
// Function to retrieve beatmaps from mapper
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

// Creating the osubot function
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
          return await user.sendMessage(
            `List of commands: !hello, !day, !maps [mappername]`
          );
        // Says hello to the user
        case prefix + "hello":
          return await user.sendMessage(`Sup ${user.ircUsername}`);
        // tell user the day of the week
        case prefix + "day":
          const day = new Date().toLocaleString("en-us", { weekday: "long" });
          return await user.sendMessage(`It is ${day}.`);
        // Get user maps
        case prefix + "newmaps":
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
                console.log(json[j]);
              }
            }
          } else {
            return await user.sendMessage(
              `You aren't following any mappers yet.`
            );
          }
        case prefix + "follow":
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
        case prefix + "unfollow":
          var userid = message.split(" ")[1];
          if (followdict[user.ircUsername].includes(userid)) {
            unfollow = followdict[user.ircUsername].indexOf(userid);
            followdict[user.ircUsername].splice(unfollow, 1);
            return await user.sendMessage(`You unfollowed ${userid}`);
          } else {
            return await user.sendMessage(`You don't follow ${userid}`);
          }
      }
    });
  } catch (error) {
    console.error(error);
  }
};

// initiates osubot
startOsuBot();
