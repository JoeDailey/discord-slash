import { Client } from "discord.js";
import { Command } from "./Command";
import CommandRegistry from "./CommandRegistry";
import ButtonRegistry from "./ButtonRegistry";
import { Button } from "./Button";
declare module "discord.js" {
    interface Client<Ready extends boolean = boolean> {
        _commands: CommandRegistry;
        _buttons: ButtonRegistry;
        _devGuildIDs: Array<string>;
        _errorHandler: (interaction: Interaction, e: any) => Promise<boolean>;
        addChatInputCommand: ((command: Command, ...alias: string[]) => Client<false>);
        addButtonInteraction: ((button: Button) => Client<false>);
        addDeveloperGuilds(...guildIDs: string[]): Client<false>;
        setErrorHandler(handler: (interaction: Interaction, e: any) => Promise<boolean>): Client<false>;
    }
}
export declare function slash(client: Client<false>): Client<false>;
