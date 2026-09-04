import { type Scene } from "../../scene.js";
import { type BaseTexture } from "./baseTexture.js";
import { type Nullable } from "../../types.js";
import { Color4 } from "../../Maths/math.color.pure.js";
/**
 * Specifies the color space of a texture operand.
 * When `sRGB` is set the sampled RGB values are converted to linear space before any channel
 * swizzle, factor multiplication, or arithmetic operation. Alpha is always treated as linear.
 */
export declare enum TextureColorSpace {
    /** Texture data is already in linear space (default). No conversion applied. */
    Linear = 0,
    /** Texture data is in sRGB (gamma) space. RGB channels are linearized (IEC 61966-2-1) before use. */
    SRGB = 1
}
/**
 * Bitmask controlling which channels are written to the output texture by a processing operation.
 * Channels excluded from the mask receive a sensible default: `0.0` for RGB channels, `1.0` for alpha.
 * Use `ChannelMask.RGBA` (or omit the parameter) to pass all channels through unchanged.
 *
 * | Flag | Channels written | Excluded channels |
 * |------|-----------------|-------------------|
 * | R    | red             | G=0, B=0, A=1     |
 * | G    | green           | R=0, B=0, A=1     |
 * | B    | blue            | R=0, G=0, A=1     |
 * | A    | alpha           | R=0, G=0, B=0     |
 * | RGB  | red, green, blue | A=1              |
 * | RGBA | all four        | (none)            |
 */
export declare enum ChannelMask {
    /** Pass only the red channel; G=0, B=0, A=1. */
    R = 1,
    /** Pass only the green channel; R=0, B=0, A=1. */
    G = 2,
    /** Pass only the blue channel; R=0, G=0, A=1. */
    B = 4,
    /** Pass only the alpha channel; R=0, G=0, B=0. */
    A = 8,
    /** Pass red, green, and blue; alpha is forced to 1.0. */
    RGB = 7,
    /** Pass all four channels unchanged (default — no masking). */
    RGBA = 15
}
/**
 * Specifies which channel of a texture to read for an operation.
 * When a single channel is selected its scalar value is broadcast to RGB; alpha
 * is either preserved from the original sample or replicated when `A` is chosen.
 *
 * | Value | Swizzle |
 * |-------|---------|
 * | RGBA  | (r, g, b, a) — no swizzle (default) |
 * | R     | (r, r, r, a) |
 * | G     | (g, g, g, a) |
 * | B     | (b, b, b, a) |
 * | A     | (a, a, a, a) |
 */
export declare enum TextureChannel {
    /** Use all four channels as sampled (default). */
    RGBA = 0,
    /** Broadcast the red channel to RGB; preserve alpha: RRRA. */
    R = 1,
    /** Broadcast the green channel to RGB; preserve alpha: GGGA. */
    G = 2,
    /** Broadcast the blue channel to RGB; preserve alpha: BBBA. */
    B = 3,
    /** Broadcast the alpha channel to all four components: AAAA. */
    A = 4
}
/**
 * Represents an operand for a texture processing operation, or the result of one.
 *
 * As an operand, the value evaluates to a vec4 per texel:
 * - `texture` only → `sample(texture)`
 * - `factor` only → `factor` (constant)
 * - both → `sample(texture) * factor`
 *
 * As a result returned by a processing function:
 * - `texture` holds the GPU-processed output; `dispose()` releases it when no longer needed.
 * - `factor` holds a CPU-folded constant when all inputs were texture-free; no `dispose` is set.
 *
 * Results are directly usable as operands to subsequent operations. When a result with a
 * `dispose` function is passed as an operand, the next operation automatically calls `dispose`
 * after consuming it, so intermediate textures are cleaned up without manual tracking.
 *
 * At least one of `texture` or `factor` must be provided when used as an operand.
 */
export interface ITextureProcessOperand {
    /**
     * Texture to sample. When combined with `factor`, the sampled value is multiplied
     * component-wise by the factor. Null when the operand or result is a constant.
     */
    texture: Nullable<BaseTexture>;
    /**
     * Optional constant RGBA factor. If `texture` is also set, the sampled value is
     * multiplied by this factor. If `texture` is not set, this becomes the constant output.
     * When omitted and `texture` is set, defaults to (1, 1, 1, 1) — no scaling.
     */
    factor?: Color4;
    /**
     * Optional channel selection applied to the sampled texture value before any factor
     * multiplication. When omitted or set to `TextureChannel.RGBA`, the sample is used
     * as-is. When set to a single channel, that channel's scalar is broadcast to RGB
     * (or all four components for `TextureChannel.A`). Only meaningful when `texture` is set.
     */
    channel?: TextureChannel;
    /**
     * Color space of the texture data. When set to `TextureColorSpace.SRGB`, the sampled
     * RGB channels are converted from sRGB to linear space (IEC 61966-2-1) before the channel
     * swizzle, factor multiplication, and any arithmetic operation. Alpha is always linear.
     * Defaults to `TextureColorSpace.Linear` (no conversion). Only meaningful when `texture` is set.
     */
    colorSpace?: TextureColorSpace;
    /**
     * Disposes the texture produced by a processing operation. Only present on results
     * returned by the texture processing functions. When a result is passed as an operand
     * to the next operation in a chain, its `dispose` is called automatically after the
     * GPU pass completes. Call `dispose` explicitly on the final result when the texture
     * is no longer needed (or skip it if transferring ownership to a material).
     */
    dispose?: () => void;
}
/**
 * Create an operand from a texture alone (no constant factor scaling).
 * @param texture - The texture to sample, or null to produce an identity (1,1,1,1) constant operand
 * @param channel - Optional channel selection. When set, the sampled value is swizzled before use
 *   (e.g. `TextureChannel.R` → RRRA). Defaults to `TextureChannel.RGBA` (no swizzle).
 * @param colorSpace - Optional color space. When `TextureColorSpace.SRGB`, the sampled RGB channels
 *   are linearized before use. Defaults to `TextureColorSpace.Linear`.
 * @returns An operand that evaluates to the sampled texture value
 */
export declare function CreateTextureOperand(texture: Nullable<BaseTexture>, channel?: TextureChannel, colorSpace?: TextureColorSpace): ITextureProcessOperand;
/**
 * Create an operand from a constant RGBA factor with no texture.
 * @param factor - The constant RGBA value
 * @returns An operand that evaluates to the constant factor
 */
export declare function CreateFactorOperand(factor: Color4): ITextureProcessOperand;
/**
 * Create an operand from a texture multiplied by a constant RGBA factor.
 * This is the standard glTF pattern (e.g. baseColorTexture * baseColorFactor).
 * If `texture` is null, returns a factor-only operand.
 * @param texture - The texture to sample, or null to use the factor alone
 * @param factor - The constant factor to multiply by
 * @param channel - Optional channel selection. When set, the sampled value is swizzled before
 *   factor multiplication (e.g. `TextureChannel.G` → GGGA, then multiplied by factor).
 *   Defaults to `TextureChannel.RGBA` (no swizzle).
 * @param colorSpace - Optional color space. When `TextureColorSpace.SRGB`, the sampled RGB channels
 *   are linearized before factor multiplication. Defaults to `TextureColorSpace.Linear`.
 * @returns An operand that evaluates to `sample(texture) * factor`, or `factor` if texture is null
 */
export declare function CreateTextureWithFactorOperand(texture: Nullable<BaseTexture>, factor: Color4, channel?: TextureChannel, colorSpace?: TextureColorSpace): ITextureProcessOperand;
/**
 * Multiply two texture operands together, component-wise: `result = a * b`.
 *
 * Each operand can be a texture, a constant factor, or a texture scaled by a factor.
 * This is useful for applying glTF-style factors to textures (e.g. `baseColorTexture * baseColorFactor`),
 * or for modulating one texture by another.
 *
 * If both operands are constant (no textures), the multiplication is performed on the CPU and
 * the result is returned as a factor-only operand with no texture allocated.
 *
 * When operands are results of previous operations (i.e. they carry a `dispose` function),
 * their intermediate textures are automatically released after the GPU pass completes.
 *
 * @param name - Name for the resulting procedural texture (used only when a GPU pass is needed)
 * @param a - First operand
 * @param b - Second operand
 * @param scene - Scene to create the texture in (used only when a GPU pass is needed)
 * @param outputColorSpace - Optional output color space. When `TextureColorSpace.SRGB`, the linear
 *   result is converted to sRGB (IEC 61966-2-1) before being written. Defaults to `TextureColorSpace.Linear`.
 * @param outputChannelMask - Optional bitmask of channels to write. Excluded color channels are set to
 *   `0.0`; excluded alpha is set to `1.0`. Defaults to `ChannelMask.RGBA` (all channels written).
 * @returns An operand whose `texture` holds the GPU result, or whose `factor` holds the CPU-folded constant
 */
export declare function MultiplyTexturesAsync(name: string, a: ITextureProcessOperand, b: ITextureProcessOperand, scene: Scene, outputColorSpace?: TextureColorSpace, outputChannelMask?: ChannelMask): Promise<ITextureProcessOperand>;
/**
 * Take the component-wise maximum of two texture operands: `result = max(a, b)`.
 *
 * Each operand can be a texture, a constant factor, or a texture scaled by a factor.
 * Useful for operations such as combining ambient occlusion maps or taking the
 * brightest contribution from two sources.
 *
 * If both operands are constant (no textures), the operation is performed on the CPU and
 * the result is returned as a factor-only operand with no texture allocated.
 *
 * When operands are results of previous operations (i.e. they carry a `dispose` function),
 * their intermediate textures are automatically released after the GPU pass completes.
 *
 * @param name - Name for the resulting procedural texture (used only when a GPU pass is needed)
 * @param a - First operand
 * @param b - Second operand
 * @param scene - Scene to create the texture in (used only when a GPU pass is needed)
 * @param outputColorSpace - Optional output color space. When `TextureColorSpace.SRGB`, the linear
 *   result is converted to sRGB (IEC 61966-2-1) before being written. Defaults to `TextureColorSpace.Linear`.
 * @param outputChannelMask - Optional bitmask of channels to write. Excluded color channels are set to
 *   `0.0`; excluded alpha is set to `1.0`. Defaults to `ChannelMask.RGBA` (all channels written).
 * @returns An operand whose `texture` holds the GPU result, or whose `factor` holds the CPU-folded constant
 */
export declare function MaxTexturesAsync(name: string, a: ITextureProcessOperand, b: ITextureProcessOperand, scene: Scene, outputColorSpace?: TextureColorSpace, outputChannelMask?: ChannelMask): Promise<ITextureProcessOperand>;
/**
 * Linearly interpolate between two texture operands: `result = mix(a, b, t)`.
 *
 * Each operand can be a texture, a constant factor, or a texture scaled by a factor.
 * The `t` operand controls the blend weight per texel, per channel — a value of 0 returns `a`,
 * a value of 1 returns `b`. Use a grayscale texture or a scalar `Color4(v, v, v, v)` for
 * uniform blending across all channels.
 *
 * If all three operands are constant (no textures), the interpolation is performed on the CPU and
 * the result is returned as a factor-only operand with no texture allocated.
 *
 * When operands are results of previous operations (i.e. they carry a `dispose` function),
 * their intermediate textures are automatically released after the GPU pass completes.
 *
 * @param name - Name for the resulting procedural texture (used only when a GPU pass is needed)
 * @param a - Start value operand (returned when t = 0)
 * @param b - End value operand (returned when t = 1)
 * @param t - Blend weight operand. Each channel independently controls the blend for the corresponding output channel.
 * @param scene - Scene to create the texture in (used only when a GPU pass is needed)
 * @param outputColorSpace - Optional output color space. When `TextureColorSpace.SRGB`, the linear
 *   result is converted to sRGB (IEC 61966-2-1) before being written. Defaults to `TextureColorSpace.Linear`.
 * @param outputChannelMask - Optional bitmask of channels to write. Excluded color channels are set to
 *   `0.0`; excluded alpha is set to `1.0`. Defaults to `ChannelMask.RGBA` (all channels written).
 * @returns An operand whose `texture` holds the GPU result, or whose `factor` holds the CPU-folded constant
 */
export declare function LerpTexturesAsync(name: string, a: ITextureProcessOperand, b: ITextureProcessOperand, t: ITextureProcessOperand, scene: Scene, outputColorSpace?: TextureColorSpace, outputChannelMask?: ChannelMask): Promise<ITextureProcessOperand>;
/**
 * Invert selected channels of a texture operand: `result[ch] = 1 - input[ch]`.
 *
 * The `channels` bitmask selects which channels are inverted; unselected channels pass through
 * unchanged. Use `ChannelMask.RGB` for the common roughness↔smoothness conversion, or
 * `ChannelMask.RGBA` (the default) to invert the entire texture.
 *
 * This is a unary operation — only operand A is used. Any `colorSpace` or `channel` properties
 * on the input operand are honoured (sRGB linearization and channel swizzle applied before
 * the invert).
 *
 * If the input is constant (no texture), the invert is performed on the CPU.
 *
 * When the input is the result of a previous operation (i.e. it carries a `dispose` function),
 * its intermediate texture is automatically released after the GPU pass completes.
 *
 * @param name - Name for the resulting procedural texture (used only when a GPU pass is needed)
 * @param input - Operand to invert
 * @param scene - Scene to create the texture in (used only when a GPU pass is needed)
 * @param channels - Bitmask of channels to invert. Defaults to `ChannelMask.RGBA`.
 * @param outputColorSpace - Optional output color space. When `TextureColorSpace.SRGB`, the linear
 *   result is converted to sRGB (IEC 61966-2-1) before being written. Defaults to `TextureColorSpace.Linear`.
 * @param outputChannelMask - Optional bitmask of channels to write. Excluded color channels are set to
 *   `0.0`; excluded alpha is set to `1.0`. Defaults to `ChannelMask.RGBA` (all channels written).
 * @returns An operand whose `texture` holds the GPU result, or whose `factor` holds the CPU-folded constant
 */
export declare function InvertTextureAsync(name: string, input: ITextureProcessOperand, scene: Scene, channels?: ChannelMask, outputColorSpace?: TextureColorSpace, outputChannelMask?: ChannelMask): Promise<ITextureProcessOperand>;
/**
 * Extract the per-texel maximum channel value from a texture and broadcast it to all output
 * channels, producing a single-value (greyscale) texture in a single GPU pass.
 *
 * For each texel, computes `max(r, g, b)` — or `max(r, g, b, a)` when `includeAlpha` is true —
 * and writes that scalar to the output:
 * - `includeAlpha = false` (default): output is `(m, m, m, a)` where `m = max(r, g, b)`
 * - `includeAlpha = true`:            output is `(m, m, m, m)` where `m = max(r, g, b, a)`
 *
 * This is more efficient than chaining `ExtractChannelAsync` calls through `MaxTexturesAsync`,
 * which would require multiple intermediate textures and GPU passes.
 *
 * Any `colorSpace` or `channel` properties on the input operand are honoured (sRGB linearization
 * and channel swizzle applied before the max reduction).
 *
 * If the input is constant (no texture), the reduction is performed on the CPU.
 *
 * When the input is the result of a previous operation (i.e. it carries a `dispose` function),
 * its intermediate texture is automatically released after the GPU pass completes.
 *
 * @param name - Name for the resulting procedural texture (used only when a GPU pass is needed)
 * @param input - Operand to reduce
 * @param scene - Scene to create the texture in (used only when a GPU pass is needed)
 * @param includeAlpha - When true, alpha participates in the max and is also set to the result.
 *   Defaults to false (alpha is preserved from the input).
 * @param outputColorSpace - Optional output color space. When `TextureColorSpace.SRGB`, the linear
 *   result is converted to sRGB (IEC 61966-2-1) before being written. Defaults to `TextureColorSpace.Linear`.
 * @param outputChannelMask - Optional bitmask of channels to write. Excluded color channels are set to
 *   `0.0`; excluded alpha is set to `1.0`. Defaults to `ChannelMask.RGBA` (all channels written).
 * @returns An operand whose `texture` holds the GPU result, or whose `factor` holds the CPU-folded constant
 */
export declare function ExtractMaxChannelAsync(name: string, input: ITextureProcessOperand, scene: Scene, includeAlpha?: boolean, outputColorSpace?: TextureColorSpace, outputChannelMask?: ChannelMask): Promise<ITextureProcessOperand>;
/**
 * Extract a single channel from a texture and broadcast it to RGB (or all four components for
 * `TextureChannel.A`), producing a new texture. This is a convenience wrapper over
 * `MultiplyTexturesAsync` with a `(1,1,1,1)` factor and the requested channel swizzle applied
 * to the input.
 *
 * Swizzle results per channel:
 * - `TextureChannel.R` → (r, r, r, a)
 * - `TextureChannel.G` → (g, g, g, a)
 * - `TextureChannel.B` → (b, b, b, a)
 * - `TextureChannel.A` → (a, a, a, a)
 *
 * If the input is constant (no texture), the swizzle is applied on the CPU.
 *
 * Any `colorSpace` property on the input operand is honoured (sRGB linearization applied before
 * the swizzle). Any existing `channel` on the input is replaced by the `channel` argument.
 *
 * When the input is the result of a previous operation (i.e. it carries a `dispose` function),
 * its intermediate texture is automatically released after the GPU pass completes.
 *
 * @param name - Name for the resulting procedural texture (used only when a GPU pass is needed)
 * @param input - Operand to extract the channel from
 * @param channel - The channel to extract and broadcast
 * @param scene - Scene to create the texture in (used only when a GPU pass is needed)
 * @param outputColorSpace - Optional output color space. When `TextureColorSpace.SRGB`, the linear
 *   result is converted to sRGB (IEC 61966-2-1) before being written. Defaults to `TextureColorSpace.Linear`.
 * @param outputChannelMask - Optional bitmask of channels to write. Excluded color channels are set to
 *   `0.0`; excluded alpha is set to `1.0`. Defaults to `ChannelMask.RGBA` (all channels written).
 * @returns An operand whose `texture` holds the GPU result, or whose `factor` holds the CPU-folded constant
 */
export declare function ExtractChannelAsync(name: string, input: ITextureProcessOperand, channel: TextureChannel, scene: Scene, outputColorSpace?: TextureColorSpace, outputChannelMask?: ChannelMask): Promise<ITextureProcessOperand>;
