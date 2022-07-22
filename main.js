const Discord = require("discord.js");
const axios = require("axios");
const { TOKEN } = require("./config.json");
const { API_KEY } = require("./config.json");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const { MessageButton, MessageActionRow, MessageEmbed  } = require("discord.js");
const prefix = "^";
const { ranksJson } = require("./ranks.json");
const ranks = Array.from(ranksJson)[0]; //array of list of ranks
let playerData;
let playerRankInfo;
let error = false;
let rank1; //rank of player
let tier;
let wins;
let losses;
let lp;
let playerName;
let messg;
client.login(TOKEN);
client.on("ready", async () => {
  console.log("on");
});
async function sendMessage(msg) {
  // client.channels.cache.get(channelId).response(msg);
  await messg.reply(msg);
}
client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  messg = message;
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
          `**Name**: ${playerData.data.name} \n**Summoner Level**: ${playerData.data.summonerLevel} \n**Icon**: ${playerData.data.profileIconId} `,
          CID
        );
        console.log("info");
      }
      break;
    }
    case "stats": {
      await searchForPlayer(param, CID);
      if (error == false) await searchPlayerRank(playerData.data.id, CID);
      if (error == false) {
        const row = new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel("View Profile")
            .setStyle(5)
            .setURL("https://lolchess.gg/profile/na/" + param)
        );
        const emb = new MessageEmbed()
          .setColor("#F2CB88")
          .setAuthor({
            name: playerData.data.name + "'s Profile",
            iconURL: `https://ddragon.leagueoflegends.com/cdn/12.13.1/img/profileicon/${playerData.data.profileIconId}.png`,
            url: "https://lolchess.gg/profile/na/" + param,
          })
          .setThumbnail(ranks[rank1])
          .addFields(
            {
              name: "Rank",
              value: rank1 + " " + tier + " " + lp,
              inline: true,
            },
            {
              name: "Matches Played",
              value: wins + losses + "",
              inline: true,
            },
            {
              name: "Top4 Rate",
              value:
                ((wins / (wins + losses)) * 100).toFixed(1) +
                "%\nTop4s: **" +
                wins +
                "**\nBot4s: **" +
                losses +
                "**",
              inline: true,
            }
          )
          .setTimestamp()
          .setFooter({
            text: "^help for a list of commands",
            iconURL:
              "https://media.discordapp.net/attachments/994108022706155580/999859304955924601/unknown.png",
          });

          sendMessage({ components: [row] , embeds: [emb]});
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
    encodeURIComponent(player) +
    "?api_key=" +
    API_KEY;
  try {
    const response = await axios.get(APICallString);
    playerData = response;
    playerName = playerData.data.name;
    error = false;
  } catch (e) {
    error = true;
    console.log("Request failed");
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
    if (playerRankInfo == "") {
      const emb = new MessageEmbed()
        .setColor("#F2CB88")
        .setAuthor({
          name: playerData.data.name + "'s Profile",
          iconURL: `https://ddragon.leagueoflegends.com/cdn/12.13.1/img/profileicon/${playerData.data.profileIconId}.png`,
          url: "https://lolchess.gg/profile/na/" + playerName,
        })
        .setThumbnail("https://cdn.lolchess.gg/images/lol/tier/provisional.png")
        .addFields({
          name: "Rank",
          value: "Unranked",
          inline: true,
        })
        .setTimestamp()
        .setFooter({
          text: "^help for a list of commands",
          iconURL:
            "https://media.discordapp.net/attachments/994108022706155580/999859304955924601/unknown.png",
        });
      sendMessage({ embeds: [emb] }, CID);
      error = true;
    } else {
      let temp = Array.from(playerRankInfo)[0];
      rank1 = temp.tier[0] + temp.tier.substring(1).toLowerCase();
      tier = temp.rank;
      lp = temp.leaguePoints + " LP";
      wins = temp.wins;
      losses = temp.losses;
      error = false;
    }
  } catch (e) {
    error = true;
    console.log("Couldn't find player", e);
    sendMessage("That user does not exist.", CID);
    return;
  }
}
