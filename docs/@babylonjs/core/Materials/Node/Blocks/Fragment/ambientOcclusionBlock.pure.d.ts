/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { type Effect } from "../../../effect.pure.js";
/**
 * Block used to evaluate screen spaceambient occlusion in a shader
 */
export declare class AmbientOcclusionBlock extends NodeMaterialBlock {
    private _randomTexture;
    private _randomSamplerName;
    /**
     * Defines the radius around the analyzed pixel used by the SSAO post-process
     */
    radius: number;
    /**
     * Related to fallOff, used to interpolate SSAO samples (first interpolate function input) based on the occlusion difference of each pixel
     * Must not be equal to fallOff and superior to fallOff.
     */
    area: number;
    /**
     * Related to area, used to interpolate SSAO samples (second interpolate function input) based on the occlusion difference of each pixel
     * Must not be equal to area and inferior to area.
     */
    fallOff: number;
    /**
     * Create a new AmbientOcclusionBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the source component
     */
    get source(): NodeMaterialConnectionPoint;
    /**
     * Gets the screenSize component
     */
    get screenSize(): NodeMaterialConnectionPoint;
    /**
     * Gets the occlusion output
     */
    get occlusion(): NodeMaterialConnectionPoint;
    /**
     * Bind data to effect
     * @param effect - the effect to bind to
     */
    bind(effect: Effect): void;
    private _createRandomTexture;
    protected _buildBlock(state: NodeMaterialBuildState): this;
    /**
     * Releases the resources held by the block
     */
    dispose(): void;
}
/**
 * Register side effects for ambientOcclusionBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterAmbientOcclusionBlock(): void;
