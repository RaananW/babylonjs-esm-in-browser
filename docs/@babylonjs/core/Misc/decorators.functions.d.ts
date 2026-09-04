/**
 * Internal helpers for reading and writing decorator metadata used by serialization.
 *
 * The serialization store is attached to each class constructor via `Symbol.metadata`. The polyfill
 * required for `Symbol.metadata` lives in `symbolMetadataPolyfill.ts` and is applied at package
 * entry points.
 */
import { type SerializedPropertyMetadataMap } from "./decorators.serializationUtilities.js";
/**
 * The well-known `Symbol.metadata` symbol, resolved once at module-evaluation time.
 *
 * Reading (and thereby resolving) this symbol at module load guarantees that `Symbol.metadata`
 * exists BEFORE any decorated class which imports the decorator infrastructure evaluates its class
 * body. TypeScript's TC39 decorator emit captures `context.metadata` from `Symbol.metadata` at the
 * top of the class `static {}` block (before the decorator factory runs), so if the symbol is not
 * yet installed the metadata object is `void 0` and every metadata-based decorator throws.
 *
 * It is intentionally an exported `const` initialized from a function call: bundlers that treat this
 * module as side-effect-free may drop bare top-level calls, but they cannot drop a `const` whose
 * value is referenced by the retained decorator helpers below. The tree-shaking side-effect detector
 * likewise skips `const X = ...` initializers, so this module stays classified as pure and remains
 * importable from `.pure` modules.
 * @internal
 */
export declare const MetadataSymbol: symbol;
/**
 * Returns (creating if necessary) the serialization store owned by the provided decorator metadata.
 * Used by the TC39 decorators, which receive `context.metadata` directly.
 * @internal
 */
export declare function GetDirectStoreFromMetadata(metadata: DecoratorMetadataObject): SerializedPropertyMetadataMap;
/** @internal */
export declare function GetDirectStore(target: any): SerializedPropertyMetadataMap;
/**
 * @returns the list of properties flagged as serializable
 * @param target host object
 */
export declare function GetMergedStore(target: any): SerializedPropertyMetadataMap;
