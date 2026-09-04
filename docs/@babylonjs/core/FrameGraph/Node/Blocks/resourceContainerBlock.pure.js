/** This file must only contain pure code and pure imports */
import { NodeRenderGraphBlockConnectionPointTypes } from "../Types/nodeRenderGraphTypes.js";
import { NodeRenderGraphBlock } from "../nodeRenderGraphBlock.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used as a resource (textures, buffers) container
 */
export class NodeRenderGraphResourceContainerBlock extends NodeRenderGraphBlock {
    /**
     * Creates a new NodeRenderGraphResourceContainerBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     */
    constructor(name, frameGraph, scene) {
        super(name, frameGraph, scene);
        this.registerInput("resource0", NodeRenderGraphBlockConnectionPointTypes.AutoDetect, true);
        this.registerInput("resource1", NodeRenderGraphBlockConnectionPointTypes.AutoDetect, true);
        this.registerInput("resource2", NodeRenderGraphBlockConnectionPointTypes.AutoDetect, true);
        this.registerInput("resource3", NodeRenderGraphBlockConnectionPointTypes.AutoDetect, true);
        this.registerInput("resource4", NodeRenderGraphBlockConnectionPointTypes.AutoDetect, true);
        this.registerInput("resource5", NodeRenderGraphBlockConnectionPointTypes.AutoDetect, true);
        this.registerInput("resource6", NodeRenderGraphBlockConnectionPointTypes.AutoDetect, true);
        this.registerInput("resource7", NodeRenderGraphBlockConnectionPointTypes.AutoDetect, true);
        this.registerOutput("output", NodeRenderGraphBlockConnectionPointTypes.ResourceContainer);
        this.resource0.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureAllButBackBuffer | NodeRenderGraphBlockConnectionPointTypes.ShadowGenerator);
        this.resource1.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureAllButBackBuffer | NodeRenderGraphBlockConnectionPointTypes.ShadowGenerator);
        this.resource2.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureAllButBackBuffer | NodeRenderGraphBlockConnectionPointTypes.ShadowGenerator);
        this.resource3.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureAllButBackBuffer | NodeRenderGraphBlockConnectionPointTypes.ShadowGenerator);
        this.resource4.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureAllButBackBuffer | NodeRenderGraphBlockConnectionPointTypes.ShadowGenerator);
        this.resource5.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureAllButBackBuffer | NodeRenderGraphBlockConnectionPointTypes.ShadowGenerator);
        this.resource6.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureAllButBackBuffer | NodeRenderGraphBlockConnectionPointTypes.ShadowGenerator);
        this.resource7.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureAllButBackBuffer | NodeRenderGraphBlockConnectionPointTypes.ShadowGenerator);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "NodeRenderGraphResourceContainerBlock";
    }
    /**
     * Gets the resource0 component
     */
    get resource0() {
        return this._inputs[0];
    }
    /**
     * Gets the resource1 component
     */
    get resource1() {
        return this._inputs[1];
    }
    /**
     * Gets the resource2 component
     */
    get resource2() {
        return this._inputs[2];
    }
    /**
     * Gets the resource3 component
     */
    get resource3() {
        return this._inputs[3];
    }
    /**
     * Gets the resource4 component
     */
    get resource4() {
        return this._inputs[4];
    }
    /**
     * Gets the resource5 component
     */
    get resource5() {
        return this._inputs[5];
    }
    /**
     * Gets the resource6 component
     */
    get resource6() {
        return this._inputs[6];
    }
    /**
     * Gets the resource7 component
     */
    get resource7() {
        return this._inputs[7];
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
 * Register side effects for resourceContainerBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterResourceContainerBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphResourceContainerBlock", NodeRenderGraphResourceContainerBlock);
}
//# sourceMappingURL=resourceContainerBlock.pure.js.map