// DEPENDENCIES
const Discord = require("discord.js");
const bot = new Discord.Client();

const fs = require('fs');

require('dotenv').config();

// Command handler setup
const PREFIX = '!';
bot.commands = new Discord.Collection();

const featureFiles = fs.readdirSync('./features').filter(file => file.endsWith('.js'));
for (const file of featureFiles) {
    const feature = require(`./features/${file}`);
    bot.commands.set(feature.name, feature);
}

bot.on('message', (msg) => {
    // Sender is a bot and should not be served
    if (msg.author.bot) return;

    // Sender is the bot itself and should not be served
    if (msg.author.id === bot.user.id) return;

    // Message does not start with prefix and should be ignored
    if (!msg.content.startsWith(PREFIX)) return;

    const args = msg.content.split(' ');
    let cmd = args.shift();

    // Strip pure command name, in all lowercase
    cmd = cmd.substring(PREFIX.length).toLowerCase();

    // If command doesn't exist ignore message
    if (!bot.commands.has(cmd)) return;

    const command = bot.commands.get(cmd);
    const isAdmin = msg.member && msg.member.hasPermission("ADMINISTRATOR");
    // If user isn't admin but the command requires it return
    if (command.admin && !isAdmin) return;
    command.execute(msg)
});

bot.on('ready', () => {
    updateStatus()
});

bot.on('guildMemberAdd', (member) => {
    updateStatus();
    welcomeUser(member);
});
bot.on('guildMemberRemove', () => updateStatus())
bot.on('guildCreate', (guild) => {
    updateStatus()
    welcomeGroup(guild)
})
bot.on('guildDelete', (guild) => {
    updateStatus()
    byeGroup(guild)
})

// LOG IN
bot.login(process.env.BOT_TOKEN).then(() => {
    console.log('authorized in all servers');
});

const updateStatus = () => {
    let members = 0;
    let guilds = 0;
    bot.guilds.forEach((guild) => {
        members += guild.memberCount
        guilds++
    })
    bot.user.setActivity(`${members} people in ${guilds} servers`, { type: "WATCHING" })
}

const welcomeUser = (member) => {
    if(member.guild.id === "752301663510986822") return
    const message = ":wave: **Welcome to Opal!** :wave: \n\nIt seems you have joined a server I reside in. Who am I? Well I am a **100% free & open source** Discord bot to make your experience in this group seamless. We provide **over 30 features**, all of which can be tested in our support server! Do you own a group? Opal is perfect for you! Can you code or are you willing to learn? Opal has great resources for anyone looking to contribute! \n\nJoin Support Server: https://discord.gg/p8dzvk7\nFollow Opal on Twitter: https://twitter.com/OpalSource\nInvite Opal Link: https://discord.com/api/oauth2/authorize?client_id=752293928157446184&permissions=8&scope=bot"
    member.user.send(message)
}

const welcomeGroup = (guild) => {
    guilds = 0;
    bot.guilds.forEach((guild) => {
        guilds++
    })
    const embed = new Discord.RichEmbed()
    .addField("Server Name", guild.name, true)
    .addField("Server ID", guild.id, true)
    .addField("Owner", guild.owner ? guild.owner : 'N/A', true)
    .addField("Region", guild.region, true)
    .addField("Members", guild.memberCount, true)
    .addField("Server Count", guilds, true)
    .setThumbnail(guild.iconURL)
    .setColor("#61E786")
    bot.channels.get('770377555089031240').send(embed)
}

const byeGroup = (guild) => {
    guilds = 0;
    bot.guilds.forEach((guild) => {
        guilds++
    })
    const embed = new Discord.RichEmbed()
    .addField("Server Name", guild.name, true)
    .addField("Server ID", guild.id, true)
    .addField("Owner", guild.owner ? guild.owner : 'N/A', true)
    .addField("Region", guild.region, true)
    .addField("Members", guild.memberCount, true)
    .addField("Server Count", guilds, true)
    .setThumbnail(guild.iconURL)
    .setColor("#FF495C")
    bot.channels.get('770377555089031240').send(embed)
}


global.setBranding = (embed) => {
    embed.setColor('#36393F');
    embed.setTimestamp();
    embed.addField("\u200b", "[Invite Opal](https://bit.ly/opal-invite) | [Join Server](https://bit.ly/opal-join-discord) | [Twitter](https://twitter.com/OpalSource)", true)
    embed.setFooter("opal.io", "https://i.ibb.co/BG79PK2/opallogo.png")
}