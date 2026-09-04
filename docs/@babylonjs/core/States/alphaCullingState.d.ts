import { type Nullable } from "../types.js";
/**
 * @internal
 **/
export declare class AlphaState {
    private _supportBlendParametersPerTarget;
    _blendFunctionParameters: Nullable<number>[];
    _blendEquationParameters: Nullable<number>[];
    _blendConstants: Nullable<number>[];
    _isBlendConstantsDirty: boolean;
    _alphaBlend: any[];
    _numTargetEnabled: number;
    private _isAlphaBlendDirty;
    private _isBlendFunctionParametersDirty;
    private _isBlendEquationParametersDirty;
    /**
     * Initializes the state.
     * @param _supportBlendParametersPerTarget - Whether blend parameters per target is supported
     */
    constructor(_supportBlendParametersPerTarget: boolean);
    get isDirty(): boolean;
    get alphaBlend(): boolean;
    set alphaBlend(value: boolean);
    setAlphaBlend(value: boolean, targetIndex?: number): void;
    setAlphaBlendConstants(r: number, g: number, b: number, a: number): void;
    setAlphaBlendFunctionParameters(srcRGBFactor: number, dstRGBFactor: number, srcAlphaFactor: number, dstAlphaFactor: number, targetIndex?: number): void;
    setAlphaEquationParameters(rgbEquation: number, alphaEquation: number, targetIndex?: number): void;
    reset(): void;
    apply(gl: WebGLRenderingContext, numTargets?: number): void;
    setAlphaMode(mode: number, targetIndex: number): void;
}
