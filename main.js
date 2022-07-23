const Discord = require("discord.js");
const axios = require("axios");
const { TOKEN } = require("./config.json");
const { API_KEY } = require("./config.json");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const { ComponentType } = require("discord.js");
const {
  Message,
  MessageButton,
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
} = require("discord.js");
const prefix = ">";
const { ranksJson } = require("./ranks.json");
const { MessageType } = require("discord-api-types/v10");
const { channel } = require("node:diagnostics_channel");
const { Console } = require("node:console");
const wait = require("node:timers/promises").setTimeout;
const ranks = Array.from(ranksJson)[0]; //array of list of ranks
let playerData, playerTFTRankInfo, playerName, playerLOLRankInfo; // player data rank and name
let error = false;
let rankedRank1, rankedTier1, rankedWins1, rankedLosses1, rankedLP1; //ranked stats
let hyperRank1, hyperLP1, hyperWins1, hyperLosses1; //hyperroll stats
let doubleRank1, doubleTier1, doubleWins1, doubleLosses1, doubleLP1;
let messg; //message
let par; //parameters of command
let unrankedRanked1,
  unrankedHyper1,
  unrankedDouble1 = false;
let rankedMsg, hyperMsg, unrankedMsg, doubleMsg;
let row, row1, row2, row3;
client.login(TOKEN);
client.on("ready", async () => {
  console.log("on");
  client.user.setPresence({
    activities: [{ name: "tft | ^help" }],
    status: "idle",
  });
  client.user.setStatus("idle");
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
          "Daeja is a bot that displays the TFT statistics of a player when called."
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
      await sendMessage({ embeds: [emb] });
      break;
    }
    case "stats": {
      await searchForPlayer(param);
      if (error == false) await searchPlayerRank(playerData.id);
      if (error == false) {
        let rankedRank = rankedRank1;
        let rankedTier = rankedTier1;
        let rankedWins = rankedWins1;
        let rankedLosses = rankedLosses1;
        let rankedLP = rankedLP1;
        let hyperRank = hyperRank1;
        let hyperLP = hyperLP1;
        let hyperWins = hyperWins1;
        let hyperLosses = hyperLosses1;
        let unrankedRanked = unrankedRanked1;
        let unrankedHyper = unrankedHyper1;
        let unrankedDouble = unrankedDouble1;

        row = new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel("View Profile")
            .setStyle(5)
            .setURL("https://lolchess.gg/profile/na/" + param),
          new MessageButton().setLabel("Done").setStyle(3).setCustomId("done")
        );
        row1 = new MessageActionRow().addComponents(
          new MessageSelectMenu()
            .setCustomId("select1")
            .setPlaceholder("Queue Type")
            .addOptions(
              {
                label: "Hyper Roll",
                value: "first_option",
              },
              {
                label: "Double Up",
                value: "second_option",
              }
            )
        );
        row2 = new MessageActionRow().addComponents(
          new MessageSelectMenu()
            .setCustomId("select2")
            .setPlaceholder("Queue Type")
            .addOptions(
              {
                label: "Ranked",
                value: "third_option",
              },
              {
                label: "Double Up",
                value: "second_option",
              }
            )
        );
        row3 = new MessageActionRow().addComponents(
          new MessageSelectMenu()
            .setCustomId("select3")
            .setPlaceholder("Queue Type")
            .addOptions(
              {
                label: "Ranked",
                value: "third_option",
              },
              {
                label: "Hyper Roll",
                value: "first_option",
              }
            )
        );
        unrankedMsg = new MessageEmbed()
          .setColor("#F2CB88")
          .setAuthor({
            name: playerData.name + "'s Profile",
            iconURL: `https://ddragon.leagueoflegends.com/cdn/12.13.1/img/profileicon/${playerData.profileIconId}.png`,
            url: "https://lolchess.gg/profile/na/" + playerName,
          })
          .setThumbnail(
            "https://cdn.lolchess.gg/images/lol/tier/provisional.png"
          )
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
        if (unrankedRanked == false) {
          rankedMsg = new MessageEmbed()
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
                value: rankedRank + " " + rankedTier,
                inline: true,
              },
              {
                name: "Rating",
                value: rankedLP + "",
                inline: true,
              },
              {
                name: "Matches Played",
                value: rankedWins + rankedLosses + "",
                inline: true,
              },

              {
                name: "Top 4's",
                value: rankedWins + "",
                inline: true,
              },
              {
                name: "Bot 4's",
                value: rankedLosses + "",
                inline: true,
              },
              {
                name: "Win Rate",
                value:
                  ((rankedWins / (rankedWins + rankedLosses)) * 100).toFixed(
                    1
                  ) + "%",
                inline: true,
              }
            )
            .setFooter({
              text: "^help for a list of commands",
              iconURL:
                "https://media.discordapp.net/attachments/994108022706155580/999859304955924601/unknown.png",
            });
        }
        if (unrankedHyper == false) {
          hyperMsg = new MessageEmbed()
            .setColor("#F2CB88")
            .setAuthor({
              name: playerData.name + "'s Profile",
              iconURL: `https://ddragon.leagueoflegends.com/cdn/12.13.1/img/profileicon/${playerData.profileIconId}.png`,
              url: "https://lolchess.gg/profile/na/" + param,
            })
            .setThumbnail(ranks[hyperRank])
            .addFields(
              {
                name: "Rank",
                value: hyperRank,
                inline: true,
              },
              {
                name: "Rating",
                value: hyperLP + "",
                inline: true,
              },
              {
                name: "Matches Played",
                value: hyperWins + hyperLosses + " ",
                inline: true,
              },
              {
                name: "Top 4's",
                value: hyperWins + "",
                inline: true,
              },
              {
                name: "Bot 4's",
                value: hyperLosses + "",
                inline: true,
              },
              {
                name: "Win Rate",
                value:
                  ((hyperWins / (hyperWins + hyperLosses)) * 100).toFixed(1) +
                  "%",
                inline: true,
              }
            )
            .setFooter({
              text: "^help for a list of commands",
              iconURL:
                "https://media.discordapp.net/attachments/994108022706155580/999859304955924601/unknown.png",
            });
        }
        if (unrankedRanked == false) {
          //sendMessage({ components: [row1], embeds: [rankedMsg] });
          await message.reply({ components: [row, row1], embeds: [rankedMsg] });
        } else
          await sendMessage({ components: [row, row1], embeds: [unrankedMsg] });
      }
      break;
    }
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
      await sendMessage({ embeds: [emb] });
    }
  }
});
client.on("interactionCreate", async (interaction) => {
  //if (!interaction.isButton()) return;
  if (!interaction.isSelectMenu() && !interaction.isButton()) return;
  if (interaction.customId == "done") {
    try {
      await interaction.message.delete();
      await interaction.deferUpdate();
    } catch (e) {}
  } else if (interaction.values[0] == "first_option") {
    await interaction.deferUpdate();
    try {
      if (unrankedHyper1 == false) {
        await interaction.editReply({
          components: [row, row2],
          embeds: [hyperMsg],
        });
      } else {
        await interaction.editReply({
          components: [row, row2],
          embeds: [unrankedMsg],
        });
      }
    } catch (e) {
      console.log(e);
    }
  } else if (interaction.values[0] == "second_option") {
    await interaction.deferUpdate();
  } else if (interaction.values[0] == "third_option") {
    await interaction.deferUpdate();
    try {
      if (unrankedRanked1 == false) {
        await interaction.editReply({
          components: [row, row1],
          embeds: [rankedMsg],
        });
      } else {
        await interaction.editReply({
          components: [row, row1],
          embeds: [unrankedMsg],
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
});
//searches for the player requested and sets playerData to the player data if found
//else it will display a player not found msg
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
    await sendMessage({ embeds: [emb] });

    return;
  }
}

//searches for the player requested rank and sets playerRankInfo
//if player is unranked or not found it will send a msg
async function searchPlayerRank(id) {
  var APICallString =
    "https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/" +
    id +
    "?api_key=" +
    API_KEY;
  try {
    const response = await axios.get(APICallString);
    playerTFTRankInfo = response.data;
    unrankedHyper1 = true;
    unrankedRanked1 = true;
    let dataArray = Array.from(playerTFTRankInfo);
    for (const temp of dataArray) {
      if (temp.queueType == "RANKED_TFT") {
        rankedRank1 = temp.tier[0] + temp.tier.substring(1).toLowerCase();
        rankedTier1 = temp.rank;
        rankedLP1 = temp.leaguePoints + " LP";
        rankedWins1 = temp.wins;
        rankedLosses1 = temp.losses;
        unrankedRanked1 = false;
      } else if (temp.queueType == "RANKED_TFT_TURBO") {
        hyperLP1 = temp.ratedRating;
        hyperLosses1 = temp.losses;
        if (temp.ratedTier == "ORANGE") hyperRank1 = "Hyper";
        else
          hyperRank1 =
            temp.ratedTier[0] + temp.ratedTier.substring(1).toLowerCase();
        hyperWins1 = temp.wins;
        unrankedHyper1 = false;
      }
    }
  } catch (e) {
    error = true;
    console.log("error", e);
    await sendMessage("error");
    return;
  }
}

//looks for the player's double up rank
async function searchPlayerDoubleRank(id) {
  var APICallString =
    "https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/" +
    id +
    "?api_key=" +
    API_KEY;

  try {
    const response = await axios.get(APICallString);
    playerLOLRankInfo = response.data;
  } catch {}
}

// if (playerRankInfo == "") {
//   const row = new MessageActionRow().addComponents(
//     new MessageButton()
//       .setLabel("View Profile")
//       .setStyle(5)
//       .setURL("https://lolchess.gg/profile/na/" + playerName)
//   );
//   const emb = new MessageEmbed()
//     .setColor("#F2CB88")
//     .setAuthor({
//       name: playerData.name + "'s Profile",
//       iconURL: `https://ddragon.leagueoflegends.com/cdn/12.13.1/img/profileicon/${playerData.profileIconId}.png`,
//       url: "https://lolchess.gg/profile/na/" + playerName,
//     })
//     .setThumbnail("https://cdn.lolchess.gg/images/lol/tier/provisional.png")
//     .addFields({
//       name: "Rank",
//       value: "Unranked",
//       inline: true,
//     })
//     .setFooter({
//       text: "^help for a list of commands",
//       iconURL:
//         "https://media.discordapp.net/attachments/994108022706155580/999859304955924601/unknown.png",
//     });
//   sendMessage({ embeds: [emb], components: [row] });
//   error = true;
// }
