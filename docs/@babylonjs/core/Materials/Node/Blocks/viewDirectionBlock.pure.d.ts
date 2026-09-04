/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
import { type NodeMaterial } from "../nodeMaterial.pure.js";
/**
 * Block used to get the view direction
 */
export declare class ViewDirectionBlock extends NodeMaterialBlock {
    /**
     * Creates a new ViewDirectionBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the world position component
     */
    get worldPosition(): NodeMaterialConnectionPoint;
    /**
     * Gets the camera position component
     */
    get cameraPosition(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    /**
     * Auto configure the block based on the material
     * @param material - the node material
     * @param additionalFilteringInfo - additional filtering info
     */
    autoConfigure(material: NodeMaterial, additionalFilteringInfo?: (node: NodeMaterialBlock) => boolean): void;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
/**
 * Register side effects for viewDirectionBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterViewDirectionBlock(): void;
