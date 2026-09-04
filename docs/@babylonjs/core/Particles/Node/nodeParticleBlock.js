import { __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { serialize } from "../../Misc/decorators.js";
import { UniqueIdGenerator } from "../../Misc/uniqueIdGenerator.js";
import { NodeParticleConnectionPoint } from "./nodeParticleBlockConnectionPoint.js";
import { Logger } from "../../Misc/logger.js";
import { Observable } from "../../Misc/observable.js";
import { GetClass } from "../../Misc/typeStore.js";
/**
 * Defines a block that can be used inside a node based particle system
 */
let NodeParticleBlock = (() => {
    var _a;
    let _comments_decorators;
    let _comments_initializers = [];
    let _comments_extraInitializers = [];
    return _a = class NodeParticleBlock {
            /**
             * Gets a boolean indicating if this block is a teleport out
             */
            get isTeleportOut() {
                return this._isTeleportOut;
            }
            /**
             * Gets a boolean indicating if this block is a teleport in
             */
            get isTeleportIn() {
                return this._isTeleportIn;
            }
            /**
             * Gets a boolean indicating that this block is a system block
             */
            get isSystem() {
                return this._isSystem;
            }
            /**
             * Gets a boolean indicating that this block is an input block
             */
            get isInput() {
                return this._isInput;
            }
            /**
             * Gets a boolean indicating if this block is a debug block
             */
            get isDebug() {
                return this._isDebug;
            }
            /**
             * Gets or set the name of the block
             */
            get name() {
                return this._name;
            }
            set name(value) {
                this._name = value;
            }
            /**
             * Gets the current class name e.g. "NodeParticleBlock"
             * @returns the class name
             */
            getClassName() {
                return "NodeParticleBlock";
            }
            /**
             * Gets the list of input points
             */
            get inputs() {
                return this._inputs;
            }
            /** Gets the list of output points */
            get outputs() {
                return this._outputs;
            }
            /**
             * Creates a new NodeParticleBlock
             * @param name defines the block name
             */
            constructor(name) {
                this._name = "";
                this._isInput = false;
                this._isSystem = false;
                this._isDebug = false;
                this._isTeleportOut = false;
                this._isTeleportIn = false;
                /** @internal */
                this._inputs = new Array();
                /** @internal */
                this._outputs = new Array();
                /**
                 * Gets an observable raised when the block is built
                 */
                this.onBuildObservable = new Observable();
                /**
                 * Gets an observable raised when the block is disposed
                 */
                this.onDisposeObservable = new Observable();
                /**
                 * Gets an observable raised when the inputs of the block change
                 */
                this.onInputChangedObservable = new Observable();
                /**
                 * A free comment about the block
                 */
                this.comments = __runInitializers(this, _comments_initializers, void 0);
                /** Gets or sets a boolean indicating that this input can be edited from a collapsed frame */
                this.visibleOnFrame = (__runInitializers(this, _comments_extraInitializers), false);
                this._name = name;
                this.uniqueId = UniqueIdGenerator.UniqueId;
            }
            _inputRename(name) {
                return name;
            }
            _outputRename(name) {
                return name;
            }
            /**
             * Checks if the current block is an ancestor of a given block
             * @param block defines the potential descendant block to check
             * @returns true if block is a descendant
             */
            isAnAncestorOf(block) {
                for (const output of this._outputs) {
                    if (!output.hasEndpoints) {
                        continue;
                    }
                    for (const endpoint of output.endpoints) {
                        if (endpoint.ownerBlock === block) {
                            return true;
                        }
                        if (endpoint.ownerBlock.isAnAncestorOf(block)) {
                            return true;
                        }
                    }
                }
                return false;
            }
            /**
             * Checks if the current block is an ancestor of a given type
             * @param type defines the potential type to check
             * @returns true if block is a descendant
             */
            isAnAncestorOfType(type) {
                if (this.getClassName() === type) {
                    return true;
                }
                for (const output of this._outputs) {
                    if (!output.hasEndpoints) {
                        continue;
                    }
                    for (const endpoint of output.endpoints) {
                        if (endpoint.ownerBlock.isAnAncestorOfType(type)) {
                            return true;
                        }
                    }
                }
                return false;
            }
            /**
             * Find an input by its name
             * @param name defines the name of the input to look for
             * @returns the input or null if not found
             */
            getInputByName(name) {
                const filter = this._inputs.filter((e) => e.name === name);
                if (filter.length) {
                    return filter[0];
                }
                return null;
            }
            _linkConnectionTypes(inputIndex0, inputIndex1, looseCoupling = false) {
                if (looseCoupling) {
                    this._inputs[inputIndex1]._acceptedConnectionPointType = this._inputs[inputIndex0];
                }
                else {
                    this._inputs[inputIndex0]._linkedConnectionSource = this._inputs[inputIndex1];
                    this._inputs[inputIndex0]._isMainLinkSource = true;
                }
                this._inputs[inputIndex1]._linkedConnectionSource = this._inputs[inputIndex0];
            }
            /**
             * Register a new input. Must be called inside a block constructor
             * @param name defines the connection point name
             * @param type defines the connection point type
             * @param isOptional defines a boolean indicating that this input can be omitted
             * @param value value to return if there is no connection
             * @param valueMin min value accepted for value
             * @param valueMax max value accepted for value
             * @returns the current block
             */
            registerInput(name, type, isOptional = false, value, valueMin, valueMax) {
                const point = new NodeParticleConnectionPoint(name, this, 0 /* NodeParticleConnectionPointDirection.Input */);
                point.type = type;
                point.isOptional = isOptional;
                point.defaultValue = value;
                point.value = value;
                point.valueMin = valueMin;
                point.valueMax = valueMax;
                this._inputs.push(point);
                this.onInputChangedObservable.notifyObservers(point);
                return this;
            }
            /**
             * Register a new output. Must be called inside a block constructor
             * @param name defines the connection point name
             * @param type defines the connection point type
             * @param point an already created connection point. If not provided, create a new one
             * @returns the current block
             */
            registerOutput(name, type, point) {
                point = point ?? new NodeParticleConnectionPoint(name, this, 1 /* NodeParticleConnectionPointDirection.Output */);
                point.type = type;
                this._outputs.push(point);
                return this;
            }
            /**
             * Builds the block. Must be implemented by derived classes.
             * @param _state defines the current build state
             */
            _build(_state) { }
            _customBuildStep(_state) {
                // Must be implemented by children
            }
            /**
             * Builds the block
             * @param state defines the current build state
             * @returns the built block
             */
            build(state) {
                if (this._buildId === state.buildId) {
                    return true;
                }
                if (this._outputs.length > 0) {
                    if (!this._outputs.some((o) => o.hasEndpoints) && !this.isDebug && !this.isSystem) {
                        return false;
                    }
                }
                this._buildId = state.buildId;
                // Check if "parent" blocks are compiled
                for (const input of this._inputs) {
                    if (!input.connectedPoint) {
                        if (!input.isOptional) {
                            // Emit a warning
                            state.notConnectedNonOptionalInputs.push(input);
                        }
                        continue;
                    }
                    const block = input.connectedPoint.ownerBlock;
                    if (block && block !== this && !block.isSystem) {
                        block.build(state);
                    }
                }
                this._customBuildStep(state);
                // Logs
                if (state.verbose) {
                    Logger.Log(`Building ${this.name} [${this.getClassName()}]`);
                }
                this._build(state);
                this.onBuildObservable.notifyObservers(this);
                return false;
            }
            /**
             * Serializes this block in a JSON representation
             * @returns the serialized block object
             */
            serialize() {
                const serializationObject = {};
                serializationObject.customType = "BABYLON." + this.getClassName();
                serializationObject.id = this.uniqueId;
                serializationObject.name = this.name;
                serializationObject.visibleOnFrame = this.visibleOnFrame;
                serializationObject.comments = this.comments;
                serializationObject.inputs = [];
                serializationObject.outputs = [];
                for (const input of this.inputs) {
                    serializationObject.inputs.push(input.serialize());
                }
                for (const output of this.outputs) {
                    serializationObject.outputs.push(output.serialize(false));
                }
                return serializationObject;
            }
            /**
             * @internal
             */
            _deserialize(serializationObject) {
                this._name = serializationObject.name;
                this.comments = serializationObject.comments;
                this.visibleOnFrame = !!serializationObject.visibleOnFrame;
                this._deserializePortDisplayNamesAndExposedOnFrame(serializationObject);
            }
            _deserializePortDisplayNamesAndExposedOnFrame(serializationObject) {
                const serializedInputs = serializationObject.inputs;
                const serializedOutputs = serializationObject.outputs;
                if (serializedInputs) {
                    for (const port of serializedInputs) {
                        const input = this.inputs.find((i) => i.name === port.name);
                        if (!input) {
                            return;
                        }
                        if (port.displayName) {
                            input.displayName = port.displayName;
                        }
                        if (port.isExposedOnFrame) {
                            input.isExposedOnFrame = port.isExposedOnFrame;
                            input.exposedPortPosition = port.exposedPortPosition;
                        }
                        if (port.value !== undefined && port.value !== null) {
                            if (port.valueType === "number") {
                                input.value = port.value;
                            }
                            else {
                                const valueType = GetClass(port.valueType);
                                if (valueType) {
                                    input.value = valueType.FromArray(port.value);
                                }
                            }
                        }
                    }
                }
                if (serializedOutputs) {
                    for (let i = 0; i < serializedOutputs.length; i++) {
                        const port = serializedOutputs[i];
                        if (port.displayName) {
                            this.outputs[i].displayName = port.displayName;
                        }
                        if (port.isExposedOnFrame) {
                            this.outputs[i].isExposedOnFrame = port.isExposedOnFrame;
                            this.outputs[i].exposedPortPosition = port.exposedPortPosition;
                        }
                    }
                }
            }
            /**
             * Clone the current block to a new identical block
             * @returns a copy of the current block
             */
            clone() {
                const serializationObject = this.serialize();
                const blockType = GetClass(serializationObject.customType);
                if (blockType) {
                    const block = new blockType();
                    block._deserialize(serializationObject);
                    return block;
                }
                return null;
            }
            /**
             * Release resources
             */
            dispose() {
                this.onDisposeObservable.notifyObservers(this);
                this.onDisposeObservable.clear();
                for (const input of this.inputs) {
                    input.dispose();
                }
                for (const output of this.outputs) {
                    output.dispose();
                }
                this.onBuildObservable.clear();
                this.onInputChangedObservable.clear();
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _comments_decorators = [serialize("comment")];
            __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: obj => "comments" in obj, get: obj => obj.comments, set: (obj, value) => { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeParticleBlock };
//# sourceMappingURL=nodeParticleBlock.js.map