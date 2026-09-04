/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../nodeGeometryBlockConnectionPoint.js";
import { type NodeGeometryBuildState } from "../nodeGeometryBuildState.js";
import { type VertexData } from "../../mesh.vertexData.js";
import { type Nullable } from "../../../types.js";
/**
 * Block used to generate the final geometry
 */
export declare class GeometryOutputBlock extends NodeGeometryBlock {
    private _vertexData;
    /**
     * Gets the current vertex data if the graph was successfully built
     */
    get currentVertexData(): Nullable<VertexData>;
    /**
     * Create a new GeometryOutputBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the geometry input component
     */
    get geometry(): NodeGeometryConnectionPoint;
    protected _buildBlock(state: NodeGeometryBuildState): void;
}
/**
 * Register side effects for geometryOutputBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGeometryOutputBlock(): void;
