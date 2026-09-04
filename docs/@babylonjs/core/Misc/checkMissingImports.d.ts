/**
 * Diagnostic utility that checks all known side-effect stubs and reports which ones
 * have NOT been registered. Call this at application startup (after all your imports)
 * to discover ALL missing imports at once, instead of hitting them one at a time at runtime.
 *
 * This function is in a standalone module — it adds zero overhead to your bundle unless
 * you explicitly import it. Intended for development use only.
 *
 * @returns An array of module names that need to be imported. Empty if everything is registered.
 *
 * @example
 * ```typescript
 * import { CheckMissingImports } from "@babylonjs/core/Misc/checkMissingImports.js";
 *
 * const missing = CheckMissingImports();
 * // Console output: "[Babylon.js] The following side-effect modules have not been imported: ..."
 * ```
 */
export declare function CheckMissingImports(): string[];
