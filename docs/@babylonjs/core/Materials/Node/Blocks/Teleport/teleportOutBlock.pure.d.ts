/** This file must only contain pure code and pure imports */
import { type Nullable } from "../../../../types.js";
import { type NodeMaterialTeleportInBlock } from "./teleportInBlock.pure.js";
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { type Scene } from "../../../../scene.pure.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
/**
 * Defines a block used to receive a value from a teleport entry point
 */
export declare class NodeMaterialTeleportOutBlock extends NodeMaterialBlock {
    /** @internal */
    _entryPoint: Nullable<NodeMaterialTeleportInBlock>;
    /** @internal */
    _tempEntryPointUniqueId: Nullable<number>;
    /**
     * Create a new TeleportOutBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the entry point
     */
    get entryPoint(): Nullable<NodeMaterialTeleportInBlock>;
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    /**
     * Gets or sets the target of the block
     */
    get target(): NodeMaterialBlockTargets;
    set target(value: NodeMaterialBlockTargets);
    /** Detach from entry point */
    detach(): void;
    protected _buildBlock(state: NodeMaterialBuildState): void;
    /**
     * Clone the current block to a new identical block
     * @param scene defines the hosting scene
     * @param rootUrl defines the root URL to use to load textures and relative dependencies
     * @returns a copy of the current block
     */
    clone(scene: Scene, rootUrl?: string): NodeMaterialBlock | null;
    protected _customBuildStep(state: NodeMaterialBuildState, activeBlocks: NodeMaterialBlock[]): void;
    /**
     * Dumps the code for the block
     * @param uniqueNames - the unique names
     * @param alreadyDumped - the already dumped blocks
     * @returns the code string
     */
    _dumpCode(uniqueNames: string[], alreadyDumped: NodeMaterialBlock[]): string;
    /**
     * Dumps the code for output connections
     * @param alreadyDumped - the already dumped blocks
     * @returns the code string
     */
    _dumpCodeForOutputConnections(alreadyDumped: NodeMaterialBlock[]): string;
    protected _dumpPropertiesCode(): string;
    /**
     * Serializes this block in a JSON representation
     * @returns the serialized block object
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
 * Register side effects for materialsNodeBlocksTeleportTeleportOutBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterMaterialsNodeBlocksTeleportTeleportOutBlock(): void;
