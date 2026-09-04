/** This file must only contain pure code and pure imports */
import { FlowGraphExecutionBlockWithOutSignal } from "../../flowGraphExecutionBlockWithOutSignal.js";
import { RichTypeAny, RichTypeString } from "../../flowGraphRichTypes.pure.js";
import { Logger } from "../../../Misc/logger.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block that logs a message to the console.
 */
export class FlowGraphConsoleLogBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * Creates a new console log block.
     * @param config optional configuration
     */
    constructor(config) {
        super(config);
        this.message = this.registerDataInput("message", RichTypeAny);
        this.logType = this.registerDataInput("logType", RichTypeString, "log");
        if (config?.messageTemplate) {
            const matches = this._getTemplateMatches(config.messageTemplate);
            for (const match of matches) {
                this.registerDataInput(match, RichTypeAny);
            }
        }
    }
    /**
     * @internal
     */
    _execute(context) {
        const typeValue = this.logType.getValue(context);
        const messageValue = this._getMessageValue(context);
        if (typeValue === "warn") {
            Logger.Warn(messageValue);
        }
        else if (typeValue === "error") {
            Logger.Error(messageValue);
        }
        else {
            Logger.Log(messageValue);
        }
        // activate the output flow block
        this.out._activateSignal(context);
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphConsoleLogBlock" /* FlowGraphBlockNames.ConsoleLog */;
    }
    _serializeValue(value) {
        if (value === null || value === undefined) {
            return String(value);
        }
        if (typeof value === "object") {
            // Prefer the object's own toString() (e.g. Vector3 → "{X:1 Y:2 Z:3}").
            // Only fall back to JSON.stringify when toString() is the unhelpful default.
            const str = value.toString();
            if (str === "[object Object]") {
                try {
                    return JSON.stringify(value);
                }
                catch {
                    return str;
                }
            }
            return str;
        }
        return String(value);
    }
    _getMessageValue(context) {
        if (this.config?.messageTemplate) {
            let template = this.config.messageTemplate;
            const matches = this._getTemplateMatches(template);
            // If the message input is an object, use its keys as the primary
            // source for template placeholders, falling back to named data inputs.
            const messageValue = this.message.getValue(context);
            const messageObj = messageValue !== null && messageValue !== undefined && typeof messageValue === "object" ? messageValue : null;
            for (const match of matches) {
                let value;
                if (messageObj !== null && match in messageObj) {
                    value = messageObj[match];
                }
                else {
                    value = this.getDataInput(match)?.getValue(context);
                }
                if (value !== undefined) {
                    // Escape regex metacharacters in the placeholder name before building the pattern.
                    const escapedMatch = match.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                    template = template.replace(new RegExp(`\\{${escapedMatch}\\}`, "g"), this._serializeValue(value));
                }
            }
            return template;
        }
        else {
            // No template — pass the raw value directly so Logger receives the original
            // object (e.g. Vector3) rather than a stringified representation.
            return this.message.getValue(context);
        }
    }
    _getTemplateMatches(template) {
        const regex = /\{([^}]+)\}/g;
        const matches = [];
        let match;
        while ((match = regex.exec(template)) !== null) {
            matches.push(match[1]);
        }
        return matches;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphConsoleLogBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphConsoleLogBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphConsoleLogBlock" /* FlowGraphBlockNames.ConsoleLog */, FlowGraphConsoleLogBlock);
}
//# sourceMappingURL=flowGraphConsoleLogBlock.pure.js.map