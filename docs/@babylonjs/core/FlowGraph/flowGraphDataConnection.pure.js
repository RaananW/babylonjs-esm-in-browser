/** This file must only contain pure code and pure imports */
import { FlowGraphConnection } from "./flowGraphConnection.js";
import { Observable } from "../Misc/observable.pure.js";
import { defaultValueSerializationFunction, GetSceneNodeFromSerializedReference } from "./serialization.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * Represents a connection point for data.
 * An unconnected input point can have a default value.
 * An output point will only have a value if it is connected to an input point. Furthermore,
 * if the point belongs to a "function" node, the node will run its function to update the value.
 */
export class FlowGraphDataConnection extends FlowGraphConnection {
    /**
     * Create a new data connection point.
     * @param name the name of the connection
     * @param connectionType the type of the connection
     * @param ownerBlock the block that owns this connection
     * @param richType the type of the data in this block
     * @param _defaultValue the default value of the connection
     * @param _optional if the connection is optional
     */
    constructor(name, connectionType, ownerBlock, 
    /**
     * the type of the data in this block
     */
    richType, 
    /**
     * [any] the default value of the connection
     */
    _defaultValue = richType.defaultValue, 
    /**
     * [false] if the connection is optional
     */
    _optional = false) {
        super(name, connectionType, ownerBlock);
        this.richType = richType;
        this._defaultValue = _defaultValue;
        this._optional = _optional;
        this._isDisabled = false;
        /**
         * This is used for debugging purposes! It is the last value that was set to this connection with ANY context.
         * Do not use this value for anything else, as it might be wrong if used in a different context.
         */
        this._lastValue = null;
        /**
         * a data transformer function, if needed.
         * This can be used, for example, to force seconds into milliseconds output, if it makes sense in your case.
         */
        this.dataTransformer = null;
        /**
         * An observable that is triggered when the value of the connection changes.
         */
        this.onValueChangedObservable = new Observable();
    }
    /**
     * Whether or not the connection is optional.
     * Currently only used for UI control.
     */
    get optional() {
        return this._optional;
    }
    /**
     * is this connection disabled
     * If the connection is disabled you will not be able to connect anything to it.
     */
    get isDisabled() {
        return this._isDisabled;
    }
    set isDisabled(value) {
        if (this._isDisabled === value) {
            return;
        }
        this._isDisabled = value;
        if (this._isDisabled) {
            this.disconnectFromAll();
        }
    }
    /**
     * An output data block can connect to multiple input data blocks,
     * but an input data block can only connect to one output data block.
     * @returns true if the connection is singular
     */
    _isSingularConnection() {
        return this.connectionType === 0 /* FlowGraphConnectionType.Input */;
    }
    /**
     * Set the value of the connection in a specific context.
     * @param value the value to set
     * @param context the context to which the value is set
     */
    setValue(value, context) {
        // check if the value is different
        if (context._getConnectionValue(this) === value) {
            return;
        }
        context._setConnectionValue(this, value);
        this.onValueChangedObservable.notifyObservers(value);
    }
    /**
     * Reset the value of the connection to the default value.
     * @param context the context in which the value is reset
     */
    resetToDefaultValue(context) {
        context._setConnectionValue(this, this._defaultValue);
    }
    /**
     * Re-resolves this input's default value against a (new) scene when the value is a node reference.
     * This handles two cases that occur when a graph is moved to a different scene (see
     * {@link FlowGraph.setScene}):
     * - the value is still an unresolved serialized reference (`{ id, name, className, uniqueId }`)
     *   because the node did not yet exist in the scene at parse time, or
     * - the value is a node that belongs to a different (e.g. disposed) scene.
     * Values that are not node references (numbers, vectors, matrices, etc.) are left untouched, and
     * the default value is only replaced when a matching node is found in the new scene.
     * @param scene the scene to resolve the reference against
     * @internal
     */
    _reresolveDefaultValueForScene(scene) {
        const value = this._defaultValue;
        if (!value || typeof value !== "object") {
            return;
        }
        let reference;
        if (typeof value.getClassName === "function" && typeof value.getScene === "function") {
            // A scene node — only rebind when it belongs to a different scene.
            if (value.getScene() === scene) {
                return;
            }
            reference = { id: value.id, name: value.name, className: value.getClassName(), uniqueId: value.uniqueId };
        }
        else if (typeof value.className === "string" && (value.id || value.name) && value.value === undefined) {
            // An unresolved serialized node reference left by the parser.
            reference = value;
        }
        else {
            return;
        }
        const node = GetSceneNodeFromSerializedReference(reference, scene);
        if (node) {
            this._defaultValue = node;
        }
    }
    /**
     * Connect this point to another point.
     * @param point the point to connect to.
     */
    connectTo(point) {
        if (this._isDisabled) {
            return;
        }
        super.connectTo(point);
    }
    _getValueOrDefault(context) {
        const val = context._getConnectionValue(this) ?? this._defaultValue;
        return this.dataTransformer ? this.dataTransformer(val) : val;
    }
    /**
     * Gets the value of the connection in a specific context.
     * @param context the context from which the value is retrieved
     * @returns the value of the connection
     */
    getValue(context) {
        if (this.connectionType === 1 /* FlowGraphConnectionType.Output */) {
            context._notifyExecuteNode(this._ownerBlock);
            this._ownerBlock._updateOutputs(context);
            const value = this._getValueOrDefault(context);
            this._lastValue = value;
            return this.richType.typeTransformer ? this.richType.typeTransformer(value) : value;
        }
        const value = !this.isConnected() ? this._getValueOrDefault(context) : this._connectedPoint[0].getValue(context);
        this._lastValue = value;
        return this.richType.typeTransformer ? this.richType.typeTransformer(value) : value;
    }
    /**
     * @internal
     */
    _getLastValue() {
        return this._lastValue;
    }
    /**
     * @returns class name of the object.
     */
    getClassName() {
        return "FlowGraphDataConnection";
    }
    /**
     * Serializes this object.
     * @param serializationObject the object to serialize to
     */
    serialize(serializationObject = {}) {
        super.serialize(serializationObject);
        serializationObject.richType = {};
        this.richType.serialize(serializationObject.richType);
        serializationObject.optional = this._optional;
        defaultValueSerializationFunction("defaultValue", this._defaultValue, serializationObject);
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphDataConnection.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphDataConnection() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphDataConnection", FlowGraphDataConnection);
}
//# sourceMappingURL=flowGraphDataConnection.pure.js.map