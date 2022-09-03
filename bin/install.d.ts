import { Client, Interaction, ButtonInteraction } from "discord.js";
import { Slash } from "./root";
declare type onButton = (interaction: ButtonInteraction) => Promise<void>;
declare module "discord.js" {
    interface Client<Ready extends boolean = boolean> {
        slash: Slash;
        buttonHandles: Map<string, onButton>;
        addButtonHandler: ((customID: string, handle: onButton) => void);
    }
}
export declare type SlashErrorHandler = (interaction: Interaction, e: any) => Promise<boolean>;
export declare function install(client: Client, slash: Slash, onError: SlashErrorHandler): Promise<void>;
export {};
