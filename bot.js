require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const TARGET_CHANNEL_ID = '1358489696669274342';
const USER_REQUIRED_ROLE_ID = '1360601477759893514';
const ROLE_TO_MENTION_ID = '1360635910760300699';
const RATE_CHANNEL_ID = '1369041831295189055';

const cooldowns = new Map();

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
  if (message.channel.id !== TARGET_CHANNEL_ID) return;
  if (!message.member.roles.cache.has(USER_REQUIRED_ROLE_ID)) return;
  if (message.content.trim() !== '.event') return;

  const now = Date.now();
  const cooldown = 60 * 1000;

  if (cooldowns.has(message.author.id)) {
    const lastUsed = cooldowns.get(message.author.id);
    if (now - lastUsed < cooldown) return;
  }

  cooldowns.set(message.author.id, now);

  message.channel.send(
    `${message.author} is starting an event! :fire:\n` +
    `Rate how the event went in <#${RATE_CHANNEL_ID}>!\n` +
    `<@&${ROLE_TO_MENTION_ID}>`
  );
});

client.login(process.env.TOKEN);
