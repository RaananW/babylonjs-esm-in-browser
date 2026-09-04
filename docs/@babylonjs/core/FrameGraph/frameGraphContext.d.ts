import { type AbstractEngine, type FrameGraphTextureManager, type Scene, type FrameGraphTextureHandle, type Nullable, type InternalTexture, type IViewportLike } from "../index.js";
/**
 * Base class for frame graph context.
 */
export declare class FrameGraphContext {
    protected readonly _engine: AbstractEngine;
    protected readonly _textureManager: FrameGraphTextureManager;
    protected readonly _scene: Scene;
    private _depthTest;
    private _depthWrite;
    /**
     * If true, debug markers will be enabled in the context.
     */
    enableDebugMarkers: boolean;
    /** @internal */
    constructor(_engine: AbstractEngine, _textureManager: FrameGraphTextureManager, _scene: Scene);
    /**
     * Renders a component without managing the render target.
     * Use this method when you have a component that handles its own rendering logic which is not fully integrated into the frame graph system.
     * @param component The component to render.
     * @param intermediateRendering If true, the scene's intermediate rendering flag will be set to true during the render call (default: true)
     */
    renderUnmanaged(component: {
        render: () => void;
    }, intermediateRendering?: boolean): void;
    /**
     * Gets a texture from a handle.
     * Note that if the texture is a history texture, the read texture for the current frame will be returned.
     * @param handle The handle of the texture
     * @returns The texture or null if not found
     */
    getTextureFromHandle(handle: FrameGraphTextureHandle): Nullable<InternalTexture>;
    /**
     * Pushes a debug group to the engine's debug stack.
     * @param name The name of the debug group
     */
    pushDebugGroup(name: string): void;
    /**
     * Pops a debug group from the engine's debug stack.
     */
    popDebugGroup(): void;
    /**
     * Inserts a debug marker in the engine's debug stack.
     * @param text The text of the debug marker
     */
    insertDebugMarker(text: string): void;
    /**
     * Saves the current depth states (depth testing and depth writing)
     */
    saveDepthStates(): void;
    /**
     * Restores the depth states saved by saveDepthStates
     */
    restoreDepthStates(): void;
    /**
     * Sets the depth states for the current render target
     * @param depthTest If true, depth testing is enabled
     * @param depthWrite If true, depth writing is enabled
     */
    setDepthStates(depthTest: boolean, depthWrite: boolean): void;
    /**
     * Sets the current viewport
     * @param viewport defines the viewport element to be used
     * @param requiredWidth defines the width required for rendering. If not provided, the width of the render texture is used.
     * @param requiredHeight defines the height required for rendering. If not provided the height of the render texture is used.
     */
    setViewport(viewport: IViewportLike, requiredWidth?: number, requiredHeight?: number): void;
}
