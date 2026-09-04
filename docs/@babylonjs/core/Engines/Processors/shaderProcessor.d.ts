import { type _IProcessingOptions } from "./shaderProcessingOptions.js";
import { type WebRequest } from "../../Misc/webRequest.js";
import { type LoadFileError } from "../../Misc/fileTools.js";
import { type IOfflineProvider } from "../../Offline/IOfflineProvider.js";
import { type IFileRequest } from "../../Misc/fileRequest.js";
import { type AbstractEngine } from "../abstractEngine.js";
/** @internal */
export declare function Initialize(options: _IProcessingOptions): void;
/** @internal */
export declare function Process(sourceCode: string, options: _IProcessingOptions, callback: (migratedCode: string, codeBeforeMigration: string) => void, engine?: AbstractEngine): void;
/** @internal */
export declare function PreProcess(sourceCode: string, options: _IProcessingOptions, callback: (migratedCode: string, codeBeforeMigration: string) => void, engine: AbstractEngine): void;
/** @internal */
export declare function Finalize(vertexCode: string, fragmentCode: string, options: _IProcessingOptions): {
    vertexCode: string;
    fragmentCode: string;
};
/** @internal */
export declare function ProcessIncludes(sourceCode: string, options: _IProcessingOptions, callback: (data: any) => void): void;
/**
 * @deprecated Use direct imports from fileTools.pure instead. Kept for backwards compatibility.
 * @internal
 */
export declare const _FunctionContainer: {
    loadFile: (url: string, onSuccess: (data: string | ArrayBuffer, responseURL?: string) => void, onProgress?: (ev: ProgressEvent) => void, offlineProvider?: IOfflineProvider, useArrayBuffer?: boolean, onError?: (request?: WebRequest, exception?: LoadFileError) => void) => IFileRequest;
};
