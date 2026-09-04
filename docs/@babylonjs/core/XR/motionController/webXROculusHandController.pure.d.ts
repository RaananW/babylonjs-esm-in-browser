/** This file must only contain pure code and pure imports */
import { WebXRAbstractMotionController, type IMinimalMotionControllerObject, type MotionControllerHandedness } from "./webXRAbstractMotionController.js";
import { type AbstractMesh } from "../../Meshes/abstractMesh.pure.js";
import { type Scene } from "../../scene.pure.js";
/**
 * Oculus hand controller class that supports microgestures
 */
export declare class WebXROculusHandController extends WebXRAbstractMotionController {
    profileId: string;
    /**
     * Create a new hand controller object, without loading a controller model
     * @param scene the scene to use to create this controller
     * @param gamepadObject the corresponding gamepad object
     * @param handedness the handedness of the controller
     */
    constructor(scene: Scene, gamepadObject: IMinimalMotionControllerObject, handedness: MotionControllerHandedness);
    protected _getFilenameAndPath(): {
        filename: string;
        path: string;
    };
    protected _getModelLoadingConstraints(): boolean;
    protected _processLoadedModel(_meshes: AbstractMesh[]): void;
    protected _setRootMesh(meshes: AbstractMesh[]): void;
    protected _updateModel(): void;
}
/**
 * Register side effects for webXROculusHandController.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterWebXROculusHandController(): void;
