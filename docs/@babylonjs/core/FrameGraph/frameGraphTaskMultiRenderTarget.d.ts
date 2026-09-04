import { type FrameGraphRenderPass, type LayerAndFaceIndex } from "../index.js";
import { FrameGraphTask } from "./frameGraphTask.js";
/**
 * Base class for frame graph tasks that involve multi-target rendering.
 */
export declare abstract class FrameGraphTaskMultiRenderTarget extends FrameGraphTask {
    private _outputLayerAndFaceIndices;
    private _layerAndFaceIndicesUpdated;
    /**
     * Sets the output layer and face indices for multi-target rendering.
     * @param indices The array of layer and face indices.
     */
    setOutputLayerAndFaceIndices(indices: LayerAndFaceIndex[]): void;
    protected _updateLayerAndFaceIndices(pass: FrameGraphRenderPass): void;
}
