import { type DrawWrapper } from "./drawWrapper.js";
import { type Effect } from "./effect.js";
/**
 * Detect if the effect is a DrawWrapper
 * @param effect defines the entity to test
 * @returns if the entity is a DrawWrapper
 */
export declare function IsWrapper(effect: Effect | DrawWrapper): effect is DrawWrapper;
