/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../nodeGeometryBlockConnectionPoint.js";
/**
 * Block used to get information about a geometry
 */
export declare class GeometryInfoBlock extends NodeGeometryBlock {
    private _currentVertexData;
    /**
     * Create a new GeometryInfoBlock
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
    /**
     * Gets the geometry output component
     */
    get output(): NodeGeometryConnectionPoint;
    /**
     * Gets the id output component
     */
    get id(): NodeGeometryConnectionPoint;
    /**
     * Gets the collectionId output component
     */
    get collectionId(): NodeGeometryConnectionPoint;
    /**
     * Gets the verticesCount output component
     */
    get verticesCount(): NodeGeometryConnectionPoint;
    /**
     * Gets the facesCount output component
     */
    get facesCount(): NodeGeometryConnectionPoint;
    protected _buildBlock(): void;
}
/**
 * Register side effects for geometryInfoBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGeometryInfoBlock(): void;
