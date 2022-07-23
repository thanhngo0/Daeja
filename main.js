const Discord = require("discord.js");
const axios = require("axios");
const { TOKEN } = require("./config.json");
const { API_KEY } = require("./config.json");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const { MessageButton, MessageActionRow, MessageEmbed } = require("discord.js");
const prefix = "^";
const { ranksJson } = require("./ranks.json");
const { MessageType } = require("discord-api-types/v10");
const ranks = Array.from(ranksJson)[0]; //array of list of ranks
let playerData, playerRankInfo, playerName; // player data rank and name
let error = false;
let rankedRank, rankedTier, rankedWins, rankedLosses, rankedLP; //ranked stats
let hyperRank, hyperLP, hyperWins, hyperLosses; //hyperroll stats
let doubleRank, doubleTier, doubleWins, doubleLosses, doubleLP;
let messg; //message
let par; //parameters of command
client.login(TOKEN);
client.on("ready", async () => {
  console.log("on");
  client.user.setPresence({ activities: [{ name: 'tft | ^help' }], status: 'idle' });
  client.user.setStatus('idle')
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
  par = param;
  switch (command) {
    case "help": {
      const emb = new MessageEmbed()
        .setColor("#F2CB88")
        .setAuthor({
          name: "Help Page",
          iconURL: message.author.avatarURL(),
        })
        .setDescription(
          "Daeja is a bot that will display the TFT statistics of a player when called."
        )
        .addFields(
          {
            name: "Prefix",
            value: "^",
            inline: true,
          },
          {
            name: "Commands",
            value:
              "**help** to show this panel\n**stats [user?]** to show player's stats",
            inline: true,
          }
        )
        .setThumbnail(
          "https://media.discordapp.net/attachments/994108022706155580/999859304955924601/unknown.png"
        )
        .setFooter({
          text: "Developed by zef#9597 • https://github.com/thanhngo0",
          iconURL:
            "https://cdn.discordapp.com/avatars/186242909236887552/7baeca26bf7b507ced1c2c79c45243c8.webp",
        });
      sendMessage({ embeds: [emb] });
      break;
    }
    case "stats": {
      await searchForPlayer(param);
      if (error == false) await searchPlayerRank(playerData.id);
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
            name: playerData.name + "'s Profile",
            iconURL: `https://ddragon.leagueoflegends.com/cdn/12.13.1/img/profileicon/${playerData.profileIconId}.png`,
            url: "https://lolchess.gg/profile/na/" + param,
          })
          .setThumbnail(ranks[rankedRank])
          .addFields(
            {
              name: "Rank",
              value: rankedRank + " " + rankedTier + " " + rankedLP,
              inline: true,
            },
            {
              name: "Matches Played",
              value: rankedWins + rankedLosses + "",
              inline: true,
            },
            {
              name: "Top4 Rate",
              value:
                ((rankedWins / (rankedWins + rankedLosses)) * 100).toFixed(1) +
                "%\nTop4s: **" +
                rankedWins +
                "**\nBot4s: **" +
                rankedLosses +
                "**",
              inline: true,
            }
          )
          .setFooter({
            text: "^help for a list of commands",
            iconURL:
              "https://media.discordapp.net/attachments/994108022706155580/999859304955924601/unknown.png",
          });

        sendMessage({ components: [row], embeds: [emb] });
      }
      break;
    }
    // case "test": {
    //   await searchForPlayer(param);
    //   await searchPlayerOtherRank(playerData.data.id);
    //   break;
    // }
    default: {
      const emb = new MessageEmbed()
        .setColor("#F2CB88")
        .setAuthor({
          name: messg.author.username,
          iconURL: messg.author.avatarURL(),
        })
        .setDescription(`**${command}** is not a command`)
        .setFooter({
          text: "^help for a list of commands",
          iconURL:
            "https://media.discordapp.net/attachments/994108022706155580/999859304955924601/unknown.png",
        });
      sendMessage({ embeds: [emb] });
    }
  }
});

async function searchForPlayer(player) {
  var APICallString =
    "https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-name/" +
    encodeURIComponent(player) +
    "?api_key=" +
    API_KEY;
  try {
    const response = await axios.get(APICallString);
    playerData = response.data;
    playerName = playerData.name;
    error = false;
  } catch (e) {
    error = true;
    console.log("User doesn't exist");
    const emb = new MessageEmbed()
      .setColor("#F2CB88")
      .setAuthor({
        name: messg.author.username,
        iconURL: messg.author.avatarURL(),
      })
      .setDescription(`No player found with the name, **${par}**`);
    sendMessage({ embeds: [emb] });

    return;
  }
}
async function searchPlayerRank(id) {
  var APICallString =
    "https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/" +
    id +
    "?api_key=" +
    API_KEY;
  try {
    const response = await axios.get(APICallString);
    playerRankInfo = response.data;
    if (playerRankInfo == "") {
      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setLabel("View Profile")
          .setStyle(5)
          .setURL("https://lolchess.gg/profile/na/" + playerName)
      );
      const emb = new MessageEmbed()
        .setColor("#F2CB88")
        .setAuthor({
          name: playerData.name + "'s Profile",
          iconURL: `https://ddragon.leagueoflegends.com/cdn/12.13.1/img/profileicon/${playerData.profileIconId}.png`,
          url: "https://lolchess.gg/profile/na/" + playerName,
        })
        .setThumbnail("https://cdn.lolchess.gg/images/lol/tier/provisional.png")
        .addFields({
          name: "Rank",
          value: "Unranked",
          inline: true,
        })
        .setFooter({
          text: "^help for a list of commands",
          iconURL:
            "https://media.discordapp.net/attachments/994108022706155580/999859304955924601/unknown.png",
        });
      sendMessage({ embeds: [emb], components: [row] });
      error = true;
    } else {
      let dataArray = Array.from(playerRankInfo);
      console.log(dataArray);
      for (const temp of dataArray) {
        if (temp.queueType == "RANKED_TFT") {
          rankedRank = temp.tier[0] + temp.tier.substring(1).toLowerCase();
          rankedTier = temp.rank;
          rankedLP = temp.leaguePoints + " LP";
          rankedWins = temp.wins;
          rankedLosses = temp.losses;
        } else if (temp.queueType == "RANKED_TFT_TURBO") {
          hyperLP = temp.ratedRating;
          hyperLosses = temp.losses;
          hyperRank = temp.ratedTier;
          hyperWins = temp.wins;
        }
      }
      error = false;     
    }
  } catch (e) {
    error = true;
    console.log("error", e);
    sendMessage("error");
    return;
  }
}

// async function searchPlayerDoubleRank(id) {
//   var APICallString =
//     "https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/" +
//     id +
//     "?api_key=" +
//     API_KEY;
//   try {
//     const response = await axios.get(APICallString);
//     console.log(response);
//     playerRankInfo = response.data;
//   } catch (e) {
//     error = true;
//     console.log("error", e);
//     sendMessage("error");
//     return;
//   }
// }
