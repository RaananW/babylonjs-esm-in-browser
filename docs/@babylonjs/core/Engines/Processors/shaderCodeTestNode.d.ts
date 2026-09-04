import { ShaderCodeNode } from "./shaderCodeNode.js";
import { type ShaderDefineExpression } from "./Expressions/shaderDefineExpression.js";
/** @internal */
export declare class ShaderCodeTestNode extends ShaderCodeNode {
    testExpression: ShaderDefineExpression;
    isValid(preprocessors: {
        [key: string]: string;
    }): boolean;
}
