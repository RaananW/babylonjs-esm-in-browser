/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
/**
 * Block used for the particle ramp gradient section
 */
export declare class ParticleRampGradientBlock extends NodeMaterialBlock {
    /**
     * Create a new ParticleRampGradientBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the color input component
     */
    get color(): NodeMaterialConnectionPoint;
    /**
     * Gets the rampColor output component
     */
    get rampColor(): NodeMaterialConnectionPoint;
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
     */
    initialize(state: NodeMaterialBuildState): void;
    protected _buildBlock(state: NodeMaterialBuildState): this | undefined;
}
/**
 * Register side effects for particleRampGradientBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterParticleRampGradientBlock(): void;
