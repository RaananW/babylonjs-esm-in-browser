/** This file must only contain pure code and pure imports */
import { NodeRenderGraphBaseShadowGeneratorBlock } from "./baseShadowGeneratorBlock.js";
import { FrameGraphShadowGeneratorTask } from "../../../Tasks/Rendering/shadowGeneratorTask.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that generate shadows through a shadow generator
 */
export class NodeRenderGraphShadowGeneratorBlock extends NodeRenderGraphBaseShadowGeneratorBlock {
    /**
     * Create a new NodeRenderGraphShadowGeneratorBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     */
    constructor(name, frameGraph, scene) {
        super(name, frameGraph, scene);
        this._finalizeInputOutputRegistering();
        this._frameGraphTask = new FrameGraphShadowGeneratorTask(this.name, frameGraph);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "NodeRenderGraphShadowGeneratorBlock";
    }
}
let _Registered = false;
/**
 * Register side effects for shadowGeneratorBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterShadowGeneratorBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphShadowGeneratorBlock", NodeRenderGraphShadowGeneratorBlock);
}
//# sourceMappingURL=shadowGeneratorBlock.pure.js.map