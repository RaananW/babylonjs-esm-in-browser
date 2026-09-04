/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { type Effect } from "../../../effect.pure.js";
/**
 * Block used to get the screen sizes
 */
export declare class ScreenSizeBlock extends NodeMaterialBlock {
    private _varName;
    private _scene;
    /**
     * Name of the variable in the shader that holds the screen size
     */
    get associatedVariableName(): string;
    /**
     * Creates a new ScreenSizeBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the xy component
     */
    get xy(): NodeMaterialConnectionPoint;
    /**
     * Gets the x component
     */
    get x(): NodeMaterialConnectionPoint;
    /**
     * Gets the y component
     */
    get y(): NodeMaterialConnectionPoint;
    /**
     * Bind data to effect
     * @param effect - defines the effect to bind data to
     */
    bind(effect: Effect): void;
    protected writeOutputs(state: NodeMaterialBuildState, varName: string): string;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
/**
 * Register side effects for screenSizeBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterScreenSizeBlock(): void;
