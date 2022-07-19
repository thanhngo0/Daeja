const Discord = require("discord.js");
const axios = require("axios");
const token = require("./token.js");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const prefix = "^";

client.login(token);
client.on("ready", async () => {
  console.log("test");
});

client.on("messageCreate", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  switch (command) {
    case "help": {
      client.channels.cache.get(message.channel.id).send("help");
      break;
    }
    case "info": {
      client.channels.cache.get(message.channel.id).send("info");
      break;
    }
    default: {client.channels.cache.get(message.channel.id).send(message.author.username + ", that is not a real command");
    break;}
  }

});
