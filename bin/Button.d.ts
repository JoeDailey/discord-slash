import { ButtonInteraction } from "discord.js";
export declare class Button {
    private customIDPattern;
    execute: (interaction: ButtonInteraction) => Promise<void>;
    constructor(customIDPattern: RegExp, execute: (interaction: ButtonInteraction) => Promise<void>);
    matches(interaction: ButtonInteraction): boolean;
}
