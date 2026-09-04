import { type WebGPUEngine } from "../webgpuEngine.js";
import { type WebGPUBundleList } from "./webgpuBundleList.js";
/** @internal */
export declare class WebGPUSnapshotRendering {
    private _engine;
    private _record;
    private _play;
    private _playBundleListIndex;
    private _allBundleLists;
    private _modeSaved;
    private _bundleList;
    private _enabled;
    private _mode;
    constructor(engine: WebGPUEngine, renderingMode: number, bundleList: WebGPUBundleList);
    showDebugLogs: boolean;
    get enabled(): boolean;
    get play(): boolean;
    get record(): boolean;
    set enabled(activate: boolean);
    get mode(): number;
    set mode(mode: number);
    endRenderPass(currentRenderPass: GPURenderPassEncoder): boolean;
    endFrame(): void;
    reset(): void;
    private _log;
}
