require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const TARGET_CHANNEL_ID = '1360603378853613568';
const USER_REQUIRED_ROLE_ID = '1360601477759893514';
const cooldowns = new Map();
const sendingFlags = new Set();
const COOLDOWN_DURATION = 60 * 1000;

console.log('Bot script loaded');

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

if (!global.listenerAdded) {
  client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (message.channel.id !== TARGET_CHANNEL_ID) return;
    if (!message.member.roles.cache.has(USER_REQUIRED_ROLE_ID)) return;
    if (message.content.trim() !== '.event') return;

    const now = Date.now();
    const lastUsed = cooldowns.get(message.author.id) || 0;

    if (sendingFlags.has(message.author.id)) return;
    if (now - lastUsed < COOLDOWN_DURATION) return;

    sendingFlags.add(message.author.id);
    cooldowns.set(message.author.id, now);

    await message.channel.send(
      `<@${message.author.id}> is starting an event! 🔥\n\n` +
      `Rate how the event went in <#1369041831295189055>!\n\n` +
      `<@&1360635910760300699>`
    );

    setTimeout(() => {
      sendingFlags.delete(message.author.id);
    }, COOLDOWN_DURATION);
  });
  global.listenerAdded = true;
}

client.login(process.env.TOKEN);
