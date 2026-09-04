/** This file must only contain pure code and pure imports */
import { type InternalTexture } from "../Materials/Textures/internalTexture.js";
import { Engine } from "./engine.pure.js";
import { ThinNativeEngine } from "./thinNativeEngine.pure.js";
import { type ThinNativeEngineOptions } from "./thinNativeEngine.js";
/**
 * Options to create the Native engine
 */
export interface NativeEngineOptions extends ThinNativeEngineOptions {
}
/** @internal */
export declare class NativeEngine extends Engine {
    /**
     * @internal
     * Will be overriden by the Thin Native engine implementation
     * No code should be placed here
     */
    protected _initializeNativeEngine(_adaptToDeviceRatio: boolean): void;
    /**
     * @internal
     */
    constructor(options?: NativeEngineOptions);
    /**
     * @internal
     */
    wrapWebGLTexture(): InternalTexture;
    /**
     * @internal
     */
    updateWrappedWebGLTexture(): void;
    /**
     * @internal
     */
    _uploadImageToTexture(texture: InternalTexture, image: HTMLImageElement, _faceIndex?: number, _lod?: number): void;
}
/**
 * @internal
 * Augments the NativeEngine type to include ThinNativeEngine methods and preventing dupplicate TS errors
 */
export interface NativeEngine extends Omit<ThinNativeEngine, keyof Engine> {
}
/**
 * Register side effects for nativeEngine.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterNativeEngine(): void;
