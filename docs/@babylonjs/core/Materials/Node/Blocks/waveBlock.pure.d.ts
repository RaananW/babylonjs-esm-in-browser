/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
import { type Scene } from "../../../scene.pure.js";
/**
 * Operations supported by the Wave block
 */
export declare enum WaveBlockKind {
    /** SawTooth */
    SawTooth = 0,
    /** Square */
    Square = 1,
    /** Triangle */
    Triangle = 2
}
/**
 * Block used to apply wave operation to floats
 */
export declare class WaveBlock extends NodeMaterialBlock {
    /**
     * Gets or sets the kibnd of wave to be applied by the block
     */
    kind: WaveBlockKind;
    /**
     * Creates a new WaveBlock
     * @param name defines the block name
     */
    constructor(name: string);
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
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    protected _buildBlock(state: NodeMaterialBuildState): this;
    /**
     * Serializes the block
     * @returns the serialized object
     */
    serialize(): any;
    /**
     * Deserializes the block from a serialization object
     * @param serializationObject - the object to deserialize from
     * @param scene - the current scene
     * @param rootUrl - the root URL for loading
     */
    _deserialize(serializationObject: any, scene: Scene, rootUrl: string): void;
}
/**
 * Register side effects for waveBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterWaveBlock(): void;
