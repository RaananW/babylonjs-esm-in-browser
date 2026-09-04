/** This file must only contain pure code and pure imports */
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { type NodeMaterialTeleportOutBlock } from "./teleportOutBlock.pure.js";
/**
 * Defines a block used to teleport a value to an endpoint
 */
export declare class NodeMaterialTeleportInBlock extends NodeMaterialBlock {
    private _endpoints;
    /** Gets the list of attached endpoints */
    get endpoints(): NodeMaterialTeleportOutBlock[];
    /**
     * Gets or sets the target of the block
     */
    get target(): NodeMaterialBlockTargets;
    set target(value: NodeMaterialBlockTargets);
    /**
     * Create a new NodeMaterialTeleportInBlock
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
     * @returns a boolean indicating that this connection will be used in the fragment shader
     */
    isConnectedInFragmentShader(): boolean;
    /**
     * Checks if the input is connected to a uniform input block
     */
    get isConnectedToUniform(): boolean;
    /**
     * Dumps the code for the block
     * @param uniqueNames - the unique names
     * @param alreadyDumped - the already dumped blocks
     * @returns the code string
     */
    _dumpCode(uniqueNames: string[], alreadyDumped: NodeMaterialBlock[]): string;
    /**
     * Checks if the current block is an ancestor of a given block
     * @param block defines the potential descendant block to check
     * @returns true if block is a descendant
     */
    isAnAncestorOf(block: NodeMaterialBlock): boolean;
    /**
     * Add an enpoint to this block
     * @param endpoint define the endpoint to attach to
     */
    attachToEndpoint(endpoint: NodeMaterialTeleportOutBlock): void;
    /**
     * Remove enpoint from this block
     * @param endpoint define the endpoint to remove
     */
    detachFromEndpoint(endpoint: NodeMaterialTeleportOutBlock): void;
    /**
     * Release resources
     */
    dispose(): void;
}
/**
 * Register side effects for materialsNodeBlocksTeleportTeleportInBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterMaterialsNodeBlocksTeleportTeleportInBlock(): void;
