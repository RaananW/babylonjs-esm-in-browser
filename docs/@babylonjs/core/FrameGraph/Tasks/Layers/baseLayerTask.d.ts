import { type FrameGraph, type FrameGraphTextureHandle, type Scene, type Effect, type AbstractEngine, type ThinEffectLayer, type FrameGraphRenderPass, type FrameGraphRenderContext } from "../../../index.js";
import { FrameGraphTask } from "../../frameGraphTask.js";
import { FrameGraphObjectRendererTask } from "../Rendering/objectRendererTask.js";
import { FrameGraphClearTextureTask } from "../Texture/clearTextureTask.js";
import { FrameGraphBlurTask } from "../PostProcesses/blurTask.js";
import { FrameGraphPostProcessTask } from "../PostProcesses/postProcessTask.js";
import { ThinGlowBlurPostProcess } from "../../../Layers/thinEffectLayer.js";
/** @internal */
export declare enum FrameGraphBaseLayerBlurType {
    None = "none",
    Standard = "standard",
    Glow = "glow"
}
declare class FrameGraphGlowBlurTask extends FrameGraphPostProcessTask {
    /**
     * The thin glow blur post process used by the task.
     */
    readonly postProcess: ThinGlowBlurPostProcess;
    /**
     * Constructs a new glow blur task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task is associated with.
     * @param thinPostProcess The thin post process to use for the glow blur effect. If not provided, a new one will be created.
     */
    constructor(name: string, frameGraph: FrameGraph, thinPostProcess?: ThinGlowBlurPostProcess);
    /**
     * Gets the current class name.
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Records the glow blur task into the frame graph.
     * @param skipCreationOfDisabledPasses defines whether disabled passes should be skipped
     * @param additionalExecute defines an optional callback executed by the pass
     * @param additionalBindings defines an optional callback used to bind extra resources
     * @returns the recorded render pass
     */
    record(skipCreationOfDisabledPasses?: boolean, additionalExecute?: (context: FrameGraphRenderContext) => void, additionalBindings?: (context: FrameGraphRenderContext) => void): FrameGraphRenderPass;
}
/**
 * @internal
 */
export declare class FrameGraphBaseLayerTask extends FrameGraphTask {
    private _blurType;
    private _setRenderTargetDepth;
    private _notifyBlurObservable;
    private _setObjectList;
    /**
     * The target texture to apply the effect layer to.
     * The effect will be blended with the contents of this texture.
     */
    targetTexture: FrameGraphTextureHandle;
    /**
     * The object renderer task used to render the objects in the texture to which the layer will be applied.
     * This is needed because the layer may have to inject code in the rendering manager used by object renderer task.
     */
    objectRendererTask: FrameGraphObjectRendererTask;
    /**
     * The layer texture to render the effect into.
     * If not provided, a default texture will be created.
     */
    layerTexture?: FrameGraphTextureHandle;
    /**
     * The output texture of the task (same as targetTexture, but the handle will be different).
     */
    readonly outputTexture: FrameGraphTextureHandle;
    /**
     * The layer object. Use this object to update the layer properties.
     */
    readonly layer: ThinEffectLayer;
    /**
     * The name of the task.
     */
    get name(): string;
    set name(name: string);
    /**
     * Gets the object renderer used to render the layer.
     */
    get objectRendererForLayer(): FrameGraphObjectRendererTask;
    protected readonly _scene: Scene;
    protected readonly _engine: AbstractEngine;
    protected readonly _clearLayerTextureTask: FrameGraphClearTextureTask;
    protected readonly _objectRendererForLayerTask: FrameGraphObjectRendererTask;
    protected readonly _blurX: Array<FrameGraphBlurTask | FrameGraphGlowBlurTask>;
    protected readonly _blurY: Array<FrameGraphBlurTask | FrameGraphGlowBlurTask>;
    protected _layerTextureDimensions: {
        width: number;
        height: number;
    };
    private readonly _onBeforeBlurTask;
    private readonly _onAfterBlurTask;
    private _onBeforeObservableObserver;
    private _onBeforeObservableObserver2;
    private _onAfterObservableObserver;
    private _onAfterRenderingGroupObserver;
    /**
     * Constructs a new layer task.
     * @param name Name of the task.
     * @param frameGraph The frame graph this task is associated with.
     * @param scene The scene to render the layer in.
     * @param layer The layer.
     * @param numBlurPasses The number of blur passes applied by the layer.
     * @param _blurType The type of blur to use for the layer.
     * @param _setRenderTargetDepth If true, the task will set the render target depth.
     * @param _notifyBlurObservable If true, the task will notify before and after blurring occurs.
     * @param _setObjectList If true, the object list of the object renderer for the layer will be set to the object list of the object renderer task.
     */
    constructor(name: string, frameGraph: FrameGraph, scene: Scene, layer: ThinEffectLayer, numBlurPasses: number, _blurType?: FrameGraphBaseLayerBlurType, _setRenderTargetDepth?: boolean, _notifyBlurObservable?: boolean, _setObjectList?: boolean);
    /**
     * Checks whether the layer task is ready.
     * @returns true if the layer task is ready
     */
    isReady(): boolean;
    /**
     * Gets the current class name.
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Records the layer task into the frame graph.
     * @param _skipCreationOfDisabledPasses defines whether disabled passes should be skipped
     * @param additionalComposeBindings defines an optional callback used to bind extra compose resources
     */
    record(_skipCreationOfDisabledPasses?: boolean, additionalComposeBindings?: (context: FrameGraphRenderContext, effect: Effect) => void): void;
    private _clearAfterRenderingGroupObserver;
    /**
     * Disposes the layer task and its dependent tasks.
     */
    dispose(): void;
}
export {};
