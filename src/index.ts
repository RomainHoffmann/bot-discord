import "dotenv/config"
import { Client, GatewayIntentBits } from "discord.js"
import { GameCommand } from "./commands/GameCommand"
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
  try {
    const { command, args } = parseArgs(message)
    if (command === "game") {
    new GameCommand(message,args).handleCommand()
  }
  } catch (error: any) {
    await message.reply(error.message)
  }
})

client.login(process.env.BOT_TOKEN)

export {client}