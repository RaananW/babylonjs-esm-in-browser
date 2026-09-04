/** This file must only contain pure code and pure imports */
import { Scene } from "../scene.pure.js";
import { type ISceneComponent } from "../sceneComponent.js";
import { type DepthRenderer } from "./depthRenderer.pure.js";
/**
 * Defines the Depth Renderer scene component responsible to manage a depth buffer useful
 * in several rendering techniques.
 */
export declare class DepthRendererSceneComponent implements ISceneComponent {
    /**
     * The component name helpful to identify the component in the list of scene components.
     */
    readonly name = "DepthRenderer";
    /**
     * The scene the component belongs to.
     */
    scene: Scene;
    /**
     * Creates a new instance of the component for the given scene
     * @param scene Defines the scene to register the component in
     */
    constructor(scene: Scene);
    /**
     * Registers the component in a given scene
     */
    register(): void;
    /**
     * Rebuilds the elements related to this component in case of
     * context lost for instance.
     */
    rebuild(): void;
    /**
     * Disposes the component and the associated resources
     */
    dispose(): void;
    private _gatherRenderTargets;
    private _isReadyForMesh;
    private _gatherActiveCameraRenderTargets;
}
/**
 * Register side effects for depthRendererSceneComponent.
 * Safe to call multiple times; only the first call has an effect.
 * @param depthRendererClass The DepthRenderer class to register the component for
 */
export declare function RegisterDepthRendererSceneComponent(depthRendererClass: typeof DepthRenderer): void;
