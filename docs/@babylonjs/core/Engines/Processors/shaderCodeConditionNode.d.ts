import { ShaderCodeNode } from "./shaderCodeNode.js";
import { type _IProcessingOptions } from "./shaderProcessingOptions.js";
/** @internal */
export declare class ShaderCodeConditionNode extends ShaderCodeNode {
    process(preprocessors: {
        [key: string]: string;
    }, options: _IProcessingOptions, preProcessorsFromCode: {
        [key: string]: string;
    }): string;
}
