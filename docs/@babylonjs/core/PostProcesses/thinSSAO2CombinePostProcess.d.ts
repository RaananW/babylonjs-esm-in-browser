import { type Nullable, type AbstractEngine, type EffectWrapperCreationOptions, type Camera } from "../index.js";
import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
/**
 * @internal
 */
export declare class ThinSSAO2CombinePostProcess extends EffectWrapper {
    static readonly FragmentUrl = "ssaoCombine";
    static readonly Uniforms: string[];
    static readonly Samplers: string[];
    protected _gatherImports(useWebGPU: boolean, list: Promise<any>[]): void;
    constructor(name: string, engine?: Nullable<AbstractEngine>, options?: EffectWrapperCreationOptions);
    camera: Nullable<Camera>;
    useViewportInCombineStage: boolean;
    bind(noDefaultBindings?: boolean): void;
}
