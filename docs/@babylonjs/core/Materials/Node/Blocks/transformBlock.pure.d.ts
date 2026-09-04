/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
import { type Scene } from "../../../scene.pure.js";
import { type AbstractMesh } from "../../../Meshes/abstractMesh.pure.js";
import { type NodeMaterial, type NodeMaterialDefines } from "../nodeMaterial.pure.js";
/**
 * Block used to transform a vector (2, 3 or 4) with a matrix. It will generate a Vector4
 */
export declare class TransformBlock extends NodeMaterialBlock {
    /**
     * Defines the value to use to complement W value to transform it to a Vector4
     */
    complementW: number;
    /**
     * Defines the value to use to complement z value to transform it to a Vector4
     */
    complementZ: number;
    /**
     * Boolean indicating if the transformation is made for a direction vector and not a position vector
     * If set to true the complementW value will be set to 0 else it will be set to 1
     */
    get transformAsDirection(): boolean;
    set transformAsDirection(value: boolean);
    /**
     * Creates a new TransformBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
     */
    initialize(state: NodeMaterialBuildState): void;
    private _initShaderSourceAsync;
    /**
     * Gets the vector input
     */
    get vector(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    /**
     * Gets the xyz output component
     */
    get xyz(): NodeMaterialConnectionPoint;
    /**
     * Gets the matrix transform input
     */
    get transform(): NodeMaterialConnectionPoint;
    protected _buildBlock(state: NodeMaterialBuildState): this;
    /**
     * Update defines for shader compilation
     * @param defines defines the material defines to update
     * @param nodeMaterial defines the node material requesting the update
     * @param mesh defines the mesh to be rendered
     */
    prepareDefines(defines: NodeMaterialDefines, nodeMaterial: NodeMaterial, mesh?: AbstractMesh): void;
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
    protected _dumpPropertiesCode(): string;
}
/**
 * Register side effects for transformBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterTransformBlock(): void;
