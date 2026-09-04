/** This file must only contain pure code and pure imports */
import { Scene } from "../scene.pure.js";
import { type ISceneComponent } from "../sceneComponent.js";
import { type GeometryBufferRenderer } from "./geometryBufferRenderer.pure.js";
/**
 * Defines the Geometry Buffer scene component responsible to manage a G-Buffer useful
 * in several rendering techniques.
 */
export declare class GeometryBufferRendererSceneComponent implements ISceneComponent {
    /**
     * The component name helpful to identify the component in the list of scene components.
     */
    readonly name = "GeometryBufferRenderer";
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
 * Register side effects for geometryBufferRendererSceneComponent.
 * Safe to call multiple times; only the first call has an effect.
 * @param geometryBufferRendererClass The GeometryBufferRenderer class to register the component for
 */
export declare function RegisterGeometryBufferRendererSceneComponent(geometryBufferRendererClass: typeof GeometryBufferRenderer): void;
