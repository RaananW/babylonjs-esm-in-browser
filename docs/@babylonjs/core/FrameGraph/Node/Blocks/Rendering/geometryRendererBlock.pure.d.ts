/** This file must only contain pure code and pure imports */
import { type NodeRenderGraphConnectionPoint, type Scene, type NodeRenderGraphBuildState, type FrameGraph } from "../../../../index.js";
import { NodeRenderGraphBaseObjectRendererBlock } from "./baseObjectRendererBlock.js";
import { FrameGraphGeometryRendererTask } from "../../../Tasks/Rendering/geometryRendererTask.js";
/**
 * Block that render geometry of objects to a multi render target
 */
export declare class NodeRenderGraphGeometryRendererBlock extends NodeRenderGraphBaseObjectRendererBlock {
    protected _frameGraphTask: FrameGraphGeometryRendererTask;
    /**
     * Gets the frame graph task associated with this block
     */
    get task(): FrameGraphGeometryRendererTask;
    /**
     * Create a new NodeRenderGraphGeometryRendererBlock
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
    /** Width of the geometry texture */
    get width(): number;
    set width(value: number);
    /** Height of the geometry texture */
    get height(): number;
    set height(value: number);
    /** Indicates if the geometry texture width and height are percentages or absolute values */
    get sizeInPercentage(): boolean;
    set sizeInPercentage(value: boolean);
    /** Number of samples of the geometry texture */
    get samples(): number;
    set samples(value: number);
    /** Indicates if culling must be reversed */
    get reverseCulling(): boolean;
    set reverseCulling(value: boolean);
    /** Indicates if a mesh shouldn't be rendered when its material has depth write disabled */
    get dontRenderWhenMaterialDepthWriteIsDisabled(): boolean;
    set dontRenderWhenMaterialDepthWriteIsDisabled(value: boolean);
    /** Indicates if depth pre-pass must be disabled */
    get disableDepthPrePass(): boolean;
    set disableDepthPrePass(value: boolean);
    /** The format of the irradiance output texture */
    irradianceFormat: number;
    /** The type of the irradiance output texture */
    irradianceType: number;
    /** The format of the view depth output texture */
    viewDepthFormat: number;
    /** The type of the view depth output texture */
    viewDepthType: number;
    /** The format of the normalized view depth output texture */
    normalizedViewDepthFormat: number;
    /** The type of the normalized view depth output texture */
    normalizedViewDepthType: number;
    /** The format of the screen depth output texture */
    screenDepthFormat: number;
    /** The type of the screen depth output texture */
    screenDepthType: number;
    /** The format of the view normal output texture */
    viewNormalFormat: number;
    /** The type of the view normal output texture */
    viewNormalType: number;
    /** The format of the world normal output texture */
    worldNormalFormat: number;
    /** The type of the world normal output texture */
    worldNormalType: number;
    /** The format of the local position output texture */
    localPositionFormat: number;
    /** The type of the local position output texture */
    localPositionType: number;
    /** The format of the world position output texture */
    worldPositionFormat: number;
    /** The type of the world position output texture */
    worldPositionType: number;
    /** The format of the albedo output texture */
    albedoFormat: number;
    /** The type of the albedo output texture */
    albedoType: number;
    /** The format of the reflectivity output texture */
    reflectivityFormat: number;
    /** The type of the reflectivity output texture */
    reflectivityType: number;
    /** The format of the velocity output texture */
    velocityFormat: number;
    /** The type of the velocity output texture */
    velocityType: number;
    /** The format of the linear velocity output texture */
    linearVelocityFormat: number;
    /** The type of the linear velocity output texture */
    linearVelocityType: number;
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the geometry irradiance component
     */
    get geomIrradiance(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the geometry view depth component
     */
    get geomViewDepth(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the geometry normalized view depth component
     */
    get geomNormViewDepth(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the geometry screen depth component
     */
    get geomScreenDepth(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the geometry view normal component
     */
    get geomViewNormal(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the world geometry normal component
     */
    get geomWorldNormal(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the geometry local position component
     */
    get geomLocalPosition(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the geometry world position component
     */
    get geomWorldPosition(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the geometry albedo component
     */
    get geomAlbedo(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the geometry reflectivity component
     */
    get geomReflectivity(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the geometry velocity component
     */
    get geomVelocity(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the geometry linear velocity component
     */
    get geomLinearVelocity(): NodeRenderGraphConnectionPoint;
    protected _buildBlock(state: NodeRenderGraphBuildState): void;
    protected _dumpPropertiesCode(): string;
    /**
     * Serializes this block
     * @returns the serialized object
     */
    serialize(): any;
    _deserialize(serializationObject: any): void;
}
/**
 * Register side effects for geometryRendererBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGeometryRendererBlock(): void;
