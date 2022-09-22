"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const builders_1 = require("@discordjs/builders");
class Command {
    constructor(name, description, handle, build, ...subcommands) {
        this.name = name;
        this.description = description;
        this.handle = handle;
        this.build = build;
        this.subcommands = new Map(subcommands.map(cmd => ([cmd.name, cmd])));
    }
    static create(name, description, handle, build) {
        return new this(name, description, handle, build);
    }
    static createWithSubcommands(name, description, ...subcommands) {
        return new this(name, description, () => { throw "Base command cannot be called when subcommands are present."; }, cmd => cmd, ...subcommands);
    }
    static alias(name, cmd) {
        return new Command(name, cmd.description, cmd.handle, cmd.build, ...cmd.subcommands.values());
    }
    async execute(interaction) {
        var _a;
        const subcmd = interaction.options.getSubcommand();
        if (subcmd) {
            return await ((_a = this.subcommands.get(subcmd)) === null || _a === void 0 ? void 0 : _a.execute(interaction));
        }
        await this.handle(interaction);
    }
    toJSON() {
        const builder = new builders_1.SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description);
        this.build(builder);
        for (const [_name, subcmd] of this.subcommands) {
            builder.addSubcommand(builder => subcmd.build(builder
                .setName(subcmd.name)
                .setDescription(subcmd.description)));
        }
        return builder.toJSON();
    }
}
exports.Command = Command;
//# sourceMappingURL=Command.js.map