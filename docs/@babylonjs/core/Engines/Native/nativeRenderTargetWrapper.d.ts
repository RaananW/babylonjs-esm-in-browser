import { type Nullable } from "../../types.js";
import { type InternalTexture } from "../../Materials/Textures/internalTexture.js";
import { type TextureSize } from "../../Materials/Textures/textureCreationOptions.js";
import { RenderTargetWrapper } from "../renderTargetWrapper.js";
import { type NativeFramebuffer } from "./nativeInterfaces.js";
import { type ThinNativeEngine } from "../thinNativeEngine.js";
export declare class NativeRenderTargetWrapper extends RenderTargetWrapper {
    readonly _engine: ThinNativeEngine;
    private __framebuffer;
    private __framebufferDepthStencil;
    private __framebuffers;
    get _framebuffer(): Nullable<NativeFramebuffer>;
    set _framebuffer(framebuffer: Nullable<NativeFramebuffer>);
    get _framebuffers(): Nullable<NativeFramebuffer[]>;
    set _framebuffers(framebuffers: Nullable<NativeFramebuffer[]>);
    get _framebufferDepthStencil(): Nullable<NativeFramebuffer>;
    set _framebufferDepthStencil(framebufferDepthStencil: Nullable<NativeFramebuffer>);
    constructor(isMulti: boolean, isCube: boolean, size: TextureSize, engine: ThinNativeEngine);
    setTexture(texture: InternalTexture, index?: number, disposePrevious?: boolean): void;
    dispose(disposeOnlyFramebuffers?: boolean): void;
}
