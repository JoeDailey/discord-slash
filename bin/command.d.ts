import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/rest/v9";
import { CommandInteraction } from "discord.js";
import { SlashCommandRegister } from "./root";
import { SlashSubcommand } from "./subcommand";
export declare class SlashCommand {
    readonly name: string;
    readonly descriptions: string;
    registers(...aliases: Array<string>): Array<SlashCommandRegister>;
    readonly subcommands: Map<string, SlashSubcommand>;
    constructor(name: string, descriptions: string, ...subcommands: SlashSubcommand[]);
    execute(interaction: CommandInteraction): Promise<void>;
    private handleDefault;
    toJSON(): RESTPostAPIApplicationCommandsJSONBody;
}
