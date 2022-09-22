import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/rest/v9";
import { ChatInputCommandInteraction } from "discord.js";
import { Command } from "./Command";

export default class CommandRegistry {
  private commands: Map<string, Command>;
  public constructor() {
    this.commands = new Map();
  }

  public push(command: Command) {
    this.commands.set(command.name, command);
  }

  public async execute(interaction: ChatInputCommandInteraction) {
    await this.commands.get(interaction.commandName)?.execute(interaction);
  }

  public toJSON(): RESTPostAPIApplicationCommandsJSONBody[] {
    return [...this.commands.values()].map(cmd => cmd.toJSON());
  }
}