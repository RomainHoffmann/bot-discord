import {
  ActionRowBuilder,
  Message,
  Role,
  ButtonBuilder,
  ButtonStyle,
  MessageCreateOptions,
  EmbedBuilder,
} from "discord.js";
import { client } from "../index";

const COMPONENTS_ID = {
  acceptButton: "accept",
  decline: "decline",
  notNow: "not_now",
};

export class GameCommand {
  public gameName!: string;
  public maxPlayers!: number;
  public message: Message<boolean>;
  public role: Role;
  public acceptedPlayers: string[] = [];
  public sentInvitations: Message<boolean>[] = [];

  constructor(message: Message<boolean>, args: string[]) {
    this.checkArgs(args);
    this.message = message;
    this.gameName = args[0];
    this.maxPlayers = Number(args[1]);
    this.role = this.findRole(args[2]);
  }

  checkArgs = (args: string[]) => {
    if (args.length < 3) {
      throw new Error(
        "Usage: !game <game_name> <number_of_players> <group_name>"
      );
    }
  };

  findRole = (roleName: string): Role => {
    const role = this.message.guild!.roles.cache.find(
      (r) => r.name === roleName
    );
    if (!role) {
      throw new Error(`Group "${roleName}" not found.`);
    }
    return role;
  };

  handleCommand = async () => {
    await this.sendInvitationsToPlayers();
    this.initEventHandler();
  };

  sendInvitationsToPlayers = async () => {
    const invitedMembers = this.message.guild?.members.cache.filter((member) =>
      member.roles.cache.has(this.role.id)
    );
    console.log(invitedMembers)
    const invitation: MessageCreateOptions = this.buildInvitationMessage();
    const promises = invitedMembers!.map(async (member) => {
      const invitationMessage = await member.send(invitation);
      this.sentInvitations.push(invitationMessage);
    });
    await Promise.all(promises)
  };

  buildInvitationMessage = (): MessageCreateOptions => {
    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(COMPONENTS_ID.acceptButton)
          .setLabel("Accept")
          .setStyle(ButtonStyle.Primary)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId(COMPONENTS_ID.decline)
          .setLabel("Decline")
          .setStyle(ButtonStyle.Danger)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId(COMPONENTS_ID.notNow)
          .setLabel("Few minutes")
          .setStyle(ButtonStyle.Secondary)
      );

    const invitationMessage = new EmbedBuilder()
      .setTitle(`Invited to play ${this.gameName}`)
      .addFields({
        name: "Accepted",
        value: `${this.acceptedPlayers.length}/5`,
      });
    return { embeds: [invitationMessage], components: [row] };
  };

  initEventHandler = () => {
    this.sentInvitations.forEach((invitationMessage) => {
      const filter = (interaction: any) =>
        interaction.isButton() &&
        Object.values(COMPONENTS_ID).includes(interaction.customId) &&
        interaction.message.id === invitationMessage.id;
      const collector = invitationMessage.createMessageComponentCollector({
        filter,
        time: 60 * 1000,
      });
      collector.on("collect", async (interaction) => {
        switch (interaction.customId) {
          case COMPONENTS_ID.acceptButton:
            if (
              this.acceptedPlayers.length < this.maxPlayers &&
              !this.acceptedPlayers.includes(interaction.user.id)
            ) {
              this.acceptedPlayers.push(interaction.user.id);
              const updatedContent = this.buildInvitationMessage();
              await interaction.update({
                components: updatedContent.components,
                embeds: updatedContent.embeds,
              });
            }
            break;
          case COMPONENTS_ID.decline:
            break;
          case COMPONENTS_ID.notNow:
            break;
        }
      });
    });
  };

  clean = () => {};
}
