import { FrameGraphTask } from "./frameGraphTask.js";
/**
 * Base class for frame graph tasks that involve multi-target rendering.
 */
export class FrameGraphTaskMultiRenderTarget extends FrameGraphTask {
    constructor() {
        super(...arguments);
        this._layerAndFaceIndicesUpdated = false;
    }
    /**
     * Sets the output layer and face indices for multi-target rendering.
     * @param indices The array of layer and face indices.
     */
    setOutputLayerAndFaceIndices(indices) {
        this._outputLayerAndFaceIndices = indices;
        this._layerAndFaceIndicesUpdated = indices.length > 0;
    }
    _updateLayerAndFaceIndices(pass) {
        if (this._layerAndFaceIndicesUpdated) {
            pass.setOutputLayerAndFaceIndices(this._outputLayerAndFaceIndices);
            this._layerAndFaceIndicesUpdated = false;
        }
    }
}
//# sourceMappingURL=frameGraphTaskMultiRenderTarget.js.map