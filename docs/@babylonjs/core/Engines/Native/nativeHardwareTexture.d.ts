import { type IHardwareTextureWrapper } from "../../Materials/Textures/hardwareTextureWrapper.js";
import { type Nullable } from "../../types.js";
import { type INativeEngine, type NativeTexture } from "./nativeInterfaces.js";
/** @internal */
export declare class NativeHardwareTexture implements IHardwareTextureWrapper {
    private readonly _engine;
    private _nativeTexture;
    get underlyingResource(): Nullable<NativeTexture>;
    constructor(existingTexture: NativeTexture, engine: INativeEngine);
    setUsage(): void;
    set(hardwareTexture: NativeTexture): void;
    reset(): void;
    release(): void;
}
