import { type FBXNode } from "../types/fbxTypes.js";
/** A named UV set */
export interface FBXUVSet {
    /** UV set name (e.g. "UVMap", "lightmap") */
    name: string;
    /** Per-vertex UV data [u,v, ...] (expanded to match triangle vertices) */
    data: Float64Array;
}
/** Recoverable geometry import issue. */
export interface FBXGeometryDiagnostic {
    /** Diagnostic category. */
    type: "degenerate-polygon" | "triangulation-fallback" | "layer-index-out-of-bounds" | "layer-data-too-short";
    /** Human-readable diagnostic message. */
    message: string;
    /** Polygon index associated with the diagnostic, if applicable. */
    polygonIndex?: number;
    /** Layer element name associated with the diagnostic, if applicable. */
    layerName?: string;
    /** Source data index associated with the diagnostic, if applicable. */
    index?: number;
}
/** Parsed geometry data ready for Babylon consumption */
export interface FBXGeometryData {
    /** Node ID from the FBX document */
    id: number;
    /** Geometry name */
    name: string;
    /** Flat array of vertex positions [x,y,z, x,y,z, ...] */
    positions: Float64Array;
    /** Triangle indices (already triangulated from n-gons) */
    indices: Uint32Array;
    /** Per-vertex normals [x,y,z, ...] (expanded to match triangle vertices) */
    normals: Float64Array | null;
    /** Per-vertex UVs [u,v, ...] (expanded to match triangle vertices) — first UV set for convenience */
    uvs: Float64Array | null;
    /** All UV sets (including the first) */
    uvSets: FBXUVSet[];
    /** Per-vertex colors [r,g,b,a, ...] (expanded to match triangle vertices) */
    colors: Float32Array | null;
    /** Per-vertex tangents [x,y,z,w, ...] expanded to match triangle vertices */
    tangents: Float64Array | null;
    /** Per-vertex binormals [x,y,z, ...] expanded to match triangle vertices */
    binormals: Float64Array | null;
    /** Control point index for each polygon-vertex (for skinning lookup) */
    controlPointIndices: Uint32Array | null;
    /** Per-triangle material index (which material each triangle belongs to) */
    materialIndices: Int32Array | null;
    /** Recoverable geometry import issues */
    diagnostics: FBXGeometryDiagnostic[];
}
/**
 * Extract geometry data from an FBX Geometry node.
 * Handles polygon triangulation and layer element expansion.
 */
export declare function extractGeometry(geometryNode: FBXNode, nodeId: number): FBXGeometryData;
