import { type Nullable } from "../../types.js";
import { type IShaderProcessor } from "../Processors/iShaderProcessor.js";
import { type NativeShaderProcessingContext } from "./nativeShaderProcessingContext.js";
import { type _IShaderProcessingContext } from "../Processors/shaderProcessingOptions.js";
import { ShaderLanguage } from "../../Materials/shaderLanguage.js";
/** @internal */
export declare class NativeShaderProcessor implements IShaderProcessor {
    shaderLanguage: ShaderLanguage;
    protected _nativeProcessingContext: Nullable<NativeShaderProcessingContext>;
    initializeShaders(processingContext: Nullable<_IShaderProcessingContext>): void;
    attributeProcessor(attribute: string): string;
    varyingCheck(varying: string, _isFragment: boolean): boolean;
    varyingProcessor(varying: string, isFragment: boolean): string;
    postProcessor(code: string, defines: string[], isFragment: boolean): string;
}
