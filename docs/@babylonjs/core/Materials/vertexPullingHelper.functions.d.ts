import { type Effect } from "./effect.js";
import { type Nullable } from "../types.js";
import { type Geometry } from "../Meshes/geometry.js";
/**
 * Interface representing metadata for vertex pulling
 */
export interface IVertexPullingMetadata {
    /**
     * Offset in vertex buffer where data starts
     */
    offset: number;
    /**
     * Stride between elements in the vertex buffer
     */
    stride: number;
    /**
     * Type of the vertex buffer (e.g., float, int)
     */
    type: number;
    /**
     * Whether integer data should be normalized when read
     */
    normalized: boolean;
}
/**
 * Prepares vertex pulling uniforms for the given attributes and mesh
 * @param geometry The geometry containing the vertex buffers
 * @returns A map of attribute names to their metadata, or null if unavailable
 */
export declare function PrepareVertexPullingUniforms(geometry: Geometry): Nullable<Map<string, IVertexPullingMetadata>>;
/**
 * Bind vertex pulling uniforms to the effect
 * @param effect The effect to bind the uniforms to
 * @param metadata The vertex pulling metadata
 */
export declare function BindVertexPullingUniforms(effect: Effect, metadata: Map<string, IVertexPullingMetadata>): void;
