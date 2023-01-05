import type { Camera } from "../../Cameras/camera";
import type { Nullable } from "../../types";
import { Observable } from "../../Misc/observable";
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
    /** Defines an optional camera used to render the view (will use active camera else) */
    camera?: Camera;
    /** Indicates if the destination view canvas should be cleared before copying the parent canvas. Can help if the scene clear color has alpha < 1 */
    clearBeforeCopy?: boolean;
    /** Indicates if the view is enabled (true by default) */
    enabled: boolean;
    /** Defines a custom function to handle canvas size changes. (the canvas to render into is provided to the callback) */
    customResize?: (canvas: HTMLCanvasElement) => void;
}
declare module "../../Engines/engine" {
    interface Engine {
        /** @internal */
        _inputElement: Nullable<HTMLElement>;
        /**
         * Gets or sets the  HTML element to use for attaching events
         */
        inputElement: Nullable<HTMLElement>;
        /**
         * Observable to handle when a change to inputElement occurs
         * @internal
         */
        _onEngineViewChanged?: () => void;
        /**
         * Will be triggered before the view renders
         */
        readonly onBeforeViewRenderObservable: Observable<EngineView>;
        /**
         * Will be triggered after the view rendered
         */
        readonly onAfterViewRenderObservable: Observable<EngineView>;
        /**
         * Gets the current engine view
         * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/multiCanvas
         */
        activeView: Nullable<EngineView>;
        /** Gets or sets the list of views */
        views: EngineView[];
        /**
         * Register a new child canvas
         * @param canvas defines the canvas to register
         * @param camera defines an optional camera to use with this canvas (it will overwrite the scene.camera for this view)
         * @param clearBeforeCopy Indicates if the destination view canvas should be cleared before copying the parent canvas. Can help if the scene clear color has alpha < 1
         * @returns the associated view
         */
        registerView(canvas: HTMLCanvasElement, camera?: Camera, clearBeforeCopy?: boolean): EngineView;
        /**
         * Remove a registered child canvas
         * @param canvas defines the canvas to remove
         * @returns the current engine
         */
        unRegisterView(canvas: HTMLCanvasElement): Engine;
        /**
         * @internal
         */
        _renderViewStep(view: EngineView): boolean;
    }
}
