/** This file must only contain pure code and pure imports */
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { type NodeMaterial } from "../../nodeMaterial.pure.js";
import { ReflectionTextureBaseBlock } from "./reflectionTextureBaseBlock.pure.js";
import { type NodeMaterialBlock } from "../../nodeMaterialBlock.js";
/**
 * Block used to read a reflection texture from a sampler
 */
export declare class ReflectionTextureBlock extends ReflectionTextureBaseBlock {
    protected _onGenerateOnlyFragmentCodeChanged(): boolean;
    protected _setTarget(): void;
    /**
     * Create a new ReflectionTextureBlock
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
    get position(): NodeMaterialConnectionPoint;
    /**
     * Gets the world position input component
     */
    get worldPosition(): NodeMaterialConnectionPoint;
    /**
     * Gets the world normal input component
     */
    get worldNormal(): NodeMaterialConnectionPoint;
    /**
     * Gets the world input component
     */
    get world(): NodeMaterialConnectionPoint;
    /**
     * Gets the camera (or eye) position component
     */
    get cameraPosition(): NodeMaterialConnectionPoint;
    /**
     * Gets the view input component
     */
    get view(): NodeMaterialConnectionPoint;
    /**
     * Gets the rgb output component
     */
    get rgb(): NodeMaterialConnectionPoint;
    /**
     * Gets the rgba output component
     */
    get rgba(): NodeMaterialConnectionPoint;
    /**
     * Gets the r output component
     */
    get r(): NodeMaterialConnectionPoint;
    /**
     * Gets the g output component
     */
    get g(): NodeMaterialConnectionPoint;
    /**
     * Gets the b output component
     */
    get b(): NodeMaterialConnectionPoint;
    /**
     * Gets the a output component
     */
    get a(): NodeMaterialConnectionPoint;
    /**
     * Auto configure the block based on the material
     * @param material - the node material
     * @param additionalFilteringInfo - optional filtering info
     */
    autoConfigure(material: NodeMaterial, additionalFilteringInfo?: (node: NodeMaterialBlock) => boolean): void;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
/**
 * Register side effects for reflectionTextureBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterReflectionTextureBlock(): void;
