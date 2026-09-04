/** This file must only contain pure code and pure imports */
import { VertexData } from "../../mesh.vertexData.js";
import { NodeGeometryBlockConnectionPointTypes } from "../Enums/nodeGeometryConnectionPointTypes.js";
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to recompute normals for a geometry
 */
export class ComputeNormalsBlock extends NodeGeometryBlock {
    /**
     * Creates a new ComputeNormalsBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this.registerInput("geometry", NodeGeometryBlockConnectionPointTypes.Geometry);
        this.registerOutput("output", NodeGeometryBlockConnectionPointTypes.Geometry);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "ComputeNormalsBlock";
    }
    /**
     * Gets the geometry component
     */
    get geometry() {
        return this._inputs[0];
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    _buildBlock() {
        this.output._storedFunction = (state) => {
            if (!this.geometry.isConnected) {
                return null;
            }
            const vertexData = this.geometry.getConnectedValue(state);
            if (!vertexData) {
                return null;
            }
            if (!vertexData.normals) {
                vertexData.normals = [];
            }
            VertexData.ComputeNormals(vertexData.positions, vertexData.indices, vertexData.normals);
            return vertexData;
        };
    }
}
let _Registered = false;
/**
 * Register side effects for computeNormalsBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterComputeNormalsBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ComputeNormalsBlock", ComputeNormalsBlock);
}
//# sourceMappingURL=computeNormalsBlock.pure.js.map