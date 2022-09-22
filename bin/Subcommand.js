"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subcommand = void 0;
class Subcommand {
    constructor(name, description, execute, build) {
        this.name = name;
        this.description = description;
        this.execute = execute;
        this.build = build;
    }
    static alias(name, cmd) {
        return new Subcommand(name, cmd.description, cmd.execute, cmd.build);
    }
}
exports.Subcommand = Subcommand;
//# sourceMappingURL=Subcommand.js.map