require('dotenv').config();
const { parse } =  require('node-html-parser');
const {Client, IntentsBitField}  = require('discord.js');

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


const fetchHTML = () => {
    return fetch(process.env.MENSA_URL)
        .then(res => res.text())
        .then(unEscape)
}

function unEscape(html) {
    return new Promise((resolve, reject) => {
        html = html.replace(/&lt;/g , "<");	 
        html = html.replace(/&gt;/g , ">");     
        html = html.replace(/&quot;/g , "\"");  
        html = html.replace(/&#39;/g , "\'");   
        html = html.replace(/&amp;/g , "&");

        resolve(html)
    });
}

const parseHTMLFromMensaSite = (html) => {
    return new Promise((resolve, reject) => {
        const parsedHTML = parse(html);

        const currDataDay = parsedHTML.querySelector('#thecurrentday')
            .getAttribute('data-day');
        
        
        const currDayAll = parsedHTML.querySelectorAll(`div[data-day="${currDataDay}"][class="day"] .menuwrap .menu`);

        //filter evening dishes
        const currDay = currDayAll.filter((dish) => dish.querySelectorAll('div[title="Essen Abendmensa MeCampNo"]').length === 0);

        const dishes = currDay.map(parseHTMLMenu);

        resolve({
            day: currDataDay,
            dishes: dishes
        });
    });
}

const parseHTMLMenu = (menuHTML) => {
    const price = menuHTML.querySelector('.price')
                            .querySelector('span').innerHTML;

    const name = menuHTML.querySelector('.left')
                            .querySelector('.title').innerHTML;

    return {
        price: price,
        name: name
    }
}

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