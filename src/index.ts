import { Client, IntentsBitField } from "discord.js";
import { fetchHTML } from "./fetcher";
import { Menu, parseHTMLFromMensaSite } from "./parser";
import { runAtSpecificTimeOfDay } from "./time";
import "dotenv/config";

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
  ],
});

let interval: NodeJS.Timeout;

client.on("ready", (c: Client) => {
  console.log("ready");

  if (interval === undefined) {
    interval = runAtSpecificTimeOfDay(
      Number(process.env.HOUR),
      Number(process.env.MINUTE),
      fetchHTMLAndSendMessage,
      (newInterval) => {
        interval = newInterval;
      }
    );
  }
});

client.login(process.env.TOKEN);

function fetchHTMLAndSendMessage() {
  fetchHTML()
    .then(parseHTMLFromMensaSite)
    .then(formatMessage)
    .then(sendMessage)
    .catch((err) => console.error(err));
}

function formatMessage(menu: Menu): Promise<string> {
  return new Promise((resolve, reject) => {
    const { day, dishes } = menu;
    let message = `**Mensa Menü für ${day}:**`;
    dishes.forEach((dish) => {
      const dishMsg = `${dish.name}: ${dish.price}€`;
      message = message.concat("\n- ", dishMsg);
    });
    resolve(message);
  });
}

function sendMessage(message: string): void {
  const mensaBotChannel = client.channels.cache.find(
    (ch: any) => ch.name === process.env.CHANNEL_NAME
  );
  if (mensaBotChannel !== undefined && mensaBotChannel.isTextBased()) {
    mensaBotChannel.send(String(message));
    console.log("send message:");
    console.log(message);
  }
}
