const Discord = require("discord.js");
const axios = require("axios");
const token = require("./token.js");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const prefix = "^";
const API_KEY = "RGAPI-887fec38-cce1-467b-a5f5-3ea6865b43d1";
let playerData;
let playerRankInfo;
let error = false;
let rank;
let tier;
let wins;
let losses;
client.login(token);
client.on("ready", async () => {
  console.log("on");
});
async function sendMessage(msg, channelId) {
  client.channels.cache.get(channelId).send(msg);
}
client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const CID = message.channel.id;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const param = message.content.slice(message.content.indexOf(" ") + 1);

  switch (command) {
    case "help": {
      sendMessage("help", CID);
      break;
    }
    case "info": {
      await searchForPlayer(param, CID);
      if (error == false) {
        sendMessage(
          `Name: ${playerData.data.name} \nSummoner Level: ${playerData.data.summonerLevel} \nIcon: ${playerData.data.profileIconId} `,
          CID
        );
        console.log(playerData.data.name);
      }
      break;
    }
    case "stats": {
      await searchForPlayer(param, CID);
      await searchPlayerRank(playerData.data.id, CID);
      let temp = Array.from(playerRankInfo)[0];
      
      if (error == false) {
         sendMessage(`Rank: ${temp.tier} ${temp.rank}\nWins: ${temp.wins}\nLosses: ${temp.losses}` , CID);
         console.log(temp.rank);
      }
      break;
    }
    default: {
      sendMessage(
        message.author.username + ", that command does not exist.",
        CID
      );
    }
  }
});

async function searchForPlayer(player, CID) {
  var APICallString =
    "https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-name/" +
    player +
    "?api_key=" +
    API_KEY;

  try {
    const response = await axios.get(APICallString);
    playerData = response;
    error = false;
  } catch (e) {
    error = true;
    console.log("Request failed", e);
    sendMessage("That user does not exist.", CID);
    return;
  }
}

async function searchPlayerRank(id, CID) {
  var APICallString =
    "https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/" +
    id +
    "?api_key=" +
    API_KEY;
  try {
    const response = await axios.get(APICallString);
    playerRankInfo = response.data;
    error = false;
  } catch (e) {
    error = true;
    console.log("Request failed");
    sendMessage("That user does not exist.", CID);
    return;
  }
}
