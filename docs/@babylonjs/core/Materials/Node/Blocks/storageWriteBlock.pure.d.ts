/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
/**
 * Block used to write to a variable within a loop
 */
export declare class StorageWriteBlock extends NodeMaterialBlock {
    /**
     * Creates a new StorageWriteBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the loop link component
     */
    get loopID(): NodeMaterialConnectionPoint;
    /**
     * Gets the value component
     */
    get value(): NodeMaterialConnectionPoint;
    /** Gets a boolean indicating that this connection will be used in the fragment shader
     * @returns true if connected in fragment shader
     */
    isConnectedInFragmentShader(): boolean;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
/**
 * Register side effects for storageWriteBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterStorageWriteBlock(): void;
