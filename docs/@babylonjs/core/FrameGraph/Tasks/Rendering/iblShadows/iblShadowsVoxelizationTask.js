import { Matrix, Quaternion, Vector3 } from "../../../../Maths/math.vector.pure.js";
import { Observable } from "../../../../Misc/observable.js";
import { _IblShadowsVoxelRenderer } from "../../../../Rendering/IBLShadows/iblShadowsVoxelRenderer.pure.js";
import { FrameGraphTask } from "../../../frameGraphTask.js";
/**
 * Task used to voxelize shadow casting objects for IBL shadows.
 * @internal
 */
export class FrameGraphIblShadowsVoxelizationTask extends FrameGraphTask {
    /**
     * Sets voxel grid resolution exponent. Actual resolution is 2^resolutionExp.
     */
    set resolutionExp(value) {
        const newValue = Math.round(Math.max(1, Math.min(value, 8)));
        if (newValue === this._resolutionExp) {
            return;
        }
        this._resolutionExp = newValue;
        if (this._voxelRenderer) {
            this._voxelRenderer.voxelResolutionExp = this._resolutionExp;
        }
        this.dirty = true;
    }
    /**
     * Gets voxel grid resolution exponent. Actual resolution is 2^resolutionExp.
     */
    get resolutionExp() {
        return this._resolutionExp;
    }
    /**
     * Controls how often voxelization is refreshed.
     * - -1: manual only (requires setting `dirty = true`)
     * - 0: every frame
     * - 1: skip 1 frame between updates
     * - N: skip N frames between updates
     */
    get refreshRate() {
        return this._refreshRate;
    }
    set refreshRate(value) {
        this._refreshRate = Math.max(-1, Math.round(value));
    }
    /**
     * Creates a new voxelization task.
     * @param name The task name.
     * @param frameGraph The frame graph this task belongs to.
     */
    constructor(name, frameGraph) {
        super(name, frameGraph);
        /**
         * Observable raised when voxelization completes.
         */
        this.onVoxelizationCompleteObservable = new Observable();
        /**
         * World-space voxel grid size.
         */
        this.voxelGridSize = 1;
        /**
         * Voxel grid resolution exponent. Actual resolution is 2^resolutionExp.
         */
        this._resolutionExp = 6;
        /**
         * Enables tri-planar voxelization mode.
         */
        this.triPlanarVoxelization = true;
        /**
         * Indicates whether voxelization should be refreshed.
         */
        this.dirty = true;
        this._refreshRate = -1;
        /**
         * World-to-voxel normalization matrix used by tracing.
         */
        this.worldScaleMatrix = Matrix.Identity();
        this._voxelizationCompleteObserver = null;
        this._frameCounter = 0;
        this.outputVoxelGridTexture = this._frameGraph.textureManager.createDanglingHandle();
    }
    /**
     * Gets the class name.
     * @returns The class name.
     */
    getClassName() {
        return "FrameGraphIblShadowsVoxelizationTask";
    }
    /**
     * Checks whether the task has all required inputs.
     * @returns True when ready.
     */
    isReady() {
        return true;
    }
    /**
     * Requests a voxelization update on the next eligible frame.
     */
    requestVoxelizationUpdate() {
        this.dirty = true;
    }
    /**
     * Recomputes voxel world bounds from the current object list and updates worldScaleMatrix.
     */
    updateSceneBounds() {
        this._updateWorldScaleMatrix();
    }
    /**
     * Records the voxelization passes.
     */
    record() {
        if (this.objectList === undefined) {
            throw new Error(`FrameGraphIblShadowsVoxelizationTask ${this.name}: objectList is required`);
        }
        this._ensureVoxelRenderer();
        this._updateWorldScaleMatrix();
        this._updateOutputTextureHandlesFromRenderer();
        const voxelRT = this._voxelRenderer.getRT();
        const voxelRTInternalTexture = voxelRT.getInternalTexture();
        if (!voxelRTInternalTexture) {
            throw new Error(`FrameGraphIblShadowsVoxelizationTask ${this.name}: voxel renderer RT texture is unavailable`);
        }
        this._voxelRTTextureHandle = this._frameGraph.textureManager.importTexture(`${this.name} Voxel RT`, voxelRTInternalTexture, this._voxelRTTextureHandle);
        const pass = this._frameGraph.addRenderPass(this.name);
        pass.setRenderTarget(this._voxelRTTextureHandle);
        pass.addDependencies(this.outputVoxelGridTexture);
        pass.setExecuteFunc((context) => {
            context.restoreDefaultFramebuffer();
            this._frameCounter++;
            const shouldRefreshFromRate = this.refreshRate >= 0 && (this._frameCounter - 1) % (this.refreshRate + 1) === 0;
            if (this._voxelRenderer.isVoxelizationInProgress()) {
                this._voxelRenderer.processVoxelization();
                return;
            }
            if (this.dirty || shouldRefreshFromRate) {
                const meshes = this.objectList.meshes;
                if (meshes.length === 0) {
                    return;
                }
                this._ensureVoxelRenderer();
                this._updateWorldScaleMatrix();
                this._voxelRenderer.setWorldScaleMatrix(this.worldScaleMatrix);
                this._voxelRenderer.updateVoxelGrid(meshes, false);
                this.dirty = false;
            }
            if (this._voxelRenderer.isVoxelizationInProgress()) {
                this._voxelRenderer.processVoxelization();
            }
        });
    }
    /**
     * Disposes internal resources.
     */
    dispose() {
        this._detachVoxelizationObserver();
        this._voxelRenderer?.dispose();
        this._voxelRenderer = undefined;
        this.onVoxelizationCompleteObservable.clear();
        super.dispose();
    }
    _ensureVoxelRenderer() {
        const needsNewRenderer = !this._voxelRenderer || this._voxelRendererResolutionExp !== this.resolutionExp || this._voxelRendererTriPlanar !== this.triPlanarVoxelization;
        if (!needsNewRenderer) {
            return;
        }
        this._voxelRenderer?.dispose();
        this._voxelRenderer = new _IblShadowsVoxelRenderer(this._frameGraph.scene, {}, this.resolutionExp, this.triPlanarVoxelization);
        this._attachVoxelizationObserver();
        this._voxelRendererResolutionExp = this.resolutionExp;
        this._voxelRendererTriPlanar = this.triPlanarVoxelization;
    }
    _attachVoxelizationObserver() {
        this._detachVoxelizationObserver();
        if (!this._voxelRenderer) {
            return;
        }
        this._voxelizationCompleteObserver = this._voxelRenderer.onVoxelizationCompleteObservable.add(() => {
            this._updateOutputTextureHandlesFromRenderer();
            this.onVoxelizationCompleteObservable.notifyObservers();
        });
    }
    _detachVoxelizationObserver() {
        if (this._voxelRenderer && this._voxelizationCompleteObserver) {
            this._voxelRenderer.onVoxelizationCompleteObservable.remove(this._voxelizationCompleteObserver);
        }
        this._voxelizationCompleteObserver = null;
    }
    _updateWorldScaleMatrix() {
        const meshes = this.objectList?.meshes;
        if (!meshes || meshes.length === 0 || !isFinite(this.voxelGridSize) || this.voxelGridSize <= 0) {
            this.worldScaleMatrix.copyFrom(Matrix.Identity());
            return;
        }
        const bounds = {
            min: new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE),
            max: new Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE),
        };
        for (const mesh of meshes) {
            const localBounds = mesh.getHierarchyBoundingVectors(true);
            bounds.min = Vector3.Minimize(bounds.min, localBounds.min);
            bounds.max = Vector3.Maximize(bounds.max, localBounds.max);
        }
        const size = bounds.max.subtract(bounds.min);
        this.voxelGridSize = Math.max(size.x, size.y, size.z);
        const halfSize = this.voxelGridSize / 2.0;
        const centerOffset = bounds.max.add(bounds.min).multiplyByFloats(-0.5, -0.5, -0.5);
        const invWorldScaleMatrix = Matrix.Compose(new Vector3(1.0 / halfSize, 1.0 / halfSize, 1.0 / halfSize), new Quaternion(), Vector3.Zero());
        const invTranslationMatrix = Matrix.Compose(new Vector3(1.0, 1.0, 1.0), new Quaternion(), centerOffset);
        invTranslationMatrix.multiplyToRef(invWorldScaleMatrix, this.worldScaleMatrix);
    }
    _updateOutputTextureHandlesFromRenderer() {
        const voxelTexture = this._voxelRenderer.getVoxelGrid();
        const voxelInternalTexture = voxelTexture.getInternalTexture();
        if (!voxelInternalTexture) {
            throw new Error(`FrameGraphIblShadowsVoxelizationTask ${this.name}: voxel renderer texture is unavailable`);
        }
        this._voxelGridTextureHandle = this._frameGraph.textureManager.importTexture(`${this.name} Voxel Grid`, voxelInternalTexture, this._voxelGridTextureHandle);
        this._frameGraph.textureManager.resolveDanglingHandle(this.outputVoxelGridTexture, this._voxelGridTextureHandle);
    }
}
//# sourceMappingURL=iblShadowsVoxelizationTask.js.map