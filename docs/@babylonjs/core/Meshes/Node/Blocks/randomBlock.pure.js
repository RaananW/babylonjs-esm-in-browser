/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { NodeGeometryBlockConnectionPointTypes } from "../Enums/nodeGeometryConnectionPointTypes.js";
import { GeometryInputBlock } from "./geometryInputBlock.pure.js";
import { Vector2, Vector3, Vector4 } from "../../../Maths/math.vector.pure.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { NodeGeometryContextualSources } from "../Enums/nodeGeometryContextualSources.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Locks supported by the random block
 */
export var RandomBlockLocks;
(function (RandomBlockLocks) {
    /** None */
    RandomBlockLocks[RandomBlockLocks["None"] = 0] = "None";
    /** LoopID */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    RandomBlockLocks[RandomBlockLocks["LoopID"] = 1] = "LoopID";
    /** InstanceID */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    RandomBlockLocks[RandomBlockLocks["InstanceID"] = 2] = "InstanceID";
    /** Once */
    RandomBlockLocks[RandomBlockLocks["Once"] = 3] = "Once";
})(RandomBlockLocks || (RandomBlockLocks = {}));
/**
 * Block used to get a random number
 */
let RandomBlock = (() => {
    var _a;
    let _classSuper = NodeGeometryBlock;
    let _lockMode_decorators;
    let _lockMode_initializers = [];
    let _lockMode_extraInitializers = [];
    return _a = class RandomBlock extends _classSuper {
            /**
             * Create a new RandomBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name);
                this._currentLockId = -1;
                /**
                 * Gets or sets a value indicating if that block will lock its value for a specific duration
                 */
                this.lockMode = __runInitializers(this, _lockMode_initializers, RandomBlockLocks.None);
                __runInitializers(this, _lockMode_extraInitializers);
                this.registerInput("min", NodeGeometryBlockConnectionPointTypes.AutoDetect);
                this.registerInput("max", NodeGeometryBlockConnectionPointTypes.AutoDetect);
                this.registerOutput("output", NodeGeometryBlockConnectionPointTypes.BasedOnInput);
                this._inputs[0].excludedConnectionPointTypes.push(NodeGeometryBlockConnectionPointTypes.Matrix);
                this._inputs[0].excludedConnectionPointTypes.push(NodeGeometryBlockConnectionPointTypes.Geometry);
                this._inputs[0].excludedConnectionPointTypes.push(NodeGeometryBlockConnectionPointTypes.Texture);
                this._inputs[1].excludedConnectionPointTypes.push(NodeGeometryBlockConnectionPointTypes.Matrix);
                this._inputs[1].excludedConnectionPointTypes.push(NodeGeometryBlockConnectionPointTypes.Geometry);
                this._inputs[1].excludedConnectionPointTypes.push(NodeGeometryBlockConnectionPointTypes.Texture);
                this._outputs[0]._typeConnectionSource = this._inputs[0];
                this._linkConnectionTypes(0, 1);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "RandomBlock";
            }
            /**
             * Gets the min input component
             */
            get min() {
                return this._inputs[0];
            }
            /**
             * Gets the max input component
             */
            get max() {
                return this._inputs[1];
            }
            /**
             * Gets the geometry output component
             */
            get output() {
                return this._outputs[0];
            }
            /** @internal */
            autoConfigure() {
                if (!this.min.isConnected) {
                    const minInput = new GeometryInputBlock("Min");
                    minInput.value = 0;
                    minInput.output.connectTo(this.min);
                }
                if (!this.max.isConnected) {
                    const maxInput = new GeometryInputBlock("Max");
                    maxInput.value = 1;
                    maxInput.output.connectTo(this.max);
                }
            }
            _buildBlock() {
                let func = null;
                this._currentLockId = -1;
                switch (this.min.type) {
                    case NodeGeometryBlockConnectionPointTypes.Int:
                    case NodeGeometryBlockConnectionPointTypes.Float: {
                        func = (state) => {
                            const min = this.min.getConnectedValue(state) ?? 0;
                            const max = this.max.getConnectedValue(state) ?? 0;
                            return min + Math.random() * (max - min);
                        };
                        break;
                    }
                    case NodeGeometryBlockConnectionPointTypes.Vector2: {
                        func = (state) => {
                            const min = this.min.getConnectedValue(state) ?? Vector2.Zero();
                            const max = this.max.getConnectedValue(state) ?? Vector2.Zero();
                            return new Vector2(min.x + Math.random() * (max.x - min.x), min.y + Math.random() * (max.y - min.y));
                        };
                        break;
                    }
                    case NodeGeometryBlockConnectionPointTypes.Vector3: {
                        func = (state) => {
                            const min = this.min.getConnectedValue(state) ?? Vector3.Zero();
                            const max = this.max.getConnectedValue(state) ?? Vector3.Zero();
                            return new Vector3(min.x + Math.random() * (max.x - min.x), min.y + Math.random() * (max.y - min.y), min.z + Math.random() * (max.z - min.z));
                        };
                        break;
                    }
                    case NodeGeometryBlockConnectionPointTypes.Vector4: {
                        func = (state) => {
                            const min = this.min.getConnectedValue(state) ?? Vector4.Zero();
                            const max = this.max.getConnectedValue(state) ?? Vector4.Zero();
                            return new Vector4(min.x + Math.random() * (max.x - min.x), min.y + Math.random() * (max.y - min.y), min.z + Math.random() * (max.z - min.z), min.w + Math.random() * (max.w - min.w));
                        };
                        break;
                    }
                }
                if (this.lockMode === RandomBlockLocks.None || !func) {
                    this.output._storedFunction = func;
                }
                else {
                    this.output._storedFunction = (state) => {
                        let lockId = 0;
                        switch (this.lockMode) {
                            case RandomBlockLocks.InstanceID:
                                lockId = state.getContextualValue(NodeGeometryContextualSources.InstanceID, true) ?? 0;
                                break;
                            case RandomBlockLocks.LoopID:
                                lockId = state.getContextualValue(NodeGeometryContextualSources.LoopID, true) ?? 0;
                                break;
                            case RandomBlockLocks.Once:
                                lockId = state.buildId ?? 0;
                                break;
                        }
                        if (this._currentLockId !== lockId || this.lockMode === RandomBlockLocks.None) {
                            this._currentLockId = lockId;
                            this.output._storedValue = func(state);
                        }
                        return this.output._storedValue;
                    };
                }
            }
            _dumpPropertiesCode() {
                const codeString = super._dumpPropertiesCode() + `${this._codeVariableName}.lockMode = BABYLON.RandomBlockLocks.${RandomBlockLocks[this.lockMode]};\n`;
                return codeString;
            }
            /**
             * Serializes this block in a JSON representation
             * @returns the serialized block object
             */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.lockMode = this.lockMode;
                return serializationObject;
            }
            /** @internal */
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.lockMode = serializationObject.lockMode;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _lockMode_decorators = [editableInPropertyPage("LockMode", 5 /* PropertyTypeForEdition.List */, "ADVANCED", {
                    notifiers: { rebuild: true },
                    embedded: true,
                    options: [
                        { label: "None", value: RandomBlockLocks.None },
                        { label: "LoopID", value: RandomBlockLocks.LoopID },
                        { label: "InstanceID", value: RandomBlockLocks.InstanceID },
                        { label: "Once", value: RandomBlockLocks.Once },
                    ],
                })];
            __esDecorate(null, null, _lockMode_decorators, { kind: "field", name: "lockMode", static: false, private: false, access: { has: obj => "lockMode" in obj, get: obj => obj.lockMode, set: (obj, value) => { obj.lockMode = value; } }, metadata: _metadata }, _lockMode_initializers, _lockMode_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { RandomBlock };
let _Registered = false;
/**
 * Register side effects for randomBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterRandomBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.RandomBlock", RandomBlock);
}
//# sourceMappingURL=randomBlock.pure.js.map