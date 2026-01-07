// -------------------------------
// Imports
// -------------------------------
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require("discord.js");
require('dotenv').config();
// -------------------------------
// Discord Bot Setup
// -------------------------------
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const ALLOWED_CHANNEL_ID = process.env.ALLOWED_CHANNEL_ID;

// Intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Store the latest message from /runs
let latest_message = "";

// -------------------------------
// Slash Command Definition
// -------------------------------
const runCommand = new SlashCommandBuilder()
    .setName("runs")
    .setDescription("Execute Code !")
    .addStringOption(option =>
        option
            .setName("msg")
            .setDescription("your code to execute blud")
            .setRequired(true)
    );

// -------------------------------
// Bot Ready Event
// -------------------------------
client.once("ready", async () => {
    console.log(`Bot is ready. Logged in as ${client.user.tag}`);

    const rest = new REST({ version: "10" }).setToken(TOKEN);

    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: [runCommand.toJSON()] }
        );
        console.log("Slash commands synced");
    } catch (err) {
        console.error(err);
    }
});

// -------------------------------
// Slash Command Handler
// -------------------------------
client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== "runs") return;

    if (interaction.channelId !== ALLOWED_CHANNEL_ID) {
        await interaction.reply({
            content: "Hey Diddy Blud! Make sure to go to the Cmds channel to use the bot!",
            ephemeral: true
        });
        return;
    }

    const msg = interaction.options.getString("msg");
    latest_message = msg;

    await interaction.reply({
        content: `Executing your code: ${msg}`,
        ephemeral: true
    });

    console.log(`Message from ${interaction.user.tag}: ${msg}`);
});

// -------------------------------
// Login
// -------------------------------
client.login(TOKEN);
