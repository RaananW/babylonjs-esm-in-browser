/** This file must only contain pure code and pure imports */
import { type Engine } from "../../Engines/engine.pure.js";
import { type WebXRSessionManager } from "../webXRSessionManager.js";
import { WebXRAbstractFeature } from "./WebXRAbstractFeature.js";
import { type Nullable } from "../../types.js";
import { type IWebXRRenderTargetTextureProvider } from "../webXRRenderTargetTextureProvider.js";
import { type Viewport } from "../../Maths/math.viewport.js";
import { type Scene } from "../../scene.pure.js";
import { RenderTargetTexture } from "../../Materials/Textures/renderTargetTexture.pure.js";
/**
 * Used for Space Warp render process
 */
export declare class XRSpaceWarpRenderTarget extends RenderTargetTexture {
    private _velocityMaterial;
    private _originalPairing;
    private _previousWorldMatrices;
    private _previousTransforms;
    /**
     * Creates a Space Warp render target
     * @param motionVectorTexture WebGLTexture provided by WebGLSubImage
     * @param depthStencilTexture WebGLTexture provided by WebGLSubImage
     * @param scene scene used with the render target
     * @param size the size of the render target (used for each view)
     */
    constructor(motionVectorTexture: WebGLTexture, depthStencilTexture: WebGLTexture, scene?: Scene, size?: number | {
        width: number;
        height: number;
    } | {
        ratio: number;
    });
    render(useCameraPostProcess?: boolean, dumpForDebug?: boolean): void;
    /**
     * @internal
     */
    _bindFrameBuffer(): void;
    /**
     * Gets the number of views the corresponding to the texture (eg. a SpaceWarpRenderTarget will have > 1)
     * @returns the view count
     */
    getViewCount(): number;
    dispose(): void;
}
/**
 * WebXR Space Warp Render Target Texture Provider
 */
export declare class WebXRSpaceWarpRenderTargetTextureProvider implements IWebXRRenderTargetTextureProvider {
    protected readonly _scene: Scene;
    protected readonly _xrSessionManager: WebXRSessionManager;
    protected readonly _xrWebGLBinding: XRWebGLBinding;
    protected _lastSubImages: Map<XRView, XRWebGLSubImage>;
    protected _renderTargetTextures: Map<XREye, RenderTargetTexture>;
    protected _framebufferDimensions: Nullable<{
        framebufferWidth: number;
        framebufferHeight: number;
    }>;
    protected _engine: Engine;
    constructor(_scene: Scene, _xrSessionManager: WebXRSessionManager, _xrWebGLBinding: XRWebGLBinding);
    private _getSubImageForView;
    protected _setViewportForSubImage(viewport: Viewport, subImage: XRWebGLSubImage): void;
    protected _createRenderTargetTexture(width: number, height: number, framebuffer: Nullable<WebGLFramebuffer>, motionVectorTexture: WebGLTexture, depthStencilTexture: WebGLTexture): RenderTargetTexture;
    protected _getRenderTargetForSubImage(subImage: XRWebGLSubImage, view: XRView): RenderTargetTexture;
    trySetViewportForView(viewport: Viewport, view: XRView): boolean;
    /**
     * Access the motion vector (which will turn on Space Warp)
     * @param view the view to access the motion vector texture for
     */
    accessMotionVector(view: XRView): void;
    /**
     * Gets the render target texture for the specified eye
     * @param _eye the eye to get the render target texture for
     * @returns the render target texture or null
     */
    getRenderTargetTextureForEye(_eye: XREye): Nullable<RenderTargetTexture>;
    getRenderTargetTextureForView(view: XRView): Nullable<RenderTargetTexture>;
    dispose(): void;
}
/**
 * the WebXR Space Warp feature.
 */
export declare class WebXRSpaceWarp extends WebXRAbstractFeature {
    /**
     * The module's name
     */
    static readonly Name: "xr-space-warp";
    /**
     * The (Babylon) version of this module.
     * This is an integer representing the implementation version.
     * This number does not correspond to the WebXR specs version
     */
    static readonly Version = 1;
    /**
     * The space warp provider
     */
    spaceWarpRTTProvider: Nullable<WebXRSpaceWarpRenderTargetTextureProvider>;
    private _xrWebGLBinding;
    private _renderTargetTexture;
    private _onAfterRenderObserver;
    /**
     * constructor for the space warp feature
     * @param _xrSessionManager the xr session manager for this feature
     */
    constructor(_xrSessionManager: WebXRSessionManager);
    /**
     * Attach this feature.
     * Will usually be called by the features manager.
     *
     * @returns true if successful.
     */
    attach(): boolean;
    detach(): boolean;
    private _onAfterRender;
    dependsOn: string[];
    isCompatible(): boolean;
    dispose(): void;
    protected _onXRFrame(_xrFrame: XRFrame): void;
}
/**
 * Register side effects for webXRSpaceWarp.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterWebXRSpaceWarp(): void;
