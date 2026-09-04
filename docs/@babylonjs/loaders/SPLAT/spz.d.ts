import { type Scene } from "@babylonjs/core/scene.js";
import { type Coroutine } from "@babylonjs/core/Misc/coroutine.js";
import { type SPLATLoadingOptions } from "./splatLoadingOptions.js";
import { type IParsedSplat } from "./splatDefs.js";
import { type GaussianCloud, type SpzModule } from "@adobe/spz";
/**
 * Parses SPZ data and returns a promise resolving to an IParsedSplat object.
 * @param data The ArrayBuffer containing SPZ data.
 * @param scene The Babylon.js scene.
 * @param _loadingOptions Options for loading Gaussian Splatting files.
 * @returns A promise resolving to the parsed SPZ data.
 */
export declare function ParseSpz(data: ArrayBuffer, scene: Scene, _loadingOptions: SPLATLoadingOptions): Promise<IParsedSplat>;
/**
 * Returns the initialized spz WASM module loaded from the given URL, loading it on first call.
 * @param url URL to the spz WASM ES module (its default export should be a factory function)
 * @returns A promise resolving to the initialized spz WASM module
 */
export declare function GetSpzModule(url: string): Promise<SpzModule>;
/**
 * Converts a GaussianCloud object (from the spz WASM module) into the packed 32-byte-per-splat
 * ArrayBuffer and SH texture arrays expected by GaussianSplattingMeshBase.updateData.
 *
 * Packed layout per splat (32 bytes):
 *   [0-11]  position xyz   (float32 x3)
 *   [12-23] scale xyz      (float32 x3)
 *   [24-27] color RGBA     (uint8 x4, colors in [0,255], alpha in [0,255])
 *   [28-31] quaternion wxyz (uint8 x4, encoded as q * 127.5 + 127.5)
 *
 * SH coefficients from the cloud (Float32, range ~[-1,1]) are encoded to bytes
 * using the SPZ convention (load-spz.cc unquantizeSH): byte = coeff * 128 + 128.
 *
 * @param cloud The GaussianCloud returned by spz.loadSpzFromBuffer
 * @param scene The Babylon.js scene (used to query maxTextureSize for SH textures)
 * @param useCoroutine If true, yields periodically to avoid blocking the main thread
 * @returns A coroutine returning an IParsedSplat ready to be passed to updateData
 */
export declare function ConvertSpzToSplat(cloud: GaussianCloud, scene: Scene, useCoroutine?: boolean): Coroutine<IParsedSplat>;
/**
 * Async version of ConvertSpzToSplat that yields periodically to avoid blocking the main thread.
 * @param cloud The GaussianCloud returned by spz.loadSpzFromBuffer
 * @param scene The Babylon.js scene
 * @returns A promise resolving to an IParsedSplat
 */
export declare function ConvertSpzToSplatAsync(cloud: any, scene: Scene): Promise<IParsedSplat>;
