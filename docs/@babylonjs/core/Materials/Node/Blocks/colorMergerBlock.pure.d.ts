/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
import { type Scene } from "../../../scene.pure.js";
/**
 * Block used to create a Color3/4 out of individual inputs (one for each component)
 */
export declare class ColorMergerBlock extends NodeMaterialBlock {
    /**
     * Gets or sets the swizzle for r (meaning which component to affect to the output.r)
     */
    rSwizzle: "r" | "g" | "b" | "a";
    /**
     * Gets or sets the swizzle for g (meaning which component to affect to the output.g)
     */
    gSwizzle: "r" | "g" | "b" | "a";
    /**
     * Gets or sets the swizzle for b (meaning which component to affect to the output.b)
     */
    bSwizzle: "r" | "g" | "b" | "a";
    /**
     * Gets or sets the swizzle for a (meaning which component to affect to the output.a)
     */
    aSwizzle: "r" | "g" | "b" | "a";
    /**
     * Create a new ColorMergerBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the rgb component (input)
     */
    get rgbIn(): NodeMaterialConnectionPoint;
    /**
     * Gets the r component (input)
     */
    get r(): NodeMaterialConnectionPoint;
    /**
     * Gets the g component (input)
     */
    get g(): NodeMaterialConnectionPoint;
    /**
     * Gets the b component (input)
     */
    get b(): NodeMaterialConnectionPoint;
    /**
     * Gets the a component (input)
     */
    get a(): NodeMaterialConnectionPoint;
    /**
     * Gets the rgba component (output)
     */
    get rgba(): NodeMaterialConnectionPoint;
    /**
     * Gets the rgb component (output)
     */
    get rgbOut(): NodeMaterialConnectionPoint;
    /**
     * Gets the rgb component (output)
     * @deprecated Please use rgbOut instead.
     */
    get rgb(): NodeMaterialConnectionPoint;
    protected _inputRename(name: string): string;
    protected _outputRename(name: string): string;
    private _buildSwizzle;
    protected _buildBlock(state: NodeMaterialBuildState): this;
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
    protected _dumpPropertiesCode(): string;
}
/**
 * Register side effects for colorMergerBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterColorMergerBlock(): void;
