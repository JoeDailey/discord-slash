import { REST } from "@discordjs/rest"
import { Client, Interaction, CommandInteraction, ButtonInteraction } from "discord.js"
import { Routes } from "discord-api-types/v10";
import { Slash } from "./root";

type onButton = (interaction: ButtonInteraction) => Promise<void>;

declare module "discord.js" {
  interface Client<Ready extends boolean = boolean> {
    slash: Slash;
    buttonHandles: Map<string, onButton>;
    addButtonHandler: ((customID: string, handle: onButton) => void);
  }
}

export type SlashErrorHandler = (interaction: Interaction, e: any) => Promise<boolean>;

export async function install(client: Client, slash: Slash, onError: SlashErrorHandler): Promise<void> {
  client.slash = slash;
  client.buttonHandles = new Map();
  client.addButtonHandler = client.buttonHandles.set;

  client.on('interactionCreate', async (interaction: Interaction) => {
    try {
      if (interaction.isButton()) {
        await handleButtonInteraction(client, interaction);
      } else if (interaction.isCommand()) {
        await handleCommandInteraction(client, interaction);
      }
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
        await rest.put(route, data);
      } catch (e) {
        rej(e);
      }
    });
  });

}

async function handleButtonInteraction(client: Client, interaction: ButtonInteraction) {
  const handle = client.buttonHandles.get(interaction.customId);
  if (handle == null) {
    throw `No handler for ${interaction.customId}`;
  }

  await handle(interaction);
}

async function handleCommandInteraction(client: Client, interaction: CommandInteraction) {
  await client.slash.execute(interaction);
}