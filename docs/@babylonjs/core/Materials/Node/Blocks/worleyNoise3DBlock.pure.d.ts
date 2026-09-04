/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
import { type Scene } from "../../../scene.pure.js";
/**
 * block used to Generate a Worley Noise 3D Noise Pattern
 */
/** Block used to generate Worley Noise 3D */
export declare class WorleyNoise3DBlock extends NodeMaterialBlock {
    /** Gets or sets a boolean indicating that normal should be inverted on X axis */
    manhattanDistance: boolean;
    /**
     * Creates a new WorleyNoise3DBlock
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
     * Gets the jitter input component
     */
    get jitter(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    /**
     * Gets the x component
     */
    get x(): NodeMaterialConnectionPoint;
    /**
     * Gets the y component
     */
    get y(): NodeMaterialConnectionPoint;
    protected _buildBlock(state: NodeMaterialBuildState): this | undefined;
    /**
     * Exposes the properties to the UI?
     * @returns - boolean indicating if the block has properties or not
     */
    protected _dumpPropertiesCode(): string;
    /**
     * Exposes the properties to the Serialize?
     * @returns - a serialized object
     */
    serialize(): any;
    /**
     * Exposes the properties to the deserialize?
     * @param serializationObject
     * @param scene
     * @param rootUrl
     */
    _deserialize(serializationObject: any, scene: Scene, rootUrl: string): void;
}
/**
 * Register side effects for worleyNoise3DBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterWorleyNoise3DBlock(): void;
