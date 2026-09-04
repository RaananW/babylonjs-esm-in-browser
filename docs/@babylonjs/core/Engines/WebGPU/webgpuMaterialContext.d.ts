import { ExternalTexture } from "../../Materials/Textures/externalTexture.js";
import { type InternalTexture } from "../../Materials/Textures/internalTexture.js";
import { type TextureSampler } from "../../Materials/Textures/textureSampler.js";
import { type Nullable } from "../../types.js";
import { type IMaterialContext } from "../IMaterialContext.js";
/** @internal */
interface IWebGPUMaterialContextSamplerCache {
    sampler: Nullable<TextureSampler>;
    hashCode: number;
}
/** @internal */
interface IWebGPUMaterialContextTextureCache {
    texture: Nullable<InternalTexture | ExternalTexture>;
    isFloatOrDepthTexture: boolean;
    isExternalTexture: boolean;
}
/** @internal */
export declare class WebGPUMaterialContext implements IMaterialContext {
    private static _Counter;
    uniqueId: number;
    updateId: number;
    isDirty: boolean;
    samplers: {
        [name: string]: Nullable<IWebGPUMaterialContextSamplerCache>;
    };
    textures: {
        [name: string]: Nullable<IWebGPUMaterialContextTextureCache>;
    };
    textureState: number;
    useVertexPulling: boolean;
    get forceBindGroupCreation(): boolean;
    get hasFloatOrDepthTextures(): boolean;
    protected _numFloatOrDepthTextures: number;
    protected _numExternalTextures: number;
    constructor();
    reset(): void;
    setSampler(name: string, sampler: Nullable<TextureSampler>): void;
    setTexture(name: string, texture: Nullable<InternalTexture | ExternalTexture>): void;
}
export {};
