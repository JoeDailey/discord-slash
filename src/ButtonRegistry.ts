import { ButtonInteraction } from "discord.js";
import { Button } from "./Button";

export default class ButtonRegistry {
  private buttons: Array<Button>;
  public constructor() {
    this.buttons = [];
  }

  public push(button: Button) {
    this.buttons.push(button);
  }

  public async execute(interaction: ButtonInteraction) {
    const button = this.buttons.find(button => button.matches(interaction));
    if (button == null) {
      throw `No handler for button interaction: ${interaction.customId}`;
    }
  
    await button.execute(interaction);
  }

}