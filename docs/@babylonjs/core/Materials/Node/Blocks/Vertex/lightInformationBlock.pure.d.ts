/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { type Nullable } from "../../../../types.js";
import { type Scene } from "../../../../scene.pure.js";
import { type Effect } from "../../../effect.pure.js";
import { type NodeMaterial, type NodeMaterialDefines } from "../../nodeMaterial.pure.js";
import { type Mesh } from "../../../../Meshes/mesh.pure.js";
import { type Light } from "../../../../Lights/light.js";
/**
 * Block used to get data information from a light
 */
export declare class LightInformationBlock extends NodeMaterialBlock {
    private _lightDataUniformName;
    private _lightColorUniformName;
    private _lightShadowUniformName;
    private _lightShadowExtraUniformName;
    private _lightTypeDefineName;
    private _forcePrepareDefines;
    /**
     * Gets or sets the light associated with this block
     */
    light: Nullable<Light>;
    /**
     * Creates a new LightInformationBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the world position input component
     */
    get worldPosition(): NodeMaterialConnectionPoint;
    /**
     * Gets the direction output component
     */
    get direction(): NodeMaterialConnectionPoint;
    /**
     * Gets the direction output component
     */
    get color(): NodeMaterialConnectionPoint;
    /**
     * Gets the direction output component
     */
    get intensity(): NodeMaterialConnectionPoint;
    /**
     * Gets the shadow bias output component
     */
    get shadowBias(): NodeMaterialConnectionPoint;
    /**
     * Gets the shadow normal bias output component
     */
    get shadowNormalBias(): NodeMaterialConnectionPoint;
    /**
     * Gets the shadow depth scale component
     */
    get shadowDepthScale(): NodeMaterialConnectionPoint;
    /**
     * Gets the shadow depth range component
     */
    get shadowDepthRange(): NodeMaterialConnectionPoint;
    /**
     * Bind data to effect
     * @param effect - the effect to bind to
     * @param nodeMaterial - the node material
     * @param mesh - the mesh
     */
    bind(effect: Effect, nodeMaterial: NodeMaterial, mesh?: Mesh): void;
    /**
     * Prepare the list of defines
     * @param defines - the list of defines
     */
    prepareDefines(defines: NodeMaterialDefines): void;
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
}
/**
 * Register side effects for lightInformationBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterLightInformationBlock(): void;
