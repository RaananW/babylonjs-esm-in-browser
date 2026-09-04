/**
 * Tiered engine extension registration helpers for the WebGL2 engine.
 *
 * These helpers let tree-shaking users register only the engine extensions
 * they need, in three tiers: Core, Standard, and Full. Each tier includes
 * the one below it. All individual Register functions are idempotent, so
 * calling a higher tier after a lower one is safe.
 *
 * NOTE: This file is `.pure.ts` (not a plain `.ts`) even though it has no
 * side effects. This is intentional — the pure barrel generator's orphan
 * scan only discovers `.pure.ts` files that aren't exported from an
 * `index.ts`. Since these registration helpers are standalone utilities
 * not exported from any `index.ts`, the `.pure.ts` suffix ensures they
 * appear in the `pure.ts` barrel automatically. See
 * `scripts/treeshaking/generatePureBarrels.mjs` for details.
 */
/**
 * Registers the minimum set of engine extensions required for basic rendering.
 * Includes: DOM binding, render passes, GPU states, and stencil.
 */
export declare function RegisterCoreEngineExtensions(): void;
/**
 * Registers the standard set of engine extensions needed by most scenes.
 * Includes everything in {@link RegisterCoreEngineExtensions} plus textures,
 * file loading, alpha blending, render targets, and uniform buffers.
 */
export declare function RegisterStandardEngineExtensions(): void;
/**
 * Registers all available engine extensions for the WebGL2 engine.
 * Includes everything in {@link RegisterStandardEngineExtensions} plus
 * cube textures, raw textures, dynamic textures, multi-render, multiview,
 * queries, compute shaders, video textures, debugging, and more.
 */
export declare function RegisterFullEngineExtensions(): void;
