/** This file must only contain pure code and pure imports */
import { type Scene, type FrameGraph, type NodeRenderGraphConnectionPoint, type NodeRenderGraphBuildState } from "../../../../index.js";
import { FrameGraphSSAO2RenderingPipelineTask } from "../../../Tasks/PostProcesses/ssao2RenderingPipelineTask.js";
import { NodeRenderGraphBasePostProcessBlock } from "./basePostProcessBlock.js";
/**
 * Block that implements the SSAO2 post process
 */
export declare class NodeRenderGraphSSAO2PostProcessBlock extends NodeRenderGraphBasePostProcessBlock {
    protected _frameGraphTask: FrameGraphSSAO2RenderingPipelineTask;
    _additionalConstructionParameters: [number, number, number];
    /**
     * Gets the frame graph task associated with this block
     */
    get task(): FrameGraphSSAO2RenderingPipelineTask;
    /**
     * Create a new NodeRenderGraphSSAO2PostProcessBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     * @param ratioSSAO The ratio between the SSAO texture size and the source texture size (default: 1)
     * @param ratioBlur The ratio between the SSAO blur texture size and the source texture size (default: 1)
     * @param textureType The texture type used by the different post processes created by SSAO2 (default: Constants.TEXTURETYPE_UNSIGNED_BYTE)
     */
    constructor(name: string, frameGraph: FrameGraph, scene: Scene, ratioSSAO?: number, ratioBlur?: number, textureType?: number);
    private _createTask;
    /** The texture type used by the different post processes created by SSAO2 */
    get textureType(): number;
    set textureType(value: number);
    /** The ratio between the SSAO texture size and the source texture size */
    get ratioSSAO(): number;
    set ratioSSAO(value: number);
    /** The ratio between the SSAO blur texture size and the source texture size */
    get ratioBlur(): number;
    set ratioBlur(value: number);
    /** Number of samples used for the SSAO calculations. Default value is 8. */
    get samples(): number;
    set samples(value: number);
    /** The strength of the SSAO post-process. Default value is 1.0. */
    get totalStrength(): number;
    set totalStrength(value: number);
    /** The base color of the SSAO post-process. The final result is "base + ssao" between [0, 1] */
    get base(): number;
    set base(value: number);
    /** Maximum depth value to still render AO. A smooth falloff makes the dimming more natural, so there will be no abrupt shading change. */
    get maxZ(): number;
    set maxZ(value: number);
    /** In order to save performances, SSAO radius is clamped on close geometry. This ratio changes by how much. */
    get minZAspect(): number;
    set minZAspect(value: number);
    /** The radius around the analyzed pixel used by the SSAO post-process. */
    get radius(): number;
    set radius(value: number);
    /** Used in SSAO calculations to compensate for accuracy issues with depth values. */
    get epsilon(): number;
    set epsilon(value: number);
    /** Indicates that the combine stage should use the current camera viewport to render the SSAO result on only a portion of the output texture. */
    get useViewportInCombineStage(): boolean;
    set useViewportInCombineStage(value: boolean);
    /** Skips the denoising (blur) stage of the SSAO calculations. */
    get bypassBlur(): boolean;
    set bypassBlur(value: boolean);
    /** Enables the configurable bilateral denoising (blurring) filter. */
    get expensiveBlur(): boolean;
    set expensiveBlur(value: boolean);
    /** The number of samples the bilateral filter uses in both dimensions when denoising the SSAO calculations. */
    get bilateralSamples(): number;
    set bilateralSamples(value: number);
    /** Controls the shape of the denoising kernel used by the bilateral filter. */
    get bilateralSoften(): number;
    set bilateralSoften(value: number);
    /** How forgiving the bilateral denoiser should be when rejecting samples. */
    get bilateralTolerance(): number;
    set bilateralTolerance(value: number);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the camera input component
     */
    get camera(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the geometry depth input component
     */
    get geomDepth(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the geometry normal input component
     */
    get geomNormal(): NodeRenderGraphConnectionPoint;
    protected _buildBlock(state: NodeRenderGraphBuildState): void;
    protected _dumpPropertiesCode(): string;
    serialize(): any;
    _deserialize(serializationObject: any): void;
}
/**
 * Register side effects for ssao2PostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterSsao2PostProcessBlock(): void;
