/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeGeometryBlock } from "../../nodeGeometryBlock.js";
import { NodeGeometryBlockConnectionPointTypes } from "../../Enums/nodeGeometryConnectionPointTypes.js";
import { Vector3 } from "../../../../Maths/math.vector.pure.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { Lattice } from "../../../lattice.js";
import { extractMinAndMax } from "../../../../Maths/math.functions.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to apply Lattice on geometry
 */
let LatticeBlock = (() => {
    var _a;
    let _classSuper = NodeGeometryBlock;
    let _evaluateContext_decorators;
    let _evaluateContext_initializers = [];
    let _evaluateContext_extraInitializers = [];
    let _resolutionX_decorators;
    let _resolutionX_initializers = [];
    let _resolutionX_extraInitializers = [];
    let _resolutionY_decorators;
    let _resolutionY_initializers = [];
    let _resolutionY_extraInitializers = [];
    let _resolutionZ_decorators;
    let _resolutionZ_initializers = [];
    let _resolutionZ_extraInitializers = [];
    return _a = class LatticeBlock extends _classSuper {
            /**
             * Create a new LatticeBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name);
                this._indexVector3 = new Vector3();
                this._currentControl = new Vector3();
                /**
                 * Gets or sets a boolean indicating that this block can evaluate context
                 * Build performance is improved when this value is set to false as the system will cache values instead of reevaluating everything per context change
                 */
                this.evaluateContext = __runInitializers(this, _evaluateContext_initializers, true);
                /**
                 * Resolution on x axis
                 */
                this.resolutionX = (__runInitializers(this, _evaluateContext_extraInitializers), __runInitializers(this, _resolutionX_initializers, 3));
                /**
                 * Resolution on y axis
                 */
                this.resolutionY = (__runInitializers(this, _resolutionX_extraInitializers), __runInitializers(this, _resolutionY_initializers, 3));
                /**
                 * Resolution on z axis
                 */
                this.resolutionZ = (__runInitializers(this, _resolutionY_extraInitializers), __runInitializers(this, _resolutionZ_initializers, 3));
                __runInitializers(this, _resolutionZ_extraInitializers);
                this.registerInput("geometry", NodeGeometryBlockConnectionPointTypes.Geometry);
                this.registerInput("controls", NodeGeometryBlockConnectionPointTypes.Vector3);
                this.registerOutput("output", NodeGeometryBlockConnectionPointTypes.Geometry);
            }
            /**
             * Gets the current index in the current flow
             * @returns the current index
             */
            getExecutionIndex() {
                return this._currentIndexX + this.resolutionX * (this._currentIndexY + this.resolutionY * this._currentIndexZ);
            }
            /**
             * Gets the current loop index in the current flow
             * @returns the current loop index
             */
            getExecutionLoopIndex() {
                return this.getExecutionIndex();
            }
            /**
             * Gets the current face index in the current flow
             * @returns the current face index
             */
            getExecutionFaceIndex() {
                return 0;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "LatticeBlock";
            }
            /**
             * Gets the geometry input component
             */
            get geometry() {
                return this._inputs[0];
            }
            /**
             * Gets the controls input component
             */
            get controls() {
                return this._inputs[1];
            }
            /**
             * Gets the geometry output component
             */
            get output() {
                return this._outputs[0];
            }
            /**
             * Gets the value associated with a contextual positions
             * In this case it will be the current position in the lattice
             * @returns the current position in the lattice
             */
            getOverridePositionsContextualValue() {
                return this._indexVector3;
            }
            /**
             * Gets the value associated with a contextual normals
             * In this case it will be the current control point being processed
             * @returns the current control point being processed
             */
            getOverrideNormalsContextualValue() {
                return this._currentControl;
            }
            _buildBlock(state) {
                const func = (state) => {
                    state.pushExecutionContext(this);
                    this._vertexData = this.geometry.getConnectedValue(state);
                    if (this._vertexData) {
                        this._vertexData = this._vertexData.clone(); // Preserve source data
                    }
                    if (!this._vertexData || !this._vertexData.positions) {
                        state.restoreExecutionContext();
                        this.output._storedValue = null;
                        return;
                    }
                    const positions = this._vertexData.positions;
                    const boundingInfo = extractMinAndMax(positions, 0, positions.length / 3);
                    // Building the lattice
                    const size = boundingInfo.maximum.subtract(boundingInfo.minimum);
                    this._lattice = new Lattice({
                        resolutionX: this.resolutionX,
                        resolutionY: this.resolutionY,
                        resolutionZ: this.resolutionZ,
                        size: size,
                        position: boundingInfo.minimum.add(size.scale(0.5)),
                    });
                    for (this._currentIndexX = 0; this._currentIndexX < this.resolutionX; this._currentIndexX++) {
                        for (this._currentIndexY = 0; this._currentIndexY < this.resolutionY; this._currentIndexY++) {
                            for (this._currentIndexZ = 0; this._currentIndexZ < this.resolutionZ; this._currentIndexZ++) {
                                this._indexVector3.set(this._currentIndexX, this._currentIndexY, this._currentIndexZ);
                                const latticeControl = this._lattice.data[this._currentIndexX][this._currentIndexY][this._currentIndexZ];
                                this._currentControl.copyFrom(latticeControl);
                                const tempVector3 = this.controls.getConnectedValue(state);
                                if (tempVector3) {
                                    latticeControl.set(tempVector3.x, tempVector3.y, tempVector3.z);
                                }
                            }
                        }
                    }
                    // Apply lattice
                    this._lattice.deform(positions);
                    // Storage
                    state.restoreExecutionContext();
                    return this._vertexData;
                };
                if (this.evaluateContext) {
                    this.output._storedFunction = func;
                }
                else {
                    this.output._storedFunction = null;
                    this.output._storedValue = func(state);
                }
            }
            _dumpPropertiesCode() {
                let codeString = super._dumpPropertiesCode() + `${this._codeVariableName}.evaluateContext = ${this.evaluateContext ? "true" : "false"};\n`;
                codeString += `${this._codeVariableName}.resolutionX = ${this.resolutionX};\n`;
                codeString += `${this._codeVariableName}.resolutionY = ${this.resolutionY};\n`;
                codeString += `${this._codeVariableName}.resolutionZ = ${this.resolutionZ};\n`;
                return codeString;
            }
            /**
             * Serializes this block in a JSON representation
             * @returns the serialized block object
             */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.evaluateContext = this.evaluateContext;
                serializationObject.resolutionX = this.resolutionX;
                serializationObject.resolutionY = this.resolutionY;
                serializationObject.resolutionZ = this.resolutionZ;
                return serializationObject;
            }
            /** @internal */
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                if (serializationObject.evaluateContext !== undefined) {
                    this.evaluateContext = serializationObject.evaluateContext;
                    this.resolutionX = serializationObject.resolutionX;
                    this.resolutionY = serializationObject.resolutionY;
                    this.resolutionZ = serializationObject.resolutionZ;
                }
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _evaluateContext_decorators = [editableInPropertyPage("Evaluate context", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })];
            _resolutionX_decorators = [editableInPropertyPage("resolutionX", 2 /* PropertyTypeForEdition.Int */, "ADVANCED", { embedded: true, notifiers: { rebuild: true }, min: 1, max: 10 })];
            _resolutionY_decorators = [editableInPropertyPage("resolutionY", 2 /* PropertyTypeForEdition.Int */, "ADVANCED", { embedded: true, notifiers: { rebuild: true }, min: 1, max: 10 })];
            _resolutionZ_decorators = [editableInPropertyPage("resolutionZ", 2 /* PropertyTypeForEdition.Int */, "ADVANCED", { embedded: true, notifiers: { rebuild: true }, min: 1, max: 10 })];
            __esDecorate(null, null, _evaluateContext_decorators, { kind: "field", name: "evaluateContext", static: false, private: false, access: { has: obj => "evaluateContext" in obj, get: obj => obj.evaluateContext, set: (obj, value) => { obj.evaluateContext = value; } }, metadata: _metadata }, _evaluateContext_initializers, _evaluateContext_extraInitializers);
            __esDecorate(null, null, _resolutionX_decorators, { kind: "field", name: "resolutionX", static: false, private: false, access: { has: obj => "resolutionX" in obj, get: obj => obj.resolutionX, set: (obj, value) => { obj.resolutionX = value; } }, metadata: _metadata }, _resolutionX_initializers, _resolutionX_extraInitializers);
            __esDecorate(null, null, _resolutionY_decorators, { kind: "field", name: "resolutionY", static: false, private: false, access: { has: obj => "resolutionY" in obj, get: obj => obj.resolutionY, set: (obj, value) => { obj.resolutionY = value; } }, metadata: _metadata }, _resolutionY_initializers, _resolutionY_extraInitializers);
            __esDecorate(null, null, _resolutionZ_decorators, { kind: "field", name: "resolutionZ", static: false, private: false, access: { has: obj => "resolutionZ" in obj, get: obj => obj.resolutionZ, set: (obj, value) => { obj.resolutionZ = value; } }, metadata: _metadata }, _resolutionZ_initializers, _resolutionZ_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { LatticeBlock };
let _Registered = false;
/**
 * Register side effects for latticeBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterLatticeBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.LatticeBlock", LatticeBlock);
}
//# sourceMappingURL=latticeBlock.pure.js.map