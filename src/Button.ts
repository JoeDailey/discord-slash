import { ButtonInteraction } from "discord.js";

export class Button {

  public constructor(
    private customIDPattern: RegExp,
    public execute: (interaction: ButtonInteraction) => Promise<void>,
  ) {}

  public matches(interaction: ButtonInteraction): boolean {
    return this.customIDPattern.test(interaction.customId)
  }

}