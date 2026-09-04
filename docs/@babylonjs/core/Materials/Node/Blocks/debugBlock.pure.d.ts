/** This file must only contain pure code and pure imports */
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
import { type Scene } from "../../../scene.pure.js";
/**
 * Block used to render intermediate debug values
 * Please note that the node needs to be active to be generated in the shader
 * Only one DebugBlock should be active at a time
 */
export declare class NodeMaterialDebugBlock extends NodeMaterialBlock {
    private _isActive;
    /** @internal */
    _forcedActive: boolean;
    /** Gets or sets a boolean indicating if we want to render alpha when using a rgba input*/
    renderAlpha: boolean;
    /**
     * Gets or sets a boolean indicating that the block is active
     */
    get isActive(): boolean;
    set isActive(value: boolean);
    /**
     * Creates a new NodeMaterialDebugBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /** @internal */
    get _isFinalOutputAndActive(): boolean;
    /** @internal */
    get _hasPrecedence(): boolean;
    /**
     * Gets the rgba input component
     */
    get debug(): NodeMaterialConnectionPoint;
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    protected _buildBlock(state: NodeMaterialBuildState): this;
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
 * Register side effects for materialsNodeBlocksDebugBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterMaterialsNodeBlocksDebugBlock(): void;
