/** This file must only contain pure code and pure imports */
import { type ThinEngine } from "../../Engines/thinEngine.pure.js";
import { type AbstractMesh } from "../../Meshes/abstractMesh.pure.js";
import { type IBoundingInfoHelperPlatform } from "./IBoundingInfoHelperPlatform.js";
/** @internal */
export declare class TransformFeedbackBoundingHelper implements IBoundingInfoHelperPlatform {
    private static _Min;
    private static _Max;
    private _engine;
    private _buffers;
    private _effects;
    private _meshList;
    private _meshListCounter;
    /**
     * Creates a new TransformFeedbackBoundingHelper
     * @param engine defines the engine to use
     */
    constructor(engine: ThinEngine);
    /** @internal */
    processAsync(meshes: AbstractMesh | AbstractMesh[]): Promise<void>;
    private _processMeshList;
    private _compute;
    /** @internal */
    registerMeshListAsync(meshes: AbstractMesh | AbstractMesh[]): Promise<void>;
    /** @internal */
    processMeshList(): void;
    /** @internal */
    fetchResultsForMeshListAsync(): Promise<void>;
    /** @internal */
    dispose(): void;
}
