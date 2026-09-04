/**
 * Registers all instance-related node geometry blocks for deserialization.
 */
export declare function RegisterNodeGeometryInstancesBlocks(): void;
/**
 * Registers all matrix-related node geometry blocks for deserialization.
 */
export declare function RegisterNodeGeometryMatricesBlocks(): void;
/**
 * Registers all set/modify node geometry blocks for deserialization.
 */
export declare function RegisterNodeGeometrySetBlocks(): void;
/**
 * Registers all source/primitive node geometry blocks for deserialization.
 */
export declare function RegisterNodeGeometrySourcesBlocks(): void;
/**
 * Registers all teleport node geometry blocks for deserialization.
 */
export declare function RegisterNodeGeometryTeleportBlocks(): void;
/**
 * Registers all texture node geometry blocks for deserialization.
 */
export declare function RegisterNodeGeometryTexturesBlocks(): void;
/**
 * Registers all root-level (math/utility/geometry) node geometry blocks for deserialization.
 */
export declare function RegisterNodeGeometryMathBlocks(): void;
/**
 * Registers all node geometry blocks for deserialization.
 * Call this function when you need to deserialize node geometry from JSON/snippets.
 *
 * This is the tree-shakeable replacement for:
 * ```ts
 * import "@babylonjs/core/Meshes/Node/Blocks/index.js";
 * ```
 */
export declare function RegisterAllNodeGeometryBlocks(): void;
