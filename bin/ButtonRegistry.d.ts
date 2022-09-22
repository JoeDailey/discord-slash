import { ButtonInteraction } from "discord.js";
import { Button } from "./Button";
export default class ButtonRegistry {
    private buttons;
    constructor();
    push(button: Button): void;
    execute(interaction: ButtonInteraction): Promise<void>;
}
