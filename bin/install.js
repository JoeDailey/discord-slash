"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = void 0;
const rest_1 = require("@discordjs/rest");
const v10_1 = require("discord-api-types/v10");
async function install(client, slash, onError) {
    client.slash = slash;
    client.buttonHandles = new Map();
    client.addButtonHandler = client.buttonHandles.set;
    client.on('interactionCreate', async (interaction) => {
        try {
            if (interaction.isButton()) {
                await handleButtonInteraction(client, interaction);
            }
            else if (interaction.isCommand()) {
                await handleCommandInteraction(client, interaction);
            }
        }
        catch (e) {
            try {
                await onError(interaction, e);
            }
            catch (ee) {
                console.error(`Error while handling ${e}`, ee);
            }
        }
    });
    return new Promise((res, rej) => {
        client.once('ready', async (readyClient) => {
            try {
                const rest = new rest_1.REST({ version: '10' }).setToken(readyClient.token);
                const route = v10_1.Routes.applicationCommands(readyClient.application.id);
                const data = { body: client.slash.toJSON() };
                await rest.put(route, data);
            }
            catch (e) {
                rej(e);
            }
        });
    });
}
exports.install = install;
async function handleButtonInteraction(client, interaction) {
    const handle = client.buttonHandles.get(interaction.customId);
    if (handle == null) {
        throw `No handler for ${interaction.customId}`;
    }
    await handle(interaction);
}
async function handleCommandInteraction(client, interaction) {
    await client.slash.execute(interaction);
}
//# sourceMappingURL=install.js.map