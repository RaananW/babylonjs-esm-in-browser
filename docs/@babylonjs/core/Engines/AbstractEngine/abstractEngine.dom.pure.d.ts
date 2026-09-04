/** This file must only contain pure code and pure imports */
import { type IViewportLike } from "../../Maths/math.like.js";
/**
 * Defines the interface used by objects containing a viewport (like a camera)
 */
export interface IViewportOwnerLike {
    /**
     * Gets or sets the viewport
     */
    viewport: IViewportLike;
}
/**
 * Register side effects for abstractEngineDom.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterAbstractEngineDom(): void;
