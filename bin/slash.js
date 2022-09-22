"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slash = void 0;
const rest_1 = require("@discordjs/rest");
const v10_1 = require("discord-api-types/v10");
const process_1 = require("process");
const Command_1 = require("./Command");
const CommandRegistry_1 = __importDefault(require("./CommandRegistry"));
const ButtonRegistry_1 = __importDefault(require("./ButtonRegistry"));
function slash(client) {
    client._commands = new CommandRegistry_1.default();
    client._buttons = new ButtonRegistry_1.default();
    client._errorHandler = async () => false;
    client._devGuildIDs = [];
    client.addChatInputCommand = function (command, ...aliases) {
        client._commands.push(command);
        for (const alias of aliases) {
            client._commands.push(Command_1.Command.alias(alias, command));
        }
        return client;
    };
    client.addButtonInteraction = function (button) {
        client._buttons.push(button);
        return client;
    };
    client.setErrorHandler = function (handler) {
        client._errorHandler = handler;
        return client;
    };
    client.addDeveloperGuilds = function (...guildIDs) {
        client._devGuildIDs = [...client._devGuildIDs, ...guildIDs];
        ;
        return client;
    };
    client.on('interactionCreate', async (interaction) => {
        try {
            if (interaction.isButton()) {
                await client._buttons.execute(interaction);
            }
            else if (interaction.isChatInputCommand()) {
                await client._commands.execute(interaction);
            }
            else {
                throw { message: "Unknown interaction type", interaction };
            }
        }
        catch (e) {
            try {
                const handled = await client._errorHandler(interaction, e);
                if (!handled) {
                    console.error("Error not handled", e);
                }
            }
            catch (ee) {
                console.error(`Error while handling ${e}`, ee);
            }
        }
    });
    client.once('ready', async (client) => {
        try {
            const appID = client.application.id;
            const rest = new rest_1.REST({ version: '10' }).setToken(client.token);
            const data = { body: client._commands.toJSON() };
            if (client._devGuildIDs.length > 0) {
                await rest.put(v10_1.Routes.applicationCommands(appID), { body: [] });
                await Promise.all(client._devGuildIDs.map(devGuildID => rest.put(v10_1.Routes.applicationGuildCommands(appID, devGuildID), data)));
            }
            else {
                await rest.put(v10_1.Routes.applicationCommands(appID), data);
            }
        }
        catch (e) {
            console.error("Failed to install commands", e);
            (0, process_1.exit)(1);
        }
    });
    return client;
}
exports.slash = slash;
//# sourceMappingURL=slash.js.map