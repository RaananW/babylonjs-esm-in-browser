/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type Scene } from "../../../scene.pure.js";
/**
 * Custom block created from user-defined json
 */
export declare class CustomBlock extends NodeMaterialBlock {
    private _options;
    private _code;
    private _inputSamplers;
    /**
     * Gets or sets the options for this custom block
     */
    get options(): any;
    set options(options: any);
    /**
     * Creates a new CustomBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    protected _buildBlock(state: NodeMaterialBuildState): this;
    protected _dumpPropertiesCode(): string;
    /**
     * Serializes the block
     * @returns the serialized object
     */
    serialize(): any;
    /**
     * Deserializes the block
     * @param serializationObject - the serialization object
     * @param scene - the scene
     * @param rootUrl - the root URL
     */
    _deserialize(serializationObject: any, scene: Scene, rootUrl: string): void;
    private _deserializeOptions;
    private _findInputByName;
}
/**
 * Register side effects for customBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterCustomBlock(): void;
