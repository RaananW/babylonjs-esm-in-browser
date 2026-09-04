/** This file must only contain pure code and pure imports */
import { type Camera } from "../../Cameras/camera.pure.js";
/**
 * Class used to define an additional view for the engine
 * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/multiCanvas
 */
export declare class EngineView {
    /**
     * A randomly generated unique id
     */
    readonly id: string;
    /** Defines the canvas where to render the view */
    target: HTMLCanvasElement;
    /**
     * Defines an optional camera or array of cameras used to render the view (will use active camera / cameras else)
     * Support for array of cameras @since
     */
    camera?: Camera | Camera[];
    /** Indicates if the destination view canvas should be cleared before copying the parent canvas. Can help if the scene clear color has alpha < 1 */
    clearBeforeCopy?: boolean;
    /** Indicates if the view is enabled (true by default) */
    enabled: boolean;
    /** Defines a custom function to handle canvas size changes. (the canvas to render into is provided to the callback) */
    customResize?: (canvas: HTMLCanvasElement) => void;
}
/**
 * Register side effects for abstractEngineViews.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterAbstractEngineViews(): void;
