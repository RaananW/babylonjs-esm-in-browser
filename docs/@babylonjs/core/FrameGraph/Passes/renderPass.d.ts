import { type Nullable, type FrameGraphRenderContext, type AbstractEngine, type IFrameGraphPass, type FrameGraphTextureHandle, type FrameGraphTask, type FrameGraphRenderTarget } from "../../index.js";
import { FrameGraphPass } from "./pass.js";
/**
 * Type used to define layer and face indices for multi-render target rendering scenarios.
 */
export type LayerAndFaceIndex = {
    /** Index of the texture to update */
    targetIndex: number;
    /** Index of the layer to set (optional - not used if the texture is not an array or a 3D texture) */
    layerIndex?: number;
    /** Index of the cube face to set (optional - not used if the texture is not a cube texture) */
    faceIndex?: number;
};
/**
 * Render pass used to render objects.
 */
export declare class FrameGraphRenderPass extends FrameGraphPass<FrameGraphRenderContext> {
    protected readonly _engine: AbstractEngine;
    protected _renderTarget: FrameGraphTextureHandle | FrameGraphTextureHandle[] | undefined;
    protected _renderTargetDepth: FrameGraphTextureHandle | undefined;
    protected _frameGraphRenderTarget: FrameGraphRenderTarget;
    protected _dependencies: Set<FrameGraphTextureHandle>;
    /**
     * Checks if a pass is a render pass.
     * @param pass The pass to check.
     * @returns True if the pass is a render pass, else false.
     */
    static IsRenderPass(pass: IFrameGraphPass): pass is FrameGraphRenderPass;
    /**
     * Gets the handle(s) of the render target(s) used by the render pass.
     */
    get renderTarget(): FrameGraphTextureHandle | FrameGraphTextureHandle[] | undefined;
    /**
     * Gets the handle of the render target depth used by the render pass.
     */
    get renderTargetDepth(): FrameGraphTextureHandle | undefined;
    /**
     * Gets the frame graph render target used by the render pass.
     */
    get frameGraphRenderTarget(): FrameGraphRenderTarget;
    /**
     * If true, the depth attachment will be read-only (may allow some optimizations in WebGPU)
     */
    depthReadOnly: boolean;
    /**
     * If true, the stencil attachment will be read-only (may allow some optimizations in WebGPU)
     */
    stencilReadOnly: boolean;
    /** @internal */
    constructor(name: string, parentTask: FrameGraphTask, context: FrameGraphRenderContext, engine: AbstractEngine);
    /**
     * Sets the render target(s) to use for rendering.
     * @param renderTargetHandle The render target to use for rendering, or an array of render targets to use for multi render target rendering.
     */
    setRenderTarget(renderTargetHandle?: FrameGraphTextureHandle | FrameGraphTextureHandle[]): void;
    /**
     * Sets the render target depth to use for rendering.
     * @param renderTargetHandle The render target depth to use for rendering.
     */
    setRenderTargetDepth(renderTargetHandle?: FrameGraphTextureHandle): void;
    /**
     * Adds dependencies to the render pass.
     * @param dependencies The dependencies to add.
     */
    addDependencies(dependencies?: FrameGraphTextureHandle | FrameGraphTextureHandle[]): void;
    /**
     * Collects the dependencies of the render pass.
     * @param dependencies The set of dependencies to update.
     */
    collectDependencies(dependencies: Set<FrameGraphTextureHandle>): void;
    /**
     * Sets the output layer and face indices for multi-render target rendering.
     * @param indices The array of layer and face indices.
     */
    setOutputLayerAndFaceIndices(indices: LayerAndFaceIndex[]): void;
    /** @internal */
    _initialize(): void;
    /** @internal */
    _execute(): void;
    /** @internal */
    _isValid(): Nullable<string>;
    /** @internal */
    _dispose(): void;
}
