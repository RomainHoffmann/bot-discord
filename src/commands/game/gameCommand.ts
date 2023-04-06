import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Message,
} from "discord.js"

export const gameCommand = (message: Message<boolean>, args: any) => {
  if (args.length < 3) {
    message.reply("Usage: !game <game_name> <number_of_players> <group_name>")
    return
  }

  const gameName = args[0]
  const numberOfPlayers = parseInt(args[1])
  const groupName = args[2]

  const groupRole = message.guild!.roles.cache.find(
    (role) => role.name === groupName
  )
  if (!groupRole) {
    message.reply(`Group "${groupName}" not found.`)
    return
  }

  const groupMembers = message.guild!.members.cache.filter((member) =>
    member.roles.cache.has(groupRole.id)
  )

  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("accept")
        .setLabel("Accept")
        .setStyle(ButtonStyle.Primary)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("decline")
        .setLabel("Decline")
        .setStyle(ButtonStyle.Danger)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("few_minutes")
        .setLabel("Few minutes")
        .setStyle(ButtonStyle.Secondary)
    )

  groupMembers.forEach((member) => {
    member.send({ content: "I think you should,", components: [row] })
  })

  message.channel.send(
    `Game proposal for **${gameName}** with ${numberOfPlayers} players sent to the **${groupName}** group.`
  )
}
