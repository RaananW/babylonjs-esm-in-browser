/** This file must only contain pure code and pure imports */
import { type TextureSize } from "../../Materials/Textures/textureCreationOptions.js";
/**
 * Type used to define a texture size (either with a number or with a rect width and height)
 * @deprecated please use TextureSize instead
 */
export type RenderTargetTextureSize = TextureSize;
/**
 * Register side effects for enginesExtensionsEngineRenderTarget.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterEnginesExtensionsEngineRenderTarget(): void;
