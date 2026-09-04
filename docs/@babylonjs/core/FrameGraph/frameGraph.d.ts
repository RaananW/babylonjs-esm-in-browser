import { type Scene, type AbstractEngine, type FrameGraphTask, type Nullable, type NodeRenderGraph, type IDisposable, type Camera, type FrameGraphObjectRendererTask } from "../index.js";
import { FrameGraphPass } from "./Passes/pass.js";
import { FrameGraphRenderPass } from "./Passes/renderPass.js";
import { FrameGraphObjectListPass } from "./Passes/objectListPass.js";
import { FrameGraphContext } from "./frameGraphContext.js";
import { FrameGraphTextureManager } from "./frameGraphTextureManager.js";
import { Observable } from "../Misc/observable.js";
/**
 * Class used to implement a frame graph
 */
export declare class FrameGraph implements IDisposable {
    private readonly _linkedNodeRenderGraph;
    /**
     * Gets the texture manager used by the frame graph
     */
    readonly textureManager: FrameGraphTextureManager;
    private readonly _engine;
    private readonly _scene;
    private readonly _tasks;
    private readonly _passContext;
    private readonly _renderContext;
    private readonly _initAsyncPromises;
    private _currentProcessedTask;
    private _whenReadyAsyncCancel;
    private _importPromise;
    /**
     * Name of the frame graph
     */
    name: string;
    /**
     * Gets the unique id of the frame graph
     */
    readonly uniqueId: number;
    /**
     * Gets or sets a boolean indicating that texture allocation should be optimized (that is, reuse existing textures when possible to limit GPU memory usage) (default: true)
     */
    optimizeTextureAllocation: boolean;
    /**
     * Observable raised when the node render graph is built
     */
    onBuildObservable: Observable<FrameGraph>;
    /**
     * Gets the engine used by the frame graph
     */
    get engine(): AbstractEngine;
    /**
     * Gets the scene used by the frame graph
     */
    get scene(): Scene;
    /**
     * Gets the list of tasks in the frame graph
     */
    get tasks(): FrameGraphTask[];
    /**
     * Indicates whether the execution of the frame graph is paused (default is false)
     */
    pausedExecution: boolean;
    /**
     * Gets the node render graph linked to the frame graph (if any)
     * @returns the linked node render graph or null if none
     */
    getLinkedNodeRenderGraph(): Nullable<NodeRenderGraph>;
    /**
     * Constructs the frame graph
     * @param scene defines the scene the frame graph is associated with
     * @param debugTextures defines a boolean indicating that textures created by the frame graph should be visible in the inspector (default is false)
     * @param _linkedNodeRenderGraph defines the linked node render graph (if any)
     */
    constructor(scene: Scene, debugTextures?: boolean, _linkedNodeRenderGraph?: Nullable<NodeRenderGraph>);
    /**
     * Gets the class name of the frame graph
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets a task by name
     * @param name Name of the task to get
     * @returns The task or undefined if not found
     */
    getTaskByName<T extends FrameGraphTask>(name: string): T | undefined;
    /**
     * Gets all tasks of a specific class name(s)
     * @param name Class name(s) of the task to get
     * @returns The list of tasks or an empty array if none found
     */
    getTasksByClassNames<T extends FrameGraphTask>(name: string | string[]): T[];
    /**
     * Gets all tasks of a specific type
     * @param taskType Type of the task(s) to get
     * @returns The list of tasks of the specified type
     */
    getTasksByType<T extends FrameGraphTask>(taskType: new (...args: any[]) => T): T[];
    /**
     * Gets all tasks of a specific type, based on their class name
     * @param taskClassName Class name(s) of the task(s) to get
     * @returns The list of tasks of the specified type
     */
    getTasksByClassName<T extends FrameGraphTask>(taskClassName: string | string[]): T[];
    /**
     * Adds a task to the frame graph
     * @param task Task to add
     */
    addTask(task: FrameGraphTask): void;
    /**
     * Adds a pass to a task. This method can only be called during a Task.record execution.
     * @param name The name of the pass
     * @param whenTaskDisabled If true, the pass will be added to the list of passes to execute when the task is disabled (default is false)
     * @returns The render pass created
     */
    addPass(name: string, whenTaskDisabled?: boolean): FrameGraphPass<FrameGraphContext>;
    /**
     * Adds a render pass to a task. This method can only be called during a Task.record execution.
     * @param name The name of the pass
     * @param whenTaskDisabled If true, the pass will be added to the list of passes to execute when the task is disabled (default is false)
     * @returns The render pass created
     */
    addRenderPass(name: string, whenTaskDisabled?: boolean): FrameGraphRenderPass;
    /**
     * Adds an object list pass to a task. This method can only be called during a Task.record execution.
     * @param name The name of the pass
     * @param whenTaskDisabled If true, the pass will be added to the list of passes to execute when the task is disabled (default is false)
     * @returns The object list pass created
     */
    addObjectListPass(name: string, whenTaskDisabled?: boolean): FrameGraphObjectListPass;
    private _addPass;
    /** @internal */
    _whenAsynchronousInitializationDoneAsync(): Promise<void>;
    /**
     * Builds the frame graph.
     * This method should be called after all tasks have been added to the frame graph (FrameGraph.addTask) and before the graph is executed (FrameGraph.execute).
     * @param waitForReadiness If true, the method will wait for the frame graph to be ready before returning (default is true)
     */
    buildAsync(waitForReadiness?: boolean): Promise<void>;
    /**
     * Checks if the frame graph is ready to be executed.
     * Note that you can use the whenReadyAsync method to wait for the frame graph to be ready.
     * @returns True if the frame graph is ready to be executed, else false
     */
    isReady(): boolean;
    /**
     * Returns a promise that resolves when the frame graph is ready to be executed.
     * In general, calling “await buildAsync()” should suffice, as this function also waits for readiness by default.
     * @param timeStep Time step in ms between retries (default is 16)
     * @param maxTimeout Maximum time in ms to wait for the graph to be ready (default is 10000)
     * @returns The promise that resolves when the graph is ready
     */
    whenReadyAsync(timeStep?: number, maxTimeout?: number): Promise<void>;
    /**
     * Executes the frame graph.
     */
    execute(): void;
    /**
     * Clears the frame graph (remove the tasks and release the textures).
     * The frame graph can be built again after this method is called.
     */
    clear(): void;
    /**
     * Looks for the main camera used by the frame graph.
     * By default, this is the camera used by the main object renderer task.
     * If no such task, we try to find a camera in a utility layer renderer tasks.
     * @returns The main camera used by the frame graph, or null if not found
     */
    findMainCamera(): Nullable<Camera>;
    /**
     * Looks for the main object renderer task in the frame graph.
     * By default, this is the object/geometry renderer task with isMainObjectRenderer set to true.
     * If no such task, we return the last object/geometry renderer task that has an object list with meshes (or null if none found).
     * @returns The main object renderer of the frame graph, or null if not found
     */
    findMainObjectRenderer(): Nullable<FrameGraphObjectRendererTask>;
    /**
     * Disposes the frame graph
     */
    dispose(): void;
}
