import { Message } from "discord.js"

export function parseArgs(message: Message<boolean>) {
  const args: any = message.content.slice(1).trim().split(/ +/)
  const command = args.shift().toLowerCase()
  return { command, args }
}
