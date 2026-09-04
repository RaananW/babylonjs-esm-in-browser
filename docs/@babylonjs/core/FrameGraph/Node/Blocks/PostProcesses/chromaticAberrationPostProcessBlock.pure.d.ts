/** This file must only contain pure code and pure imports */
import { type Scene, type FrameGraph } from "../../../../index.js";
import { Vector2 } from "../../../../Maths/math.vector.pure.js";
import { FrameGraphChromaticAberrationTask } from "../../../Tasks/PostProcesses/chromaticAberrationTask.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "./baseWithPropertiesPostProcessBlock.js";
/**
 * Block that implements the chromatic aberration post process
 */
export declare class NodeRenderGraphChromaticAberrationPostProcessBlock extends NodeRenderGraphBaseWithPropertiesPostProcessBlock {
    protected _frameGraphTask: FrameGraphChromaticAberrationTask;
    /**
     * Gets the frame graph task associated with this block
     */
    get task(): FrameGraphChromaticAberrationTask;
    /**
     * Create a new chromatic aberration post process block
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     */
    constructor(name: string, frameGraph: FrameGraph, scene: Scene);
    /** The amount of separation of rgb channels */
    get aberrationAmount(): number;
    set aberrationAmount(value: number);
    /** The amount the effect will increase for pixels closer to the edge of the screen */
    get radialIntensity(): number;
    set radialIntensity(value: number);
    /** The normalized direction in which the rgb channels should be separated. If set to 0,0 radial direction will be used. */
    get direction(): Vector2;
    set direction(value: Vector2);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    protected _dumpPropertiesCode(): string;
    serialize(): any;
    _deserialize(serializationObject: any): void;
}
/**
 * Register side effects for chromaticAberrationPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterChromaticAberrationPostProcessBlock(): void;
