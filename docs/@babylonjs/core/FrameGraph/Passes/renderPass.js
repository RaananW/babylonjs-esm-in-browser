import { FrameGraphPass } from "./pass.js";
/**
 * Render pass used to render objects.
 */
export class FrameGraphRenderPass extends FrameGraphPass {
    /**
     * Checks if a pass is a render pass.
     * @param pass The pass to check.
     * @returns True if the pass is a render pass, else false.
     */
    static IsRenderPass(pass) {
        return pass.setRenderTarget !== undefined;
    }
    /**
     * Gets the handle(s) of the render target(s) used by the render pass.
     */
    get renderTarget() {
        return this._renderTarget;
    }
    /**
     * Gets the handle of the render target depth used by the render pass.
     */
    get renderTargetDepth() {
        return this._renderTargetDepth;
    }
    /**
     * Gets the frame graph render target used by the render pass.
     */
    get frameGraphRenderTarget() {
        return this._frameGraphRenderTarget;
    }
    /** @internal */
    constructor(name, parentTask, context, engine) {
        super(name, parentTask, context);
        this._dependencies = new Set();
        /**
         * If true, the depth attachment will be read-only (may allow some optimizations in WebGPU)
         */
        this.depthReadOnly = false;
        /**
         * If true, the stencil attachment will be read-only (may allow some optimizations in WebGPU)
         */
        this.stencilReadOnly = false;
        this._engine = engine;
    }
    /**
     * Sets the render target(s) to use for rendering.
     * @param renderTargetHandle The render target to use for rendering, or an array of render targets to use for multi render target rendering.
     */
    setRenderTarget(renderTargetHandle) {
        this._renderTarget = renderTargetHandle;
    }
    /**
     * Sets the render target depth to use for rendering.
     * @param renderTargetHandle The render target depth to use for rendering.
     */
    setRenderTargetDepth(renderTargetHandle) {
        this._renderTargetDepth = renderTargetHandle;
    }
    /**
     * Adds dependencies to the render pass.
     * @param dependencies The dependencies to add.
     */
    addDependencies(dependencies) {
        if (dependencies === undefined) {
            return;
        }
        if (Array.isArray(dependencies)) {
            for (const dependency of dependencies) {
                this._dependencies.add(dependency);
            }
        }
        else {
            this._dependencies.add(dependencies);
        }
    }
    /**
     * Collects the dependencies of the render pass.
     * @param dependencies The set of dependencies to update.
     */
    collectDependencies(dependencies) {
        const iterator = this._dependencies.keys();
        for (let key = iterator.next(); key.done !== true; key = iterator.next()) {
            dependencies.add(key.value);
        }
        if (this._renderTarget !== undefined) {
            if (Array.isArray(this._renderTarget)) {
                for (const handle of this._renderTarget) {
                    if (handle !== undefined) {
                        dependencies.add(handle);
                    }
                }
            }
            else {
                dependencies.add(this._renderTarget);
            }
        }
        if (this._renderTargetDepth !== undefined) {
            dependencies.add(this._renderTargetDepth);
        }
    }
    /**
     * Sets the output layer and face indices for multi-render target rendering.
     * @param indices The array of layer and face indices.
     */
    setOutputLayerAndFaceIndices(indices) {
        const renderTargetWrapper = this.frameGraphRenderTarget.renderTargetWrapper;
        if (renderTargetWrapper) {
            for (const index of indices) {
                renderTargetWrapper.setLayerAndFaceIndex(index.targetIndex, index.layerIndex, index.faceIndex);
            }
        }
    }
    /** @internal */
    _initialize() {
        this._frameGraphRenderTarget = this._context.createRenderTarget(this.name, this._renderTarget, this._renderTargetDepth, this.depthReadOnly, this.stencilReadOnly);
        super._initialize();
    }
    /** @internal */
    _execute() {
        this._context.bindRenderTarget(this._frameGraphRenderTarget);
        super._execute();
        this._context.restoreDefaultFramebuffer();
    }
    /** @internal */
    _isValid() {
        const errMsg = super._isValid();
        return errMsg
            ? errMsg
            : this._renderTarget !== undefined || this.renderTargetDepth !== undefined
                ? null
                : "Render target and render target depth cannot both be undefined.";
    }
    /** @internal */
    _dispose() {
        this._frameGraphRenderTarget?.dispose();
    }
}
//# sourceMappingURL=renderPass.js.map