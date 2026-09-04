import { type ComputeEffect } from "../../../Compute/computeEffect.js";
import { type IComputeContext } from "../../../Compute/IComputeContext.js";
import { type Nullable } from "../../../types.js";
import { type ComputeBindingList, type ComputeBindingMapping } from "../../Extensions/engine.computeShader.js";
import { type WebGPUPerfCounter } from "../webgpuPerfCounter.js";
import { type DataBuffer } from "../../../Buffers/dataBuffer.js";
declare module "../../webgpuEngine.pure.js" {
    interface WebGPUEngine {
        /** @internal */
        _createComputePipelineStageDescriptor(computeShader: string, defines: Nullable<string>, entryPoint: string): GPUProgrammableStage;
        /** @internal
         * Either all of x,y,z or buffer and offset should be defined.
         */
        _computeDispatch(effect: ComputeEffect, context: IComputeContext, bindings: ComputeBindingList, x?: number, y?: number, z?: number, buffer?: DataBuffer, offset?: number, bindingsMapping?: ComputeBindingMapping, gpuPerfCounter?: WebGPUPerfCounter): void;
    }
}
