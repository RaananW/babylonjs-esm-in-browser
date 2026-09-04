import { type EventState, type IReadonlyObservable, Observable } from "../Misc/observable.js";
import { type Scene } from "../scene.js";
import { FlowGraph } from "./flowGraph.js";
import { type IPathToObjectConverter } from "../ObjectModel/objectModelInterfaces.js";
import { type IObjectAccessor } from "./typeDefinitions.js";
import { type IAssetContainer } from "../IAssetContainer.js";
import { type IFlowGraphHostResolver } from "./flowGraphHostResolver.js";
/**
 * Parameters used to create a flow graph engine.
 */
export interface IFlowGraphCoordinatorConfiguration {
    /**
     * The scene that the flow graph engine belongs to.
     */
    scene: Scene;
    /**
     * Optional resolver letting the environment hosting the graphs decide how runtime entities are
     * represented as opaque reference values. When omitted, a neutral built-in representation is used.
     */
    hostResolver?: IFlowGraphHostResolver;
}
/**
 * Parameters used to parse a flow graph coordinator.
 */
export interface IFlowGraphCoordinatorParseOptions {
    /**
     * A function that will be called to parse the value of a property.
     * @param key the key of the property
     * @param serializationObject the serialization object where the property is located
     * @param assetsContainer the assets container
     * @param scene the scene that the block is being parsed in
     */
    valueParseFunction?: (key: string, serializationObject: any, assetsContainer: IAssetContainer, scene: Scene) => any;
    /**
     * The path converter to use to convert the path to an object accessor.
     */
    pathConverter?: IPathToObjectConverter<IObjectAccessor>;
    /**
     * The scene that the flow graph coordinator belongs to.
     */
    scene: Scene;
}
/**
 * This class holds all of the existing flow graphs and is responsible for creating new ones.
 * It also handles starting/stopping multiple graphs and communication between them through an Event Coordinator
 * This is the entry point for the flow graph system.
 * @experimental This class is still in development and is subject to change.
 */
export declare class FlowGraphCoordinator {
    /**
     * the configuration of the block
     */
    config: IFlowGraphCoordinatorConfiguration;
    /**
     * The maximum number of events per type.
     * This is used to limit the number of events that can be created in a single scene.
     * This is to prevent infinite loops.
     */
    static MaxEventsPerType: number;
    /**
     * The maximum number of execution of a specific event in a single frame.
     */
    static MaxEventTypeExecutionPerFrame: number;
    /**
     * @internal
     * A list of all the coordinators per scene. Will be used by the inspector
     */
    static readonly SceneCoordinators: Map<Scene, FlowGraphCoordinator[]>;
    /**
     * Observable raised when a flow graph is added to any coordinator. Used by the inspector to keep
     * the flow graph list in sync. The payload is the newly added flow graph.
     */
    static get OnFlowGraphAddedObservable(): IReadonlyObservable<FlowGraph>;
    private static readonly _OnFlowGraphAddedObservable;
    /**
     * Observable raised when a flow graph is removed from any coordinator. Used by the inspector to keep
     * the flow graph list in sync. The payload is the removed flow graph.
     */
    static get OnFlowGraphRemovedObservable(): IReadonlyObservable<FlowGraph>;
    private static readonly _OnFlowGraphRemovedObservable;
    /**
     * When set to true (default) custom events will be dispatched synchronously.
     * This means that the events will be dispatched immediately when they are triggered.
     */
    dispatchEventsSynchronously: boolean;
    private readonly _flowGraphs;
    private _customEventsMap;
    private _eventExecutionCounter;
    private _disposeObserver;
    private _onBeforeRenderObserver;
    private _executeOnNextFrame;
    private _eventUniqueId;
    /**
     * Stack of custom-event dispatches currently in progress. Each entry pairs the
     * dispatched event id with the Observable's EventState so that
     * `event/stopPropagation` can stop the remaining handlers of an in-flight
     * dispatch. A stack (rather than a single value) tolerates re-entrant
     * dispatching, e.g. an event handler synchronously sending another event.
     * @internal
     */
    _eventDispatchStack: {
        eventId: string;
        state: EventState;
    }[];
    constructor(
    /**
     * the configuration of the block
     */
    config: IFlowGraphCoordinatorConfiguration);
    /**
     * Creates a new flow graph and adds it to the list of existing flow graphs
     * @param name - optional name for the new graph. If not provided, an auto-generated name is used.
     * @returns a new flow graph
     */
    createGraph(name?: string): FlowGraph;
    /**
     * Removes a flow graph from the list of existing flow graphs and disposes it
     * @param graph the graph to remove
     */
    removeGraph(graph: FlowGraph): void;
    /**
     * Starts all graphs
     */
    start(): void;
    /**
     * Disposes all graphs
     */
    dispose(): void;
    /**
     * Serializes this coordinator to a JSON object.
     * @param serializationObject the object to serialize to
     * @param valueSerializeFunction the function to use to serialize the value
     */
    serialize(serializationObject: any, valueSerializeFunction?: (key: string, value: any, serializationObject: any) => void): void;
    /**
     * Gets the list of flow graphs
     */
    get flowGraphs(): FlowGraph[];
    /**
     * Get an observable that will be notified when the event with the given id is fired.
     * @param id the id of the event
     * @returns the observable for the event
     */
    getCustomEventObservable(id: string): Observable<any>;
    /**
     * Notifies the observable for the given event id with the given data.
     * @param id the id of the event
     * @param data the data to send with the event
     * @param async if true, the event will be dispatched asynchronously
     */
    notifyCustomEvent(id: string, data: any, async?: boolean): void;
    /**
     * @internal
     * Marks the beginning of a custom-event dispatch. Called by event receiver
     * blocks from within their Observable callback so that the dispatch's
     * EventState becomes reachable by `event/stopPropagation` while the receiver
     * flow executes synchronously.
     * @param eventId the id of the event being dispatched
     * @param state the Observable EventState for this dispatch
     */
    _beginEventDispatch(eventId: string, state: EventState): void;
    /**
     * @internal
     * Marks the end of the most recent custom-event dispatch started with
     * {@link _beginEventDispatch}.
     */
    _endEventDispatch(): void;
    /**
     * Stops the propagation of an in-flight custom event, preventing any event
     * handler nodes that have not been activated yet from running for the current
     * dispatch.
     *
     * The `event` argument is the opaque event reference produced by an event block on its `event`
     * output. If it does not reference an event that is currently being dispatched, this is a no-op.
     *
     * Babylon custom events have no scene-graph propagation layer, so there are
     * no transitive activations to cancel when `stopImmediate` is false. When it
     * is true, the remaining handlers in the Observable dispatch are skipped.
     * @param event the event reference to stop propagation for
     * @param stopImmediate whether to also stop remaining immediate handlers
     */
    stopEventPropagation(event: string, stopImmediate: boolean): void;
    /**
     * @internal
     * Encodes an event source key as the opaque reference exposed on an event block's `event`
     * output, delegating to the host resolver when one is configured.
     * @param key the event source key
     * @returns the event reference
     */
    _getEventReference(key: string): string;
}
