import { type FrameGraph, type FrameGraphTextureHandle, type Scene, type Camera, type FrameGraphObjectList, type FrameGraphRenderContext, type ObjectRendererOptions, type Nullable, type Observer, type FrameGraphShadowGeneratorTask, type FrameGraphRenderPass, type AbstractEngine, type SmartArray, type SubMesh, type RenderingGroup } from "../../../index.js";
import { FrameGraphTaskMultiRenderTarget } from "../../frameGraphTaskMultiRenderTarget.js";
import { ObjectRenderer } from "../../../Rendering/objectRenderer.js";
import { ThinDepthPeelingRenderer } from "../../../Rendering/thinDepthPeelingRenderer.pure.js";
import { FrameGraphRenderTarget } from "../../frameGraphRenderTarget.js";
/**
 * Task used to render objects to a texture.
 */
export declare class FrameGraphObjectRendererTask extends FrameGraphTaskMultiRenderTarget {
    /**
     * The target texture(s) where the objects will be rendered.
     */
    targetTexture: FrameGraphTextureHandle | FrameGraphTextureHandle[];
    /**
     * The depth attachment texture where the objects will be rendered (optional).
     */
    depthTexture?: FrameGraphTextureHandle;
    /**
     * The shadow generators used to render the objects (optional).
     */
    shadowGenerators?: FrameGraphShadowGeneratorTask[];
    private _camera;
    /**
     * Gets or sets the camera used to render the objects.
     */
    get camera(): Camera;
    set camera(camera: Camera);
    /**
     * The list of objects to render.
     */
    objectList: FrameGraphObjectList;
    /**
     * If depth testing should be enabled (default is true).
     */
    depthTest: boolean;
    /**
     * If depth writing should be enabled (default is true).
     */
    depthWrite: boolean;
    /**
     * If shadows should be disabled (default is false).
     */
    disableShadows: boolean;
    private _disableImageProcessing;
    /**
     * If image processing should be disabled (default is false).
     * false means that the default image processing configuration will be applied (the one from the scene)
     */
    get disableImageProcessing(): boolean;
    set disableImageProcessing(value: boolean);
    /**
     * Sets this property to true if this task is the main object renderer of the frame graph.
     * It will help to locate the main object renderer in the frame graph when multiple object renderers are used.
     * This is useful for the inspector to know which object renderer to use for additional rendering features like wireframe rendering or frustum light debugging.
     * It is also used to determine the main camera used by the frame graph: this is the camera used by the main object renderer.
     */
    isMainObjectRenderer: boolean;
    private _renderMeshes;
    /**
     * Defines if meshes should be rendered (default is true).
     */
    get renderMeshes(): boolean;
    set renderMeshes(value: boolean);
    private _renderDepthOnlyMeshes;
    /**
     * Defines if depth only meshes should be rendered (default is true). Always subject to the renderMeshes property, though.
     */
    get renderDepthOnlyMeshes(): boolean;
    set renderDepthOnlyMeshes(value: boolean);
    private _renderOpaqueMeshes;
    /**
     * Defines if opaque meshes should be rendered (default is true). Always subject to the renderMeshes property, though.
     */
    get renderOpaqueMeshes(): boolean;
    set renderOpaqueMeshes(value: boolean);
    private _renderAlphaTestMeshes;
    /**
     * Defines if alpha test meshes should be rendered (default is true). Always subject to the renderMeshes property, though.
     */
    get renderAlphaTestMeshes(): boolean;
    set renderAlphaTestMeshes(value: boolean);
    private _renderTransparentMeshes;
    /**
     * Defines if transparent meshes should be rendered (default is true). Always subject to the renderMeshes property, though.
     */
    get renderTransparentMeshes(): boolean;
    set renderTransparentMeshes(value: boolean);
    private _useOITForTransparentMeshes;
    /**
     * Defines if Order Independent Transparency should be used for transparent meshes (default is false).
     */
    get useOITForTransparentMeshes(): boolean;
    set useOITForTransparentMeshes(value: boolean);
    /**
     * Defines the number of passes to use for Order Independent Transparency (default is 5).
     */
    get oitPassCount(): number;
    set oitPassCount(value: number);
    private _renderParticles;
    /**
     * Defines if particles should be rendered (default is true).
     */
    get renderParticles(): boolean;
    set renderParticles(value: boolean);
    private _renderSprites;
    /**
     * Defines if sprites should be rendered (default is true).
     */
    get renderSprites(): boolean;
    set renderSprites(value: boolean);
    private _forceLayerMaskCheck;
    /**
     * Forces checking the layerMask property even if a custom list of meshes is provided (ie. if renderList is not undefined). Default is true.
     */
    get forceLayerMaskCheck(): boolean;
    set forceLayerMaskCheck(value: boolean);
    private _enableBoundingBoxRendering;
    /**
     * Enables the rendering of bounding boxes for meshes (still subject to Mesh.showBoundingBox or scene.forceShowBoundingBoxes). Default is true.
     */
    get enableBoundingBoxRendering(): boolean;
    set enableBoundingBoxRendering(value: boolean);
    private _enableOutlineRendering;
    /**
     * Enables the rendering of outlines/overlays for meshes (still subject to Mesh.renderOutline/Mesh.renderOverlay). Default is true.
     */
    get enableOutlineRendering(): boolean;
    set enableOutlineRendering(value: boolean);
    /**
     * If true, targetTexture will be resolved at the end of the render pass, if this/these texture(s) is/are MSAA (default: true)
     */
    resolveMSAAColors: boolean;
    /**
     * If true, depthTexture will be resolved at the end of the render pass, if this texture is provided and is MSAA (default: false).
     */
    resolveMSAADepth: boolean;
    /**
     * The output texture.
     * This texture will point to the same texture than the targetTexture property.
     * Note, however, that the handle itself will be different!
     */
    readonly outputTexture: FrameGraphTextureHandle;
    /**
     * The output depth attachment texture.
     * This texture will point to the same texture than the depthTexture property if it is set.
     * Note, however, that the handle itself will be different!
     */
    readonly outputDepthTexture: FrameGraphTextureHandle;
    /**
     * The object renderer used to render the objects.
     */
    get objectRenderer(): ObjectRenderer;
    get name(): string;
    set name(value: string);
    protected readonly _engine: AbstractEngine;
    protected readonly _scene: Scene;
    protected readonly _renderer: ObjectRenderer;
    protected readonly _oitRenderer: ThinDepthPeelingRenderer;
    protected _textureWidth: number;
    protected _textureHeight: number;
    protected _onBeforeRenderObservable: Nullable<Observer<number>>;
    protected _onAfterRenderObservable: Nullable<Observer<number>>;
    protected _externalObjectRenderer: boolean;
    protected _rtForOrderIndependentTransparency: FrameGraphRenderTarget;
    /**
     * Constructs a new object renderer task.
     * @param name The name of the task.
     * @param frameGraph The frame graph the task belongs to.
     * @param scene The scene the frame graph is associated with.
     * @param options The options of the object renderer.
     * @param existingObjectRenderer An existing object renderer to use (optional). If provided, the options parameter will be ignored.
     */
    constructor(name: string, frameGraph: FrameGraph, scene: Scene, options?: ObjectRendererOptions, existingObjectRenderer?: ObjectRenderer);
    isReady(): boolean;
    getClassName(): string;
    /**
     * Records the object renderer task into the frame graph.
     * @param skipCreationOfDisabledPasses defines whether disabled passes should be skipped
     * @param additionalExecute defines an optional callback executed by the pass
     * @returns the recorded render pass
     */
    record(skipCreationOfDisabledPasses?: boolean, additionalExecute?: (context: FrameGraphRenderContext) => void): FrameGraphRenderPass;
    dispose(): void;
    protected _resolveDanglingHandles(targetTextures: FrameGraphTextureHandle[]): void;
    protected _checkParameters(): void;
    protected _checkTextureCompatibility(targetTextures: FrameGraphTextureHandle[]): boolean;
    protected _getTargetHandles(): FrameGraphTextureHandle[];
    protected _prepareRendering(context: FrameGraphRenderContext, depthEnabled: boolean): Nullable<number[]>;
    protected _setLightsForShadow(): void;
    protected _renderTransparentMeshesWithOIT(transparentSubMeshes: SmartArray<SubMesh>, renderingGroup: RenderingGroup): void;
}
