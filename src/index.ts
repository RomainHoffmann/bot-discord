import "dotenv/config"
import { Client, GatewayIntentBits } from "discord.js"
import { gameCommand } from "./commands/game/gameCommand"
import { parseArgs } from "./helpers/parseArgs"

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
  ],
})

client.once("ready", () => {
  console.log("Bot is ready!")
})

client.on("messageCreate", async (message) => {
  const { command, args } = parseArgs(message)
  if (command === "game") {
    gameCommand(message, args)
  }
})

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return

  switch (interaction.customId) {
    case "accept":
      await interaction.reply("You accepted the invitation.")
      break
    case "decline":
      await interaction.reply("You declined the invitation.")
      break
    case "few_minutes":
      await interaction.reply('You chose "Not Now".')
      break
    default:
      await interaction.reply("Unknown button.")
  }
})

client.login(process.env.BOT_TOKEN)
