/** This file must only contain pure code and pure imports */

import { PostProcess } from "../PostProcesses/postProcess.pure.js";
import { PostProcessManager } from "../PostProcesses/postProcessManager.js";
import { ThinMinMaxReducer, ThinMinMaxReducerPostProcess } from "./thinMinMaxReducer.js";
/**
 * This class computes a min/max reduction from a texture: it means it computes the minimum
 * and maximum values from all values of the texture.
 * It is performed on the GPU for better performances, thanks to a succession of post processes.
 * The source values are read from the red channel of the texture.
 */
export class MinMaxReducer {
    /**
     * Observable triggered when the computation has been performed
     */
    get onAfterReductionPerformed() {
        return this._thinMinMaxReducer.onAfterReductionPerformed;
    }
    /**
     * Creates a min/max reducer
     * @param camera The camera to use for the post processes
     */
    constructor(camera) {
        this._onAfterUnbindObserver = null;
        this._forceFullscreenViewport = true;
        this._activated = false;
        this._camera = camera;
        this._postProcessManager = new PostProcessManager(camera.getScene());
        this._thinMinMaxReducer = new ThinMinMaxReducer(camera.getScene());
        this._reductionSteps = [];
        this._onContextRestoredObserver = camera.getEngine().onContextRestoredObservable.add(() => {
            this._postProcessManager._rebuild();
        });
    }
    /**
     * Gets the texture used to read the values from.
     */
    get sourceTexture() {
        return this._sourceTexture;
    }
    /**
     * Sets the source texture to read the values from.
     * One must indicate if the texture is a depth texture or not through the depthRedux parameter
     * because in such textures '1' value must not be taken into account to compute the maximum
     * as this value is used to clear the texture.
     * Note that the computation is not activated by calling this function, you must call activate() for that!
     * @param sourceTexture The texture to read the values from. The values should be in the red channel.
     * @param depthRedux Indicates if the texture is a depth texture or not
     * @param type The type of the textures created for the reduction (defaults to TEXTURETYPE_HALF_FLOAT)
     * @param forceFullscreenViewport Forces the post processes used for the reduction to be applied without taking into account viewport (defaults to true)
     */
    setSourceTexture(sourceTexture, depthRedux, type = 2, forceFullscreenViewport = true) {
        if (sourceTexture === this._sourceTexture) {
            return;
        }
        this._thinMinMaxReducer.depthRedux = depthRedux;
        this.deactivate();
        this._sourceTexture = sourceTexture;
        this._forceFullscreenViewport = forceFullscreenViewport;
        if (this._thinMinMaxReducer.setTextureDimensions(sourceTexture.getRenderWidth(), sourceTexture.getRenderHeight())) {
            this._disposePostProcesses();
            const reductionSteps = this._thinMinMaxReducer.reductionSteps;
            for (let i = 0; i < reductionSteps.length; ++i) {
                const reductionStep = reductionSteps[i];
                const postProcess = new PostProcess(reductionStep.name, ThinMinMaxReducerPostProcess.FragmentUrl, {
                    effectWrapper: reductionStep,
                    samplingMode: 1,
                    engine: this._camera.getScene().getEngine(),
                    textureType: type,
                    textureFormat: 7,
                    size: { width: reductionStep.textureWidth, height: reductionStep.textureHeight },
                });
                this._reductionSteps.push(postProcess);
                postProcess.autoClear = false;
                postProcess.forceFullscreenViewport = forceFullscreenViewport;
                if (i === 0) {
                    postProcess.externalTextureSamplerBinding = true;
                    postProcess.onApplyObservable.add((effect) => {
                        effect.setTexture("textureSampler", this._sourceTexture);
                    });
                }
                if (i === reductionSteps.length - 1) {
                    this._reductionSteps[i - 1].onAfterRenderObservable.add(() => {
                        this._thinMinMaxReducer.readMinMax(postProcess.inputTexture.texture);
                    });
                }
            }
        }
    }
    /**
     * Defines the refresh rate of the computation.
     * Use 0 to compute just once, 1 to compute on every frame, 2 to compute every two frames and so on...
     */
    get refreshRate() {
        return this._sourceTexture ? this._sourceTexture.refreshRate : -1;
    }
    set refreshRate(value) {
        if (this._sourceTexture) {
            this._sourceTexture.refreshRate = value;
        }
    }
    /**
     * Gets the activation status of the reducer
     */
    get activated() {
        return this._activated;
    }
    /**
     * Activates the reduction computation.
     * When activated, the observers registered in onAfterReductionPerformed are
     * called after the computation is performed
     */
    activate() {
        if (this._onAfterUnbindObserver || !this._sourceTexture) {
            return;
        }
        this._onAfterUnbindObserver = this._sourceTexture.onAfterUnbindObservable.add(() => {
            const engine = this._camera.getScene().getEngine();
            engine._debugPushGroup?.(`min max reduction`);
            this._reductionSteps[0].activate(this._camera);
            this._postProcessManager.directRender(this._reductionSteps, this._reductionSteps[0].inputTexture, this._forceFullscreenViewport, 0, 0, true, this._reductionSteps.length - 1);
            engine.unBindFramebuffer(this._reductionSteps[this._reductionSteps.length - 1].inputTexture, false);
            engine._debugPopGroup?.();
        });
        this._activated = true;
    }
    /**
     * Deactivates the reduction computation.
     */
    deactivate() {
        if (!this._onAfterUnbindObserver || !this._sourceTexture) {
            return;
        }
        this._sourceTexture.onAfterUnbindObservable.remove(this._onAfterUnbindObserver);
        this._onAfterUnbindObserver = null;
        this._activated = false;
    }
    /**
     * Disposes the min/max reducer
     * @param disposeAll true to dispose all the resources. You should always call this function with true as the parameter (or without any parameter as it is the default one). This flag is meant to be used internally.
     */
    dispose(disposeAll = true) {
        if (!disposeAll) {
            return;
        }
        this.onAfterReductionPerformed.clear();
        this._camera.getEngine().onContextRestoredObservable.remove(this._onContextRestoredObserver);
        this._onContextRestoredObserver = undefined;
        this._disposePostProcesses();
        this._postProcessManager.dispose();
        this._postProcessManager = undefined;
        this._thinMinMaxReducer.dispose();
        this._thinMinMaxReducer = undefined;
        this._sourceTexture = null;
    }
    _disposePostProcesses() {
        for (let i = 0; i < this._reductionSteps.length; ++i) {
            this._reductionSteps[i].dispose();
        }
        this._reductionSteps.length = 0;
    }
}
//# sourceMappingURL=minMaxReducer.pure.js.map