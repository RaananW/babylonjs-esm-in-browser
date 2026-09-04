/** This file must only contain pure code and pure imports */
import { FrameGraphFXAATask } from "../../../Tasks/PostProcesses/fxaaTask.js";
import { ThinFXAAPostProcess } from "../../../../PostProcesses/thinFXAAPostProcess.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "./baseWithPropertiesPostProcessBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that implements the FXAA post process
 */
export class NodeRenderGraphFXAAPostProcessBlock extends NodeRenderGraphBaseWithPropertiesPostProcessBlock {
    /**
     * Gets the frame graph task associated with this block
     */
    get task() {
        return this._frameGraphTask;
    }
    /**
     * Create a new FXAA post-process block
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     */
    constructor(name, frameGraph, scene) {
        super(name, frameGraph, scene);
        this._finalizeInputOutputRegistering();
        this._frameGraphTask = new FrameGraphFXAATask(this.name, frameGraph, new ThinFXAAPostProcess(name, scene.getEngine()));
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "NodeRenderGraphFXAAPostProcessBlock";
    }
}
let _Registered = false;
/**
 * Register side effects for fxaaPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFxaaPostProcessBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphFXAAPostProcessBlock", NodeRenderGraphFXAAPostProcessBlock);
}
//# sourceMappingURL=fxaaPostProcessBlock.pure.js.map