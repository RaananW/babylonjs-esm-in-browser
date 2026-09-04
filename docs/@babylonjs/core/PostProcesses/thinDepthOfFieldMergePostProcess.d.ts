import { type Nullable, type AbstractEngine, type EffectWrapperCreationOptions } from "../index.js";
import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
/**
 * @internal
 */
export declare class ThinDepthOfFieldMergePostProcess extends EffectWrapper {
    static readonly FragmentUrl = "depthOfFieldMerge";
    static readonly Samplers: string[];
    protected _gatherImports(useWebGPU: boolean, list: Promise<any>[]): void;
    constructor(name: string, engine?: Nullable<AbstractEngine>, options?: EffectWrapperCreationOptions);
}
