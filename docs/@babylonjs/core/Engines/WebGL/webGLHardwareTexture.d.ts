import { type IHardwareTextureWrapper } from "../../Materials/Textures/hardwareTextureWrapper.js";
import { type Nullable } from "../../types.js";
/** @internal */
export declare class WebGLHardwareTexture implements IHardwareTextureWrapper {
    private _webGLTexture;
    private _context;
    private _MSAARenderBuffers;
    memoryAllocated?: boolean;
    get underlyingResource(): Nullable<WebGLTexture>;
    constructor(existingTexture: Nullable<WebGLTexture> | undefined, context: WebGLRenderingContext);
    setUsage(): void;
    set(hardwareTexture: WebGLTexture): void;
    reset(): void;
    addMSAARenderBuffer(buffer: WebGLRenderbuffer): void;
    releaseMSAARenderBuffers(): void;
    getMSAARenderBuffer(index?: number): WebGLRenderbuffer | null;
    release(): void;
}
