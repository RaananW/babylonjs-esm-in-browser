import { type IMinimalMotionControllerObject, type MotionControllerHandedness, WebXRAbstractMotionController } from "./webXRAbstractMotionController.js";
import { type AbstractMesh } from "../../Meshes/abstractMesh.js";
import { type Scene } from "../../scene.js";
/**
 * A generic trigger-only motion controller for WebXR
 */
export declare class WebXRGenericTriggerMotionController extends WebXRAbstractMotionController {
    /**
     * Static version of the profile id of this controller
     */
    static ProfileId: string;
    profileId: string;
    constructor(scene: Scene, gamepadObject: IMinimalMotionControllerObject, handedness: MotionControllerHandedness);
    protected _getFilenameAndPath(): {
        filename: string;
        path: string;
    };
    protected _getModelLoadingConstraints(): boolean;
    protected _processLoadedModel(meshes: AbstractMesh[]): void;
    protected _setRootMesh(meshes: AbstractMesh[]): void;
    protected _updateModel(): void;
}
