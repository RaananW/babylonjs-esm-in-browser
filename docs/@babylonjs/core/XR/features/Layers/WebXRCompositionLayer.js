import { Observable } from "../../../Misc/observable.js";
import { WebXRLayerWrapper } from "../../webXRLayerWrapper.js";
import { WebXRLayerRenderTargetTextureProvider } from "../../webXRRenderTargetTextureProvider.js";
import { WebXRWebGLRenderTargetTextureProvider } from "../../webXRWebGLRenderTargetTextureProvider.js";
import { Quaternion, Vector3 } from "../../../Maths/math.vector.pure.js";
/**
 * Wraps an XR composition layer and creates its Babylon render target provider.
 * @typeParam LayerT the concrete WebXR composition layer type
 * @see https://playground.babylonjs.com/#TODARD#0
 */
export class WebXRCompositionLayerWrapper extends WebXRLayerWrapper {
    /**
     * Whether the native layer exposes compositor opacity control.
     */
    get isOpacitySupported() {
        return "opacity" in this.layer;
    }
    /**
     * Gets the compositor opacity applied to this layer.
     * @returns The native opacity in the range 0 to 1.
     * @throws If opacity is not supported by the active XR runtime.
     */
    get opacity() {
        this._assertControlSupported("opacity");
        return this.layer.opacity;
    }
    /**
     * Sets the compositor opacity applied to this layer.
     * The native runtime clamps the value to the range 0 to 1.
     * @param value The desired opacity.
     * @throws If opacity is not supported by the active XR runtime.
     */
    set opacity(value) {
        this._assertControlSupported("opacity");
        this.layer.opacity = value;
    }
    /**
     * Whether the native layer exposes compositor quality hints.
     */
    get isQualitySupported() {
        return "quality" in this.layer;
    }
    /**
     * Gets the compositor quality hint applied to this layer.
     * @returns The current native layer quality hint.
     * @throws If quality hints are not supported by the active XR runtime.
     */
    get quality() {
        this._assertControlSupported("quality");
        return this.layer.quality;
    }
    /**
     * Sets the compositor quality hint applied to this layer.
     * @param value The desired quality hint.
     * @throws If quality hints are not supported by the active XR runtime, or the native runtime rejects the value.
     */
    set quality(value) {
        this._assertControlSupported("quality");
        this.layer.quality = value;
    }
    /**
     * Whether the native layer exposes mono-presentation control.
     */
    get isForceMonoPresentationSupported() {
        return "forceMonoPresentation" in this.layer;
    }
    /**
     * Gets whether the compositor presents the left-eye layer configuration to both eyes.
     * @returns Whether mono presentation is forced.
     * @throws If mono presentation control is not supported by the active XR runtime.
     */
    get forceMonoPresentation() {
        this._assertControlSupported("forceMonoPresentation");
        return this.layer.forceMonoPresentation;
    }
    /**
     * Sets whether the compositor presents the left-eye layer configuration to both eyes.
     * Applications should continue rendering both eyes when this is enabled.
     * @param value Whether to force mono presentation.
     * @throws If mono presentation control is not supported by the active XR runtime.
     */
    set forceMonoPresentation(value) {
        this._assertControlSupported("forceMonoPresentation");
        this.layer.forceMonoPresentation = value;
    }
    constructor(getWidth, getHeight, layer, layerType, 
    /**
     * Whether the layer renders both views into a texture array.
     */
    isMultiview, createRTTProvider, _originalInternalTexture = null, _destroyLayerOnDispose = false, 
    /**
     * Whether the layer can only be rendered when its native `needsRedraw` flag is set.
     */
    isStatic = false) {
        super(getWidth, getHeight, layer, layerType, createRTTProvider);
        this.getWidth = getWidth;
        this.getHeight = getHeight;
        this.layer = layer;
        this.layerType = layerType;
        this.isMultiview = isMultiview;
        this.createRTTProvider = createRTTProvider;
        this._originalInternalTexture = _originalInternalTexture;
        this._destroyLayerOnDispose = _destroyLayerOnDispose;
        this.isStatic = isStatic;
        /**
         * Whether this layer receives its content directly from an HTML media element.
         */
        this.isMediaLayer = false;
        /**
         * Whether Babylon should acquire subimages and expose render target textures for this layer.
         */
        this.usesRenderTargetProvider = true;
    }
    _assertControlSupported(control) {
        if (!(control in this.layer)) {
            throw new Error(`XRCompositionLayer.${control} is not supported by this XR runtime.`);
        }
    }
    /**
     * Disposes the Babylon render-target resources and destroys the native layer when this wrapper owns it.
     */
    dispose() {
        super.dispose();
        if (this._destroyLayerOnDispose) {
            this.layer.destroy();
        }
    }
}
/**
 * Wraps a positionable XR composition layer and synchronizes it with a Babylon transform node.
 * The node's scaling does not affect the physical dimensions of the layer.
 * @typeParam LayerT the concrete positionable WebXR layer type
 */
export class WebXRSpatialLayerWrapper extends WebXRCompositionLayerWrapper {
    constructor(getWidth, getHeight, layer, layerType, isMultiview, isStatic, 
    /**
     * Whether the layer should follow changes to the session manager's reference space.
     */
    usesSessionReferenceSpace, createRTTProvider, 
    /**
     * The Babylon node whose world position and rotation are applied to the native layer.
     */
    transformNode, _ownsTransformNode) {
        super(getWidth, getHeight, layer, layerType, isMultiview, createRTTProvider, null, true, isStatic);
        this.usesSessionReferenceSpace = usesSessionReferenceSpace;
        this.transformNode = transformNode;
        this._ownsTransformNode = _ownsTransformNode;
        this._currentPosition = new Vector3();
        this._currentRotation = new Quaternion();
        this._lastPosition = new Vector3(Number.NaN, Number.NaN, Number.NaN);
        this._lastRotation = new Quaternion(Number.NaN, Number.NaN, Number.NaN, Number.NaN);
    }
    /**
     * Synchronizes the native layer with the current world transform of the Babylon node.
     * @param useRightHandedSystem whether the Babylon scene uses right-handed coordinates
     * @param worldScalingFactor the number of Babylon scene units represented by one meter
     */
    updateFromTransformNode(useRightHandedSystem, worldScalingFactor) {
        this.transformNode.computeWorldMatrix(true).decompose(undefined, this._currentRotation, this._currentPosition);
        this._currentPosition.scaleInPlace(1 / worldScalingFactor);
        if (!useRightHandedSystem) {
            this._currentPosition.z *= -1;
            this._currentRotation.z *= -1;
            this._currentRotation.w *= -1;
        }
        if (this._currentPosition.equals(this._lastPosition) && this._currentRotation.equals(this._lastRotation)) {
            return;
        }
        this._lastPosition.copyFrom(this._currentPosition);
        this._lastRotation.copyFrom(this._currentRotation);
        const orientation = {
            x: this._currentRotation.x,
            y: this._currentRotation.y,
            z: this._currentRotation.z,
            w: this._currentRotation.w,
        };
        if (this.layerType === "XRCubeLayer") {
            this.layer.orientation =
                typeof DOMPointReadOnly === "undefined" ? orientation : new DOMPointReadOnly(orientation.x, orientation.y, orientation.z, orientation.w);
        }
        else {
            this.layer.transform = new XRRigidTransform({
                x: this._currentPosition.x,
                y: this._currentPosition.y,
                z: this._currentPosition.z,
            }, orientation);
        }
    }
    /**
     * Disposes the native layer wrapper and its Babylon transform node when the node was created by Babylon.
     */
    dispose() {
        super.dispose();
        if (this._ownsTransformNode) {
            this.transformNode.dispose();
        }
    }
}
/**
 * Wraps an XRMediaBinding layer.
 * @typeParam LayerT the concrete media layer type
 */
export class WebXRMediaLayerWrapper extends WebXRSpatialLayerWrapper {
    /**
     * Creates a wrapper for a media-backed spatial layer.
     * @param getWidth returns the current video width
     * @param getHeight returns the current video height
     * @param layer the native media composition layer
     * @param layerType the concrete spatial layer type
     * @param transformNode the Babylon transform synchronized with the native layer
     * @param ownsTransformNode whether the wrapper should dispose the transform node
     * @param usesSessionReferenceSpace whether the layer should follow session reference-space changes
     */
    constructor(getWidth, getHeight, layer, layerType, transformNode, ownsTransformNode, usesSessionReferenceSpace) {
        super(getWidth, getHeight, layer, layerType, false, false, usesSessionReferenceSpace, (sessionManager) => new WebXRNoRenderTargetTextureProvider(sessionManager, this), transformNode, ownsTransformNode);
        /**
         * Media layers receive their contents directly from the user agent.
         */
        this.isMediaLayer = true;
        /**
         * Media layers are populated directly by the user agent.
         */
        this.usesRenderTargetProvider = false;
    }
}
/**
 * Wraps a native cube layer and exposes its raw subimage.
 * Cube layers require six face uploads or render passes and therefore do not use Babylon's 2D composition-layer render target provider.
 */
export class WebXRCubeLayerWrapper extends WebXRSpatialLayerWrapper {
    constructor(getWidth, getHeight, layer, isStatic, usesSessionReferenceSpace, _binding, transformNode, ownsTransformNode) {
        super(getWidth, getHeight, layer, "XRCubeLayer", false, isStatic, usesSessionReferenceSpace, (sessionManager) => new WebXRNoRenderTargetTextureProvider(sessionManager, this), transformNode, ownsTransformNode);
        this._binding = _binding;
        /**
         * Cube layers are populated through raw cubemap or array-layer access.
         */
        this.usesRenderTargetProvider = false;
    }
    /**
     * Gets the compositor-owned cube subimage for the current frame.
     * WebGL callers must populate all six cubemap faces. WebGPU callers must render to six consecutive array layers beginning at the descriptor's base array layer.
     * @param frame the current XR frame
     * @param eye the eye to retrieve for stereo cube layers
     * @returns the raw WebGL or WebGPU cube subimage
     */
    getSubImage(frame, eye) {
        return this._binding.getSubImage(this.layer, frame, eye);
    }
}
/**
 * Composition layers that are populated outside Babylon do not expose render targets.
 * @internal
 */
class WebXRNoRenderTargetTextureProvider extends WebXRLayerRenderTargetTextureProvider {
    /**
     * Creates a no-render-target provider.
     * @param sessionManager the current XR session manager
     * @param layerWrapper the composition layer wrapper
     */
    constructor(sessionManager, layerWrapper) {
        super(sessionManager.scene, layerWrapper);
    }
    /**
     * Media layers do not expose a viewport.
     * @param _viewport unused viewport
     * @param _view unused XR view
     * @returns always `false`
     */
    trySetViewportForView(_viewport, _view) {
        return false;
    }
    /**
     * Media layers do not expose render target textures.
     * @param _eye unused XR eye
     * @returns always `null`
     */
    getRenderTargetTextureForEye(_eye) {
        return null;
    }
    /**
     * Media layers do not expose render target textures.
     * @param _view unused XR view
     * @returns always `null`
     */
    getRenderTargetTextureForView(_view) {
        return null;
    }
}
/**
 * Provides render target textures and other important rendering information for a given XRCompositionLayer.
 * @internal
 */
export class WebXRCompositionLayerRenderTargetTextureProvider extends WebXRWebGLRenderTargetTextureProvider {
    constructor(_xrSessionManager, _xrWebGLBinding, layerWrapper) {
        super(_xrSessionManager.scene, layerWrapper);
        this._xrSessionManager = _xrSessionManager;
        this._xrWebGLBinding = _xrWebGLBinding;
        this.layerWrapper = layerWrapper;
        this._lastSubImages = new Map();
        /**
         * Fires every time a new render target texture is created (either for eye, for view, or for the entire frame)
         */
        this.onRenderTargetTextureCreatedObservable = new Observable();
        this._compositionLayer = layerWrapper.layer;
    }
    _getRenderTargetForSubImage(subImage, eye = "none") {
        const lastSubImage = this._lastSubImages.get(eye);
        const eyeIndex = eye == "right" ? 1 : 0;
        const colorTextureWidth = subImage.colorTextureWidth ?? subImage.textureWidth;
        const colorTextureHeight = subImage.colorTextureHeight ?? subImage.textureHeight;
        if (!this._renderTargetTextures[eyeIndex] || lastSubImage?.textureWidth !== colorTextureWidth || lastSubImage?.textureHeight !== colorTextureHeight) {
            let depthStencilTexture;
            const depthStencilTextureWidth = subImage.depthStencilTextureWidth ?? colorTextureWidth;
            const depthStencilTextureHeight = subImage.depthStencilTextureHeight ?? colorTextureHeight;
            if (colorTextureWidth === depthStencilTextureWidth || colorTextureHeight === depthStencilTextureHeight) {
                depthStencilTexture = subImage.depthStencilTexture;
            }
            this._renderTargetTextures[eyeIndex] = this._createRenderTargetTexture(colorTextureWidth, colorTextureHeight, null, subImage.colorTexture, depthStencilTexture, this.layerWrapper.isMultiview);
            this._framebufferDimensions = {
                framebufferWidth: colorTextureWidth,
                framebufferHeight: colorTextureHeight,
            };
            this.onRenderTargetTextureCreatedObservable.notifyObservers({ texture: this._renderTargetTextures[eyeIndex], eye });
        }
        this._lastSubImages.set(eye, subImage);
        return this._renderTargetTextures[eyeIndex];
    }
    _getSubImageForEye(eye) {
        const currentFrame = this._xrSessionManager.currentFrame;
        if (currentFrame) {
            return this._xrWebGLBinding.getSubImage(this._compositionLayer, currentFrame, eye);
        }
        return null;
    }
    getRenderTargetTextureForEye(eye) {
        const subImage = this._getSubImageForEye(eye);
        if (subImage) {
            return this._getRenderTargetForSubImage(subImage, eye);
        }
        return null;
    }
    getRenderTargetTextureForView(view) {
        return this.getRenderTargetTextureForEye(view?.eye);
    }
    _setViewportForSubImage(viewport, subImage) {
        const textureWidth = subImage.colorTextureWidth ?? subImage.textureWidth;
        const textureHeight = subImage.colorTextureHeight ?? subImage.textureHeight;
        const xrViewport = subImage.viewport;
        viewport.x = xrViewport.x / textureWidth;
        viewport.y = xrViewport.y / textureHeight;
        viewport.width = xrViewport.width / textureWidth;
        viewport.height = xrViewport.height / textureHeight;
    }
    trySetViewportForView(viewport, view) {
        const subImage = this._lastSubImages.get(view.eye) || this._getSubImageForEye(view.eye);
        if (subImage) {
            this._setViewportForSubImage(viewport, subImage);
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=WebXRCompositionLayer.js.map