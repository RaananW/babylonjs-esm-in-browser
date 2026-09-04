import { type FrameGraph, type FrameGraphRenderPass, type FrameGraphObjectRendererTask, type Observer, type ObjectRenderer, type FrameGraphTextureHandle, type Scene } from "../../../index.js";
import { ThinTAAPostProcess } from "../../../PostProcesses/thinTAAPostProcess.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
/**
 * Task which applies a Temporal Anti-Aliasing post process.
 */
export declare class FrameGraphTAATask extends FrameGraphPostProcessTask {
    readonly postProcess: ThinTAAPostProcess;
    /**
     * The object renderer task used to render the scene objects.
     */
    objectRendererTask: FrameGraphObjectRendererTask;
    /**
     * The handle to the velocity texture. Only needed if postProcess.reprojectHistory is enabled.
     * Note that you must use the linear velocity texture!
     */
    velocityTexture?: FrameGraphTextureHandle;
    protected _onBeforeRenderSceneObserver: Observer<Scene>;
    protected _initRenderingObserver: Observer<ObjectRenderer>;
    /**
     * Constructs a new Temporal Anti-Aliasing task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task is associated with.
     * @param thinPostProcess The thin post process to use for the Temporal Anti-Aliasing effect. If not provided, a new one will be created.
     */
    constructor(name: string, frameGraph: FrameGraph, thinPostProcess?: ThinTAAPostProcess);
    getClassName(): string;
    record(): FrameGraphRenderPass;
    dispose(): void;
}
