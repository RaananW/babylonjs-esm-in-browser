import { type IFileRequest } from "../Misc/fileRequest.js";
import { type LoadFileError } from "../Misc/fileTools.js";
import { type IWebRequest } from "../Misc/interfaces/iWebRequest.js";
import { type WebRequest } from "../Misc/webRequest.js";
import { type IOfflineProvider } from "../Offline/IOfflineProvider.js";
import { type Nullable } from "../types.js";
import { type AbstractEngine } from "./abstractEngine.js";
/**
 * Injection seam for file/image loading. The implementations live in
 * `fileTools.pure` and are registered here as a side effect by `fileTools.ts`
 * (via `RegisterFileTools`). Keeping them behind this mutable context object —
 * instead of importing them directly into the always-loaded engine classes —
 * lets bundlers tree-shake all file-loading code out of builds that never
 * import the `fileTools` side effect (e.g. a minimal thin-engine build).
 * @internal
 */
export declare const EngineFunctionContext: {
    loadFile?: (url: string, onSuccess: (data: string | ArrayBuffer, responseURL?: string) => void, onProgress?: (ev: ProgressEvent) => void, offlineProvider?: Nullable<IOfflineProvider>, useArrayBuffer?: boolean, onError?: (request?: WebRequest, exception?: LoadFileError) => void) => IFileRequest;
    loadImage?: (input: string | ArrayBuffer | ArrayBufferView | Blob, onLoad: (img: HTMLImageElement | ImageBitmap) => void, onError: (message?: string, exception?: any) => void, offlineProvider: Nullable<IOfflineProvider>, mimeType?: string, imageBitmapOptions?: ImageBitmapOptions, engine?: Nullable<AbstractEngine>) => Nullable<HTMLImageElement>;
};
/**
 * @internal
 */
export declare function _ConcatenateShader(source: string, defines: Nullable<string>, shaderVersion?: string): string;
/**
 * @internal
 */
export declare function _LoadFile(url: string, onSuccess: (data: string | ArrayBuffer, responseURL?: string) => void, onProgress?: (data: any) => void, offlineProvider?: Nullable<IOfflineProvider>, useArrayBuffer?: boolean, onError?: (request?: IWebRequest, exception?: any) => void, injectedLoadFile?: (url: string, onSuccess: (data: string | ArrayBuffer, responseURL?: string) => void, onProgress?: (ev: ProgressEvent<EventTarget>) => void, offlineProvider?: Nullable<IOfflineProvider>, useArrayBuffer?: boolean, onError?: (request?: WebRequest, exception?: LoadFileError) => void) => IFileRequest): IFileRequest;
/**
 * Gets host document
 * @param renderingCanvas if provided, the canvas' owner document will be returned
 * @returns the host document object
 */
export declare function getHostDocument(renderingCanvas?: Nullable<HTMLCanvasElement>): Nullable<Document>;
/** @internal */
export declare function _GetGlobalDefines(defines?: {
    [key: string]: string;
}, isNDCHalfZRange?: boolean, useReverseDepthBuffer?: boolean, useExactSrgbConversions?: boolean): string | undefined;
/**
 * Allocate a typed array depending on a texture type. Optionally can copy existing data in the buffer.
 * @param type type of the texture
 * @param sizeOrDstBuffer size of the array OR an existing buffer that will be used as the destination of the copy (if copyBuffer is provided)
 * @param sizeInBytes true if the size of the array is given in bytes, false if it is the number of elements of the array
 * @param copyBuffer if provided, buffer to copy into the destination buffer (either a newly allocated buffer if sizeOrDstBuffer is a number or use sizeOrDstBuffer as the destination buffer otherwise)
 * @returns the allocated buffer or sizeOrDstBuffer if the latter is an ArrayBuffer
 */
export declare function allocateAndCopyTypedBuffer(type: number, sizeOrDstBuffer: number | ArrayBufferLike, sizeInBytes?: boolean, copyBuffer?: ArrayBuffer): ArrayBufferView;
