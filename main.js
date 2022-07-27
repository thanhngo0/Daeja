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
const { appendFile } = require("node:fs");
const wait = require("node:timers/promises").setTimeout;
const ranks = Array.from(ranksJson)[0]; //array of list of ranks
let playerData, playerTFTRankInfo, playerName, playerLOLRankInfo; // player data rank and name
let error = false;
let rankedRank1, rankedTier1, rankedWins1, rankedLosses1, rankedLP1; //ranked stats
let hyperRank1, hyperLP1, hyperWins1, hyperLosses1; //hyperroll stats
let doubleRank1, doubleTier1, doubleWins1, doubleLosses1, doubleLP1;
let messg; //message
let par; //parameters of command
let msgRef;
let qt = "Ranked"; //queue type
let msgT;
let user;
let firstRun = true;
let unrankedRanked1,
  unrankedHyper1,
  unrankedDouble1 = false;
let rankedMsg, hyperMsg, unrankedMsg, doubleMsg;
let row, row1, row2, row3;
client.login(TOKEN);
client.on("ready", async () => {
  console.log("on");
  client.user.setActivity(`tft | ${prefix}help`);
  client.user.setStatus("idle");
});
async function sendMessage(msg) {
  // client.channels.cache.get(channelId).response(msg);
  await messg.reply(msg);
}
client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  messg = message;
  user = message.author.id;
  const CID = message.channel.id;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  par = message.content.slice(message.content.indexOf(" ") + 1);
  const param = message.content
    .slice(message.content.indexOf(" ") + 1)
    .replace(/\s+/g, "");
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
            value: `${prefix}`,
            inline: true,
          },
          {
            name: "Commands",
            value:
              "**help** to show this panel\n**info** to show bot information\n**stats [user?]** to show player's stats",
            inline: true,
          }
        )
        .setThumbnail(
          "https://media.discordapp.net/attachments/994108022706155580/999859304955924601/unknown.png"
        )
        .setFooter({
          text: "Developed by zef#9597 • https://github.com/thanhngo0",
          iconURL:
            "https://cdn.discordapp.com/attachments/757537399629676605/1000703122114629642/0097e4935d657eb4d359516b9bd7d31e.png",
        });
      await sendMessage({ embeds: [emb] });
      break;
    }
    case "info": {
      const emb = new MessageEmbed()
        .setColor("#F2CB88")
        .setAuthor({
          name: `Daeja`,
          iconURL: `https://media.discordapp.net/attachments/994108022706155580/999859304955924601/unknown.png`,
          url: "https://github.com/thanhngo0",
        })
        .addFields(
          {
            name: "Creator",
            value: "zef#9597",
            inline: true,
          },
          {
            name: "Library",
            value: "discord.js",
            inline: true,
          },
          {
            name: "Invite",
            value: "[daeja.gg](https://daeja.gg)",
            inline: true,
          },
          {
            name: "Project",
            value: "[GitHub](https://github.com/thanhngo0/discordBot)",
            inline: true
          }
        )
        .setFooter({
          text: `${prefix}help for a list of commands`,
        });
      await sendMessage({embeds: [emb]});
      break;
    }
    case "start": {
      if (firstRun) {
        row = new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel("start")
            .setStyle(1)
            .setCustomId("start")
            .setDisabled(true)
        );
        test = new MessageEmbed()
          .setColor("#F2CB88")
          .setDescription("Bot is online");
        msgRef = await message.reply({
          components: [row],
          embeds: [test],
        });
        msgT = {
          components: [row],
          embeds: [test],
        };
        firstRun = false;
      } else {
        const emb = new MessageEmbed()
          .setColor("#F2CB88")
          .setAuthor({
            name: messg.author.username,
            iconURL: messg.author.avatarURL(),
          })
          .setDescription(`**${command}** is not a command`)
          .setFooter({
            text: `${prefix}help for a list of commands`,
            iconURL:
              "https://media.discordapp.net/attachments/994108022706155580/999859304955924601/unknown.png",
          });
        await sendMessage({ embeds: [emb] });
      }
      break;
    }
    case "stats": {
      await searchForPlayer(param);
      if (error == false) {
        await searchPlayerRank(playerData.id);
        await searchPlayerDoubleRank(playerData.id);
      }
      if (error == false) {
        isStatsCalled = true;
        qt = "Ranked";
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
        let doubleRank = doubleRank1;
        let doubleTier = doubleTier1;
        let doubleWins = doubleWins1;
        let doubleLosses = doubleLosses1;
        let doubleLP = doubleLP1;
        row = new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel("Hyper Roll")
            .setStyle(1)
            .setCustomId("hyper"),
          new MessageButton()
            .setLabel("Double Up")
            .setStyle(1)
            .setCustomId("double"),
          new MessageButton()
            .setLabel("Profile")
            .setStyle(5)
            .setURL("https://lolchess.gg/profile/na/" + param)
        );
        row1 = new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel("Ranked")
            .setStyle(1)
            .setCustomId("ranked"),
          new MessageButton()
            .setLabel("Double Up")
            .setStyle(1)
            .setCustomId("double"),
          new MessageButton()
            .setLabel("Profile")
            .setStyle(5)
            .setURL("https://lolchess.gg/profile/na/" + param)
        );
        row2 = new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel("Ranked")
            .setStyle(1)
            .setCustomId("ranked"),
          new MessageButton()
            .setLabel("Hyper Roll")
            .setStyle(1)
            .setCustomId("hyper"),
          new MessageButton()
            .setLabel("Profile")
            .setStyle(5)
            .setURL("https://lolchess.gg/profile/na/" + param)
        );
        row3 = new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel("Profile")
            .setStyle(5)
            .setURL("https://lolchess.gg/profile/na/" + param)
        );
        msgRef.edit({ components: [row3], embeds: msgT.embeds });
        unrankedMsg = new MessageEmbed()
          .setColor("#F2CB88")
          .setAuthor({
            name: playerData.name + `'s ${qt} Profile`,
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
            text: `${prefix}help for a list of commands`,
            iconURL:
              "https://media.discordapp.net/attachments/994108022706155580/999859304955924601/unknown.png",
          });
        if (unrankedRanked == false) {
          rankedMsg = new MessageEmbed()
            .setColor("#F2CB88")
            .setAuthor({
              name: playerData.name + `'s Ranked Profile`,
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
              text: `${prefix}help for a list of commands`,
              iconURL:
                "https://media.discordapp.net/attachments/994108022706155580/999859304955924601/unknown.png",
            });
        }
        if (unrankedHyper == false) {
          hyperMsg = new MessageEmbed()
            .setColor("#F2CB88")
            .setAuthor({
              name: playerData.name + `'s Hyper Roll Profile`,
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
              text: `${prefix}help for a list of commands`,
              iconURL:
                "https://media.discordapp.net/attachments/994108022706155580/999859304955924601/unknown.png",
            });
        }
        if (unrankedDouble == false) {
          doubleMsg = new MessageEmbed()
            .setColor("#F2CB88")
            .setAuthor({
              name: playerData.name + `'s Double Up Profile`,
              iconURL: `https://ddragon.leagueoflegends.com/cdn/12.13.1/img/profileicon/${playerData.profileIconId}.png`,
              url: "https://lolchess.gg/profile/na/" + param,
            })
            .setThumbnail(ranks[doubleRank])
            .addFields(
              {
                name: "Rank",
                value: doubleRank + " " + doubleTier,
                inline: true,
              },
              {
                name: "Rating",
                value: doubleLP + "",
                inline: true,
              },
              {
                name: "Matches Played",
                value: doubleWins + doubleLosses + "",
                inline: true,
              },

              {
                name: "Top 4's",
                value: doubleWins + "",
                inline: true,
              },
              {
                name: "Bot 4's",
                value: doubleLosses + "",
                inline: true,
              },
              {
                name: "Win Rate",
                value:
                  ((doubleWins / (doubleWins + doubleLosses)) * 100).toFixed(
                    1
                  ) + "%",
                inline: true,
              }
            )
            .setFooter({
              text: `${prefix}help for a list of commands`,
              iconURL:
                "https://media.discordapp.net/attachments/994108022706155580/999859304955924601/unknown.png",
            });
        }
        if (unrankedRanked == false) {
          msgRef = await message.reply({
            components: [row],
            embeds: [rankedMsg],
          });
          msgT = { components: [row], embeds: [rankedMsg] };
        } else {
          msgRef = await message.reply({
            components: [row],
            embeds: [unrankedMsg],
          });
          msgT = { s: [row], embeds: [unrankedMsg] };
        }
        setTimeout(
          () => msgRef.edit({ components: [row3], embeds: msgT.embeds }),
          1000 * 60
        );
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
          text: `${prefix}help for a list of commands`,
          iconURL:
            "https://media.discordapp.net/attachments/994108022706155580/999859304955924601/unknown.png",
        });
      await sendMessage({ embeds: [emb] });
    }
  }
});
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isSelectMenu() && !interaction.isButton()) return;

  if (interaction.customId == "hyper") {
    qt = "Hyper Roll";
    try {
      if (unrankedHyper1 == false) {
        msgT = {
          components: [row1],
          embeds: [hyperMsg],
        };
      } else {
        unrankedMsg.setAuthor({
          name: playerData.name + `'s ${qt} Profile`,
          iconURL: `https://ddragon.leagueoflegends.com/cdn/12.13.1/img/profileicon/${playerData.profileIconId}.png`,
          url: "https://lolchess.gg/profile/na/" + playerName,
        });
        msgT = {
          components: [row1],
          embeds: [unrankedMsg],
        };
      }
    } catch (e) {
      console.log(e);
    }
  } else if (interaction.customId == "double") {
    qt = "Double Up";
    try {
      if (unrankedDouble1 == false) {
        msgT = {
          components: [row2],
          embeds: [doubleMsg],
        };
      } else {
        unrankedMsg.setAuthor({
          name: playerData.name + `'s ${qt} Profile`,
          iconURL: `https://ddragon.leagueoflegends.com/cdn/12.13.1/img/profileicon/${playerData.profileIconId}.png`,
          url: "https://lolchess.gg/profile/na/" + playerName,
        });
        msgT = {
          components: [row2],
          embeds: [unrankedMsg],
        };
      }
    } catch (e) {
      console.log(e);
    }
  } else if (interaction.customId == "ranked") {
    qt = "Ranked";
    try {
      if (unrankedRanked1 == false) {
        msgT = {
          components: [row],
          embeds: [rankedMsg],
        };
      } else {
        unrankedMsg.setAuthor({
          name: playerData.name + `'s ${qt} Profile`,
          iconURL: `https://ddragon.leagueoflegends.com/cdn/12.13.1/img/profileicon/${playerData.profileIconId}.png`,
          url: "https://lolchess.gg/profile/na/" + playerName,
        });
        msgT = {
          components: [row],
          embeds: [unrankedMsg],
        };
      }
    } catch (e) {
      console.log(e);
    }
  }
  await interaction.deferUpdate();
  await interaction.editReply(msgT);
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
    await message.reply({ embeds: [emb] });

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
        if (
          temp.tier == "MASTER" ||
          temp.tier == "GRANDMASTER" ||
          temp.tier == "CHALLENGER"
        )
          rankedTier1 = " ";
        else rankedTier1 = temp.rank;

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
    const emb = new MessageEmbed()
      .setColor("#F2CB88")
      .setAuthor({
        name: messg.author.username,
        iconURL: messg.author.avatarURL(),
      })
      .setDescription(`An error occurred, please try again.`);
    await sendMessage({ embeds: [emb] });

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
    //console.log(playerLOLRankInfo);
    unrankedDouble1 = true;
    let dataArray = Array.from(playerLOLRankInfo);
    for (const temp of dataArray) {
      if (temp.queueType == "RANKED_TFT_DOUBLE_UP") {
        doubleRank1 = temp.tier[0] + temp.tier.substring(1).toLowerCase();
        if (
          temp.tier == "MASTER" ||
          temp.tier == "GRANDMASTER" ||
          temp.tier == "CHALLENGER"
        )
          doubleTier1 = " ";
        else doubleTier1 = temp.rank;

        doubleLP1 = temp.leaguePoints + " LP";
        doubleWins1 = temp.wins;
        doubleLosses1 = temp.losses;
        unrankedDouble1 = false;
      }
    }
  } catch (e) {
    error = true;
    console.log("error", e);
    const emb = new MessageEmbed()
      .setColor("#F2CB88")
      .setAuthor({
        name: messg.author.username,
        iconURL: messg.author.avatarURL(),
      })
      .setDescription(`An error occurred, please try again.`);
    await sendMessage({ embeds: [emb] });

    return;
  }
}
