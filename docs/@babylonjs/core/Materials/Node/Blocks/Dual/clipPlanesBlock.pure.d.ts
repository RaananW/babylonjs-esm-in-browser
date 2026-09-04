/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { type Effect } from "../../../effect.pure.js";
import { type NodeMaterial, type NodeMaterialDefines } from "../../nodeMaterial.pure.js";
import { type Mesh } from "../../../../Meshes/mesh.pure.js";
import { type AbstractMesh } from "../../../../Meshes/abstractMesh.pure.js";
/**
 * Block used to implement clip planes
 */
export declare class ClipPlanesBlock extends NodeMaterialBlock {
    /**
     * Create a new ClipPlanesBlock
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
     * Gets the worldPosition input component
     */
    get worldPosition(): NodeMaterialConnectionPoint;
    /** {@inheritDoc} */
    get target(): NodeMaterialBlockTargets;
    /** {@inheritDoc} */
    set target(value: NodeMaterialBlockTargets);
    /**
     * Prepares the shader defines related to clip planes for the given mesh
     * @param defines - the material defines
     * @param nodeMaterial - the node material
     * @param mesh - the mesh to prepare for
     */
    prepareDefines(defines: NodeMaterialDefines, nodeMaterial: NodeMaterial, mesh?: AbstractMesh): void;
    /**
     * Bind data to effect
     * @param effect - the effect to bind to
     * @param nodeMaterial - the node material
     * @param mesh - the mesh to bind for
     */
    bind(effect: Effect, nodeMaterial: NodeMaterial, mesh?: Mesh): void;
    protected _buildBlock(state: NodeMaterialBuildState): this | undefined;
}
/**
 * Register side effects for clipPlanesBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterClipPlanesBlock(): void;
