"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ButtonRegistry {
    constructor() {
        this.buttons = [];
    }
    push(button) {
        this.buttons.push(button);
    }
    async execute(interaction) {
        const button = this.buttons.find(button => button.matches(interaction));
        if (button == null) {
            throw `No handler for button interaction: ${interaction.customId}`;
        }
        await button.execute(interaction);
    }
}
exports.default = ButtonRegistry;
//# sourceMappingURL=ButtonRegistry.js.map