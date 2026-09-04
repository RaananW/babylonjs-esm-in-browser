/**
 * Inflate a zlib-wrapped deflate stream.
 *
 * This implementation is intentionally scoped to FBX binary array payloads: one-shot,
 * synchronous zlib streams with the exact uncompressed length known up front.
 */
export declare function inflateZlib(input: Uint8Array, expectedLength: number): Uint8Array;
