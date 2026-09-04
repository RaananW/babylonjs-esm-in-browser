import { type Nullable } from "../types.js";
import { type Animation } from "./animation.js";
/**
 * Interface containing an array of animations
 */
export interface IAnimatable {
    /**
     * Array of animations
     */
    animations: Nullable<Array<Animation>>;
}
