import { FrameGraphPass } from "./Passes/pass.js";
import { FrameGraphRenderPass } from "./Passes/renderPass.js";
import { FrameGraphObjectListPass } from "./Passes/objectListPass.js";
import { FrameGraphRenderContext } from "./frameGraphRenderContext.js";
import { FrameGraphContext } from "./frameGraphContext.js";
import { FrameGraphTextureManager } from "./frameGraphTextureManager.js";
import { Observable } from "../Misc/observable.js";
import { _RetryWithInterval } from "../Misc/timingTools.js";
import { Logger } from "../Misc/logger.js";
import { UniqueIdGenerator } from "../Misc/uniqueIdGenerator.js";
var FrameGraphPassType;
(function (FrameGraphPassType) {
    FrameGraphPassType[FrameGraphPassType["Normal"] = 0] = "Normal";
    FrameGraphPassType[FrameGraphPassType["Render"] = 1] = "Render";
    FrameGraphPassType[FrameGraphPassType["ObjectList"] = 2] = "ObjectList";
})(FrameGraphPassType || (FrameGraphPassType = {}));
/**
 * Class used to implement a frame graph
 */
export class FrameGraph {
    /**
     * Gets the engine used by the frame graph
     */
    get engine() {
        return this._engine;
    }
    /**
     * Gets the scene used by the frame graph
     */
    get scene() {
        return this._scene;
    }
    /**
     * Gets the list of tasks in the frame graph
     */
    get tasks() {
        return this._tasks;
    }
    /**
     * Gets the node render graph linked to the frame graph (if any)
     * @returns the linked node render graph or null if none
     */
    getLinkedNodeRenderGraph() {
        return this._linkedNodeRenderGraph;
    }
    /**
     * Constructs the frame graph
     * @param scene defines the scene the frame graph is associated with
     * @param debugTextures defines a boolean indicating that textures created by the frame graph should be visible in the inspector (default is false)
     * @param _linkedNodeRenderGraph defines the linked node render graph (if any)
     */
    constructor(scene, debugTextures = false, _linkedNodeRenderGraph = null) {
        this._linkedNodeRenderGraph = _linkedNodeRenderGraph;
        this._tasks = [];
        this._initAsyncPromises = [];
        this._currentProcessedTask = null;
        this._whenReadyAsyncCancel = null;
        /**
         * Name of the frame graph
         */
        this.name = "Frame Graph";
        /**
         * Gets the unique id of the frame graph
         */
        this.uniqueId = UniqueIdGenerator.UniqueId;
        /**
         * Gets or sets a boolean indicating that texture allocation should be optimized (that is, reuse existing textures when possible to limit GPU memory usage) (default: true)
         */
        this.optimizeTextureAllocation = true;
        /**
         * Observable raised when the node render graph is built
         */
        this.onBuildObservable = new Observable();
        /**
         * Indicates whether the execution of the frame graph is paused (default is false)
         */
        this.pausedExecution = false;
        this._scene = scene;
        this._engine = scene.getEngine();
        this._importPromise = (async () => {
            if (this._engine.isWebGPU) {
                const module = await import("../Engines/WebGPU/Extensions/engine.multiRender.pure.js");
                module.RegisterEnginesWebGPUExtensionsEngineMultiRender();
            }
            else {
                const module = await import("../Engines/Extensions/engine.multiRender.pure.js");
                module.RegisterEnginesExtensionsEngineMultiRender();
            }
        })();
        this.textureManager = new FrameGraphTextureManager(this._engine, debugTextures, scene);
        this._passContext = new FrameGraphContext(this._engine, this.textureManager, scene);
        this._renderContext = new FrameGraphRenderContext(this._engine, this.textureManager, scene);
        this._scene.addFrameGraph(this);
    }
    /**
     * Gets the class name of the frame graph
     * @returns the class name
     */
    getClassName() {
        return "FrameGraph";
    }
    /**
     * Gets a task by name
     * @param name Name of the task to get
     * @returns The task or undefined if not found
     */
    getTaskByName(name) {
        return this._tasks.find((t) => t.name === name);
    }
    /**
     * Gets all tasks of a specific class name(s)
     * @param name Class name(s) of the task to get
     * @returns The list of tasks or an empty array if none found
     */
    getTasksByClassNames(name) {
        return this._tasks.filter((t) => (Array.isArray(name) ? name.includes(t.getClassName()) : t.getClassName() === name));
    }
    /**
     * Gets all tasks of a specific type
     * @param taskType Type of the task(s) to get
     * @returns The list of tasks of the specified type
     */
    getTasksByType(taskType) {
        return this._tasks.filter((t) => t instanceof taskType);
    }
    /**
     * Gets all tasks of a specific type, based on their class name
     * @param taskClassName Class name(s) of the task(s) to get
     * @returns The list of tasks of the specified type
     */
    getTasksByClassName(taskClassName) {
        return Array.isArray(taskClassName)
            ? this._tasks.filter((t) => taskClassName.includes(t.getClassName()))
            : this._tasks.filter((t) => t.getClassName() === taskClassName);
    }
    /**
     * Adds a task to the frame graph
     * @param task Task to add
     */
    addTask(task) {
        if (this._currentProcessedTask !== null) {
            throw new Error(`FrameGraph.addTask: Can't add the task "${task.name}" while another task is currently building (task: ${this._currentProcessedTask.name}).`);
        }
        if (this._tasks.includes(task)) {
            return;
        }
        this._tasks.push(task);
        this._initAsyncPromises.push(task.initAsync());
    }
    /**
     * Adds a pass to a task. This method can only be called during a Task.record execution.
     * @param name The name of the pass
     * @param whenTaskDisabled If true, the pass will be added to the list of passes to execute when the task is disabled (default is false)
     * @returns The render pass created
     */
    addPass(name, whenTaskDisabled = false) {
        return this._addPass(name, FrameGraphPassType.Normal, whenTaskDisabled);
    }
    /**
     * Adds a render pass to a task. This method can only be called during a Task.record execution.
     * @param name The name of the pass
     * @param whenTaskDisabled If true, the pass will be added to the list of passes to execute when the task is disabled (default is false)
     * @returns The render pass created
     */
    addRenderPass(name, whenTaskDisabled = false) {
        return this._addPass(name, FrameGraphPassType.Render, whenTaskDisabled);
    }
    /**
     * Adds an object list pass to a task. This method can only be called during a Task.record execution.
     * @param name The name of the pass
     * @param whenTaskDisabled If true, the pass will be added to the list of passes to execute when the task is disabled (default is false)
     * @returns The object list pass created
     */
    addObjectListPass(name, whenTaskDisabled = false) {
        return this._addPass(name, FrameGraphPassType.ObjectList, whenTaskDisabled);
    }
    _addPass(name, passType, whenTaskDisabled = false) {
        if (!this._currentProcessedTask) {
            throw new Error("FrameGraph: A pass must be created during a Task.record execution only.");
        }
        let pass;
        switch (passType) {
            case FrameGraphPassType.Render:
                pass = new FrameGraphRenderPass(name, this._currentProcessedTask, this._renderContext, this._engine);
                break;
            case FrameGraphPassType.ObjectList:
                pass = new FrameGraphObjectListPass(name, this._currentProcessedTask, this._passContext, this._engine);
                break;
            default:
                pass = new FrameGraphPass(name, this._currentProcessedTask, this._passContext);
                break;
        }
        this._currentProcessedTask._addPass(pass, whenTaskDisabled);
        return pass;
    }
    /** @internal */
    async _whenAsynchronousInitializationDoneAsync() {
        if (this._initAsyncPromises.length > 0) {
            await Promise.all(this._initAsyncPromises);
            this._initAsyncPromises.length = 0;
        }
    }
    /**
     * Builds the frame graph.
     * This method should be called after all tasks have been added to the frame graph (FrameGraph.addTask) and before the graph is executed (FrameGraph.execute).
     * @param waitForReadiness If true, the method will wait for the frame graph to be ready before returning (default is true)
     */
    async buildAsync(waitForReadiness = true) {
        this.textureManager._releaseTextures(false);
        this.pausedExecution = true;
        try {
            await this._importPromise;
            await this._whenAsynchronousInitializationDoneAsync();
            for (const task of this._tasks) {
                task._reset();
                this._currentProcessedTask = task;
                this.textureManager._isRecordingTask = true;
                task.record();
                this.textureManager._isRecordingTask = false;
                this._currentProcessedTask = null;
            }
            this.textureManager._allocateTextures(this.optimizeTextureAllocation ? this._tasks : undefined);
            for (const task of this._tasks) {
                task._checkTask();
            }
            for (const task of this._tasks) {
                task.onTexturesAllocatedObservable.notifyObservers(this._renderContext);
            }
            for (const task of this._tasks) {
                task._initializePasses();
            }
            this.onBuildObservable.notifyObservers(this);
            if (waitForReadiness) {
                await this.whenReadyAsync();
            }
        }
        catch (e) {
            this._tasks.length = 0;
            this._currentProcessedTask = null;
            this.textureManager._isRecordingTask = false;
            throw e;
        }
        finally {
            this.pausedExecution = false;
        }
    }
    /**
     * Checks if the frame graph is ready to be executed.
     * Note that you can use the whenReadyAsync method to wait for the frame graph to be ready.
     * @returns True if the frame graph is ready to be executed, else false
     */
    isReady() {
        let ready = this._renderContext._isReady();
        for (const task of this._tasks) {
            ready && (ready = task.isReady());
        }
        return ready;
    }
    /**
     * Returns a promise that resolves when the frame graph is ready to be executed.
     * In general, calling “await buildAsync()” should suffice, as this function also waits for readiness by default.
     * @param timeStep Time step in ms between retries (default is 16)
     * @param maxTimeout Maximum time in ms to wait for the graph to be ready (default is 10000)
     * @returns The promise that resolves when the graph is ready
     */
    async whenReadyAsync(timeStep = 16, maxTimeout = 10000) {
        let firstNotReadyTask = null;
        return await new Promise((resolve, reject) => {
            this._whenReadyAsyncCancel = _RetryWithInterval(() => {
                firstNotReadyTask = null;
                let ready = this._renderContext._isReady();
                for (const task of this._tasks) {
                    const taskIsReady = task.isReady();
                    if (!taskIsReady && !firstNotReadyTask) {
                        firstNotReadyTask = task;
                    }
                    ready && (ready = taskIsReady);
                }
                return ready;
            }, () => {
                this._whenReadyAsyncCancel = null;
                resolve();
            }, (err, isTimeout) => {
                this._whenReadyAsyncCancel = null;
                if (!isTimeout) {
                    Logger.Error("FrameGraph: An unexpected error occurred while waiting for the frame graph to be ready.");
                    if (err) {
                        Logger.Error(err);
                        if (err.stack) {
                            Logger.Error(err.stack);
                        }
                    }
                }
                else {
                    Logger.Error(`FrameGraph: Timeout while waiting for the frame graph to be ready.${firstNotReadyTask ? ` First task not ready: ${firstNotReadyTask.name}` : ""}`);
                    if (err) {
                        Logger.Error(err);
                    }
                }
                reject(new Error(err));
            }, timeStep, maxTimeout);
        });
    }
    /**
     * Executes the frame graph.
     */
    execute() {
        if (this.pausedExecution) {
            return;
        }
        this._renderContext.restoreDefaultFramebuffer();
        this.textureManager._updateHistoryTextures();
        for (const task of this._tasks) {
            task._execute();
        }
        this._renderContext.restoreDefaultFramebuffer();
    }
    /**
     * Clears the frame graph (remove the tasks and release the textures).
     * The frame graph can be built again after this method is called.
     */
    clear() {
        this._whenReadyAsyncCancel?.();
        this._whenReadyAsyncCancel = null;
        for (const task of this._tasks) {
            task._reset();
        }
        this._tasks.length = 0;
        this.textureManager._releaseTextures();
        this._currentProcessedTask = null;
    }
    /**
     * Looks for the main camera used by the frame graph.
     * By default, this is the camera used by the main object renderer task.
     * If no such task, we try to find a camera in a utility layer renderer tasks.
     * @returns The main camera used by the frame graph, or null if not found
     */
    findMainCamera() {
        const mainObjectRenderer = this.findMainObjectRenderer();
        if (mainObjectRenderer) {
            return mainObjectRenderer.camera;
        }
        // Try to find a camera in the utility layer renderer tasks
        const tasks = this.tasks;
        for (let i = tasks.length - 1; i >= 0; i--) {
            const task = tasks[i];
            if (task.getClassName() === "FrameGraphUtilityLayerRendererTask") {
                return task.camera;
            }
        }
        return null;
    }
    /**
     * Looks for the main object renderer task in the frame graph.
     * By default, this is the object/geometry renderer task with isMainObjectRenderer set to true.
     * If no such task, we return the last object/geometry renderer task that has an object list with meshes (or null if none found).
     * @returns The main object renderer of the frame graph, or null if not found
     */
    findMainObjectRenderer() {
        const objectRenderers = this.getTasksByClassNames(["FrameGraphObjectRendererTask", "FrameGraphGeometryRendererTask"]);
        let fallbackRenderer = null;
        for (let i = objectRenderers.length - 1; i >= 0; --i) {
            const meshes = objectRenderers[i].objectList.meshes;
            if (objectRenderers[i].isMainObjectRenderer) {
                return objectRenderers[i];
            }
            if ((!meshes || meshes.length > 0) && !fallbackRenderer) {
                fallbackRenderer = objectRenderers[i];
            }
        }
        return fallbackRenderer;
    }
    /**
     * Disposes the frame graph
     */
    dispose() {
        this._whenReadyAsyncCancel?.();
        this._whenReadyAsyncCancel = null;
        this.clear();
        this.textureManager._dispose();
        this._renderContext._dispose();
        this._scene.removeFrameGraph(this);
    }
}
//# sourceMappingURL=frameGraph.js.map