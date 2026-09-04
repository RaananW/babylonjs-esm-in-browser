import { MaterialDefines } from "./materialDefines.js";
/**
 * Interface to follow in your material defines to integrate easily the
 * Image processing functions.
 * @internal
 */
export interface IImageProcessingConfigurationDefines {
    IMAGEPROCESSING: boolean;
    WHITEBALANCE: boolean;
    VIGNETTE: boolean;
    VIGNETTEBLENDMODEMULTIPLY: boolean;
    VIGNETTEBLENDMODEOPAQUE: boolean;
    TONEMAPPING: number;
    CONTRAST: boolean;
    EXPOSURE: boolean;
    COLORCURVES: boolean;
    COLORGRADING: boolean;
    COLORGRADING3D: boolean;
    SAMPLER3DGREENDEPTH: boolean;
    SAMPLER3DBGRMAP: boolean;
    DITHER: boolean;
    IMAGEPROCESSINGPOSTPROCESS: boolean;
    SKIPFINALCOLORCLAMP: boolean;
}
type ImageProcessingDefinesMixinConstructor<T = {}> = new (...args: any[]) => T;
/**
 * Mixin to add Image processing defines to your material defines
 * @internal
 */
export declare function ImageProcessingDefinesMixin<Tbase extends ImageProcessingDefinesMixinConstructor>(base: Tbase): {
    new (...args: any[]): {
        IMAGEPROCESSING: boolean;
        WHITEBALANCE: boolean;
        VIGNETTE: boolean;
        VIGNETTEBLENDMODEMULTIPLY: boolean;
        VIGNETTEBLENDMODEOPAQUE: boolean;
        TONEMAPPING: number;
        CONTRAST: boolean;
        COLORCURVES: boolean;
        COLORGRADING: boolean;
        COLORGRADING3D: boolean;
        SAMPLER3DGREENDEPTH: boolean;
        SAMPLER3DBGRMAP: boolean;
        DITHER: boolean;
        IMAGEPROCESSINGPOSTPROCESS: boolean;
        SKIPFINALCOLORCLAMP: boolean;
        EXPOSURE: boolean;
    };
} & Tbase;
/**
 * @internal
 */
export declare class ImageProcessingConfigurationDefines extends MaterialDefines implements IImageProcessingConfigurationDefines {
    IMAGEPROCESSING: boolean;
    WHITEBALANCE: boolean;
    VIGNETTE: boolean;
    VIGNETTEBLENDMODEMULTIPLY: boolean;
    VIGNETTEBLENDMODEOPAQUE: boolean;
    TONEMAPPING: number;
    CONTRAST: boolean;
    COLORCURVES: boolean;
    COLORGRADING: boolean;
    COLORGRADING3D: boolean;
    SAMPLER3DGREENDEPTH: boolean;
    SAMPLER3DBGRMAP: boolean;
    DITHER: boolean;
    IMAGEPROCESSINGPOSTPROCESS: boolean;
    EXPOSURE: boolean;
    SKIPFINALCOLORCLAMP: boolean;
    constructor();
}
export {};
