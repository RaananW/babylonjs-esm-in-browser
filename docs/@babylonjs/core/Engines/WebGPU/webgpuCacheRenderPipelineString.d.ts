import { type Nullable } from "../../types.js";
import { WebGPUCacheRenderPipeline } from "./webgpuCacheRenderPipeline.js";
/**
 * Class not used, WebGPUCacheRenderPipelineTree is faster
 * @internal
 */
export declare class WebGPUCacheRenderPipelineString extends WebGPUCacheRenderPipeline {
    private static _Cache;
    protected _getRenderPipeline(param: {
        token: any;
        pipeline: Nullable<GPURenderPipeline>;
    }): void;
    protected _setRenderPipeline(param: {
        token: any;
        pipeline: Nullable<GPURenderPipeline>;
    }): void;
}
