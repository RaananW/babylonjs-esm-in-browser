/** This file must only contain pure code and pure imports */
import { Scene } from "../scene.pure.js";
import { type ISceneComponent } from "../sceneComponent.js";
import { type IblCdfGenerator } from "./iblCdfGenerator.js";
/**
 * Defines the IBL CDF Generator scene component responsible for generating CDF maps for a given IBL.
 */
export declare class IblCdfGeneratorSceneComponent implements ISceneComponent {
    /**
     * The component name helpful to identify the component in the list of scene components.
     */
    readonly name = "iblCDFGenerator";
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
    /**
     * @returns true once the CDF generator's procedural textures and effects are ready.
     * Used by `Scene.isReady` so that `executeWhenReady` waits for the CDF maps to be
     * generated before declaring the scene ready to render.
     */
    isReady(): boolean;
    private _updateIblSource;
    private _newIblObserver;
}
/**
 * Register side effects for iblCdfGeneratorSceneComponent.
 * Safe to call multiple times; only the first call has an effect.
 * @param iblCdfGeneratorClass The IblCdfGenerator class to register the component for
 */
export declare function RegisterIblCdfGeneratorSceneComponent(iblCdfGeneratorClass: typeof IblCdfGenerator): void;
