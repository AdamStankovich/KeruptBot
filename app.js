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
        case prefix + "maps":
          var json = await getAccessTokenPromise();
          var key = json.access_token;
          json = await getBeatmaps("4398740", "graveyard", key);
          console.log(json);
          return await user.sendMessage(``);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

// initiates osubot
startOsuBot();
