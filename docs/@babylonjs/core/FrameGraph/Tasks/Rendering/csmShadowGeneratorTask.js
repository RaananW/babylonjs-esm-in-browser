import { CascadedShadowGenerator } from "../../../Lights/Shadows/cascadedShadowGenerator.pure.js";
import { FrameGraphShadowGeneratorTask } from "./shadowGeneratorTask.js";
import { DirectionalLight } from "../../../Lights/directionalLight.pure.js";
import { ThinMinMaxReducer } from "../../../Misc/thinMinMaxReducer.js";
import { FrameGraphPostProcessTask } from "../PostProcesses/postProcessTask.js";

import { textureSizeIsObject } from "../../../Materials/Textures/textureCreationOptions.js";
/**
 * Task used to generate a cascaded shadow map from a list of objects.
 */
export class FrameGraphCascadedShadowGeneratorTask extends FrameGraphShadowGeneratorTask {
    /**
     * Checks if a shadow generator task is a cascaded shadow generator task.
     * @param task The task to check.
     * @returns True if the task is a cascaded shadow generator task, else false.
     */
    static IsCascadedShadowGenerator(task) {
        return task.numCascades !== undefined;
    }
    /**
     * The number of cascades.
     */
    get numCascades() {
        return this._numCascades;
    }
    set numCascades(value) {
        if (value === this._numCascades) {
            return;
        }
        this._numCascades = value;
        if (this._shadowGenerator) {
            this._shadowGenerator.numCascades = value;
            this._updateShadowMap();
        }
    }
    /**
     * Gets or sets a value indicating whether the shadow generator should display the cascades.
     */
    get debug() {
        return this._debug;
    }
    set debug(value) {
        if (value === this._debug) {
            return;
        }
        this._debug = value;
        if (this._shadowGenerator) {
            this._shadowGenerator.debug = value;
        }
    }
    /**
     * Gets or sets a value indicating whether the shadow generator should stabilize the cascades.
     */
    get stabilizeCascades() {
        return this._stabilizeCascades;
    }
    set stabilizeCascades(value) {
        if (value === this._stabilizeCascades) {
            return;
        }
        this._stabilizeCascades = value;
        if (this._shadowGenerator) {
            this._shadowGenerator.stabilizeCascades = value;
        }
    }
    /**
     * Gets or sets the lambda parameter of the shadow generator.
     */
    get lambda() {
        return this._lambda;
    }
    set lambda(value) {
        if (value === this._lambda) {
            return;
        }
        this._lambda = value;
        if (this._shadowGenerator) {
            this._shadowGenerator.lambda = value;
        }
    }
    /**
     * Gets or sets the cascade blend percentage.
     */
    get cascadeBlendPercentage() {
        return this._cascadeBlendPercentage;
    }
    set cascadeBlendPercentage(value) {
        if (value === this._cascadeBlendPercentage) {
            return;
        }
        this._cascadeBlendPercentage = value;
        if (this._shadowGenerator) {
            this._shadowGenerator.cascadeBlendPercentage = value;
        }
    }
    /**
     * Gets or sets a value indicating whether the shadow generator should use depth clamping.
     */
    get depthClamp() {
        return this._depthClamp;
    }
    set depthClamp(value) {
        if (value === this._depthClamp) {
            return;
        }
        this._depthClamp = value;
        if (this._shadowGenerator) {
            this._shadowGenerator.depthClamp = value;
        }
    }
    /**
     * Gets or sets a value indicating whether the shadow generator should automatically calculate the depth bounds.
     */
    get autoCalcDepthBounds() {
        return this._autoCalcDepthBounds;
    }
    set autoCalcDepthBounds(value) {
        if (value === this._autoCalcDepthBounds) {
            return;
        }
        this._autoCalcDepthBounds = value;
        this._currentAutoCalcDepthBoundsCounter = this._autoCalcDepthBoundsRefreshRate;
        if (!value) {
            this._shadowGenerator?.setMinMaxDistance(0, 1);
        }
        // All passes but the last one are related to min/max reduction and should be enabled/disabled depending on autoCalcDepthBounds value
        const passes = this.passes;
        for (let i = 0; i < passes.length - 1; ++i) {
            passes[i].disabled = !value;
        }
    }
    /**
     * Defines the refresh rate of the min/max computation used when autoCalcDepthBounds is set to true
     * Use 0 to compute just once, 1 to compute on every frame, 2 to compute every two frames and so on...
     */
    get autoCalcDepthBoundsRefreshRate() {
        return this._autoCalcDepthBoundsRefreshRate;
    }
    set autoCalcDepthBoundsRefreshRate(value) {
        this._autoCalcDepthBoundsRefreshRate = value;
        this._currentAutoCalcDepthBoundsCounter = this._autoCalcDepthBoundsRefreshRate;
    }
    /**
     * Gets or sets the maximum shadow Z value.
     */
    get shadowMaxZ() {
        return this._shadowMaxZ;
    }
    set shadowMaxZ(value) {
        if (value === this._shadowMaxZ) {
            return;
        }
        this._shadowMaxZ = value;
        if (this._shadowGenerator) {
            this._shadowGenerator.shadowMaxZ = value;
        }
    }
    /**
     * Creates a new shadow generator task.
     * @param name The name of the task.
     * @param frameGraph The frame graph the task belongs to.
     */
    constructor(name, frameGraph) {
        super(name, frameGraph);
        /**
         * The type of the depth texture used by the autoCalcDepthBounds feature.
         */
        this.depthTextureType = 0 /* DepthTextureType.NormalizedViewDepth */;
        this._numCascades = CascadedShadowGenerator.DEFAULT_CASCADES_COUNT;
        this._debug = false;
        this._stabilizeCascades = false;
        this._lambda = 0.5;
        this._cascadeBlendPercentage = 0.1;
        this._depthClamp = true;
        this._autoCalcDepthBounds = false;
        this._currentAutoCalcDepthBoundsCounter = 0;
        this._autoCalcDepthBoundsRefreshRate = 1;
        this._shadowMaxZ = 10000;
        this._thinMinMaxReducer = new ThinMinMaxReducer(frameGraph.scene);
        this._thinMinMaxReducer.onAfterReductionPerformed.add((minmax) => {
            if (!this._shadowGenerator) {
                return;
            }
            const camera = this.camera;
            let min = minmax.min, max = minmax.max;
            if (min >= max) {
                min = 0;
                max = 1;
            }
            else if (camera && this.depthTextureType !== 0 /* DepthTextureType.NormalizedViewDepth */) {
                if (this.depthTextureType === 2 /* DepthTextureType.ScreenDepth */) {
                    const engine = this._frameGraph.engine;
                    const projectionMatrix = camera.getProjectionMatrix();
                    const p2z = projectionMatrix.m[10];
                    const p3z = projectionMatrix.m[14];
                    if (!engine.isNDCHalfZRange) {
                        // Convert to NDC depth
                        min = min * 2 - 1;
                        max = max * 2 - 1;
                    }
                    // Convert to view depth
                    min = p3z / (min - p2z);
                    max = p3z / (max - p2z);
                }
                // Convert to normalized view depth
                const zNear = camera.minZ;
                const zFar = camera.maxZ;
                min = (min - zNear) / (zFar - zNear);
                max = (max - zNear) / (zFar - zNear);
            }
            if (min !== this._shadowGenerator.minDistance || max !== this._shadowGenerator.maxDistance) {
                this._shadowGenerator.setMinMaxDistance(min, max);
            }
        });
    }
    _createShadowGeneratorInstance() {
        if (!(this.light instanceof DirectionalLight)) {
            throw new Error(`FrameGraphCascadedShadowGeneratorTask ${this.name}: the CSM shadow generator only supports directional lights.`);
        }
        this._shadowGenerator = new CascadedShadowGenerator(this.mapSize, this.light, this.useFloat32TextureType, this.camera, this.useRedTextureFormat);
    }
    _createShadowGenerator() {
        if (super._createShadowGenerator()) {
            const shadowGenerator = this._shadowGenerator;
            if (shadowGenerator === undefined) {
                return;
            }
            shadowGenerator.numCascades = this._numCascades;
            shadowGenerator.debug = this._debug;
            shadowGenerator.stabilizeCascades = this._stabilizeCascades;
            shadowGenerator.lambda = this._lambda;
            shadowGenerator.cascadeBlendPercentage = this._cascadeBlendPercentage;
            shadowGenerator.depthClamp = this._depthClamp;
            shadowGenerator.shadowMaxZ = this._shadowMaxZ;
            return true;
        }
        return false;
    }
    getClassName() {
        return "FrameGraphCascadedShadowGeneratorTask";
    }
    record() {
        if (this.light === undefined || this.objectList === undefined || this.camera === undefined) {
            throw new Error(`FrameGraphCascadedShadowGeneratorTask ${this.name}: light, objectList and camera are required`);
        }
        if (this.depthTexture !== undefined) {
            const depthTextureCreationOptions = this._frameGraph.textureManager.getTextureCreationOptions(this.depthTexture);
            const size = !depthTextureCreationOptions.sizeIsPercentage
                ? textureSizeIsObject(depthTextureCreationOptions.size)
                    ? depthTextureCreationOptions.size
                    : { width: depthTextureCreationOptions.size, height: depthTextureCreationOptions.size }
                : this._frameGraph.textureManager.getAbsoluteDimensions(depthTextureCreationOptions.size);
            const width = size.width;
            const height = size.height;
            depthTextureCreationOptions.sizeIsPercentage = false;
            depthTextureCreationOptions.options.formats = [7];
            depthTextureCreationOptions.options.samples = 1;
            this._thinMinMaxReducer.setTextureDimensions(width, height, this.depthTextureType);
            const reductionSteps = this._thinMinMaxReducer.reductionSteps;
            let targetTexture;
            this._frameGraph.addPass(`${this.name} Before Min Max Reduction`).setExecuteFunc((context) => {
                context.pushDebugGroup(`Min Max Reduction`);
            });
            for (let i = 0; i < reductionSteps.length - 1; ++i) {
                const reductionStep = reductionSteps[i];
                depthTextureCreationOptions.size = { width: reductionSteps[i + 1].textureWidth, height: reductionSteps[i + 1].textureHeight };
                const postProcess = new FrameGraphPostProcessTask(reductionStep.name, this._frameGraph, reductionStep);
                postProcess.sourceTexture = i == 0 ? this.depthTexture : targetTexture;
                postProcess.sourceSamplingMode = 1;
                postProcess.targetTexture = this._frameGraph.textureManager.createRenderTargetTexture(`${this.name} ${reductionStep.name}`, depthTextureCreationOptions);
                postProcess.record(true);
                targetTexture = postProcess.outputTexture;
            }
            this._frameGraph.addPass(`${this.name} After Min Max Reduction`).setExecuteFunc((context) => {
                context.popDebugGroup();
                if (this._autoCalcDepthBounds && this._currentAutoCalcDepthBoundsCounter >= 0) {
                    if (++this._currentAutoCalcDepthBoundsCounter >= this._autoCalcDepthBoundsRefreshRate) {
                        const minMaxTexture = context.getTextureFromHandle(targetTexture);
                        if (minMaxTexture) {
                            this._thinMinMaxReducer.readMinMax(minMaxTexture);
                        }
                    }
                    this._currentAutoCalcDepthBoundsCounter %= this._autoCalcDepthBoundsRefreshRate;
                    if (this._autoCalcDepthBoundsRefreshRate === 0) {
                        this._currentAutoCalcDepthBoundsCounter = -1;
                    }
                }
            });
        }
        super.record();
    }
    dispose() {
        super.dispose();
        this._thinMinMaxReducer.dispose();
    }
}
//# sourceMappingURL=csmShadowGeneratorTask.js.map