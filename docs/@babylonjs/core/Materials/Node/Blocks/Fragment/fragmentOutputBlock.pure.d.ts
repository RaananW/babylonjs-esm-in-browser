/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { type Scene } from "../../../../scene.pure.js";
import { type NodeMaterialDefines, type NodeMaterial } from "../../nodeMaterial.pure.js";
import { type Effect } from "../../../effect.pure.js";
import { type Mesh } from "../../../../Meshes/mesh.pure.js";
/**
 * Color spaces supported by the fragment output block
 */
export declare enum FragmentOutputBlockColorSpace {
    /** Unspecified */
    NoColorSpace = 0,
    /** Gamma */
    Gamma = 1,
    /** Linear */
    Linear = 2
}
/**
 * Block used to output the final color
 */
export declare class FragmentOutputBlock extends NodeMaterialBlock {
    private _linearDefineName;
    private _gammaDefineName;
    private _additionalColorDefineName;
    protected _outputString: string;
    /**
     * Create a new FragmentOutputBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /** Gets or sets a boolean indicating if content needs to be converted to gamma space */
    convertToGammaSpace: boolean;
    /** Gets or sets a boolean indicating if content needs to be converted to linear space */
    convertToLinearSpace: boolean;
    /** Gets or sets a boolean indicating if logarithmic depth should be used */
    useLogarithmicDepth: boolean;
    /**
     * Gets or sets the color space used for the block
     */
    get colorSpace(): FragmentOutputBlockColorSpace;
    set colorSpace(value: FragmentOutputBlockColorSpace);
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
     * Gets the rgba input component
     */
    get rgba(): NodeMaterialConnectionPoint;
    /**
     * Gets the rgb input component
     */
    get rgb(): NodeMaterialConnectionPoint;
    /**
     * Gets the a input component
     */
    get a(): NodeMaterialConnectionPoint;
    /**
     * Gets the additionalColor input component (named glow in the UI for now)
     */
    get additionalColor(): NodeMaterialConnectionPoint;
    /**
     * Gets the glow input component
     */
    get glow(): NodeMaterialConnectionPoint;
    protected _getOutputString(state: NodeMaterialBuildState): string;
    /**
     * Prepare the list of defines
     * @param defines - the material defines
     * @param nodeMaterial - the node material
     */
    prepareDefines(defines: NodeMaterialDefines, nodeMaterial: NodeMaterial): void;
    /**
     * Bind data to effect
     * @param effect - the effect to bind to
     * @param nodeMaterial - the node material
     * @param mesh - the mesh to bind for
     */
    bind(effect: Effect, nodeMaterial: NodeMaterial, mesh?: Mesh): void;
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
 * Register side effects for fragmentOutputBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFragmentOutputBlock(): void;
