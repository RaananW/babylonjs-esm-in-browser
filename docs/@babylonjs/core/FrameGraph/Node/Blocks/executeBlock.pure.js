/** This file must only contain pure code and pure imports */
import { NodeRenderGraphBlockConnectionPointTypes } from "../Types/nodeRenderGraphTypes.js";
import { NodeRenderGraphBlock } from "../nodeRenderGraphBlock.js";
import { FrameGraphExecuteTask } from "../../Tasks/Misc/executeTask.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to execute a custom function in the frame graph
 */
export class NodeRenderGraphExecuteBlock extends NodeRenderGraphBlock {
    /**
     * Gets the frame graph task associated with this block
     */
    get task() {
        return this._frameGraphTask;
    }
    /**
     * Creates a new NodeRenderGraphExecuteBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     */
    constructor(name, frameGraph, scene) {
        super(name, frameGraph, scene);
        this._addDependenciesInput(NodeRenderGraphBlockConnectionPointTypes.Camera | NodeRenderGraphBlockConnectionPointTypes.ShadowLight | NodeRenderGraphBlockConnectionPointTypes.ObjectList);
        this.registerOutput("output", NodeRenderGraphBlockConnectionPointTypes.ResourceContainer);
        this._frameGraphTask = new FrameGraphExecuteTask(name, frameGraph);
    }
    /**
     * Gets or sets the execute function
     */
    get func() {
        return this._frameGraphTask.func;
    }
    set func(func) {
        this._frameGraphTask.func = func;
    }
    /**
     * Gets or sets the execute when task disabled function
     */
    get funcDisabled() {
        return this._frameGraphTask.funcDisabled;
    }
    set funcDisabled(func) {
        this._frameGraphTask.funcDisabled = func;
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "NodeRenderGraphExecuteBlock";
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
 * Register side effects for executeBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterExecuteBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphExecuteBlock", NodeRenderGraphExecuteBlock);
}
//# sourceMappingURL=executeBlock.pure.js.map