import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/rest/v9";
import { ChatInputCommandInteraction } from "discord.js";
import { Command } from "./Command";
export default class CommandRegistry {
    private commands;
    constructor();
    push(command: Command): void;
    execute(interaction: ChatInputCommandInteraction): Promise<void>;
    toJSON(): RESTPostAPIApplicationCommandsJSONBody[];
}
