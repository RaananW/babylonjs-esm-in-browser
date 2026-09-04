import { type SSRRenderingPipelineParse } from "./ssrRenderingPipeline.pure.js";
type SSRRenderingPipelineParseType = typeof SSRRenderingPipelineParse;
declare module "./ssrRenderingPipeline.pure.js" {
    namespace SSRRenderingPipeline {
        let Parse: SSRRenderingPipelineParseType;
    }
}
export {};
