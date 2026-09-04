/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
/**
 * Block used to build a matrix from 4 Vector4
 */
export declare class MatrixBuilderBlock extends NodeMaterialBlock {
    /**
     * Creates a new MatrixBuilder
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the row0 vector
     */
    get row0(): NodeMaterialConnectionPoint;
    /**
     * Gets the row1 vector
     */
    get row1(): NodeMaterialConnectionPoint;
    /**
     * Gets the row2 vector
     */
    get row2(): NodeMaterialConnectionPoint;
    /**
     * Gets the row3 vector
     */
    get row3(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    /** Auto configure the block based on the material */
    autoConfigure(): void;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
/**
 * Register side effects for matrixBuilderBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterMatrixBuilderBlock(): void;
