/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { type Scene } from "../../../../scene.pure.js";
/**
 * Block used to convert a height vector to a normal
 */
export declare class HeightToNormalBlock extends NodeMaterialBlock {
    /**
     * Creates a new HeightToNormalBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Defines if the output should be generated in world or tangent space.
     * Note that in tangent space the result is also scaled by 0.5 and offsetted by 0.5 so that it can directly be used as a PerturbNormal.normalMapColor input
     */
    generateInWorldSpace: boolean;
    /**
     * Defines that the worldNormal input will be normalized by the HeightToNormal block before being used
     */
    automaticNormalizationNormal: boolean;
    /**
     * Defines that the worldTangent input will be normalized by the HeightToNormal block before being used
     */
    automaticNormalizationTangent: boolean;
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
     * Gets the position component
     */
    get worldPosition(): NodeMaterialConnectionPoint;
    /**
     * Gets the normal component
     */
    get worldNormal(): NodeMaterialConnectionPoint;
    /**
     * Gets the tangent component
     */
    get worldTangent(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    /**
     * Gets the xyz component
     */
    get xyz(): NodeMaterialConnectionPoint;
    protected _buildBlock(state: NodeMaterialBuildState): this;
    protected _dumpPropertiesCode(): string;
    /**
     * Serializes the block
     * @returns the serialized object
     */
    serialize(): any;
    /**
     * Deserializes the block
     * @param serializationObject - the serialization object
     * @param scene - the scene
     * @param rootUrl - the root url
     */
    _deserialize(serializationObject: any, scene: Scene, rootUrl: string): void;
}
/**
 * Register side effects for heightToNormalBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterHeightToNormalBlock(): void;
