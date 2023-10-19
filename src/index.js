require('dotenv').config();

const {Client, IntentsBitField}  = require('discord.js');

const {parseHTMLFromMensaSite} = require('./parser.js');

const {fetchHTML} = require('./fetcher.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages
    ]
});

client.on('ready', (c) => {
    fetchHTML()
        .then(parseHTMLFromMensaSite)
        .then(formatMessage)
        .then(sendMessage);
});

client.login(process.env.TOKEN);

const formatMessage = ({day, dishes}) => { 
    return new Promise((resolve, reject) => {
        let message = `**Mensa Menü für ${day}:**`;
        dishes.forEach((dish) => {
            const dishMsg = `${dish.name}: ${dish.price}€`
            message = message.concat("\n- ", dishMsg);
        });
        resolve(message);
    });
}

const sendMessage = (message) => {
    const mensaBotChannel = client.channels.cache.find(ch => ch.name === process.env.CHANNEL_NAME);
    mensaBotChannel.send(String(message));
}