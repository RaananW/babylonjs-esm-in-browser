/** This file must only contain pure code and pure imports */
import { NodeRenderGraphBlockConnectionPointTypes } from "../Types/nodeRenderGraphTypes.js";
import { NodeRenderGraphBlock } from "../nodeRenderGraphBlock.js";
import { FrameGraphComputeShaderTask } from "../../Tasks/Misc/computeShaderTask.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to execute a compute shader in the frame graph
 */
export class NodeRenderGraphComputeShaderBlock extends NodeRenderGraphBlock {
    /**
     * Gets the frame graph task associated with this block
     */
    get task() {
        return this._frameGraphTask;
    }
    /**
     * Creates a new NodeRenderGraphComputeShaderBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     * @param computeShaderPath defines the compute shader path or source
     * @param computeShaderOptions defines the compute shader options
     */
    constructor(name, frameGraph, scene, computeShaderPath = "@compute @workgroup_size(1, 1, 1)\nfn main() {}", computeShaderOptions = { bindingsMapping: {} }) {
        super(name, frameGraph, scene);
        this._additionalConstructionParameters = [computeShaderPath, computeShaderOptions];
        this._addDependenciesInput(NodeRenderGraphBlockConnectionPointTypes.Camera | NodeRenderGraphBlockConnectionPointTypes.ShadowLight | NodeRenderGraphBlockConnectionPointTypes.ObjectList);
        this.registerOutput("output", NodeRenderGraphBlockConnectionPointTypes.ResourceContainer);
        this._frameGraphTask = new FrameGraphComputeShaderTask(name, frameGraph, computeShaderPath, computeShaderOptions);
    }
    _createTask(shaderPath, shaderOptions) {
        const dispatchSize = this._frameGraphTask.dispatchSize;
        const indirectDispatch = this._frameGraphTask.indirectDispatch;
        const execute = this._frameGraphTask.execute;
        this._frameGraphTask.dispose();
        this._frameGraphTask = new FrameGraphComputeShaderTask(this.name, this._frameGraph, shaderPath, shaderOptions);
        this._frameGraphTask.dispatchSize = dispatchSize;
        this._frameGraphTask.indirectDispatch = indirectDispatch;
        this._frameGraphTask.execute = execute;
        this._additionalConstructionParameters = [shaderPath, shaderOptions];
    }
    /**
     * Gets or sets the execute function
     */
    get shaderPath() {
        return this._frameGraphTask.computeShader.shaderPath;
    }
    set shaderPath(path) {
        this._createTask(path, this.shaderOptions);
    }
    /**
     * Gets or sets the execute when task disabled function
     */
    get shaderOptions() {
        return this._frameGraphTask.computeShader.options;
    }
    set shaderOptions(options) {
        this._createTask(this.shaderPath, options);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "NodeRenderGraphComputeShaderBlock";
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
}
let _Registered = false;
/**
 * Register side effects for computeShaderBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterComputeShaderBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphComputeShaderBlock", NodeRenderGraphComputeShaderBlock);
}
//# sourceMappingURL=computeShaderBlock.pure.js.map