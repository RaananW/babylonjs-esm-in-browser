/** This file must only contain pure code and pure imports */
import { NodeRenderGraphBlock } from "../../nodeRenderGraphBlock.js";
import { NodeRenderGraphBlockConnectionPointTypes } from "../../Types/nodeRenderGraphTypes.js";
import { FrameGraphGenerateMipMapsTask } from "../../../Tasks/Texture/generateMipMapsTask.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to generate mipmaps for a texture
 */
export class NodeRenderGraphGenerateMipmapsBlock extends NodeRenderGraphBlock {
    /**
     * Gets the frame graph task associated with this block
     */
    get task() {
        return this._frameGraphTask;
    }
    /**
     * Create a new NodeRenderGraphGenerateMipmapsBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     */
    constructor(name, frameGraph, scene) {
        super(name, frameGraph, scene);
        this.registerInput("target", NodeRenderGraphBlockConnectionPointTypes.AutoDetect);
        this._addDependenciesInput();
        this.registerOutput("output", NodeRenderGraphBlockConnectionPointTypes.BasedOnInput);
        this.target.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureAllButBackBuffer);
        this.output._typeConnectionSource = this.target;
        this._frameGraphTask = new FrameGraphGenerateMipMapsTask(name, frameGraph);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "NodeRenderGraphGenerateMipmapsBlock";
    }
    /**
     * Gets the target input component
     */
    get target() {
        return this._inputs[0];
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    _buildBlock(state) {
        super._buildBlock(state);
        this.output.value = this._frameGraphTask.outputTexture;
        this._frameGraphTask.targetTexture = this.target.connectedPoint?.value;
    }
}
let _Registered = false;
/**
 * Register side effects for generateMipmapsBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterGenerateMipmapsBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphGenerateMipmapsBlock", NodeRenderGraphGenerateMipmapsBlock);
}
//# sourceMappingURL=generateMipmapsBlock.pure.js.map