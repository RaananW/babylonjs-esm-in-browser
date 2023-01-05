import type { ShaderCustomProcessingFunction } from "../Engines/Processors/shaderProcessingOptions";
import type { SmartArray } from "../Misc/smartArray";
declare type BaseTexture = import("./Textures/baseTexture").BaseTexture;
declare type EffectFallbacks = import("./effectFallbacks").EffectFallbacks;
declare type MaterialDefines = import("./materialDefines").MaterialDefines;
declare type UniformBuffer = import("./uniformBuffer").UniformBuffer;
declare type SubMesh = import("../Meshes/subMesh").SubMesh;
declare type AbstractMesh = import("../Meshes/abstractMesh").AbstractMesh;
declare type IAnimatable = import("../Animations/animatable.interface").IAnimatable;
declare type RenderTargetTexture = import("./Textures/renderTargetTexture").RenderTargetTexture;
/** @internal */
export declare type MaterialPluginCreated = {};
/** @internal */
export declare type MaterialPluginDisposed = {
    forceDisposeTextures?: boolean;
};
/** @internal */
export declare type MaterialPluginHasTexture = {
    hasTexture: boolean;
    texture: BaseTexture;
};
/** @internal */
export declare type MaterialPluginIsReadyForSubMesh = {
    isReadyForSubMesh: boolean;
    defines: MaterialDefines;
    subMesh: SubMesh;
};
/** @internal */
export declare type MaterialPluginGetDefineNames = {
    defineNames?: {
        [name: string]: {
            type: string;
            default: any;
        };
    };
};
/** @internal */
export declare type MaterialPluginPrepareEffect = {
    defines: MaterialDefines;
    fallbacks: EffectFallbacks;
    fallbackRank: number;
    customCode?: ShaderCustomProcessingFunction;
    attributes: string[];
    uniforms: string[];
    samplers: string[];
    uniformBuffersNames: string[];
    mesh: AbstractMesh;
};
/** @internal */
export declare type MaterialPluginPrepareDefines = {
    defines: MaterialDefines;
    mesh: AbstractMesh;
};
/** @internal */
export declare type MaterialPluginPrepareUniformBuffer = {
    ubo: UniformBuffer;
};
/** @internal */
export declare type MaterialPluginBindForSubMesh = {
    subMesh: SubMesh;
};
/** @internal */
export declare type MaterialPluginGetAnimatables = {
    animatables: IAnimatable[];
};
/** @internal */
export declare type MaterialPluginGetActiveTextures = {
    activeTextures: BaseTexture[];
};
/** @internal */
export declare type MaterialPluginFillRenderTargetTextures = {
    renderTargets: SmartArray<RenderTargetTexture>;
};
/** @internal */
export declare type MaterialPluginHasRenderTargetTextures = {
    hasRenderTargetTextures: boolean;
};
/** @internal */
export declare type MaterialPluginHardBindForSubMesh = {
    subMesh: SubMesh;
};
/**
 * @internal
 */
export declare enum MaterialPluginEvent {
    Created = 1,
    Disposed = 2,
    GetDefineNames = 4,
    PrepareUniformBuffer = 8,
    IsReadyForSubMesh = 16,
    PrepareDefines = 32,
    BindForSubMesh = 64,
    PrepareEffect = 128,
    GetAnimatables = 256,
    GetActiveTextures = 512,
    HasTexture = 1024,
    FillRenderTargetTextures = 2048,
    HasRenderTargetTextures = 4096,
    HardBindForSubMesh = 8192
}
export {};
