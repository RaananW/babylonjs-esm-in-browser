/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
/**
 * Block used to replace a color by another one
 */
export declare class ReplaceColorBlock extends NodeMaterialBlock {
    /**
     * Creates a new ReplaceColorBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the value input component
     */
    get value(): NodeMaterialConnectionPoint;
    /**
     * Gets the reference input component
     */
    get reference(): NodeMaterialConnectionPoint;
    /**
     * Gets the distance input component
     */
    get distance(): NodeMaterialConnectionPoint;
    /**
     * Gets the replacement input component
     */
    get replacement(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
/**
 * Register side effects for replaceColorBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterReplaceColorBlock(): void;
