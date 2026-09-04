/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import cannonJSPlugin.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./cannonJSPlugin.pure.js";
import { RegisterCannonJSPlugin } from "./cannonJSPlugin.pure.js";
RegisterCannonJSPlugin();
//# sourceMappingURL=cannonJSPlugin.js.map