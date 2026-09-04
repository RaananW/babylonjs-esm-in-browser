import { Observable } from "../Misc/observable.js";
import { FlowGraph } from "./flowGraph.js";
import { Logger } from "../Misc/logger.js";
import { GetDefaultEventReferenceKey, GetDefaultEventReference } from "./flowGraphHostResolver.js";
/**
 * This class holds all of the existing flow graphs and is responsible for creating new ones.
 * It also handles starting/stopping multiple graphs and communication between them through an Event Coordinator
 * This is the entry point for the flow graph system.
 * @experimental This class is still in development and is subject to change.
 */
export class FlowGraphCoordinator {
    /**
     * Observable raised when a flow graph is added to any coordinator. Used by the inspector to keep
     * the flow graph list in sync. The payload is the newly added flow graph.
     */
    static get OnFlowGraphAddedObservable() {
        return this._OnFlowGraphAddedObservable;
    }
    /**
     * Observable raised when a flow graph is removed from any coordinator. Used by the inspector to keep
     * the flow graph list in sync. The payload is the removed flow graph.
     */
    static get OnFlowGraphRemovedObservable() {
        return this._OnFlowGraphRemovedObservable;
    }
    constructor(
    /**
     * the configuration of the block
     */
    config) {
        this.config = config;
        /**
         * When set to true (default) custom events will be dispatched synchronously.
         * This means that the events will be dispatched immediately when they are triggered.
         */
        this.dispatchEventsSynchronously = true;
        this._flowGraphs = [];
        this._customEventsMap = new Map();
        this._eventExecutionCounter = new Map();
        this._executeOnNextFrame = [];
        this._eventUniqueId = 0;
        /**
         * Stack of custom-event dispatches currently in progress. Each entry pairs the
         * dispatched event id with the Observable's EventState so that
         * `event/stopPropagation` can stop the remaining handlers of an in-flight
         * dispatch. A stack (rather than a single value) tolerates re-entrant
         * dispatching, e.g. an event handler synchronously sending another event.
         * @internal
         */
        this._eventDispatchStack = [];
        // When the scene is disposed, dispose all graphs currently running on it.
        this._disposeObserver = this.config.scene.onDisposeObservable.add(() => {
            this.dispose();
        });
        this._onBeforeRenderObserver = this.config.scene.onBeforeRenderObservable.add(() => {
            // Reset the event execution counter at the beginning of each frame.
            this._eventExecutionCounter.clear();
            // duplicate the _executeOnNextFrame array to avoid modifying it while iterating over it
            const executeOnNextFrame = this._executeOnNextFrame.slice(0);
            if (executeOnNextFrame.length) {
                // Execute the events that were triggered on the next frame.
                for (const event of executeOnNextFrame) {
                    this.notifyCustomEvent(event.id, event.data, false);
                    // remove the event from the array
                    const index = this._executeOnNextFrame.findIndex((e) => e.uniqueId === event.uniqueId);
                    if (index !== -1) {
                        this._executeOnNextFrame.splice(index, 1);
                    }
                }
            }
        });
        // Add itself to the SceneCoordinators list for the Inspector.
        let coordinators = FlowGraphCoordinator.SceneCoordinators.get(this.config.scene);
        if (!coordinators) {
            coordinators = [];
            FlowGraphCoordinator.SceneCoordinators.set(this.config.scene, coordinators);
        }
        coordinators.push(this);
    }
    /**
     * Creates a new flow graph and adds it to the list of existing flow graphs
     * @param name - optional name for the new graph. If not provided, an auto-generated name is used.
     * @returns a new flow graph
     */
    createGraph(name) {
        const graphName = name ?? `Graph ${this._flowGraphs.length + 1}`;
        const graph = new FlowGraph({ scene: this.config.scene, coordinator: this, name: graphName });
        this._flowGraphs.push(graph);
        FlowGraphCoordinator._OnFlowGraphAddedObservable.notifyObservers(graph);
        return graph;
    }
    /**
     * Removes a flow graph from the list of existing flow graphs and disposes it
     * @param graph the graph to remove
     */
    removeGraph(graph) {
        const index = this._flowGraphs.indexOf(graph);
        if (index !== -1) {
            graph.dispose();
            this._flowGraphs.splice(index, 1);
            FlowGraphCoordinator._OnFlowGraphRemovedObservable.notifyObservers(graph);
        }
    }
    /**
     * Starts all graphs
     */
    start() {
        for (const graph of this._flowGraphs) {
            graph.start();
        }
    }
    /**
     * Disposes all graphs
     */
    dispose() {
        for (const graph of this._flowGraphs) {
            graph.dispose();
            FlowGraphCoordinator._OnFlowGraphRemovedObservable.notifyObservers(graph);
        }
        this._flowGraphs.length = 0;
        this._disposeObserver?.remove();
        this._onBeforeRenderObserver?.remove();
        // Remove itself from the SceneCoordinators list for the Inspector.
        const coordinators = FlowGraphCoordinator.SceneCoordinators.get(this.config.scene) ?? [];
        const index = coordinators.indexOf(this);
        if (index !== -1) {
            coordinators.splice(index, 1);
        }
    }
    /**
     * Serializes this coordinator to a JSON object.
     * @param serializationObject the object to serialize to
     * @param valueSerializeFunction the function to use to serialize the value
     */
    serialize(serializationObject, valueSerializeFunction) {
        serializationObject._flowGraphs = [];
        for (const graph of this._flowGraphs) {
            const serializedGraph = {};
            graph.serialize(serializedGraph, valueSerializeFunction);
            serializationObject._flowGraphs.push(serializedGraph);
        }
        serializationObject.dispatchEventsSynchronously = this.dispatchEventsSynchronously;
    }
    /**
     * Gets the list of flow graphs
     */
    get flowGraphs() {
        return this._flowGraphs;
    }
    /**
     * Get an observable that will be notified when the event with the given id is fired.
     * @param id the id of the event
     * @returns the observable for the event
     */
    getCustomEventObservable(id) {
        let observable = this._customEventsMap.get(id);
        if (!observable) {
            // receive event is initialized before scene start, so no need to notify if triggered. but possible!
            observable = new Observable( /*undefined, true*/);
            this._customEventsMap.set(id, observable);
        }
        return observable;
    }
    /**
     * Notifies the observable for the given event id with the given data.
     * @param id the id of the event
     * @param data the data to send with the event
     * @param async if true, the event will be dispatched asynchronously
     */
    notifyCustomEvent(id, data, async = !this.dispatchEventsSynchronously) {
        if (async) {
            this._executeOnNextFrame.push({ id, data, uniqueId: this._eventUniqueId++ });
            return;
        }
        // check if we are not exceeding the max number of events
        if (this._eventExecutionCounter.has(id)) {
            const count = this._eventExecutionCounter.get(id);
            this._eventExecutionCounter.set(id, count + 1);
            if (count >= FlowGraphCoordinator.MaxEventTypeExecutionPerFrame) {
                if (count === FlowGraphCoordinator.MaxEventTypeExecutionPerFrame) {
                    Logger.Warn(`FlowGraphCoordinator: Too many executions of event "${id}".`);
                }
                return;
            }
        }
        else {
            this._eventExecutionCounter.set(id, 1);
        }
        const observable = this._customEventsMap.get(id);
        if (observable) {
            observable.notifyObservers(data);
        }
    }
    /**
     * @internal
     * Marks the beginning of a custom-event dispatch. Called by event receiver
     * blocks from within their Observable callback so that the dispatch's
     * EventState becomes reachable by `event/stopPropagation` while the receiver
     * flow executes synchronously.
     * @param eventId the id of the event being dispatched
     * @param state the Observable EventState for this dispatch
     */
    _beginEventDispatch(eventId, state) {
        this._eventDispatchStack.push({ eventId, state });
    }
    /**
     * @internal
     * Marks the end of the most recent custom-event dispatch started with
     * {@link _beginEventDispatch}.
     */
    _endEventDispatch() {
        this._eventDispatchStack.pop();
    }
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
    stopEventPropagation(event, stopImmediate) {
        if (typeof event !== "string" || !stopImmediate) {
            return;
        }
        const decode = this.config.hostResolver?.decodeEventReference ?? GetDefaultEventReferenceKey;
        const eventId = decode(event);
        if (eventId === undefined) {
            return;
        }
        // Find the most recent matching in-flight dispatch and skip its remaining observers.
        for (let i = this._eventDispatchStack.length - 1; i >= 0; i--) {
            if (this._eventDispatchStack[i].eventId === eventId) {
                this._eventDispatchStack[i].state.skipNextObservers = true;
                return;
            }
        }
    }
    /**
     * @internal
     * Encodes an event source key as the opaque reference exposed on an event block's `event`
     * output, delegating to the host resolver when one is configured.
     * @param key the event source key
     * @returns the event reference
     */
    _getEventReference(key) {
        const encode = this.config.hostResolver?.encodeEventReference;
        return encode ? encode(key) : GetDefaultEventReference(key);
    }
}
/**
 * The maximum number of events per type.
 * This is used to limit the number of events that can be created in a single scene.
 * This is to prevent infinite loops.
 */
FlowGraphCoordinator.MaxEventsPerType = 30;
/**
 * The maximum number of execution of a specific event in a single frame.
 */
FlowGraphCoordinator.MaxEventTypeExecutionPerFrame = 30;
/**
 * @internal
 * A list of all the coordinators per scene. Will be used by the inspector
 */
FlowGraphCoordinator.SceneCoordinators = new Map();
FlowGraphCoordinator._OnFlowGraphAddedObservable = new Observable();
FlowGraphCoordinator._OnFlowGraphRemovedObservable = new Observable();
//# sourceMappingURL=flowGraphCoordinator.js.map