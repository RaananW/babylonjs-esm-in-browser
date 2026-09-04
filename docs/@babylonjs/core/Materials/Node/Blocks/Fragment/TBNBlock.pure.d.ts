/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { type NodeMaterial, type NodeMaterialDefines } from "../../nodeMaterial.pure.js";
import { type AbstractMesh } from "../../../../Meshes/abstractMesh.pure.js";
/**
 * Block used to implement TBN matrix
 */
export declare class TBNBlock extends NodeMaterialBlock {
    /**
     * Create a new TBNBlock
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
    /**
     * Gets the normal input component
     */
    get normal(): NodeMaterialConnectionPoint;
    /**
     * Gets the tangent input component
     */
    get tangent(): NodeMaterialConnectionPoint;
    /**
     * Gets the world matrix input component
     */
    get world(): NodeMaterialConnectionPoint;
    /**
     * Gets the TBN output component
     */
    get TBN(): NodeMaterialConnectionPoint;
    /**
     * Gets the row0 of the output matrix
     */
    get row0(): NodeMaterialConnectionPoint;
    /**
     * Gets the row1 of the output matrix
     */
    get row1(): NodeMaterialConnectionPoint;
    /**
     * Gets the row2 of the output matrix
     */
    get row2(): NodeMaterialConnectionPoint;
    /**
     * Gets the block target
     */
    get target(): NodeMaterialBlockTargets;
    /**
     * Sets the block target
     */
    set target(value: NodeMaterialBlockTargets);
    /**
     * Auto configure the block based on the material
     * @param material - defines the hosting NodeMaterial
     * @param additionalFilteringInfo - defines additional filtering info
     */
    autoConfigure(material: NodeMaterial, additionalFilteringInfo?: (node: NodeMaterialBlock) => boolean): void;
    /**
     * Prepare the list of defines
     * @param defines - defines the list of defines to update
     * @param nodeMaterial - defines the node material requesting the update
     * @param mesh - defines the mesh to bind data for
     */
    prepareDefines(defines: NodeMaterialDefines, nodeMaterial: NodeMaterial, mesh?: AbstractMesh): void;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
/**
 * Register side effects for tBNBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterTBNBlock(): void;
