/** This file must only contain pure code and pure imports */
import { type AbstractEngine } from "../Engines/abstractEngine.pure.js";
import { type Effect } from "../Materials/effect.pure.js";
import { MultiRenderTarget } from "../Materials/Textures/multiRenderTarget.pure.js";
import { Color4 } from "../Maths/math.color.pure.js";
import { type SubMesh } from "../Meshes/subMesh.pure.js";
import { type AbstractMesh } from "../Meshes/abstractMesh.pure.js";
import { SmartArray } from "../Misc/smartArray.js";
import { type Scene } from "../scene.pure.js";
import { ThinTexture } from "../Materials/Textures/thinTexture.js";
import { EffectRenderer, EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { type PrePassRenderer } from "./prePassRenderer.pure.js";
import { ShaderLanguage } from "../Materials/shaderLanguage.js";
import { type RenderTargetWrapper } from "../Engines/renderTargetWrapper.js";
import { type Nullable } from "../types.js";
/**
 * @internal
 */
export declare class ThinDepthPeelingRenderer {
    protected _scene: Scene;
    protected _engine: AbstractEngine;
    protected _depthMrts: MultiRenderTarget[];
    protected _thinTextures: ThinTexture[];
    protected _colorMrts: MultiRenderTarget[];
    protected _blendBackMrt: MultiRenderTarget;
    protected _blendBackEffectWrapper: EffectWrapper;
    protected _blendBackEffectWrapperPingPong: EffectWrapper;
    protected _finalEffectWrapper: EffectWrapper;
    protected _effectRenderer: EffectRenderer;
    protected _currentPingPongState: number;
    protected _layoutCacheFormat: boolean[][];
    protected _layoutCache: number[][];
    protected _renderPassIds: number[];
    protected _candidateSubMeshes: SmartArray<SubMesh>;
    protected _excludedSubMeshes: SmartArray<SubMesh>;
    protected _excludedMeshes: number[];
    protected static _DEPTH_CLEAR_VALUE: number;
    protected static _MIN_DEPTH: number;
    protected static _MAX_DEPTH: number;
    protected _colorCache: Color4[];
    protected _passCount: number;
    /**
     * Number of depth peeling passes. As we are using dual depth peeling, each pass two levels of transparency are processed.
     */
    get passCount(): number;
    set passCount(count: number);
    protected _useRenderPasses: boolean;
    /**
     * Instructs the renderer to use render passes. It is an optimization that makes the rendering faster for some engines (like WebGPU) but that consumes more memory, so it is disabled by default.
     */
    get useRenderPasses(): boolean;
    set useRenderPasses(usePasses: boolean);
    /**
     * Add a mesh in the exclusion list to prevent it to be handled by the depth peeling renderer
     * @param mesh The mesh to exclude from the depth peeling renderer
     */
    addExcludedMesh(mesh: AbstractMesh): void;
    /**
     * Remove a mesh from the exclusion list of the depth peeling renderer
     * @param mesh The mesh to remove
     */
    removeExcludedMesh(mesh: AbstractMesh): void;
    /** Shader language used by the renderer */
    protected _shaderLanguage: ShaderLanguage;
    /**
     * Gets the shader language used in this renderer
     */
    get shaderLanguage(): ShaderLanguage;
    private _blendOutput;
    /**
     * Sets the render target wrapper we will blend the transparent objects onto
     */
    get blendOutput(): Nullable<RenderTargetWrapper>;
    set blendOutput(blendOutput: Nullable<RenderTargetWrapper>);
    /**
     * Instanciates the depth peeling renderer
     * @param scene Scene to attach to
     * @param passCount Number of depth layers to peel
     * @returns The depth peeling renderer
     */
    constructor(scene: Scene, passCount?: number);
    private _createRenderPassIds;
    private _releaseRenderPassIds;
    protected _getTextureSize(): {
        width: number;
        height: number;
    };
    protected _createTextures(): void;
    protected _disposeTextures(): void;
    protected _createEffects(finalEffectFragmentShaderName: string, finalEffectSamplerNames: string[]): void;
    /**
     * Links to the prepass renderer
     * @param _prePassRenderer The scene PrePassRenderer
     */
    setPrePassRenderer(_prePassRenderer: PrePassRenderer): void;
    /**
     * Binds depth peeling textures on an effect
     * @param effect The effect to bind textures on
     */
    bind(effect: Effect): void;
    private _renderSubMeshes;
    protected _finalCompose(writeId: number): void;
    /**
     * Checks if the depth peeling renderer is ready to render transparent meshes
     * @returns true if the depth peeling renderer is ready to render the transparent meshes
     */
    isReady(): boolean;
    protected _beforeRender(): void;
    protected _afterRender(): void;
    protected _noTransparentMeshes(): void;
    /**
     * Renders transparent submeshes with depth peeling
     * @param transparentSubMeshes List of transparent meshes to render
     * @returns The array of submeshes that could not be handled by this renderer
     */
    render(transparentSubMeshes: SmartArray<SubMesh>): SmartArray<SubMesh>;
    /**
     * Disposes the depth peeling renderer and associated resources
     */
    dispose(): void;
}
