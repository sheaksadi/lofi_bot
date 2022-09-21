const { Client, GatewayIntentBits, Routes } = require('discord.js');
const { token, prefix, clientId, ownerId } = require('./config.json');
const { joinVoiceChannel, createAudioPlayer, createAudioResource} = require('@discordjs/voice');
const play = require('play-dl');
const {REST} = require("@discordjs/rest")

// Create a new client instance
const client = new Client({ intents: [
        GatewayIntentBits.GuildMessages,
         GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        641,

    ] });


// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
});

let connection;


const rest = new REST({ version: '10' }).setToken(token)

const commands = [
    {
        name: 'join',
        description: 'Bot joins your vc',
    },
    {
        name: 'stop',
        description: 'Bot leaves your vc',
    },
    {
        name: 'help',
        description: 'For help',
    },
];

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(clientId), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();


client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'join') {

        // Getting the author's voice connection.
        const userVoiceChannel = interaction.member.voice;

        if (!userVoiceChannel.channel){
            await interaction.reply("You need to be in a voice channel lol");
            return
        }



        await joinAndPlay(userVoiceChannel.channelId, interaction.guild)
        await interaction.reply("o7");

    }
    if (interaction.commandName === 'help') {
        await interaction.reply('Do /join to join vc and /stop to leave :)');
    }

});



client.on('voiceStateUpdate',  async (old,news,) => {

    if (old ){
        if(old.channel){
            if (old.channel.members.size !== 0){
                if (old.channel.members.size === 1){
                    for (const [memberID, member] of old.channel.members) {
                        if (memberID === clientId){
                            if (!connection) return
                            connection.destroy()
                            connection = null
                        }
                    }
                }

                // setTimeout(() => { // if 1 (you), wait five minutes
                //     if (!old.channel.members.size - 1) {
                //         if (!connection) return
                //         connection.destroy()
                //         connection = null
                //     }
                //
                //     // leave
                // }, 5000);
            }   // (5 min in ms)
        }

    }

    if (news.channelId === null) return

    if (news.member.id === ownerId && old.member.id === ownerId){

        await joinAndPlay(news.channelId, news.guild)

    }

});


client.on('messageCreate', async (message) => {
    if (message.content === prefix+"join"){

        // Getting the author's voice connection.
        const userVoiceChannel = message.member.voice;

        if (!userVoiceChannel.channel) await message.reply("You need to be in a voice channel lol");



        await joinAndPlay(userVoiceChannel.channelId, message.guild)
        await message.reply("o7");

    }


})

const joinAndPlay =async (channelId, guild) => {

    const stream = await play.stream("https://www.youtube.com/watch?v=jfKfPfyJRdk&ab_channel=LofiGirl")


    connection = joinVoiceChannel({
        channelId: channelId,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer()


    let resource = createAudioResource(stream.stream, {
        inputType: stream.type
    })

    player.play(resource)

    connection.subscribe(player)

    client.on('messageCreate', async (message) => {
        if (message.content === prefix+"stop"){
            if (!connection) return
            connection.destroy()
            connection = null
            await message.reply("o7");
        }

    })

    client.on('interactionCreate', async interaction => {
        if (interaction.commandName === 'stop') {
            if (!connection) return
            connection.destroy()
            connection = null
            await interaction.reply("o7");

        }

    })

}




// Login to Discord with your client's token
client.login(token);