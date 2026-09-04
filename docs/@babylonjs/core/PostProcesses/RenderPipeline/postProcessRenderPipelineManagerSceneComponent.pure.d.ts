/** This file must only contain pure code and pure imports */
import { type ISceneComponent } from "../../sceneComponent.js";
import { Scene } from "../../scene.pure.js";
import { type PostProcessRenderPipelineManager } from "./postProcessRenderPipelineManager.js";
/**
 * Defines the Render Pipeline scene component responsible to rendering pipelines
 */
export declare class PostProcessRenderPipelineManagerSceneComponent implements ISceneComponent {
    /**
     * The component name helpful to identify the component in the list of scene components.
     */
    readonly name = "PostProcessRenderPipelineManager";
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
}
/**
 * Register side effects for postProcessRenderPipelineManagerSceneComponent.
 * Safe to call multiple times; only the first call has an effect.
 * @param pipelineManagerClass The PostProcessRenderPipelineManager class to use for lazy instantiation
 */
export declare function RegisterPostProcessRenderPipelineManagerSceneComponent(pipelineManagerClass?: typeof PostProcessRenderPipelineManager): void;
