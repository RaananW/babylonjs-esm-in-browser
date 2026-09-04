/** This file must only contain pure code and pure imports */
import { type FrameGraph, type NodeRenderGraphBuildState, type NodeRenderGraphConnectionPoint, type Scene } from "../../../../index.js";
import { NodeRenderGraphBlock } from "../../nodeRenderGraphBlock.js";
import { FrameGraphVolumetricLightingTask } from "../../../Tasks/PostProcesses/volumetricLightingTask.js";
import { Vector3 } from "../../../../Maths/math.vector.pure.js";
import { Color3 } from "../../../../Maths/math.color.pure.js";
/**
 * Block that implements the volumetric lighting post process
 */
export declare class NodeRenderGraphVolumetricLightingBlock extends NodeRenderGraphBlock {
    protected _frameGraphTask: FrameGraphVolumetricLightingTask;
    _additionalConstructionParameters: [boolean];
    /**
     * Gets the frame graph task associated with this block
     */
    get task(): FrameGraphVolumetricLightingTask;
    /**
     * Create a new NodeRenderGraphVolumetricLightingBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     * @param enableExtinction defines whether to enable extinction coefficients
     */
    constructor(name: string, frameGraph: FrameGraph, scene: Scene, enableExtinction?: boolean);
    private _createTask;
    /** Gets or sets the phaseG parameter */
    get phaseG(): number;
    set phaseG(value: number);
    /** If extinction coefficients should be used */
    get enableExtinction(): boolean;
    set enableExtinction(value: boolean);
    /** Gets or sets the extinction color */
    get extinction(): Vector3;
    set extinction(value: Vector3);
    /** Gets or sets the light power */
    get lightPower(): Color3;
    set lightPower(value: Color3);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the target input component
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
     * Gets the lighting volume mesh input component
     */
    get lightingVolumeMesh(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the light input component
     */
    get light(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the lighting volume texture input component
     */
    get lightingVolumeTexture(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeRenderGraphConnectionPoint;
    protected _buildBlock(state: NodeRenderGraphBuildState): void;
    protected _dumpPropertiesCode(): string;
    serialize(): any;
    _deserialize(serializationObject: any): void;
}
/**
 * Register side effects for volumetricLightingBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterVolumetricLightingBlock(): void;
