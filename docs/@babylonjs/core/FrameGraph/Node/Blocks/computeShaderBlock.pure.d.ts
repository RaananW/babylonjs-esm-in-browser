/** This file must only contain pure code and pure imports */
import { type NodeRenderGraphConnectionPoint, type Scene, type FrameGraph, type IComputeShaderPath, type IComputeShaderOptions } from "../../../index.js";
import { NodeRenderGraphBlock } from "../nodeRenderGraphBlock.js";
import { FrameGraphComputeShaderTask } from "../../Tasks/Misc/computeShaderTask.js";
/**
 * Block used to execute a compute shader in the frame graph
 */
export declare class NodeRenderGraphComputeShaderBlock extends NodeRenderGraphBlock {
    protected _frameGraphTask: FrameGraphComputeShaderTask;
    /**
     * Gets the frame graph task associated with this block
     */
    get task(): FrameGraphComputeShaderTask;
    /**
     * Creates a new NodeRenderGraphComputeShaderBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     * @param computeShaderPath defines the compute shader path or source
     * @param computeShaderOptions defines the compute shader options
     */
    constructor(name: string, frameGraph: FrameGraph, scene: Scene, computeShaderPath?: string | IComputeShaderPath, computeShaderOptions?: IComputeShaderOptions);
    private _createTask;
    /**
     * Gets or sets the execute function
     */
    get shaderPath(): string | IComputeShaderPath;
    set shaderPath(path: string | IComputeShaderPath);
    /**
     * Gets or sets the execute when task disabled function
     */
    get shaderOptions(): IComputeShaderOptions;
    set shaderOptions(options: IComputeShaderOptions);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the output component
     */
    get output(): NodeRenderGraphConnectionPoint;
}
/**
 * Register side effects for computeShaderBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterComputeShaderBlock(): void;
