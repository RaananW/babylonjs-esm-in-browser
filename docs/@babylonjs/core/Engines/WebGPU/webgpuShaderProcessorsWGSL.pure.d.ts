/** This file must only contain pure code and pure imports */
import { type Nullable } from "../../types.js";
import { type _IShaderProcessingContext } from "../Processors/shaderProcessingOptions.js";
import { type WebGPUBufferDescription } from "./webgpuShaderProcessingContext.js";
import { WebGPUShaderProcessor } from "./webgpuShaderProcessor.js";
import { ShaderLanguage } from "../../Materials/shaderLanguage.js";
/** @internal */
export declare class WebGPUShaderProcessorWGSL extends WebGPUShaderProcessor {
    protected _attributesInputWGSL: string[];
    protected _attributesWGSL: string[];
    protected _attributesConversionCodeWGSL: string[];
    protected _hasNonFloatAttribute: boolean;
    protected _varyingsWGSL: string[];
    protected _varyingNamesWGSL: string[];
    protected _stridedUniformArrays: string[];
    shaderLanguage: ShaderLanguage;
    uniformRegexp: RegExp;
    textureRegexp: RegExp;
    noPrecision: boolean;
    pureMode: boolean;
    protected _getArraySize(name: string, uniformType: string, preProcessors: {
        [key: string]: string;
    }): [string, string, number];
    initializeShaders(processingContext: Nullable<_IShaderProcessingContext>): void;
    preProcessShaderCode(code: string): string;
    varyingCheck(varying: string): boolean;
    varyingProcessor(varying: string, isFragment: boolean, preProcessors: {
        [key: string]: string;
    }): string;
    attributeProcessor(attribute: string, preProcessors: {
        [key: string]: string;
    }): string;
    uniformProcessor(uniform: string, isFragment: boolean, preProcessors: {
        [key: string]: string;
    }): string;
    textureProcessor(texture: string, isFragment: boolean, preProcessors: {
        [key: string]: string;
    }): string;
    private _convertDefinesToConst;
    postProcessor(code: string, _defines: string[], _isFragment: boolean, _processingContext: Nullable<_IShaderProcessingContext>, _parameters: {
        [key: string]: number | string | boolean | undefined;
    }, preProcessors: {
        [key: string]: string;
    }, preProcessorsFromCode: {
        [key: string]: string;
    }): string;
    finalizeShaders(vertexCode: string, fragmentCode: string): {
        vertexCode: string;
        fragmentCode: string;
    };
    protected _generateLeftOverUBOCode(name: string, uniformBufferDescription: WebGPUBufferDescription): string;
    private _processSamplers;
    private _processCustomBuffers;
    private _processStridedUniformArrays;
}
