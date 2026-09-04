/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
import { type Scene } from "../../../scene.pure.js";
/**
 * Block used to repeat code
 */
export declare class LoopBlock extends NodeMaterialBlock {
    /**
     * Gets or sets number of iterations
     * Will be ignored if the iterations input is connected
     */
    iterations: number;
    /**
     * Creates a new LoopBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the main input component
     */
    get input(): NodeMaterialConnectionPoint;
    /**
     * Gets the iterations input component
     */
    get iterationsInput(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    /**
     * Gets the index component which will be incremented at each iteration
     */
    get index(): NodeMaterialConnectionPoint;
    /**
     * Gets the loop ID component
     */
    get loopID(): NodeMaterialConnectionPoint;
    protected _buildBlock(state: NodeMaterialBuildState): this;
    protected _postBuildBlock(state: NodeMaterialBuildState): this;
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
}
/**
 * Register side effects for loopBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterLoopBlock(): void;
