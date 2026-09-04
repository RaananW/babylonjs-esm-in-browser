import { type RawTexture } from "../Textures/rawTexture.js";
import { type Nullable } from "../../types.js";
import { Color3 } from "../../Maths/math.color.pure.js";
/**
 * Default settings for GreasedLine materials
 */
export declare class GreasedLineMaterialDefaults {
    /**
     * Default line color for newly created lines
     */
    static DEFAULT_COLOR: Color3;
    /**
     * Default line width when sizeAttenuation is true
     */
    static DEFAULT_WIDTH_ATTENUATED: number;
    /**
     * Defaule line width
     */
    static DEFAULT_WIDTH: number;
    /**
     * Empty colors texture for WebGPU
     */
    static EmptyColorsTexture: Nullable<RawTexture>;
}
