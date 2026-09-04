/** This file must only contain pure code and pure imports */
import { type AbstractEngine } from "../Engines/abstractEngine.pure.js";
declare class EncodingHelper {
    /**
     * Encodes image data to the given mime type.
     * This is put into a helper class so we can apply the nativeOverride decorator to it.
     * @internal
     */
    static EncodeImageAsync(pixelData: ArrayBufferView, width: number, height: number, mimeType?: string, invertY?: boolean, quality?: number): Promise<Blob>;
}
/**
 * Encodes pixel data to an image
 * @param pixelData 8-bit RGBA pixel data
 * @param width the width of the image
 * @param height the height of the image
 * @param mimeType the requested MIME type
 * @param invertY true to invert the image in the Y direction
 * @param quality the quality of the image if lossy mimeType is used (e.g. image/jpeg, image/webp). See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob | HTMLCanvasElement.toBlob()}'s `quality` parameter.
 * @returns a promise that resolves to the encoded image data. Note that the `blob.type` may differ from `mimeType` if it was not supported.
 */
export declare const EncodeImageAsync: typeof EncodingHelper.EncodeImageAsync;
/**
 * Dumps the current bound framebuffer
 * @param width defines the rendering width
 * @param height defines the rendering height
 * @param engine defines the hosting engine
 * @param successCallback defines the callback triggered once the data are available
 * @param mimeType defines the mime type of the result
 * @param fileName defines the filename to download. If present, the result will automatically be downloaded
 * @param quality The quality of the image if lossy mimeType is used (e.g. image/jpeg, image/webp). See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob | HTMLCanvasElement.toBlob()}'s `quality` parameter.
 * @returns a void promise
 */
export declare function DumpFramebuffer(width: number, height: number, engine: AbstractEngine, successCallback?: (data: string) => void, mimeType?: string, fileName?: string, quality?: number): Promise<void>;
export declare function DumpDataAsync(width: number, height: number, data: ArrayBufferView, mimeType: string | undefined, fileName: string | undefined, invertY: boolean | undefined, toArrayBuffer: true, quality?: number): Promise<ArrayBuffer>;
export declare function DumpDataAsync(width: number, height: number, data: ArrayBufferView, mimeType?: string, fileName?: string, invertY?: boolean, toArrayBuffer?: boolean, quality?: number): Promise<string>;
/**
 * Dumps an array buffer
 * @param width defines the rendering width
 * @param height defines the rendering height
 * @param data the data array
 * @param successCallback defines the callback triggered once the data are available
 * @param mimeType defines the mime type of the result
 * @param fileName The name of the file to download. If present, the result will automatically be downloaded. If not defined, and `successCallback` is also not defined, the result will automatically be downloaded with an auto-generated file name.
 * @param invertY true to invert the picture in the Y dimension
 * @param toArrayBuffer true to convert the data to an ArrayBuffer (encoded as `mimeType`) instead of a base64 string
 * @param quality The quality of the image if lossy mimeType is used (e.g. image/jpeg, image/webp). See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob | HTMLCanvasElement.toBlob()}'s `quality` parameter.
 */
export declare function DumpData(width: number, height: number, data: ArrayBufferView, successCallback?: (data: string | ArrayBuffer) => void, mimeType?: string, fileName?: string, invertY?: boolean, toArrayBuffer?: boolean, quality?: number): void;
/**
 * Dispose the dump tools associated resources
 */
export declare function Dispose(): void;
/**
 * Object containing a set of static utilities functions to dump data from a canvas
 * @deprecated use functions
 */
export declare const DumpTools: {
    DumpData: typeof DumpData;
    DumpDataAsync: typeof DumpDataAsync;
    DumpFramebuffer: typeof DumpFramebuffer;
    Dispose: typeof Dispose;
};
/**
 * Register side effects for dumpTools.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterDumpTools(): void;
export {};
