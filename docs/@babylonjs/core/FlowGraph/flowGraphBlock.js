import { RandomGUID } from "../Misc/guid.js";
import { FlowGraphDataConnection } from "./flowGraphDataConnection.pure.js";
import { defaultValueSerializationFunction } from "./serialization.js";
/**
 * A block in a flow graph. The most basic form
 * of a block has inputs and outputs that contain
 * data.
 */
export class FlowGraphBlock {
    /** Constructor is protected so only subclasses can be instantiated
     * @param config optional configuration for this block
     * @internal - do not use directly. Extend this class instead.
     */
    constructor(
    /**
     * the configuration of the block
     */
    config) {
        this.config = config;
        /**
         * A randomly generated GUID for each block.
         */
        this.uniqueId = RandomGUID();
        this.name = this.config?.name ?? this.getClassName();
        this.dataInputs = [];
        this.dataOutputs = [];
    }
    /**
     * @internal
     * This function is called when the block needs to update its output flows.
     * @param _context the context in which it is running
     */
    _updateOutputs(_context) {
        // empty by default, overridden in data blocks
    }
    /**
     * Registers a data input on the block.
     * @param name the name of the input
     * @param richType the type of the input
     * @param defaultValue optional default value of the input. If not set, the rich type's default value will be used.
     * @returns the created connection
     */
    registerDataInput(name, richType, defaultValue) {
        const input = new FlowGraphDataConnection(name, 0 /* FlowGraphConnectionType.Input */, this, richType, defaultValue);
        this.dataInputs.push(input);
        return input;
    }
    /**
     * Registers a data output on the block.
     * @param name the name of the input
     * @param richType the type of the input
     * @param defaultValue optional default value of the input. If not set, the rich type's default value will be used.
     * @returns the created connection
     */
    registerDataOutput(name, richType, defaultValue) {
        const output = new FlowGraphDataConnection(name, 1 /* FlowGraphConnectionType.Output */, this, richType, defaultValue);
        this.dataOutputs.push(output);
        return output;
    }
    /**
     * Given the name of a data input, returns the connection if it exists
     * @param name the name of the input
     * @returns the connection if it exists, undefined otherwise
     */
    getDataInput(name) {
        return this.dataInputs.find((i) => i.name === name);
    }
    /**
     * Given the name of a data output, returns the connection if it exists
     * @param name the name of the output
     * @returns the connection if it exists, undefined otherwise
     */
    getDataOutput(name) {
        return this.dataOutputs.find((i) => i.name === name);
    }
    /**
     * Serializes this block
     * @param serializationObject the object to serialize to
     * @param _valueSerializeFunction a function that serializes a specific value
     */
    serialize(serializationObject = {}, _valueSerializeFunction = defaultValueSerializationFunction) {
        serializationObject.uniqueId = this.uniqueId;
        serializationObject.config = {};
        if (this.config) {
            const config = this.config;
            const keys = Object.keys(config);
            for (const key of keys) {
                _valueSerializeFunction(key, config[key], serializationObject.config);
            }
        }
        serializationObject.dataInputs = [];
        serializationObject.dataOutputs = [];
        serializationObject.className = this.getClassName();
        for (const input of this.dataInputs) {
            const serializedInput = {};
            input.serialize(serializedInput);
            serializationObject.dataInputs.push(serializedInput);
        }
        for (const output of this.dataOutputs) {
            const serializedOutput = {};
            output.serialize(serializedOutput);
            serializationObject.dataOutputs.push(serializedOutput);
        }
    }
    /**
     * Deserializes this block
     * @param _serializationObject the object to deserialize from
     */
    deserialize(_serializationObject) {
        // no-op by default
    }
    _log(context, action, payload) {
        context.logger?.addLogItem({
            action,
            payload,
            className: this.getClassName(),
            uniqueId: this.uniqueId,
        });
    }
    /**
     * Gets the class name of this block
     * @returns the class name
     */
    getClassName() {
        return "FlowGraphBlock";
    }
}
//# sourceMappingURL=flowGraphBlock.js.map