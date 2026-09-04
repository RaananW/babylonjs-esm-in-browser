import { getMappingForDeclaration, getMappingForFullOperationName } from "./declarationMapper.js";
import { Logger } from "@babylonjs/core/Misc/logger.js";
import { RandomGUID } from "@babylonjs/core/Misc/guid.js";
// eslint-disable-next-line @typescript-eslint/naming-convention
export const gltfTypeToBabylonType = {
    float: { length: 1, flowGraphType: "number" /* FlowGraphTypes.Number */, elementType: "number" },
    bool: { length: 1, flowGraphType: "boolean" /* FlowGraphTypes.Boolean */, elementType: "boolean" },
    float2: { length: 2, flowGraphType: "Vector2" /* FlowGraphTypes.Vector2 */, elementType: "number" },
    float3: { length: 3, flowGraphType: "Vector3" /* FlowGraphTypes.Vector3 */, elementType: "number" },
    float4: { length: 4, flowGraphType: "Vector4" /* FlowGraphTypes.Vector4 */, elementType: "number" },
    float4x4: { length: 16, flowGraphType: "Matrix" /* FlowGraphTypes.Matrix */, elementType: "number" },
    float2x2: { length: 4, flowGraphType: "Matrix2D" /* FlowGraphTypes.Matrix2D */, elementType: "number" },
    float3x3: { length: 9, flowGraphType: "Matrix3D" /* FlowGraphTypes.Matrix3D */, elementType: "number" },
    int: { length: 1, flowGraphType: "FlowGraphInteger" /* FlowGraphTypes.Integer */, elementType: "number" },
    // KHR_interactivity opaque reference type. Represented as a JSON Pointer string
    // (e.g. "/nodes/17/") that addresses a glTF object. The empty string is the
    // canonical "null reference" sentinel used by the parser.
    ref: { length: 1, flowGraphType: "string" /* FlowGraphTypes.String */, elementType: "string" },
};
/**
 * Parses a KHR_interactivity graph definition (the raw glTF JSON object) into
 * the serialized FlowGraph form consumed by {@link ParseFlowGraphAsync}.
 *
 * The class walks the interactivity types, declarations, variables, events
 * and nodes in order and emits an {@link ISerializedFlowGraph} via
 * {@link serializeToFlowGraph}.
 */
export class InteractivityGraphToFlowGraphParser {
    constructor(_interactivityGraph, _gltf, _animationTargetFps = 60) {
        this._interactivityGraph = _interactivityGraph;
        this._gltf = _gltf;
        this._animationTargetFps = _animationTargetFps;
        /**
         * Note - the graph should be rejected if the same type is defined twice.
         * We currently don't validate that.
         */
        this._types = [];
        this._mappings = [];
        this._staticVariables = [];
        this._events = [];
        this._internalEventsCounter = 0;
        this._nodes = [];
        /**
         * Extra blocks the parser inserts between existing nodes (e.g. the seconds→frames multiply for
         * connected animation-time inputs). Kept separate from any node's `blocks` array so per-node
         * post-processing that indexes into that array (such as the animation extraProcessors targeting
         * the last block) is not disturbed, then concatenated into the serialized graph.
         */
        this._insertedBlocks = [];
        // start with types
        this._parseTypes();
        // continue with declarations
        this._parseDeclarations();
        this._parseVariables();
        this._parseEvents();
        this._parseNodes();
    }
    get arrays() {
        return {
            types: this._types,
            mappings: this._mappings,
            staticVariables: this._staticVariables,
            events: this._events,
            nodes: this._nodes,
        };
    }
    _parseTypes() {
        if (!this._interactivityGraph.types) {
            return;
        }
        for (const type of this._interactivityGraph.types) {
            this._types.push(gltfTypeToBabylonType[type.signature]);
        }
    }
    _parseDeclarations() {
        if (!this._interactivityGraph.declarations) {
            return;
        }
        for (const declaration of this._interactivityGraph.declarations) {
            // make sure we have the mapping for this operation
            const mapping = getMappingForDeclaration(declaration);
            // mapping is defined, because we generate an empty mapping if it's not found
            if (!mapping) {
                Logger.Error(["No mapping found for declaration", declaration]);
                throw new Error("Error parsing declarations");
            }
            this._mappings.push({
                flowGraphMapping: mapping,
                fullOperationName: declaration.extension ? declaration.op + ":" + declaration.extension : declaration.op,
            });
        }
    }
    _parseVariables() {
        if (!this._interactivityGraph.variables) {
            return;
        }
        for (const variable of this._interactivityGraph.variables) {
            const parsed = this._parseVariable(variable);
            // set the default values here
            this._staticVariables.push(parsed);
        }
    }
    _parseVariable(variable, dataTransform) {
        const type = this._types[variable.type];
        if (!type) {
            Logger.Error(["No type found for variable", variable]);
            throw new Error("Error parsing variables");
        }
        if (variable.value) {
            if (variable.value.length !== type.length) {
                Logger.Error(["Invalid value length for variable", variable, type]);
                throw new Error("Error parsing variables");
            }
        }
        const value = variable.value || [];
        if (!value.length) {
            switch (type.flowGraphType) {
                case "boolean" /* FlowGraphTypes.Boolean */:
                    value.push(false);
                    break;
                case "FlowGraphInteger" /* FlowGraphTypes.Integer */:
                    value.push(0);
                    break;
                case "number" /* FlowGraphTypes.Number */:
                    value.push(NaN);
                    break;
                case "string" /* FlowGraphTypes.String */:
                    // Default for a `ref`-typed value is the null reference, encoded as the empty string.
                    value.push("");
                    break;
                case "Vector2" /* FlowGraphTypes.Vector2 */:
                    value.push(NaN, NaN);
                    break;
                case "Vector3" /* FlowGraphTypes.Vector3 */:
                    value.push(NaN, NaN, NaN);
                    break;
                case "Vector4" /* FlowGraphTypes.Vector4 */:
                case "Matrix2D" /* FlowGraphTypes.Matrix2D */:
                case "Quaternion" /* FlowGraphTypes.Quaternion */:
                    value.fill(NaN, 0, 4);
                    break;
                case "Matrix" /* FlowGraphTypes.Matrix */:
                    value.fill(NaN, 0, 16);
                    break;
                case "Matrix3D" /* FlowGraphTypes.Matrix3D */:
                    value.fill(NaN, 0, 9);
                    break;
                default:
                    break;
            }
        }
        // in case of NaN, Infinity, we need to parse the string to the object itself
        if (type.elementType === "number" && typeof value[0] === "string") {
            value[0] = parseFloat(value[0]);
        }
        return { type: type.flowGraphType, value: dataTransform ? dataTransform(value, this) : value };
    }
    _parseEvents() {
        if (!this._interactivityGraph.events) {
            return;
        }
        for (const event of this._interactivityGraph.events) {
            const converted = {
                eventId: event.id || "internalEvent_" + this._internalEventsCounter++,
            };
            if (event.values) {
                converted.eventData = Object.keys(event.values).map((key) => {
                    const eventValue = event.values?.[key];
                    if (!eventValue) {
                        Logger.Error(["No value found for event key", key]);
                        throw new Error("Error parsing events");
                    }
                    const type = this._types[eventValue.type];
                    if (!type) {
                        Logger.Error(["No type found for event value", eventValue]);
                        throw new Error("Error parsing events");
                    }
                    const value = typeof eventValue.value !== "undefined" ? this._parseVariable(eventValue) : undefined;
                    return {
                        id: key,
                        type: type.flowGraphType,
                        eventData: true,
                        value,
                    };
                });
            }
            this._events.push(converted);
        }
    }
    _parseNodes() {
        if (!this._interactivityGraph.nodes) {
            return;
        }
        for (const node of this._interactivityGraph.nodes) {
            // some validation
            if (typeof node.declaration !== "number") {
                Logger.Error(["No declaration found for node", node]);
                throw new Error("Error parsing nodes");
            }
            const mapping = this._mappings[node.declaration];
            if (!mapping) {
                Logger.Error(["No mapping found for node", node]);
                throw new Error("Error parsing nodes");
            }
            if (mapping.flowGraphMapping.validation) {
                const validationResult = mapping.flowGraphMapping.validation(node, this._interactivityGraph, this._gltf);
                if (!validationResult.valid) {
                    throw new Error(`Error validating interactivity node ${this._interactivityGraph.declarations?.[node.declaration].op} - ${validationResult.error}`);
                }
            }
            const blocks = [];
            // create block(s) for this node using the mapping
            for (const blockType of mapping.flowGraphMapping.blocks) {
                const block = this._getEmptyBlock(blockType, mapping.fullOperationName);
                this._parseNodeConfiguration(node, block, mapping.flowGraphMapping, blockType);
                blocks.push(block);
            }
            this._nodes.push({ blocks, fullOperationName: mapping.fullOperationName });
        }
    }
    _getEmptyBlock(className, type) {
        return {
            uniqueId: RandomGUID(),
            className,
            dataInputs: [],
            dataOutputs: [],
            signalInputs: [],
            signalOutputs: [],
            config: {},
            type,
            metadata: {},
        };
    }
    _parseNodeConfiguration(node, block, nodeMapping, blockType) {
        const gltfConfiguration = node.configuration;
        if (gltfConfiguration) {
            for (const key in gltfConfiguration) {
                const gltfProperty = gltfConfiguration[key];
                if (!gltfProperty) {
                    throw new Error("Error parsing node configuration");
                }
                const propertyMapping = nodeMapping.configuration?.[key];
                const belongsToBlock = propertyMapping && propertyMapping.toBlock ? propertyMapping.toBlock === blockType : nodeMapping.blocks.indexOf(blockType) === 0;
                if (belongsToBlock) {
                    let value = propertyMapping?.defaultValue;
                    if (gltfProperty?.value) {
                        value = gltfProperty.value;
                    }
                    if (!propertyMapping?.isArray) {
                        if (value.length !== 1) {
                            Logger.Warn(`Invalid non-array value length: ${value.length}`);
                        }
                        value = value[0];
                    }
                    if (propertyMapping?.dataTransformer) {
                        value = propertyMapping.dataTransformer(value, this);
                    }
                    if (value !== undefined) {
                        // Update the flow graph block config.
                        block.config[propertyMapping?.name || key] = {
                            value: value,
                        };
                    }
                }
            }
        }
    }
    _parseNodeConnections(context) {
        for (let i = 0; i < this._nodes.length; i++) {
            // get the corresponding gltf node
            const gltfNode = this._interactivityGraph.nodes?.[i];
            if (!gltfNode) {
                // should never happen but let's still check
                Logger.Error(["No node found for interactivity node", this._nodes[i]]);
                throw new Error("Error parsing node connections");
            }
            const flowGraphBlocks = this._nodes[i];
            const outputMapper = this._mappings[gltfNode.declaration];
            // validate
            if (!outputMapper) {
                Logger.Error(["No mapping found for node", gltfNode]);
                throw new Error("Error parsing node connections");
            }
            // KHR_interactivity spec section 3.2.4 "Unsupported Operations":
            // nodes referring to unsupported operations are demoted to no-ops.
            // Activations of their input flow sockets are ignored, their output
            // flow sockets are never activated, and their output value sockets
            // return constant type-default values. They have no backing
            // FlowGraph blocks (blocks.length === 0), so there is nothing to
            // wire for this node — skip all of its connections.
            if (flowGraphBlocks.blocks.length === 0) {
                Logger.Warn(`Skipping connections for no-op node #${i} (unsupported operation: ${flowGraphBlocks.fullOperationName})`);
                continue;
            }
            const flowsFromGLTF = gltfNode.flows || {};
            const flowsKeys = Object.keys(flowsFromGLTF).sort(); // sorting as some operations require sorted keys
            // connect the flows
            for (const flowKey of flowsKeys) {
                const flow = flowsFromGLTF[flowKey];
                const flowMapping = outputMapper.flowGraphMapping.outputs?.flows?.[flowKey];
                const socketOutName = flowMapping?.name || flowKey;
                // get the input node of this block
                const inputNodeId = flow.node;
                const nodeIn = this._nodes[inputNodeId];
                if (!nodeIn) {
                    Logger.Error(["No node found for input node id", inputNodeId]);
                    throw new Error("Error parsing node connections");
                }
                // Spec 3.2.4: input flow activations on no-op nodes are ignored,
                // so a flow connection into a no-op target is itself a no-op.
                // Drop it instead of crashing on the missing target block.
                if (nodeIn.blocks.length === 0) {
                    Logger.Warn(`Dropping flow connection from node #${i} "${flowKey}" to no-op node #${inputNodeId} (unsupported operation: ${nodeIn.fullOperationName})`);
                    continue;
                }
                // create a serialized socket
                const socketOut = this._createNewSocketConnection(socketOutName, true);
                const block = (flowMapping && flowMapping.toBlock && flowGraphBlocks.blocks.find((b) => b.className === flowMapping.toBlock)) || flowGraphBlocks.blocks[0];
                block.signalOutputs.push(socketOut);
                // get the mapper for the input node - in case it mapped to multiple blocks
                const inputMapper = getMappingForFullOperationName(nodeIn.fullOperationName);
                if (!inputMapper) {
                    Logger.Error(["No mapping found for input node", nodeIn]);
                    throw new Error("Error parsing node connections");
                }
                let flowInMapping = inputMapper.inputs?.flows?.[flow.socket || "in"];
                let arrayMapping = false;
                if (!flowInMapping) {
                    for (const key in inputMapper.inputs?.flows) {
                        if (key.startsWith("[") && key.endsWith("]")) {
                            arrayMapping = true;
                            flowInMapping = inputMapper.inputs?.flows?.[key];
                        }
                    }
                }
                const nodeInSocketName = flowInMapping ? (arrayMapping ? flowInMapping.name.replace("$1", flow.socket || "") : flowInMapping.name) : flow.socket || "in";
                const inputBlock = (flowInMapping && flowInMapping.toBlock && nodeIn.blocks.find((b) => b.className === flowInMapping.toBlock)) || nodeIn.blocks[0];
                // in all of the flow graph input connections, find the one with the same name as the socket
                let socketIn = inputBlock.signalInputs.find((s) => s.name === nodeInSocketName);
                // if the socket doesn't exist, create the input socket for the connection
                if (!socketIn) {
                    socketIn = this._createNewSocketConnection(nodeInSocketName);
                    inputBlock.signalInputs.push(socketIn);
                }
                // connect the sockets
                socketIn.connectedPointIds.push(socketOut.uniqueId);
                socketOut.connectedPointIds.push(socketIn.uniqueId);
            }
            // connect the values
            const valuesFromGLTF = gltfNode.values || {};
            const valuesKeys = Object.keys(valuesFromGLTF);
            for (const valueKey of valuesKeys) {
                const value = valuesFromGLTF[valueKey];
                let valueMapping = outputMapper.flowGraphMapping.inputs?.values?.[valueKey];
                let arrayMapping = false;
                if (!valueMapping) {
                    for (const key in outputMapper.flowGraphMapping.inputs?.values) {
                        if (key.startsWith("[") && key.endsWith("]")) {
                            arrayMapping = true;
                            valueMapping = outputMapper.flowGraphMapping.inputs?.values?.[key];
                        }
                    }
                }
                const socketInName = valueMapping ? (arrayMapping ? valueMapping.name.replace("$1", valueKey) : valueMapping.name) : valueKey;
                // create a serialized socket
                const socketIn = this._createNewSocketConnection(socketInName);
                const block = (valueMapping && valueMapping.toBlock && flowGraphBlocks.blocks.find((b) => b.className === valueMapping.toBlock)) || flowGraphBlocks.blocks[0];
                block.dataInputs.push(socketIn);
                // Captured before the connected branch below shadows `valueMapping`. When set and the
                // value is supplied by a connection, the seconds→frames `dataTransformer` cannot run
                // (it is parse-time only), so the raw connected value is scaled by a runtime multiply.
                const convertConnectedTimeToFrames = !!valueMapping?.convertConnectedTimeToFrames;
                if (value.value !== undefined) {
                    const convertedValue = this._parseVariable(value, valueMapping && valueMapping.dataTransformer);
                    context._connectionValues[socketIn.uniqueId] = convertedValue;
                }
                else if (typeof value.node !== "undefined") {
                    const nodeOutId = value.node;
                    const nodeOutSocketName = value.socket || "value";
                    const nodeOut = this._nodes[nodeOutId];
                    if (!nodeOut) {
                        Logger.Error(["No node found for output socket reference", value]);
                        throw new Error("Error parsing node connections");
                    }
                    // Spec 3.2.4: output value sockets of no-op nodes return
                    // constant type-default values. Leave the consumer's
                    // dataInput unconnected (no connectedPointIds) so the
                    // FlowGraph runtime falls back to the RichType default.
                    if (nodeOut.blocks.length === 0) {
                        Logger.Warn(`Dropping value connection from no-op node #${nodeOutId} (unsupported operation: ${nodeOut.fullOperationName}) into node #${i} "${valueKey}"; consumer will use type-default value`);
                        continue;
                    }
                    const outputMapper = getMappingForFullOperationName(nodeOut.fullOperationName);
                    if (!outputMapper) {
                        Logger.Error(["No mapping found for output socket reference", value]);
                        throw new Error("Error parsing node connections");
                    }
                    let valueMapping = outputMapper.outputs?.values?.[nodeOutSocketName];
                    let arrayMapping = false;
                    // check if there is an array mapping defined
                    if (!valueMapping) {
                        // search for a value mapping that has an array mapping
                        for (const key in outputMapper.outputs?.values) {
                            if (key.startsWith("[") && key.endsWith("]")) {
                                arrayMapping = true;
                                valueMapping = outputMapper.outputs?.values?.[key];
                            }
                        }
                    }
                    const socketOutName = valueMapping ? (arrayMapping ? valueMapping.name.replace("$1", nodeOutSocketName) : valueMapping?.name) : nodeOutSocketName;
                    const outBlock = (valueMapping && valueMapping.toBlock && nodeOut.blocks.find((b) => b.className === valueMapping.toBlock)) || nodeOut.blocks[0];
                    let socketOut = outBlock.dataOutputs.find((s) => s.name === socketOutName);
                    // if the socket doesn't exist, create it
                    if (!socketOut) {
                        socketOut = this._createNewSocketConnection(socketOutName, true);
                        outBlock.dataOutputs.push(socketOut);
                    }
                    // connect the sockets
                    if (convertConnectedTimeToFrames) {
                        this._connectWithSecondsToFramesConversion(context, socketOut, socketIn);
                    }
                    else {
                        socketIn.connectedPointIds.push(socketOut.uniqueId);
                        socketOut.connectedPointIds.push(socketIn.uniqueId);
                    }
                }
                else {
                    Logger.Error(["Invalid value for value connection", value]);
                    throw new Error("Error parsing node connections");
                }
            }
            // inter block connections
            if (outputMapper.flowGraphMapping.interBlockConnectors) {
                for (const connector of outputMapper.flowGraphMapping.interBlockConnectors) {
                    const input = connector.input;
                    const output = connector.output;
                    const isVariable = connector.isVariable;
                    this._connectFlowGraphNodes(input, output, flowGraphBlocks.blocks[connector.inputBlockIndex], flowGraphBlocks.blocks[connector.outputBlockIndex], isVariable);
                }
            }
            if (outputMapper.flowGraphMapping.extraProcessor) {
                const declaration = this._interactivityGraph.declarations?.[gltfNode.declaration];
                if (!declaration) {
                    Logger.Error(["No declaration found for extra processor", gltfNode]);
                    throw new Error("Error parsing node connections");
                }
                flowGraphBlocks.blocks = outputMapper.flowGraphMapping.extraProcessor(gltfNode, declaration, outputMapper.flowGraphMapping, this, flowGraphBlocks.blocks, context, this._gltf);
            }
        }
    }
    _createNewSocketConnection(name, isOutput) {
        return {
            uniqueId: RandomGUID(),
            name,
            _connectionType: isOutput ? 1 /* FlowGraphConnectionType.Output */ : 0 /* FlowGraphConnectionType.Input */,
            connectedPointIds: [],
        };
    }
    /**
     * Wires an upstream data output into a downstream data input through a runtime multiply block that
     * scales the value by the animation target fps. This converts a KHR animation time (seconds),
     * delivered by a connection (e.g. a `pointer/get` on the `maxTime` animation pointer), into the
     * Babylon animation frames expected by the play/stop-animation blocks. Literal times are already
     * converted at parse time by the input's `dataTransformer`, so this is only used for connections.
     * @param context the serialized flow graph context that stores literal socket values
     * @param upstreamOutput the data output socket providing the time value (in seconds)
     * @param downstreamInput the data input socket that expects the time in frames
     */
    _connectWithSecondsToFramesConversion(context, upstreamOutput, downstreamInput) {
        const multiplyBlock = this._getEmptyBlock("FlowGraphMultiplyBlock" /* FlowGraphBlockNames.Multiply */, "FlowGraphMultiplyBlock" /* FlowGraphBlockNames.Multiply */);
        // Scalar (float) multiply; matches how the `math/mul` mapping configures the block.
        multiplyBlock.config = { type: "number" /* FlowGraphTypes.Number */ };
        const inputA = this._createNewSocketConnection("a");
        const inputB = this._createNewSocketConnection("b");
        const output = this._createNewSocketConnection("value", true);
        multiplyBlock.dataInputs.push(inputA, inputB);
        multiplyBlock.dataOutputs.push(output);
        // The second factor is the constant animation target fps.
        context._connectionValues[inputB.uniqueId] = { type: "number" /* FlowGraphTypes.Number */, value: [this._animationTargetFps] };
        // upstream time output -> multiply.a
        inputA.connectedPointIds.push(upstreamOutput.uniqueId);
        upstreamOutput.connectedPointIds.push(inputA.uniqueId);
        // multiply.value (frames) -> downstream time input
        downstreamInput.connectedPointIds.push(output.uniqueId);
        output.connectedPointIds.push(downstreamInput.uniqueId);
        // Register the inserted block separately so serializeToFlowGraph picks it up without
        // appending to any node's block list (which would break per-node extraProcessors).
        this._insertedBlocks.push(multiplyBlock);
    }
    _connectFlowGraphNodes(input, output, serializedInput, serializedOutput, isVariable) {
        const inputArray = isVariable ? serializedInput.dataInputs : serializedInput.signalInputs;
        const outputArray = isVariable ? serializedOutput.dataOutputs : serializedOutput.signalOutputs;
        const inputConnection = inputArray.find((s) => s.name === input) || this._createNewSocketConnection(input);
        const outputConnection = outputArray.find((s) => s.name === output) || this._createNewSocketConnection(output, true);
        // of not found add it to the array
        if (!inputArray.find((s) => s.name === input)) {
            inputArray.push(inputConnection);
        }
        if (!outputArray.find((s) => s.name === output)) {
            outputArray.push(outputConnection);
        }
        // connect the sockets
        inputConnection.connectedPointIds.push(outputConnection.uniqueId);
        outputConnection.connectedPointIds.push(inputConnection.uniqueId);
    }
    /**
     * Returns the deterministic FlowGraph user-variable name used for the
     * static variable at the given declaration index.
     * @param index zero-based index into the interactivity graph's `variables` array.
     * @returns the FlowGraph variable name (e.g. `staticVariable_3`).
     */
    getVariableName(index) {
        return "staticVariable_" + index;
    }
    /**
     * Serializes the parsed interactivity graph into the {@link ISerializedFlowGraph}
     * payload consumed by `ParseFlowGraphAsync`. Performs node-connection wiring
     * and seeds the execution context with the graph's static variables.
     * @returns the serialized FlowGraph for the parsed KHR_interactivity graph.
     */
    serializeToFlowGraph() {
        const context = {
            uniqueId: RandomGUID(),
            _userVariables: {},
            _connectionValues: {},
        };
        this._parseNodeConnections(context);
        for (let i = 0; i < this._staticVariables.length; i++) {
            const variable = this._staticVariables[i];
            context._userVariables[this.getVariableName(i)] = variable;
        }
        const allBlocks = this._nodes.reduce((acc, val) => acc.concat(val.blocks), []).concat(this._insertedBlocks);
        return {
            rightHanded: true,
            allBlocks,
            executionContexts: [context],
        };
    }
}
//# sourceMappingURL=interactivityGraphParser.js.map