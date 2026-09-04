import { type AbstractMesh } from "../../Meshes/abstractMesh.js";
import { type IMotionControllerProfile, WebXRAbstractMotionController } from "./webXRAbstractMotionController.js";
import { type Scene } from "../../scene.js";
/**
 * A profiled motion controller has its profile loaded from an online repository.
 * The class is responsible of loading the model, mapping the keys and enabling model-animations
 */
export declare class WebXRProfiledMotionController extends WebXRAbstractMotionController {
    private _repositoryUrl;
    private controllerCache?;
    private _buttonMeshMapping;
    private _touchDots;
    /**
     * The profile ID of this controller. Will be populated when the controller initializes.
     */
    profileId: string;
    constructor(scene: Scene, xrInput: XRInputSource, _profile: IMotionControllerProfile, _repositoryUrl: string, controllerCache?: Array<{
        filename: string;
        path: string;
        meshes: AbstractMesh[];
    }> | undefined);
    dispose(): void;
    protected _getFilenameAndPath(): {
        filename: string;
        path: string;
    };
    protected _getModelLoadingConstraints(): boolean;
    protected _processLoadedModel(_meshes: AbstractMesh[]): void;
    protected _setRootMesh(meshes: AbstractMesh[]): void;
    protected _updateModel(_xrFrame: XRFrame): void;
}
