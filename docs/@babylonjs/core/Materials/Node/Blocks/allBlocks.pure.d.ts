/**
 * Registers all vertex shader node material blocks for deserialization.
 * Call this if you only need vertex blocks to be deserializable.
 */
export declare function RegisterNodeMaterialVertexBlocks(): void;
/**
 * Registers all fragment shader node material blocks for deserialization.
 * Call this if you only need fragment blocks to be deserializable.
 */
export declare function RegisterNodeMaterialFragmentBlocks(): void;
/**
 * Registers all dual (vertex + fragment) node material blocks for deserialization.
 * Call this if you only need dual blocks to be deserializable.
 */
export declare function RegisterNodeMaterialDualBlocks(): void;
/**
 * Registers all input node material blocks for deserialization.
 * Call this if you only need input blocks to be deserializable.
 */
export declare function RegisterNodeMaterialInputBlocks(): void;
/**
 * Registers all teleport node material blocks for deserialization.
 * Call this if you only need teleport blocks to be deserializable.
 */
export declare function RegisterNodeMaterialTeleportBlocks(): void;
/**
 * Registers all PBR node material blocks for deserialization.
 * Call this if you only need PBR blocks to be deserializable.
 */
export declare function RegisterNodeMaterialPBRBlocks(): void;
/**
 * Registers all particle node material blocks for deserialization.
 * Call this if you only need particle blocks to be deserializable.
 */
export declare function RegisterNodeMaterialParticleBlocks(): void;
/**
 * Registers all Gaussian splatting node material blocks for deserialization.
 * Call this if you only need Gaussian splatting blocks to be deserializable.
 */
export declare function RegisterNodeMaterialGaussianSplattingBlocks(): void;
/**
 * Registers all root-level (math/utility) node material blocks for deserialization.
 * Call this if you only need math and utility blocks to be deserializable.
 */
export declare function RegisterNodeMaterialMathBlocks(): void;
/**
 * Registers all node material blocks for deserialization.
 * Call this function when you need to deserialize node materials from JSON/snippets
 * and cannot know at build time which blocks will be used.
 *
 * This is the tree-shakeable replacement for:
 * ```ts
 * import "@babylonjs/core/Materials/Node/Blocks/index.js";
 * ```
 *
 * For granular control, use per-category functions instead:
 * - {@link RegisterNodeMaterialVertexBlocks}
 * - {@link RegisterNodeMaterialFragmentBlocks}
 * - {@link RegisterNodeMaterialDualBlocks}
 * - {@link RegisterNodeMaterialInputBlocks}
 * - {@link RegisterNodeMaterialTeleportBlocks}
 * - {@link RegisterNodeMaterialPBRBlocks}
 * - {@link RegisterNodeMaterialParticleBlocks}
 * - {@link RegisterNodeMaterialGaussianSplattingBlocks}
 * - {@link RegisterNodeMaterialMathBlocks}
 */
export declare function RegisterAllNodeMaterialBlocks(): void;
