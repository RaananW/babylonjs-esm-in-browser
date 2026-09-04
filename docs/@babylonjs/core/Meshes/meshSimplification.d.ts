import { Mesh } from "../Meshes/mesh.pure.js";
import { type ISimplificationSettings, SimplificationType } from "./meshSimplification.common.js";
export { SimplificationSettings, SimplificationType } from "./meshSimplification.common.js";
export { type ISimplificationSettings } from "./meshSimplification.common.js";
/**
 * A simplifier interface for future simplification implementations
 * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/simplifyingMeshes
 */
export interface ISimplifier {
    /**
     * Simplification of a given mesh according to the given settings.
     * Since this requires computation, it is assumed that the function runs async.
     * @param settings The settings of the simplification, including quality and distance
     * @param successCallback A callback that will be called after the mesh was simplified.
     * @param errorCallback in case of an error, this callback will be called. optional.
     */
    simplify(settings: ISimplificationSettings, successCallback: (simplifiedMeshes: Mesh) => void, errorCallback?: () => void): void;
}
/**
 * Interface used to define a simplification task
 */
export interface ISimplificationTask {
    /**
     * Array of settings
     */
    settings: Array<ISimplificationSettings>;
    /**
     * Simplification type
     */
    simplificationType: SimplificationType;
    /**
     * Mesh to simplify
     */
    mesh: Mesh;
    /**
     * Callback called on success
     */
    successCallback?: () => void;
    /**
     * Defines if parallel processing can be used
     */
    parallelProcessing: boolean;
}
/**
 * Queue used to order the simplification tasks
 * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/simplifyingMeshes
 */
export declare class SimplificationQueue {
    private _simplificationArray;
    /**
     * Gets a boolean indicating that the process is still running
     */
    running: boolean;
    /**
     * Creates a new queue
     */
    constructor();
    /**
     * Adds a new simplification task
     * @param task defines a task to add
     */
    addTask(task: ISimplificationTask): void;
    /**
     * Execute next task
     */
    executeNext(): void;
    /**
     * Execute a simplification task
     * @param task defines the task to run
     */
    runSimplification(task: ISimplificationTask): void;
    private _getSimplifier;
}
/**
 * An implementation of the Quadratic Error simplification algorithm.
 * Original paper : http://www1.cs.columbia.edu/~cs4162/html05s/garland97.pdf
 * Ported mostly from QSlim and http://voxels.blogspot.de/2014/05/quadric-mesh-simplification-with-source.html to babylon JS
 * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/simplifyingMeshes
 */
export declare class QuadraticErrorSimplification implements ISimplifier {
    private _mesh;
    private _triangles;
    private _vertices;
    private _references;
    private _reconstructedMesh;
    /** Gets or sets the number pf sync iterations */
    syncIterations: number;
    /** Gets or sets the aggressiveness of the simplifier */
    aggressiveness: number;
    /** Gets or sets the number of allowed iterations for decimation */
    decimationIterations: number;
    /** Gets or sets the espilon to use for bounding box computation */
    boundingBoxEpsilon: number;
    /**
     * Creates a new QuadraticErrorSimplification
     * @param _mesh defines the target mesh
     */
    constructor(_mesh: Mesh);
    /**
     * Simplification of a given mesh according to the given settings.
     * Since this requires computation, it is assumed that the function runs async.
     * @param settings The settings of the simplification, including quality and distance
     * @param successCallback A callback that will be called after the mesh was simplified.
     */
    simplify(settings: ISimplificationSettings, successCallback: (simplifiedMesh: Mesh) => void): void;
    private _runDecimation;
    private _initWithMesh;
    private _init;
    private _reconstructMesh;
    private _initDecimatedMesh;
    private _isFlipped;
    private _updateTriangles;
    private _identifyBorder;
    private _updateMesh;
    private _vertexError;
    private _calculateError;
}
