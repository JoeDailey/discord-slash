import { REST } from "@discordjs/rest"
import { Client, Interaction } from "discord.js"
import { Routes } from "discord-api-types/v10";
import { Slash } from "./root";
import { rejects } from "assert";

declare module "discord.js" {
  interface Client<Ready extends boolean = boolean> {
    slash: Slash;
  }
}

export type SlashErrorHandler = (interaction: Interaction, e: any) => Promise<boolean>;

export async function install(client: Client, slash: Slash, onError: SlashErrorHandler): Promise<void> {
  client.slash = slash;

  client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    try {
      await client.slash.execute(interaction);
    } catch (e) {
      try {
        await onError(interaction, e);
      } catch (ee) {
        console.error(`Error while handling ${e}`, ee);
      }
    }
  });

  return new Promise((res, rej) => {
    client.once('ready', async (readyClient: Client<true>) => {
      try {
        const rest = new REST({version: '10'}).setToken(readyClient.token);
        const route = Routes.applicationCommands(readyClient.application.id);
        const data = { body: client.slash.toJSON() };
        const response: unknown = await rest.put(route, data);
      } catch (e) {
        rej(e);
      }
    });
  });

}