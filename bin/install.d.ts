import { Client, CommandInteraction } from "discord.js";
import { Slash } from "./root";
declare module "discord.js" {
    interface Client<Ready extends boolean = boolean> {
        slash: Slash;
    }
}
export declare type SlashErrorHandler = (interaction: CommandInteraction, e: any) => Promise<boolean>;
export declare function install(client: Client, slash: Slash, onError: SlashErrorHandler): Promise<void>;
