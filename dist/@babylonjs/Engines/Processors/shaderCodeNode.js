const defaultAttributeKeywordName = "attribute";
const defaultVaryingKeywordName = "varying";
/** @internal */
export class ShaderCodeNode {
    constructor() {
        this.children = [];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isValid(preprocessors) {
        return true;
    }
    process(preprocessors, options) {
        var _a, _b, _c, _d, _e, _f;
        let result = "";
        if (this.line) {
            let value = this.line;
            const processor = options.processor;
            if (processor) {
                // This must be done before other replacements to avoid mistakenly changing something that was already changed.
                if (processor.lineProcessor) {
                    value = processor.lineProcessor(value, options.isFragment, options.processingContext);
                }
                const attributeKeyword = (_b = (_a = options.processor) === null || _a === void 0 ? void 0 : _a.attributeKeywordName) !== null && _b !== void 0 ? _b : defaultAttributeKeywordName;
                const varyingKeyword = options.isFragment && ((_c = options.processor) === null || _c === void 0 ? void 0 : _c.varyingFragmentKeywordName)
                    ? (_d = options.processor) === null || _d === void 0 ? void 0 : _d.varyingFragmentKeywordName
                    : !options.isFragment && ((_e = options.processor) === null || _e === void 0 ? void 0 : _e.varyingVertexKeywordName)
                        ? (_f = options.processor) === null || _f === void 0 ? void 0 : _f.varyingVertexKeywordName
                        : defaultVaryingKeywordName;
                if (!options.isFragment && processor.attributeProcessor && this.line.startsWith(attributeKeyword)) {
                    value = processor.attributeProcessor(this.line, preprocessors, options.processingContext);
                }
                else if (processor.varyingProcessor && this.line.startsWith(varyingKeyword)) {
                    value = processor.varyingProcessor(this.line, options.isFragment, preprocessors, options.processingContext);
                }
                else if (processor.uniformProcessor && processor.uniformRegexp && processor.uniformRegexp.test(this.line)) {
                    if (!options.lookForClosingBracketForUniformBuffer) {
                        value = processor.uniformProcessor(this.line, options.isFragment, preprocessors, options.processingContext);
                    }
                }
                else if (processor.uniformBufferProcessor && processor.uniformBufferRegexp && processor.uniformBufferRegexp.test(this.line)) {
                    if (!options.lookForClosingBracketForUniformBuffer) {
                        value = processor.uniformBufferProcessor(this.line, options.isFragment, options.processingContext);
                        options.lookForClosingBracketForUniformBuffer = true;
                    }
                }
                else if (processor.textureProcessor && processor.textureRegexp && processor.textureRegexp.test(this.line)) {
                    value = processor.textureProcessor(this.line, options.isFragment, preprocessors, options.processingContext);
                }
                else if ((processor.uniformProcessor || processor.uniformBufferProcessor) && this.line.startsWith("uniform") && !options.lookForClosingBracketForUniformBuffer) {
                    const regex = /uniform\s+(?:(?:highp)?|(?:lowp)?)\s*(\S+)\s+(\S+)\s*;/;
                    if (regex.test(this.line)) {
                        // uniform
                        if (processor.uniformProcessor) {
                            value = processor.uniformProcessor(this.line, options.isFragment, preprocessors, options.processingContext);
                        }
                    }
                    else {
                        // Uniform buffer
                        if (processor.uniformBufferProcessor) {
                            value = processor.uniformBufferProcessor(this.line, options.isFragment, options.processingContext);
                            options.lookForClosingBracketForUniformBuffer = true;
                        }
                    }
                }
                if (options.lookForClosingBracketForUniformBuffer && this.line.indexOf("}") !== -1) {
                    options.lookForClosingBracketForUniformBuffer = false;
                    if (processor.endOfUniformBufferProcessor) {
                        value = processor.endOfUniformBufferProcessor(this.line, options.isFragment, options.processingContext);
                    }
                }
            }
            result += value + "\r\n";
        }
        this.children.forEach((child) => {
            result += child.process(preprocessors, options);
        });
        if (this.additionalDefineKey) {
            preprocessors[this.additionalDefineKey] = this.additionalDefineValue || "true";
        }
        return result;
    }
}
//# sourceMappingURL=shaderCodeNode.js.map