import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
export declare class Subcommand {
    readonly name: string;
    readonly description: string;
    readonly execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
    readonly build: (builder: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder;
    constructor(name: string, description: string, execute: (interaction: ChatInputCommandInteraction) => Promise<void>, build: (builder: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder);
    static alias(name: string, cmd: Subcommand): Subcommand;
}
