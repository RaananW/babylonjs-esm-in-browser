import type { Engine } from "../Engines/engine";
/**
 * Class containing a set of static utilities functions to dump data from a canvas
 */
export declare class DumpTools {
    private static _DumpToolsEngine;
    private static _CreateDumpRenderer;
    /**
     * Dumps the current bound framebuffer
     * @param width defines the rendering width
     * @param height defines the rendering height
     * @param engine defines the hosting engine
     * @param successCallback defines the callback triggered once the data are available
     * @param mimeType defines the mime type of the result
     * @param fileName defines the filename to download. If present, the result will automatically be downloaded
     * @returns a void promise
     */
    static DumpFramebuffer(width: number, height: number, engine: Engine, successCallback?: (data: string) => void, mimeType?: string, fileName?: string): Promise<void>;
    /**
     * Dumps an array buffer
     * @param width defines the rendering width
     * @param height defines the rendering height
     * @param data the data array
     * @param mimeType defines the mime type of the result
     * @param fileName defines the filename to download. If present, the result will automatically be downloaded
     * @param invertY true to invert the picture in the Y dimension
     * @param toArrayBuffer true to convert the data to an ArrayBuffer (encoded as `mimeType`) instead of a base64 string
     * @param quality defines the quality of the result
     * @returns a promise that resolve to the final data
     */
    static DumpDataAsync(width: number, height: number, data: ArrayBufferView, mimeType?: string, fileName?: string, invertY?: boolean, toArrayBuffer?: boolean, quality?: number): Promise<string | ArrayBuffer>;
    /**
     * Dumps an array buffer
     * @param width defines the rendering width
     * @param height defines the rendering height
     * @param data the data array
     * @param successCallback defines the callback triggered once the data are available
     * @param mimeType defines the mime type of the result
     * @param fileName defines the filename to download. If present, the result will automatically be downloaded
     * @param invertY true to invert the picture in the Y dimension
     * @param toArrayBuffer true to convert the data to an ArrayBuffer (encoded as `mimeType`) instead of a base64 string
     * @param quality defines the quality of the result
     */
    static DumpData(width: number, height: number, data: ArrayBufferView, successCallback?: (data: string | ArrayBuffer) => void, mimeType?: string, fileName?: string, invertY?: boolean, toArrayBuffer?: boolean, quality?: number): void;
    /**
     * Dispose the dump tools associated resources
     */
    static Dispose(): void;
}
