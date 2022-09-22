import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

export class Subcommand {
  public constructor(
    readonly name: string,
    readonly description: string,
    readonly execute: (interaction: ChatInputCommandInteraction) => Promise<void>,
    readonly build: (builder: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder,
  ) {}

  public static alias(name: string, cmd: Subcommand): Subcommand {
    return new Subcommand(
      name,
      cmd.description,
      cmd.execute,
      cmd.build,
    );
  }
}

