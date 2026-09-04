import { type IKHRInteractivity_Graph } from "babylonjs-gltf2interface";
import { type IGLTF } from "../../glTFLoaderInterfaces.js";
import { type IGLTFToFlowGraphMapping } from "./declarationMapper.js";
import { type ISerializedFlowGraph, type ISerializedFlowGraphBlock } from "@babylonjs/core/FlowGraph/typeDefinitions.js";
import { FlowGraphTypes } from "@babylonjs/core/FlowGraph/flowGraphRichTypes.js";
/**
 * Description of a KHR_interactivity custom event, as parsed from the
 * glTF `events` array. Used by the importer to register the event with the
 * FlowGraph send/receive event blocks.
 */
export interface InteractivityEvent {
    /** Identifier of the event, used to match send and receive blocks. */
    eventId: string;
    /**
     * Optional payload schema for the event. Each entry describes one
     * value carried by the event: an `id` (the FlowGraph data socket name),
     * a `type` (glTF interactivity type name) and an optional default
     * `value`. `eventData` (the boolean) is currently unused.
     */
    eventData?: {
        eventData: boolean;
        id: string;
        type: string;
        value?: any;
    }[];
}
export declare const gltfTypeToBabylonType: {
    [key: string]: {
        length: number;
        flowGraphType: FlowGraphTypes;
        elementType: "number" | "boolean" | "string";
    };
};
/**
 * Parses a KHR_interactivity graph definition (the raw glTF JSON object) into
 * the serialized FlowGraph form consumed by {@link ParseFlowGraphAsync}.
 *
 * The class walks the interactivity types, declarations, variables, events
 * and nodes in order and emits an {@link ISerializedFlowGraph} via
 * {@link serializeToFlowGraph}.
 */
export declare class InteractivityGraphToFlowGraphParser {
    private _interactivityGraph;
    private _gltf;
    _animationTargetFps: number;
    /**
     * Note - the graph should be rejected if the same type is defined twice.
     * We currently don't validate that.
     */
    private _types;
    private _mappings;
    private _staticVariables;
    private _events;
    private _internalEventsCounter;
    private _nodes;
    /**
     * Extra blocks the parser inserts between existing nodes (e.g. the seconds→frames multiply for
     * connected animation-time inputs). Kept separate from any node's `blocks` array so per-node
     * post-processing that indexes into that array (such as the animation extraProcessors targeting
     * the last block) is not disturbed, then concatenated into the serialized graph.
     */
    private _insertedBlocks;
    constructor(_interactivityGraph: IKHRInteractivity_Graph, _gltf: IGLTF, _animationTargetFps?: number);
    get arrays(): {
        types: {
            length: number;
            flowGraphType: FlowGraphTypes;
            elementType: "number" | "boolean" | "string";
        }[];
        mappings: {
            flowGraphMapping: IGLTFToFlowGraphMapping;
            fullOperationName: string;
        }[];
        staticVariables: {
            type: FlowGraphTypes;
            value: any[];
        }[];
        events: InteractivityEvent[];
        nodes: {
            blocks: ISerializedFlowGraphBlock[];
            fullOperationName: string;
        }[];
    };
    private _parseTypes;
    private _parseDeclarations;
    private _parseVariables;
    private _parseVariable;
    private _parseEvents;
    private _parseNodes;
    private _getEmptyBlock;
    private _parseNodeConfiguration;
    private _parseNodeConnections;
    private _createNewSocketConnection;
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
    private _connectWithSecondsToFramesConversion;
    private _connectFlowGraphNodes;
    /**
     * Returns the deterministic FlowGraph user-variable name used for the
     * static variable at the given declaration index.
     * @param index zero-based index into the interactivity graph's `variables` array.
     * @returns the FlowGraph variable name (e.g. `staticVariable_3`).
     */
    getVariableName(index: number): string;
    /**
     * Serializes the parsed interactivity graph into the {@link ISerializedFlowGraph}
     * payload consumed by `ParseFlowGraphAsync`. Performs node-connection wiring
     * and seeds the execution context with the graph's static variables.
     * @returns the serialized FlowGraph for the parsed KHR_interactivity graph.
     */
    serializeToFlowGraph(): ISerializedFlowGraph;
}
