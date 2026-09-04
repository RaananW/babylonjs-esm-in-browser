import { AudioParameterRampShape } from "./audioParameter.js";
export declare const _FileExtensionRegex: RegExp;
/** @internal */
export declare function _GetAudioParamCurveValues(shape: AudioParameterRampShape, from: number, to: number): Float32Array;
/** @internal */
export declare function _CleanUrl(url: string): string;
/**
 * Applies `WebRequest.CustomRequestModifiers` URL transformations to the given URL for use with a streaming
 * `<audio>` element. Unlike `_LoadArrayBufferFromUrlAsync`, this does NOT download the audio content —
 * the browser streams it natively. If custom request headers are present they cannot be forwarded to the
 * `<audio>` element (which has no API for custom headers), so a warning is logged and the headers are ignored.
 * @param url - The URL to process (should already be cleaned via `_CleanUrl` if needed).
 * @returns The (possibly rewritten) URL with URL modifiers applied.
 * @internal
 */
export declare function _GetUrlForStreaming(url: string): string;
/**
 * Loads an `ArrayBuffer` from the given URL using `WebRequest.FetchAsync`, so that
 * `WebRequest.CustomRequestHeaders` and `WebRequest.CustomRequestModifiers` are respected for audio network
 * requests just like for any other Babylon.js network call.
 * Uses the Fetch API when available, falling back to XMLHttpRequest otherwise.
 * @param url - The URL to load from (should already be cleaned via `_CleanUrl` if needed).
 * @returns A promise that resolves with the loaded `ArrayBuffer` and the HTTP `Content-Type` response header value.
 * @internal
 */
export declare function _LoadArrayBufferFromUrlAsync(url: string): Promise<{
    data: ArrayBuffer;
    contentType: string;
}>;
