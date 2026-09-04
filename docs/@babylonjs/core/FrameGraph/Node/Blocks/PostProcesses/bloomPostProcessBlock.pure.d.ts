/** This file must only contain pure code and pure imports */
import { type Scene, type FrameGraph } from "../../../../index.js";
import { FrameGraphBloomTask } from "../../../Tasks/PostProcesses/bloomTask.js";
import { NodeRenderGraphBasePostProcessBlock } from "./basePostProcessBlock.js";
/**
 * Block that implements the bloom post process
 */
export declare class NodeRenderGraphBloomPostProcessBlock extends NodeRenderGraphBasePostProcessBlock {
    protected _frameGraphTask: FrameGraphBloomTask;
    _additionalConstructionParameters: [boolean, number];
    /**
     * Gets the frame graph task associated with this block
     */
    get task(): FrameGraphBloomTask;
    /**
     * Create a new NodeRenderGraphBloomPostProcessBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     * @param hdr If high dynamic range textures should be used (default: false)
     * @param bloomScale The scale of the bloom effect (default: 0.5)
     */
    constructor(name: string, frameGraph: FrameGraph, scene: Scene, hdr?: boolean, bloomScale?: number);
    private _createTask;
    /** The quality of the blur effect */
    get bloomScale(): number;
    set bloomScale(value: number);
    /** If high dynamic range textures should be used */
    get hdr(): boolean;
    set hdr(value: boolean);
    /** The luminance threshold to find bright areas of the image to bloom. */
    get threshold(): number;
    set threshold(value: number);
    /** The strength of the bloom. */
    get weight(): number;
    set weight(value: number);
    /** Specifies the size of the bloom blur kernel, relative to the final output size */
    get kernel(): number;
    set kernel(value: number);
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
 * Register side effects for bloomPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterBloomPostProcessBlock(): void;
