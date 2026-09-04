/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
import { type Scene } from "../../../scene.pure.js";
/**
 * block used to Generate Fractal Brownian Motion Clouds
 */
export declare class CloudBlock extends NodeMaterialBlock {
    /** Gets or sets the number of octaves */
    octaves: number;
    /**
     * Creates a new CloudBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the seed input component
     */
    get seed(): NodeMaterialConnectionPoint;
    /**
     * Gets the chaos input component
     */
    get chaos(): NodeMaterialConnectionPoint;
    /**
     * Gets the offset X input component
     */
    get offsetX(): NodeMaterialConnectionPoint;
    /**
     * Gets the offset Y input component
     */
    get offsetY(): NodeMaterialConnectionPoint;
    /**
     * Gets the offset Z input component
     */
    get offsetZ(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    protected _buildBlock(state: NodeMaterialBuildState): this | undefined;
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
     * @param rootUrl - the root URL
     */
    _deserialize(serializationObject: any, scene: Scene, rootUrl: string): void;
}
/**
 * Register side effects for cloudBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterCloudBlock(): void;
