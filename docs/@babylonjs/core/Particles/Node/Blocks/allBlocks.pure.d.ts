/**
 * Registers all condition node particle blocks for deserialization.
 */
export declare function RegisterNodeParticleConditionsBlocks(): void;
/**
 * Registers all emitter node particle blocks for deserialization.
 */
export declare function RegisterNodeParticleEmittersBlocks(): void;
/**
 * Registers all teleport node particle blocks for deserialization.
 */
export declare function RegisterNodeParticleTeleportBlocks(): void;
/**
 * Registers all trigger node particle blocks for deserialization.
 */
export declare function RegisterNodeParticleTriggersBlocks(): void;
/**
 * Registers all update node particle blocks for deserialization.
 */
export declare function RegisterNodeParticleUpdateBlocks(): void;
/**
 * Registers all root-level (math/utility) node particle blocks for deserialization.
 */
export declare function RegisterNodeParticleMathBlocks(): void;
/**
 * Registers all node particle blocks for deserialization.
 * Call this function when you need to deserialize node particle systems from JSON/snippets.
 *
 * This is the tree-shakeable replacement for:
 * ```ts
 * import "@babylonjs/core/Particles/Node/Blocks/index.js";
 * ```
 */
export declare function RegisterAllNodeParticleBlocks(): void;
