"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashSubcommand = exports.SlashCommand = exports.Slash = void 0;
class Slash {
    constructor(...commands) {
        this.commands = new Map(commands);
    }
    async execute(interaction) {
        this.commands.get(interaction.commandName).execute(interaction);
    }
    toJSON() {
        return [...this.commands.values()].map(cmd => cmd.toJSON());
    }
}
exports.Slash = Slash;
var command_1 = require("./command");
Object.defineProperty(exports, "SlashCommand", { enumerable: true, get: function () { return command_1.SlashCommand; } });
var subcommand_1 = require("./subcommand");
Object.defineProperty(exports, "SlashSubcommand", { enumerable: true, get: function () { return subcommand_1.SlashSubcommand; } });
//# sourceMappingURL=index.js.map