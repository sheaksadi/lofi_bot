const { Client, GatewayIntentBits } = require('discord.js');
const { token, prefix } = require('./config.json');
const { joinVoiceChannel, createAudioPlayer, createAudioResource} = require('@discordjs/voice');
const play = require('play-dl'); // Everything
// Individual functions by using destructuring
const { video_basic_info, stream } = require('play-dl');

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


client.on('voiceStateUpdate',  async (old,news) => {


    if (old ){
        console.log(1)
        if(old.channel){
            if (!old.channel.members.size - 1){

            }     setTimeout(() => { // if 1 (you), wait five minutes
                if (!old.channel.members.size - 1) {
                    if (!connection) return
                    connection.destroy()
                    connection = null
                }

                // leave
            }, 5000); // (5 min in ms)
        }

    }


    if (news.channelId === null) return
    // console.log(old.member.id);
    // console.log(news.id)
    if (news.member.id === "446224188592881665" && old.member.id === "446224188592881665"){

        let stream = await play.stream("https://www.youtube.com/watch?v=jfKfPfyJRdk&ab_channel=LofiGirl")


        connection = joinVoiceChannel({
            channelId: news.channelId,
            guildId: news.guild.id,
            adapterCreator: news.guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer()


        let resource = createAudioResource(stream.stream, {
            inputType: stream.type
        })

        player.play(resource)

        connection.subscribe(player)

        client.on('messageCreate', async (message) => {
            console.log(message.content)
            if (message.content === prefix+"stop"){
                connection.destroy()
            }

        })



    }

});






// Login to Discord with your client's token
client.login(token);