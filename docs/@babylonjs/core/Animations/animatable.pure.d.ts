/** This file must only contain pure code and pure imports */
export * from "./animatable.core.js";
/**
 * Register side effects for animatable.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterAnimatable(): void;
