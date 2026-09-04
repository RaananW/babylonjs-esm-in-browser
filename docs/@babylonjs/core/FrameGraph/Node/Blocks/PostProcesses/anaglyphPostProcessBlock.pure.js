/** This file must only contain pure code and pure imports */
import { NodeRenderGraphBlockConnectionPointTypes } from "../../Types/nodeRenderGraphTypes.js";
import { FrameGraphAnaglyphTask } from "../../../Tasks/PostProcesses/anaglyphTask.js";
import { ThinAnaglyphPostProcess } from "../../../../PostProcesses/thinAnaglyphPostProcess.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "./baseWithPropertiesPostProcessBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that implements the anaglyph post process
 */
export class NodeRenderGraphAnaglyphPostProcessBlock extends NodeRenderGraphBaseWithPropertiesPostProcessBlock {
    /**
     * Gets the frame graph task associated with this block
     */
    get task() {
        return this._frameGraphTask;
    }
    /**
     * Create a new NodeRenderAnaglyphPostProcessBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     */
    constructor(name, frameGraph, scene) {
        super(name, frameGraph, scene);
        this.registerInput("leftTexture", NodeRenderGraphBlockConnectionPointTypes.AutoDetect);
        this.leftTexture.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureAllButBackBuffer);
        this._finalizeInputOutputRegistering();
        this._frameGraphTask = new FrameGraphAnaglyphTask(this.name, frameGraph, new ThinAnaglyphPostProcess(name, scene.getEngine()));
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "NodeRenderGraphAnaglyphPostProcessBlock";
    }
    /**
     * Gets the left texture input component
     */
    get leftTexture() {
        return this._inputs[2];
    }
    _buildBlock(state) {
        super._buildBlock(state);
        this._frameGraphTask.leftTexture = this.leftTexture.connectedPoint?.value;
    }
}
let _Registered = false;
/**
 * Register side effects for anaglyphPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterAnaglyphPostProcessBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphAnaglyphPostProcessBlock", NodeRenderGraphAnaglyphPostProcessBlock);
}
//# sourceMappingURL=anaglyphPostProcessBlock.pure.js.map