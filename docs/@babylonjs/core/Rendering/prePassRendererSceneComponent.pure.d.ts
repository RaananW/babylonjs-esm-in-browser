/** This file must only contain pure code and pure imports */
import { Scene } from "../scene.pure.js";
import { type ISceneComponent } from "../sceneComponent.js";
import { type PrePassRenderer } from "./prePassRenderer.pure.js";
/**
 * Defines the Geometry Buffer scene component responsible to manage a G-Buffer useful
 * in several rendering techniques.
 */
export declare class PrePassRendererSceneComponent implements ISceneComponent {
    /**
     * The component name helpful to identify the component in the list of scene components.
     */
    readonly name = "PrePassRenderer";
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
    private _beforeRenderTargetDraw;
    private _afterRenderTargetDraw;
    private _beforeRenderTargetClearStage;
    private _beforeCameraDraw;
    private _afterCameraDraw;
    private _beforeClearStage;
    private _beforeRenderingMeshStage;
    private _afterRenderingMeshStage;
    /**
     * Rebuilds the elements related to this component in case of
     * context lost for instance.
     */
    rebuild(): void;
    /**
     * Disposes the component and the associated resources
     */
    dispose(): void;
}
/**
 * Register side effects for prePassRendererSceneComponent.
 * Safe to call multiple times; only the first call has an effect.
 * @param prePassRendererClass The PrePassRenderer class to register the component for
 */
export declare function RegisterPrePassRendererSceneComponent(prePassRendererClass: typeof PrePassRenderer): void;
