import { SlashCommandBuilder } from "@discordjs/builders";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/rest/v9";
import { ChatInputCommandInteraction } from "discord.js";
import { Subcommand } from "./Subcommand";
export declare class Command {
    readonly name: string;
    readonly description: string;
    readonly handle: (interaction: ChatInputCommandInteraction) => Promise<void>;
    readonly build: (builder: SlashCommandBuilder) => SlashCommandBuilder;
    static create(name: string, description: string, handle: (interaction: ChatInputCommandInteraction) => Promise<void>, build: (builder: SlashCommandBuilder) => SlashCommandBuilder): Command;
    static createWithSubcommands(name: string, description: string, ...subcommands: Subcommand[]): Command;
    readonly subcommands: Map<string, Subcommand>;
    constructor(name: string, description: string, handle: (interaction: ChatInputCommandInteraction) => Promise<void>, build: (builder: SlashCommandBuilder) => SlashCommandBuilder, ...subcommands: Subcommand[]);
    static alias(name: string, cmd: Command): Command;
    execute(interaction: ChatInputCommandInteraction): Promise<void>;
    toJSON(): RESTPostAPIApplicationCommandsJSONBody;
}
