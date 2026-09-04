/**
 * Registers all layer node render graph blocks for deserialization.
 */
export declare function RegisterNodeRenderGraphLayersBlocks(): void;
/**
 * Registers all post-process node render graph blocks for deserialization.
 */
export declare function RegisterNodeRenderGraphPostProcessesBlocks(): void;
/**
 * Registers all rendering node render graph blocks for deserialization.
 */
export declare function RegisterNodeRenderGraphRenderingBlocks(): void;
/**
 * Registers all teleport node render graph blocks for deserialization.
 */
export declare function RegisterNodeRenderGraphTeleportBlocks(): void;
/**
 * Registers all texture node render graph blocks for deserialization.
 */
export declare function RegisterNodeRenderGraphTexturesBlocks(): void;
/**
 * Registers all core (root-level) node render graph blocks for deserialization.
 */
export declare function RegisterNodeRenderGraphCoreBlocks(): void;
/**
 * Registers all node render graph blocks for deserialization.
 * Call this function when you need to deserialize node render graphs from JSON/snippets.
 *
 * This is the tree-shakeable replacement for:
 * ```ts
 * import "@babylonjs/core/FrameGraph/Node/Blocks/index.js";
 * ```
 */
export declare function RegisterAllNodeRenderGraphBlocks(): void;
