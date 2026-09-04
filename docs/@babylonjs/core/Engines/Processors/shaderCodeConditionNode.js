import { ShaderCodeNode } from "./shaderCodeNode.js";
/** @internal */
export class ShaderCodeConditionNode extends ShaderCodeNode {
    process(preprocessors, options, preProcessorsFromCode) {
        for (let index = 0; index < this.children.length; index++) {
            const node = this.children[index];
            if (node.isValid(preprocessors)) {
                return node.process(preprocessors, options, preProcessorsFromCode);
            }
        }
        return "";
    }
}
//# sourceMappingURL=shaderCodeConditionNode.js.map