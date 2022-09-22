"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommandRegistry {
    constructor() {
        this.commands = new Map();
    }
    push(command) {
        this.commands.set(command.name, command);
    }
    async execute(interaction) {
        var _a;
        await ((_a = this.commands.get(interaction.commandName)) === null || _a === void 0 ? void 0 : _a.execute(interaction));
    }
    toJSON() {
        return [...this.commands.values()].map(cmd => cmd.toJSON());
    }
}
exports.default = CommandRegistry;
//# sourceMappingURL=CommandRegistry.js.map