/** This file must only contain pure code and pure imports */
import { ImageSourceBlock } from "./imageSourceBlock.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to provide an depth texture for a TextureBlock
 */
export class DepthSourceBlock extends ImageSourceBlock {
    /**
     * Creates a new DepthSourceBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
    }
    /**
     * Gets or sets the texture associated with the node
     */
    get texture() {
        return this._texture;
    }
    set texture(texture) {
        // Do nothing, we always use the depth texture from the scene
    }
    /**
     * Bind data to effect
     * @param effect - the effect to bind to
     * @param nodeMaterial - the node material
     */
    bind(effect, nodeMaterial) {
        const scene = nodeMaterial.getScene();
        const renderer = scene.enableDepthRenderer();
        this._texture = renderer.getDepthMap();
        super.bind(effect, nodeMaterial);
    }
    /**
     * Checks if the block is ready
     * @returns true if ready
     */
    isReady() {
        return true;
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "DepthSourceBlock";
    }
    _dumpPropertiesCode() {
        return super._dumpPropertiesCode(true);
    }
    /**
     * Serializes the block
     * @returns the serialized object
     */
    serialize() {
        return super.serialize(true);
    }
}
let _Registered = false;
/**
 * Register side effects for depthSourceBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterDepthSourceBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.DepthSourceBlock", DepthSourceBlock);
}
//# sourceMappingURL=depthSourceBlock.pure.js.map