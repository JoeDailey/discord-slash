"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
class Button {
    constructor(customIDPattern, execute) {
        this.customIDPattern = customIDPattern;
        this.execute = execute;
    }
    matches(interaction) {
        return this.customIDPattern.test(interaction.customId);
    }
}
exports.Button = Button;
//# sourceMappingURL=Button.js.map