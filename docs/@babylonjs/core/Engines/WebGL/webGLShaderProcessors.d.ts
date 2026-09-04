import { ShaderLanguage } from "../../Materials/shaderLanguage.js";
import { type Nullable } from "../../types.js";
import { type IShaderProcessor } from "../Processors/iShaderProcessor.js";
import { type _IShaderProcessingContext } from "../Processors/shaderProcessingOptions.js";
/** @internal */
export declare class WebGLShaderProcessor implements IShaderProcessor {
    shaderLanguage: ShaderLanguage;
    postProcessor(code: string, defines: string[], isFragment: boolean, processingContext: Nullable<_IShaderProcessingContext>, parameters: {
        [key: string]: number | string | boolean | undefined;
    }): string;
}
