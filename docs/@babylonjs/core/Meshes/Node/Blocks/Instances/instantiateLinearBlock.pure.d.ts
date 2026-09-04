/** This file must only contain pure code and pure imports */
import { type NodeGeometryConnectionPoint } from "../../nodeGeometryBlockConnectionPoint.js";
import { type NodeGeometryBuildState } from "../../nodeGeometryBuildState.js";
import { InstantiateBaseBlock } from "./instantiateBaseBlock.js";
/**
 * Block used to clone geometry along a line
 */
export declare class InstantiateLinearBlock extends InstantiateBaseBlock {
    /**
     * Create a new Instantiate Linear Block
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the direction input component
     */
    get direction(): NodeGeometryConnectionPoint;
    /**
     * Gets the rotation input component
     */
    get rotation(): NodeGeometryConnectionPoint;
    /**
     * Gets the scaling input component
     */
    get scaling(): NodeGeometryConnectionPoint;
    protected _buildBlock(state: NodeGeometryBuildState): void;
}
/**
 * Register side effects for instantiateLinearBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterInstantiateLinearBlock(): void;
