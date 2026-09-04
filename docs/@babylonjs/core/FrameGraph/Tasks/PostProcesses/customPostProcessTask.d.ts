import { type FrameGraph, type EffectWrapperCreationOptions, type Observable, type Effect } from "../../../index.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
import { ThinCustomPostProcess } from "../../../PostProcesses/thinCustomPostProcess.js";
/**
 * Task which applies a custom post process.
 */
export declare class FrameGraphCustomPostProcessTask extends FrameGraphPostProcessTask {
    readonly postProcess: ThinCustomPostProcess;
    /**
     * Observable triggered when bind is called for the post process.
     * Use this to set custom uniforms.
     */
    onApplyObservable: Observable<Effect>;
    /**
     * Constructs a new custom post process task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task is associated with.
     * @param options Options to configure the post process
     */
    constructor(name: string, frameGraph: FrameGraph, options: EffectWrapperCreationOptions);
    getClassName(): string;
}
