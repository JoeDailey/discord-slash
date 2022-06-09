"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slash = void 0;
class Slash {
    constructor(...commands) {
        this.commands = new Map(commands);
    }
    async execute(interaction) {
        var _a;
        await ((_a = this.commands.get(interaction.commandName)) === null || _a === void 0 ? void 0 : _a.execute(interaction));
    }
    toJSON() {
        return [...this.commands.values()].map(cmd => cmd.toJSON());
    }
}
exports.Slash = Slash;
//# sourceMappingURL=root.js.map