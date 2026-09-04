import { type Scene, type NodeRenderGraphBuildState, type FrameGraph } from "../../../../index.js";
import { NodeRenderGraphBlock } from "../../nodeRenderGraphBlock.js";
import { NodeRenderGraphConnectionPoint } from "../../nodeRenderGraphBlockConnectionPoint.js";
import { FrameGraphObjectRendererTask } from "../../../Tasks/Rendering/objectRendererTask.js";
/**
 * @internal
 */
export declare class NodeRenderGraphBaseObjectRendererBlock extends NodeRenderGraphBlock {
    protected _frameGraphTask: FrameGraphObjectRendererTask;
    _additionalConstructionParameters: [boolean, boolean];
    /**
     * Gets the frame graph task associated with this block
     */
    get task(): FrameGraphObjectRendererTask;
    /**
     * Create a new NodeRenderGraphBaseObjectRendererBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     * @param doNotChangeAspectRatio True (default) to not change the aspect ratio of the scene in the RTT
     * @param enableClusteredLights True (default) to enable clustered lights
     */
    constructor(name: string, frameGraph: FrameGraph, scene: Scene, doNotChangeAspectRatio?: boolean, enableClusteredLights?: boolean);
    protected _createFrameGraphObject(): void;
    protected _saveState(state: {
        [key: string]: any;
    }): void;
    protected _restoreState(state: {
        [key: string]: any;
    }): void;
    protected _createFrameGraphObjectWithState(doNotChangeAspectRatio: boolean, enableClusteredLights: boolean): void;
    /** Indicates that this object renderer is the main object renderer of the frame graph. */
    get isMainObjectRenderer(): boolean;
    set isMainObjectRenderer(value: boolean);
    /** Indicates if depth testing must be enabled or disabled */
    get depthTest(): boolean;
    set depthTest(value: boolean);
    /** Indicates if depth writing must be enabled or disabled */
    get depthWrite(): boolean;
    set depthWrite(value: boolean);
    /** Indicates if meshes should be rendered */
    get renderMeshes(): boolean;
    set renderMeshes(value: boolean);
    /** Indicates if depth-only meshes should be rendered */
    get renderDepthOnlyMeshes(): boolean;
    set renderDepthOnlyMeshes(value: boolean);
    /** Indicates if opaque meshes should be rendered */
    get renderOpaqueMeshes(): boolean;
    set renderOpaqueMeshes(value: boolean);
    /** Indicates if alpha tested meshes should be rendered */
    get renderAlphaTestMeshes(): boolean;
    set renderAlphaTestMeshes(value: boolean);
    /** Indicates if transparent meshes should be rendered */
    get renderTransparentMeshes(): boolean;
    set renderTransparentMeshes(value: boolean);
    /** Indicates if use of Order Independent Transparency (OIT) for transparent meshes should be enabled */
    get useOITForTransparentMeshes(): boolean;
    set useOITForTransparentMeshes(value: boolean);
    /** Defines the number of passes to use for Order Independent Transparency */
    get oitPassCount(): number;
    set oitPassCount(value: number);
    /** Indicates if particles should be rendered */
    get renderParticles(): boolean;
    set renderParticles(value: boolean);
    /** Indicates if sprites should be rendered */
    get renderSprites(): boolean;
    set renderSprites(value: boolean);
    /** Indicates if layer mask check must be forced */
    get forceLayerMaskCheck(): boolean;
    set forceLayerMaskCheck(value: boolean);
    /** Indicates if bounding boxes should be rendered */
    get enableBoundingBoxRendering(): boolean;
    set enableBoundingBoxRendering(value: boolean);
    /** Indicates if outlines/overlays should be rendered */
    get enableOutlineRendering(): boolean;
    set enableOutlineRendering(value: boolean);
    /** Indicates if shadows must be enabled or disabled */
    get disableShadows(): boolean;
    set disableShadows(value: boolean);
    /** If image processing should be disabled */
    get renderInLinearSpace(): boolean;
    set renderInLinearSpace(value: boolean);
    /** True (default) to not change the aspect ratio of the scene in the RTT */
    get doNotChangeAspectRatio(): boolean;
    set doNotChangeAspectRatio(value: boolean);
    /** True (default) to enable clustered lights */
    get enableClusteredLights(): boolean;
    set enableClusteredLights(value: boolean);
    /** If true, MSAA color textures will be resolved at the end of the render pass (default: true) */
    get resolveMSAAColors(): boolean;
    set resolveMSAAColors(value: boolean);
    /** If true, MSAA depth texture will be resolved at the end of the render pass (default: false) */
    get resolveMSAADepth(): boolean;
    set resolveMSAADepth(value: boolean);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the target texture input component
     */
    get target(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the depth texture input component
     */
    get depth(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the camera input component
     */
    get camera(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the objects input component
     */
    get objects(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the dependencies input component
     */
    get dependencies(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the shadowGenerators input component
     */
    get shadowGenerators(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the output depth component
     */
    get outputDepth(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the objectRenderer component
     */
    get objectRenderer(): NodeRenderGraphConnectionPoint;
    protected _buildBlock(state: NodeRenderGraphBuildState): void;
    protected _dumpPropertiesCode(): string;
    serialize(): any;
    _deserialize(serializationObject: any): void;
}
