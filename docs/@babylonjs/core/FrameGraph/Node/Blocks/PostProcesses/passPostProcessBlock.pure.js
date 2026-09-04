/** This file must only contain pure code and pure imports */
import { FrameGraphPassCubeTask, FrameGraphPassTask } from "../../../Tasks/PostProcesses/passTask.js";
import { ThinPassCubePostProcess, ThinPassPostProcess } from "../../../../PostProcesses/thinPassPostProcess.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "././baseWithPropertiesPostProcessBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that implements the pass post process
 */
export class NodeRenderGraphPassPostProcessBlock extends NodeRenderGraphBaseWithPropertiesPostProcessBlock {
    /**
     * Gets the frame graph task associated with this block
     */
    get task() {
        return this._frameGraphTask;
    }
    /**
     * Create a new NodeRenderGraphPassPostProcessBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     */
    constructor(name, frameGraph, scene) {
        super(name, frameGraph, scene);
        this._finalizeInputOutputRegistering();
        this._frameGraphTask = new FrameGraphPassTask(this.name, frameGraph, new ThinPassPostProcess(name, scene.getEngine()));
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "NodeRenderGraphPassPostProcessBlock";
    }
}
/**
 * Block that implements the pass cube post process
 */
export class NodeRenderGraphPassCubePostProcessBlock extends NodeRenderGraphBaseWithPropertiesPostProcessBlock {
    /**
     * Gets the frame graph task associated with this block
     */
    get task() {
        return this._frameGraphTask;
    }
    /**
     * Create a new NodeRenderGraphPassCubePostProcessBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     */
    constructor(name, frameGraph, scene) {
        super(name, frameGraph, scene);
        this._finalizeInputOutputRegistering();
        this._frameGraphTask = new FrameGraphPassCubeTask(this.name, frameGraph, new ThinPassCubePostProcess(name, scene.getEngine()));
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "NodeRenderGraphPassCubePostProcessBlock";
    }
}
let _Registered = false;
/**
 * Register side effects for passPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterPassPostProcessBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphPassPostProcessBlock", NodeRenderGraphPassPostProcessBlock);
    RegisterClass("BABYLON.NodeRenderGraphPassCubePostProcessBlock", NodeRenderGraphPassCubePostProcessBlock);
}
//# sourceMappingURL=passPostProcessBlock.pure.js.map