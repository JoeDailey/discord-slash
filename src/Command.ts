import { SlashCommandBuilder } from "@discordjs/builders";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/rest/v9";
import { ChatInputCommandInteraction } from "discord.js";
import { Subcommand } from "./Subcommand";

export class Command {

  public static create(
    name: string,
    description: string,
    handle: (interaction: ChatInputCommandInteraction) => Promise<void>,
    build: (builder: SlashCommandBuilder) => SlashCommandBuilder,
  ) {
    return new this(name, description, handle, build);
  }

  public static createWithSubcommands(
    name: string,
    description: string,
    ...subcommands: Subcommand[]
  ) {
    return new this(
      name,
      description,
      () => {throw "Base command cannot be called when subcommands are present."},
      cmd => cmd,
      ...subcommands
    );
  }

  readonly subcommands: Map<string, Subcommand>;
  public constructor(
    readonly name: string,
    readonly description: string,
    readonly handle: (interaction: ChatInputCommandInteraction) => Promise<void>,
    readonly build: (builder: SlashCommandBuilder) => SlashCommandBuilder,
    ...subcommands: Subcommand[]
  ) {
    this.subcommands = new Map(subcommands.map(cmd => ([cmd.name, cmd])));
  }

  public static alias(name: string, cmd: Command): Command {
    return new Command(
      name,
      cmd.description,
      cmd.handle,
      cmd.build,
      ...cmd.subcommands.values(),
    );
  }

  public async execute(interaction: ChatInputCommandInteraction) {
    const subcmd = interaction.options.getSubcommand();
    if (subcmd) {
      return await this.subcommands.get(subcmd)?.execute(interaction);
    }

    await this.handle(interaction);
  }

  public toJSON(): RESTPostAPIApplicationCommandsJSONBody {
    const builder = new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description);
    
    this.build(builder);
  
    for (const [_name, subcmd] of this.subcommands) {
      builder.addSubcommand(builder => subcmd.build(
        builder
          .setName(subcmd.name)
          .setDescription(subcmd.description)
      ));
    }
    
    return builder.toJSON();
  }
}