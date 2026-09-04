
import { Vector4 } from "../../Maths/math.vector.pure.js";
import { PostProcess } from "../../PostProcesses/postProcess.pure.js";
import { GeometryBufferRenderer } from "../../Rendering/geometryBufferRenderer.pure.js";
import { ProceduralTexture } from "../../Materials/Textures/Procedurals/proceduralTexture.pure.js";
/**
 * This should not be instanciated directly, as it is part of a scene component
 * @internal
 */
export class _IblShadowsSpatialBlurPass {
    /**
     * Is the effect enabled
     */
    get enabled() {
        return this._enabled;
    }
    set enabled(value) {
        this._enabled = value;
        // _render() already gates on `enabled`, but also disable the underlying ProceduralTexture
        // directly so it can't be rendered through any other path (e.g. Babylon's generic
        // per-frame ProceduralTexture refresh loop) while the pass is toggled off.
        if (this._outputTexture) {
            this._outputTexture.isEnabled = value;
        }
    }
    /**
     * Returns the output texture of the pass.
     * @returns The output texture.
     */
    getOutputTexture() {
        return this._outputTexture;
    }
    /**
     * Gets the debug pass post process
     * @returns The post process
     */
    getDebugPassPP() {
        if (!this._debugPassPP) {
            this._createDebugPass();
        }
        return this._debugPassPP;
    }
    /**
     * Sets the name of the debug pass
     */
    get debugPassName() {
        return this._debugPassName;
    }
    /**
     * The scale of the voxel grid in world space. This is used to scale the blur radius in world space.
     * @param scale The scale of the voxel grid in world space.
     */
    setWorldScale(scale) {
        this._worldScale = scale;
    }
    /**
     * Sets params that control the position and scaling of the debug display on the screen.
     * @param x Screen X offset of the debug display (0-1)
     * @param y Screen Y offset of the debug display (0-1)
     * @param widthScale X scale of the debug display (0-1)
     * @param heightScale Y scale of the debug display (0-1)
     */
    setDebugDisplayParams(x, y, widthScale, heightScale) {
        this._debugSizeParams.set(x, y, widthScale, heightScale);
    }
    /**
     * Creates the debug post process effect for this pass
     */
    _createDebugPass() {
        if (!this._debugPassPP) {
            const isWebGPU = this._engine.isWebGPU;
            const debugOptions = {
                width: this._engine.getRenderWidth(),
                height: this._engine.getRenderHeight(),
                textureFormat: 5,
                textureType: 0,
                samplingMode: 1,
                uniforms: ["sizeParams"],
                samplers: ["debugSampler"],
                engine: this._engine,
                reusable: false,
                shaderLanguage: isWebGPU ? 1 /* ShaderLanguage.WGSL */ : 0 /* ShaderLanguage.GLSL */,
                extraInitializations: (useWebGPU, list) => {
                    if (useWebGPU) {
                        list.push(import("../../ShadersWGSL/iblShadowDebug.fragment.js"));
                    }
                    else {
                        list.push(import("../../Shaders/iblShadowDebug.fragment.js"));
                    }
                },
            };
            this._debugPassPP = new PostProcess(this.debugPassName, "iblShadowDebug", debugOptions);
            this._debugPassPP.autoClear = false;
            this._debugPassPP.onApplyObservable.add((effect) => {
                // update the caustic texture with what we just rendered.
                effect.setTexture("debugSampler", this._outputTexture);
                effect.setVector4("sizeParams", this._debugSizeParams);
            });
        }
    }
    /**
     * Instanciates the importance sampling renderer
     * @param scene Scene to attach to
     * @param iblShadowsRenderPipeline The IBL shadows render pipeline
     * @returns The importance sampling renderer
     */
    constructor(scene, iblShadowsRenderPipeline) {
        this._worldScale = 1.0;
        this._blurParameters = new Vector4(0.0, 0.0, 0.0, 0.0);
        this._enabled = true;
        this._debugPassName = "Spatial Blur Debug Pass";
        /** Enable the debug view for this pass */
        this.debugEnabled = false;
        this._debugSizeParams = new Vector4(0.0, 0.0, 0.0, 0.0);
        this._renderWhenGBufferReady = null;
        this._scene = scene;
        this._engine = scene.getEngine();
        this._renderPipeline = iblShadowsRenderPipeline;
        this._createTextures();
    }
    _createTextures() {
        const isWebGPU = this._engine.isWebGPU;
        const textureOptions = {
            type: 0,
            format: 5,
            samplingMode: 1,
            generateDepthBuffer: false,
            generateMipMaps: false,
            shaderLanguage: isWebGPU ? 1 /* ShaderLanguage.WGSL */ : 0 /* ShaderLanguage.GLSL */,
            extraInitializationsAsync: async () => {
                if (isWebGPU) {
                    await Promise.all([import("../../ShadersWGSL/iblShadowSpatialBlur.fragment.js")]);
                }
                else {
                    await Promise.all([import("../../Shaders/iblShadowSpatialBlur.fragment.js")]);
                }
            },
        };
        this._outputTexture = new ProceduralTexture("spatialBlurPass", {
            width: this._engine.getRenderWidth(),
            height: this._engine.getRenderHeight(),
        }, "iblShadowSpatialBlur", this._scene, textureOptions, false, false, 0);
        this._outputTexture.refreshRate = -1;
        this._outputTexture.autoClear = false;
        // Need to set all the textures first so that the effect gets created with the proper uniforms.
        this._setBindings();
        this._renderWhenGBufferReady = this._render.bind(this);
        // Don't start rendering until the first vozelization is done.
        this._renderPipeline.onVoxelizationCompleteObservable.addOnce(() => {
            if (this._scene.geometryBufferRenderer) {
                this._scene.geometryBufferRenderer.getGBuffer().onAfterRenderObservable.add(this._renderWhenGBufferReady);
            }
        });
    }
    _setBindings() {
        this._outputTexture.setTexture("voxelTracingSampler", this._renderPipeline._getVoxelTracingTexture());
        const iterationCount = 1;
        this._blurParameters.set(iterationCount, this._worldScale, 0.0, 0.0);
        this._outputTexture.setVector4("blurParameters", this._blurParameters);
        const geometryBufferRenderer = this._scene.geometryBufferRenderer;
        if (!geometryBufferRenderer) {
            return false;
        }
        const depthIndex = geometryBufferRenderer.getTextureIndex(GeometryBufferRenderer.SCREENSPACE_DEPTH_TEXTURE_TYPE);
        this._outputTexture.setTexture("depthSampler", geometryBufferRenderer.getGBuffer().textures[depthIndex]);
        const wnormalIndex = geometryBufferRenderer.getTextureIndex(GeometryBufferRenderer.NORMAL_TEXTURE_TYPE);
        this._outputTexture.setTexture("worldNormalSampler", geometryBufferRenderer.getGBuffer().textures[wnormalIndex]);
        return true;
    }
    _render() {
        if (this.enabled && this._outputTexture.isReady() && this._outputTexture.getEffect()?.isReady()) {
            if (this._setBindings()) {
                this._outputTexture.render();
            }
        }
    }
    /**
     * Called by render pipeline when canvas resized.
     * @param scaleFactor The factor by which to scale the canvas size.
     */
    resize(scaleFactor = 1.0) {
        const newSize = {
            width: Math.max(1.0, Math.floor(this._engine.getRenderWidth() * scaleFactor)),
            height: Math.max(1.0, Math.floor(this._engine.getRenderHeight() * scaleFactor)),
        };
        // Don't resize if the size is the same as the current size.
        if (this._outputTexture.getSize().width === newSize.width && this._outputTexture.getSize().height === newSize.height) {
            return;
        }
        this._outputTexture.resize(newSize, false);
    }
    /**
     * Checks if the pass is ready
     * @returns true if the pass is ready
     */
    isReady() {
        return this._outputTexture.isReady() && !(this._debugPassPP && !this._debugPassPP.isReady());
    }
    /**
     * Disposes the associated resources
     */
    dispose() {
        if (this._scene.geometryBufferRenderer && this._renderWhenGBufferReady) {
            const gBuffer = this._scene.geometryBufferRenderer.getGBuffer();
            gBuffer.onAfterRenderObservable.removeCallback(this._renderWhenGBufferReady);
        }
        this._outputTexture.dispose();
        if (this._debugPassPP) {
            this._debugPassPP.dispose();
        }
    }
}
//# sourceMappingURL=iblShadowsSpatialBlurPass.js.map