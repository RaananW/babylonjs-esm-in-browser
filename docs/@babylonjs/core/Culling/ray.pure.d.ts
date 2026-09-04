/** This file must only contain pure code and pure imports */
export * from "./ray.core.js";
export {};
/**
 * Register side effects for ray.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterRay(): void;
