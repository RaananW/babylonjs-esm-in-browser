/** This file must only contain pure code and pure imports */
import { type Effect } from "../../../effect.pure.js";
import { ImageSourceBlock } from "./imageSourceBlock.pure.js";
import { type Nullable } from "../../../../types.js";
import { type Texture } from "../../../Textures/texture.pure.js";
import { type NodeMaterial } from "../../nodeMaterial.pure.js";
/**
 * Block used to provide an depth texture for a TextureBlock
 */
export declare class DepthSourceBlock extends ImageSourceBlock {
    /**
     * Creates a new DepthSourceBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets or sets the texture associated with the node
     */
    get texture(): Nullable<Texture>;
    set texture(texture: Nullable<Texture>);
    /**
     * Bind data to effect
     * @param effect - the effect to bind to
     * @param nodeMaterial - the node material
     */
    bind(effect: Effect, nodeMaterial: NodeMaterial): void;
    /**
     * Checks if the block is ready
     * @returns true if ready
     */
    isReady(): boolean;
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    protected _dumpPropertiesCode(): string;
    /**
     * Serializes the block
     * @returns the serialized object
     */
    serialize(): any;
}
/**
 * Register side effects for depthSourceBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterDepthSourceBlock(): void;
