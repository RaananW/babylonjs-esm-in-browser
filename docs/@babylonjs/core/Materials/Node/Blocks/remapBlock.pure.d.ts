/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
import { Vector2 } from "../../../Maths/math.vector.pure.js";
import { type Scene } from "../../../scene.pure.js";
/**
 * Block used to remap a float from a range to a new one
 */
export declare class RemapBlock extends NodeMaterialBlock {
    /**
     * Gets or sets the source range
     */
    sourceRange: Vector2;
    /**
     * Gets or sets the target range
     */
    targetRange: Vector2;
    /**
     * Creates a new RemapBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the input component
     */
    get input(): NodeMaterialConnectionPoint;
    /**
     * Gets the source min input component
     */
    get sourceMin(): NodeMaterialConnectionPoint;
    /**
     * Gets the source max input component
     */
    get sourceMax(): NodeMaterialConnectionPoint;
    /**
     * Gets the target min input component
     */
    get targetMin(): NodeMaterialConnectionPoint;
    /**
     * Gets the target max input component
     */
    get targetMax(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    protected _buildBlock(state: NodeMaterialBuildState): this;
    protected _dumpPropertiesCode(): string;
    /**
     * Serializes the block
     * @returns the serialized object
     */
    serialize(): any;
    /**
     * Deserializes the block from a serialization object
     * @param serializationObject - the object to deserialize from
     * @param scene - the current scene
     * @param rootUrl - the root URL for loading
     */
    _deserialize(serializationObject: any, scene: Scene, rootUrl: string): void;
}
/**
 * Register side effects for remapBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterRemapBlock(): void;
