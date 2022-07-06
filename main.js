const Discord = require("discord.js");
const axios = require("axios");
const token = require("./token.js");
const { s } = require("@sapphire/shapeshift");
const client = new Discord.Client({intents:["GUILDS", "GUILD_MESSAGES"]});
const prefix = "^";

client.login(token);
client.on("ready", async() => {  
    console.log("test");
 });

 client.on("messageCreate", (message) => {
    if(!message.content.startsWith(prefix) || message.author.bot) return; 
   
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
   
    if(command == "cats"){
        message.channel.send("hi");
    } else if(command != "cats"){
       sendMessage(message.author.username, message.channel.id);
    }
})

function sendMessage(username, channelId) {
    client.channels.cache.get(channelId).send(username + ", that is not a command!");
}