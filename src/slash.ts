import { REST } from "@discordjs/rest"
import { Client, Interaction, ChatInputCommandInteraction, ButtonInteraction } from "discord.js"
import { Routes } from "discord-api-types/v10";
import { exit } from "process";
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

    /**
     * Interactions, namely slash commands, are set globally and
     * propagate slowly. This can slow down development. If this
     * is called, two things will happen. Firstly, we will clear
     * all globally-set commands for this application. Secondly,
     * we will set the commands directly for each of the provided
     * guilds; this change will be instant.
     */
    addDeveloperGuilds(...guildIDs: string[]): Client<false>;

    /**
     * This function is invoked when a command failed and give you
     * a chance to handle the error directly. Return `true` if the
     * error should be supressed. Return false if the interaction
     * should be marked as a failure in Discord.
     */
    setErrorHandler(handler: (interaction: Interaction, e: any) => Promise<boolean>): Client<false>;
  }
}

/**
 * This module adds some utilites to Discord.js that make it simple
 * to add additional interactions to your client. These interactions
 * will be published to discord *onReady*.
 */
export function slash(client: Client<false>): Client<false> {
  client._commands = new CommandRegistry();
  client._buttons = new ButtonRegistry();
  client._errorHandler = async () => false;
  client._devGuildIDs = [];

  client.addChatInputCommand = function(command: Command, ...aliases: string[]): Client<false> {
    client._commands.push(command)
    for (const alias of aliases) {
      client._commands.push(Command.alias(alias, command));
    }
    return client;
  }

  client.addButtonInteraction = function(button): Client<false> {
    client._buttons.push(button);
    return client;
  }

  client.setErrorHandler = function(handler): Client<false> {
    client._errorHandler = handler;
    return client;
  }

  client.addDeveloperGuilds = function(...guildIDs: string[]): Client<false> {
    client._devGuildIDs = [...client._devGuildIDs, ...guildIDs];;
    return client;
  }

  client.on('interactionCreate', async (interaction: Interaction) => {
    try {
      if (interaction.isButton()) {
        await client._buttons.execute(interaction);
      } else if (interaction.isChatInputCommand()) {
        await client._commands.execute(interaction);
      } else {
        throw {message: "Unknown interaction type", interaction};
      }
    } catch (e) {
      try {
        const handled = await client._errorHandler(interaction, e);
        if (!handled) {
          console.error("Error not handled", e);
        }
      } catch (ee) {
        console.error(`Error while handling ${e}`, ee);
      }
    }
  });

  client.once('ready', async (client: Client<true>) => {
    try {
      const appID = client.application.id;
      const rest = new REST({version: '10'}).setToken(client.token);
      const data = { body: client._commands.toJSON() };
      
      if (client._devGuildIDs.length > 0) {
        await rest.put(Routes.applicationCommands(appID), {body: []});
        await Promise.all(client._devGuildIDs.map(devGuildID => rest.put(
          Routes.applicationGuildCommands(appID, devGuildID),
          data,
        )));
      } else {
        await rest.put(Routes.applicationCommands(appID), data);
      }
    } catch (e) {
      console.error("Failed to install commands", e);
      exit(1);
    }
  });

  return client;
}