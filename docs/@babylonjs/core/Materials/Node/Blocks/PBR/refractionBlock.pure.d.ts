/** This file must only contain pure code and pure imports */
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { type NodeMaterial, type NodeMaterialDefines } from "../../nodeMaterial.pure.js";
import { type Nullable } from "../../../../types.js";
import { type BaseTexture } from "../../../Textures/baseTexture.pure.js";
import { type Mesh } from "../../../../Meshes/mesh.pure.js";
import { type Effect } from "../../../effect.pure.js";
import { type Scene } from "../../../../scene.pure.js";
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
/**
 * Block used to implement the refraction part of the sub surface module of the PBR material
 */
export declare class RefractionBlock extends NodeMaterialBlock {
    /** @internal */
    _define3DName: string;
    /** @internal */
    _refractionMatrixName: string;
    /** @internal */
    _defineLODRefractionAlpha: string;
    /** @internal */
    _defineLinearSpecularRefraction: string;
    /** @internal */
    _defineOppositeZ: string;
    /** @internal */
    _cubeSamplerName: string;
    /** @internal */
    _2DSamplerName: string;
    /** @internal */
    _vRefractionMicrosurfaceInfosName: string;
    /** @internal */
    _vRefractionInfosName: string;
    /** @internal */
    _vRefractionFilteringInfoName: string;
    private _scene;
    /**
     * The properties below are set by the main PBR block prior to calling methods of this class.
     * This is to avoid having to add them as inputs here whereas they are already inputs of the main block, so already known.
     * It's less burden on the user side in the editor part.
     */
    /** @internal */
    viewConnectionPoint: NodeMaterialConnectionPoint;
    /** @internal */
    indexOfRefractionConnectionPoint: NodeMaterialConnectionPoint;
    /**
     * This parameters will make the material used its opacity to control how much it is refracting against not.
     * Materials half opaque for instance using refraction could benefit from this control.
     */
    linkRefractionWithTransparency: boolean;
    /**
     * Controls if refraction needs to be inverted on Y. This could be useful for procedural texture.
     */
    invertRefractionY: boolean;
    /**
     * Controls if refraction needs to be inverted on Y. This could be useful for procedural texture.
     */
    useThicknessAsDepth: boolean;
    /**
     * Gets or sets the texture associated with the node
     */
    texture: Nullable<BaseTexture>;
    /**
     * Create a new RefractionBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
     */
    initialize(state: NodeMaterialBuildState): void;
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the intensity input component
     */
    get intensity(): NodeMaterialConnectionPoint;
    /**
     * Gets the tint at distance input component
     */
    get tintAtDistance(): NodeMaterialConnectionPoint;
    /**
     * Gets the volume index of refraction input component
     */
    get volumeIndexOfRefraction(): NodeMaterialConnectionPoint;
    /**
     * Gets the view input component
     */
    get view(): NodeMaterialConnectionPoint;
    /**
     * Gets the refraction object output component
     */
    get refraction(): NodeMaterialConnectionPoint;
    /**
     * Returns true if the block has a texture
     */
    get hasTexture(): boolean;
    protected _getTexture(): Nullable<BaseTexture>;
    /**
     * Auto configure the block based on the material
     * @param material - the node material
     * @param additionalFilteringInfo - additional filtering info
     */
    autoConfigure(material: NodeMaterial, additionalFilteringInfo?: (node: NodeMaterialBlock) => boolean): void;
    /**
     * Prepare the list of defines
     * @param defines - the list of defines
     */
    prepareDefines(defines: NodeMaterialDefines): void;
    /**
     * Checks if the block is ready
     * @returns true if ready
     */
    isReady(): boolean;
    /**
     * Bind data to effect
     * @param effect - the effect to bind to
     * @param nodeMaterial - the node material
     * @param mesh - the mesh
     */
    bind(effect: Effect, nodeMaterial: NodeMaterial, mesh?: Mesh): void;
    /**
     * Gets the main code of the block (fragment side)
     * @param state current state of the node material building
     * @returns the shader code
     */
    getCode(state: NodeMaterialBuildState): string;
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
     * @param rootUrl - the root URL
     */
    _deserialize(serializationObject: any, scene: Scene, rootUrl: string): void;
}
/**
 * Register side effects for refractionBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterRefractionBlock(): void;
