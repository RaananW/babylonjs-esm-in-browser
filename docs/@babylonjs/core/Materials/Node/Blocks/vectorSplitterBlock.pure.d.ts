/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
/**
 * Block used to expand a Vector3/4 into 4 outputs (one for each component)
 */
export declare class VectorSplitterBlock extends NodeMaterialBlock {
    /**
     * Create a new VectorSplitterBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the xyzw component (input)
     */
    get xyzw(): NodeMaterialConnectionPoint;
    /**
     * Gets the xyz component (input)
     */
    get xyzIn(): NodeMaterialConnectionPoint;
    /**
     * Gets the xy component (input)
     */
    get xyIn(): NodeMaterialConnectionPoint;
    /**
     * Gets the xyz component (output)
     */
    get xyzOut(): NodeMaterialConnectionPoint;
    /**
     * Gets the xy component (output)
     */
    get xyOut(): NodeMaterialConnectionPoint;
    /**
     * Gets the zw component (output)
     */
    get zw(): NodeMaterialConnectionPoint;
    /**
     * Gets the x component (output)
     */
    get x(): NodeMaterialConnectionPoint;
    /**
     * Gets the y component (output)
     */
    get y(): NodeMaterialConnectionPoint;
    /**
     * Gets the z component (output)
     */
    get z(): NodeMaterialConnectionPoint;
    /**
     * Gets the w component (output)
     */
    get w(): NodeMaterialConnectionPoint;
    protected _inputRename(name: string): string;
    protected _outputRename(name: string): string;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
/**
 * Register side effects for vectorSplitterBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterVectorSplitterBlock(): void;
