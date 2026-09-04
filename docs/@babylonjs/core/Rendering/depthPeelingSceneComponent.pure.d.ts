/** This file must only contain pure code and pure imports */
import { Scene } from "../scene.pure.js";
import { type ISceneComponent } from "../sceneComponent.js";
import { type DepthPeelingRenderer } from "./depthPeelingRenderer.js";
/**
 * Scene component to render order independent transparency with depth peeling
 */
export declare class DepthPeelingSceneComponent implements ISceneComponent {
    /**
     * The component name helpful to identify the component in the list of scene components.
     */
    readonly name = "DepthPeelingRenderer";
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
     * Disposes the component and the associated resources.
     */
    dispose(): void;
}
/**
 * Register side effects for depthPeelingSceneComponent.
 * Safe to call multiple times; only the first call has an effect.
 * @param depthPeelingRendererClass The DepthPeelingRenderer class to use for instantiation
 */
export declare function RegisterDepthPeelingSceneComponent(depthPeelingRendererClass: typeof DepthPeelingRenderer): void;
