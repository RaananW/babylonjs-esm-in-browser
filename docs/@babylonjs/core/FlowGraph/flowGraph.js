import { Observable } from "../Misc/observable.js";
import { FlowGraphContext } from "./flowGraphContext.js";
import { FlowGraphExecutionBlock } from "./flowGraphExecutionBlock.js";
import { FlowGraphAsyncExecutionBlock } from "./flowGraphAsyncExecutionBlock.js";
import { FlowGraphSceneEventCoordinator } from "./flowGraphSceneEventCoordinator.js";
import { _IsDescendantOf } from "./utils.js";
import { ValidateFlowGraphWithBlockList } from "./flowGraphValidator.js";
import { RandomGUID } from "../Misc/guid.js";
import { Tools } from "../Misc/tools.pure.js";
import { AbstractEngine } from "../Engines/abstractEngine.js";
export var FlowGraphState;
(function (FlowGraphState) {
    /**
     * The graph is stopped
     */
    FlowGraphState[FlowGraphState["Stopped"] = 0] = "Stopped";
    /**
     * The graph is running
     */
    FlowGraphState[FlowGraphState["Started"] = 1] = "Started";
    /**
     * The graph is paused (contexts kept, pending tasks cancelled)
     */
    FlowGraphState[FlowGraphState["Paused"] = 2] = "Paused";
})(FlowGraphState || (FlowGraphState = {}));
/**
 * Class used to represent a flow graph.
 * A flow graph is a graph of blocks that can be used to create complex logic.
 * Blocks can be added to the graph and connected to each other.
 * The graph can then be started, which will init and start all of its event blocks.
 *
 * @experimental FlowGraph is still in development and is subject to change.
 */
export class FlowGraph {
    /** @returns the flow graph editor from a UMD bundle or the BABYLON global, or undefined if not loaded */
    _getGlobalFlowGraphEditor() {
        // UMD global name detection from bundle metadata. rollup-built UMD bundles may expose the
        // editor class on `.default.FlowGraphEditor`, so unwrap that case before falling back to
        // the BABYLON global emitted from the editor entry point.
        if (typeof FLOWGRAPHEDITOR !== "undefined") {
            if (FLOWGRAPHEDITOR.FlowGraphEditor) {
                return FLOWGRAPHEDITOR;
            }
            if (FLOWGRAPHEDITOR.default?.FlowGraphEditor) {
                return FLOWGRAPHEDITOR.default;
            }
        }
        if (typeof BABYLON !== "undefined" && typeof BABYLON.FlowGraphEditor !== "undefined") {
            return BABYLON;
        }
        return undefined;
    }
    /**
     * The scene associated with this flow graph.
     */
    get scene() {
        return this._scene;
    }
    /**
     * The coordinator that owns this flow graph.
     */
    get coordinator() {
        return this._coordinator;
    }
    /**
     * The scene event coordinator for this graph.
     * Provides access to runtime event state such as currently pressed keys.
     */
    get sceneEventCoordinator() {
        return this._sceneEventCoordinator;
    }
    /**
     * The state of the graph
     */
    get state() {
        return this._state;
    }
    /**
     * The state of the graph
     */
    set state(value) {
        this._state = value;
        this.onStateChangedObservable.notifyObservers(value);
    }
    /**
     * Construct a Flow Graph
     * @param params construction parameters. currently only the scene
     */
    constructor(params) {
        this._BJSFLOWGRAPHEDITOR = this._getGlobalFlowGraphEditor();
        /**
         * An observable that is triggered when the state of the graph changes.
         */
        this.onStateChangedObservable = new Observable();
        /** @internal */
        this._eventBlocks = {
            ["SceneReady" /* FlowGraphEventType.SceneReady */]: [],
            ["SceneDispose" /* FlowGraphEventType.SceneDispose */]: [],
            ["SceneBeforeRender" /* FlowGraphEventType.SceneBeforeRender */]: [],
            ["MeshPick" /* FlowGraphEventType.MeshPick */]: [],
            ["PointerDown" /* FlowGraphEventType.PointerDown */]: [],
            ["PointerUp" /* FlowGraphEventType.PointerUp */]: [],
            ["PointerMove" /* FlowGraphEventType.PointerMove */]: [],
            ["PointerOver" /* FlowGraphEventType.PointerOver */]: [],
            ["PointerOut" /* FlowGraphEventType.PointerOut */]: [],
            ["KeyDown" /* FlowGraphEventType.KeyDown */]: [],
            ["KeyUp" /* FlowGraphEventType.KeyUp */]: [],
            ["SceneAfterRender" /* FlowGraphEventType.SceneAfterRender */]: [],
            ["NoTrigger" /* FlowGraphEventType.NoTrigger */]: [],
        };
        /**
         * All blocks that belong to this graph, including unreachable ones.
         * @internal
         */
        this._allBlocks = [];
        this._executionContexts = [];
        /**
         * The state of the graph
         */
        this._state = 0 /* FlowGraphState.Stopped */;
        this._scene = params.scene;
        this._sceneEventCoordinator = new FlowGraphSceneEventCoordinator(this._scene);
        this._coordinator = params.coordinator;
        this.name = params.name ?? "Graph";
        this.uniqueId = params.uniqueId ?? RandomGUID();
    }
    _attachEventObserver() {
        if (this._eventObserver) {
            return;
        }
        this._eventObserver = this._sceneEventCoordinator.onEventTriggeredObservable.add((event) => {
            if (event.type === "SceneDispose" /* FlowGraphEventType.SceneDispose */) {
                this.dispose();
                return;
            }
            if (this.state !== 1 /* FlowGraphState.Started */) {
                return;
            }
            for (const context of this._executionContexts) {
                const order = this._getContextualOrder(event.type, context);
                for (const block of order) {
                    // iterate contexts
                    if (!block._executeEvent(context, event.payload)) {
                        break;
                    }
                }
            }
            // custom behavior(s) of specific events
            switch (event.type) {
                case "SceneReady" /* FlowGraphEventType.SceneReady */:
                    this._sceneEventCoordinator.sceneReadyTriggered = true;
                    break;
                case "SceneBeforeRender" /* FlowGraphEventType.SceneBeforeRender */:
                    for (const context of this._executionContexts) {
                        context._notifyOnTick(event.payload);
                    }
                    break;
            }
        });
    }
    _detachEventObserver() {
        this._eventObserver?.remove();
        this._eventObserver = null;
    }
    /**
     * Sets a new scene for this flow graph, re-wiring all event listeners.
     * This is useful when the scene the flow graph should listen to changes
     * (e.g. when a new scene is loaded in an editor preview).
     * If the graph is currently running, it will be stopped first and must be
     * restarted manually after calling this method.
     * @param scene the new scene to attach to
     */
    setScene(scene) {
        if (scene === this._scene) {
            return;
        }
        if (this.state === 1 /* FlowGraphState.Started */) {
            this.stop();
        }
        // Tear down old event coordinator
        this._detachEventObserver();
        this._sceneEventCoordinator.dispose();
        // Clear execution contexts so start() creates fresh ones with the new scene.
        // NOTE: This intentionally discards user variables and connection values.
        // Callers that need to preserve them (e.g. the Flow Graph Editor) should
        // snapshot context state BEFORE calling setScene() and restore it in a
        // wrapped createContext() callback after start() re-creates contexts.
        this._executionContexts.length = 0;
        // Rebuild with the new scene
        this._scene = scene;
        this._scene.constantlyUpdateMeshUnderPointer = true; // ensure pointer info is always up to date for event blocks that need it
        // Re-resolve node references (e.g. meshes targeted by Get/Set property blocks) against the
        // new scene. This is required when the graph was parsed before its scene was populated (for
        // example an editor that loads a graph from a snippet first and the referenced scene second):
        // the references would otherwise stay bound to nodes from the old/disposed scene.
        for (const block of this._allBlocks) {
            for (const input of block.dataInputs) {
                input._reresolveDefaultValueForScene(scene);
            }
        }
        this._sceneEventCoordinator = new FlowGraphSceneEventCoordinator(this._scene);
        // Pre-attach the event observer so that events from the new
        // coordinator are routed to the graph immediately.  The handler
        // guards against processing events while the graph is stopped,
        // but having the observer in place ensures no events are lost
        // when start() is called shortly after.
        this._attachEventObserver();
    }
    /**
     * Create a context. A context represents one self contained execution for the graph, with its own variables.
     * @returns the context, where you can get and set variables
     */
    createContext() {
        const context = new FlowGraphContext({ scene: this._scene, coordinator: this._coordinator, sceneEventCoordinator: this._sceneEventCoordinator });
        this._executionContexts.push(context);
        return context;
    }
    /**
     * Returns the execution context at a given index
     * @param index the index of the context
     * @returns the execution context at that index
     */
    getContext(index) {
        return this._executionContexts[index];
    }
    /**
     * Returns the number of execution contexts currently attached to this graph.
     */
    get contextCount() {
        return this._executionContexts.length;
    }
    /**
     * Remove an execution context by index. Any pending async blocks on
     * the context are cleared before removal.
     * @param index the index of the context to remove
     * @returns the removed context, or undefined if the index was out of range
     */
    removeContext(index) {
        if (index < 0 || index >= this._executionContexts.length) {
            return undefined;
        }
        const [removed] = this._executionContexts.splice(index, 1);
        removed._clearPendingBlocks();
        return removed;
    }
    /**
     * Returns all blocks registered in this graph, including disconnected ones.
     * @returns a read-only array of all blocks
     */
    getAllBlocks() {
        return this._allBlocks;
    }
    /**
     * Register a block with the graph. This does not wire any connections;
     * it simply ensures the block is tracked so that serialization, editor
     * display, and validation see it even when it is not reachable from an
     * event block.
     * @param block the block to register
     */
    addBlock(block) {
        if (this._allBlocks.indexOf(block) === -1) {
            this._allBlocks.push(block);
        }
    }
    /**
     * Remove a block from the graph. Disconnects all of its ports and, if it
     * is an event block, unregisters it from the event-block lists.
     * @param block the block to remove
     */
    removeBlock(block) {
        const idx = this._allBlocks.indexOf(block);
        if (idx !== -1) {
            this._allBlocks.splice(idx, 1);
        }
        // If it is an event block, remove from the event-block registry
        if (block instanceof FlowGraphExecutionBlock && "type" in block) {
            const eventBlock = block;
            const list = this._eventBlocks[eventBlock.type];
            if (list) {
                const eIdx = list.indexOf(eventBlock);
                if (eIdx !== -1) {
                    list.splice(eIdx, 1);
                }
            }
        }
        // If the block has pending async tasks (e.g. event subscriptions),
        // cancel them in all active execution contexts so deletion takes
        // effect immediately even while the graph is running.
        if (block instanceof FlowGraphAsyncExecutionBlock) {
            for (const context of this._executionContexts) {
                block._cancelPendingTasks(context);
                block._resetAfterCanceled(context);
            }
        }
        // Disconnect all ports
        for (const input of block.dataInputs) {
            input.disconnectFromAll();
        }
        for (const output of block.dataOutputs) {
            output.disconnectFromAll();
        }
        if (block instanceof FlowGraphExecutionBlock) {
            for (const signalIn of block.signalInputs) {
                signalIn.disconnectFromAll();
            }
            for (const signalOut of block.signalOutputs) {
                signalOut.disconnectFromAll();
            }
        }
    }
    /**
     * Add an event block. When the graph is started, it will start listening to events
     * from the block and execute the graph when they are triggered.
     * @param block the event block to be added
     */
    addEventBlock(block) {
        this.addBlock(block);
        if (block.type === "PointerOver" /* FlowGraphEventType.PointerOver */ || block.type === "PointerOut" /* FlowGraphEventType.PointerOut */) {
            this._scene.constantlyUpdateMeshUnderPointer = true;
        }
        this._eventBlocks[block.type].push(block);
        // if already started, sort and add to the pending
        if (this.state === 1 /* FlowGraphState.Started */) {
            for (const context of this._executionContexts) {
                block._startPendingTasks(context);
            }
        }
        else {
            this.onStateChangedObservable.addOnce((state) => {
                if (state === 1 /* FlowGraphState.Started */) {
                    for (const context of this._executionContexts) {
                        block._startPendingTasks(context);
                    }
                }
            });
        }
    }
    /**
     * Stops the flow graph. Cancels all pending tasks and clears execution contexts,
     * but keeps event blocks so the graph can be restarted.
     */
    stop() {
        if (this.state === 0 /* FlowGraphState.Stopped */) {
            return;
        }
        this._detachEventObserver();
        this.state = 0 /* FlowGraphState.Stopped */;
        for (const context of this._executionContexts) {
            context._clearPendingBlocks();
            context._clearPendingActivation();
        }
        this._executionContexts.length = 0;
    }
    /**
     * Pauses the flow graph. Cancels pending tasks but keeps execution contexts and event blocks.
     * Call start() to resume.
     */
    pause() {
        if (this.state !== 1 /* FlowGraphState.Started */) {
            return;
        }
        this._detachEventObserver();
        this.state = 2 /* FlowGraphState.Paused */;
        for (const context of this._executionContexts) {
            context._clearPendingBlocks();
        }
    }
    /**
     * Starts the flow graph. Initializes the event blocks and starts listening to events.
     * Can also be called to resume from a paused state.
     */
    start() {
        if (this.state === 1 /* FlowGraphState.Started */) {
            return;
        }
        const resumingFromPause = this.state === 2 /* FlowGraphState.Paused */;
        if (this._executionContexts.length === 0) {
            this.createContext();
        }
        this._attachEventObserver();
        this.state = 1 /* FlowGraphState.Started */;
        this._startPendingEvents();
        // On a fresh start (not resume), fire the SceneReady event.
        // The coordinator's own scene-ready observer may have already
        // fired (and been lost) while the graph was stopped, so reset
        // the flag and handle the ready state ourselves.
        if (!resumingFromPause) {
            this._sceneEventCoordinator.sceneReadyTriggered = false;
            if (this._scene.isReady(true)) {
                this._sceneEventCoordinator.sceneReadyTriggered = true;
                this._sceneEventCoordinator.onEventTriggeredObservable.notifyObservers({ type: "SceneReady" /* FlowGraphEventType.SceneReady */ });
            }
            else {
                // Scene isn't ready yet (e.g. pending shader compilations after
                // a scene swap).  Use executeWhenReady(true) which restarts the
                // readiness check loop — a plain addOnce on onReadyObservable
                // may never fire if the check loop already completed.
                this._scene.executeWhenReady(() => {
                    if (this.state === 1 /* FlowGraphState.Started */ && !this._sceneEventCoordinator.sceneReadyTriggered) {
                        this._sceneEventCoordinator.sceneReadyTriggered = true;
                        this._sceneEventCoordinator.onEventTriggeredObservable.notifyObservers({ type: "SceneReady" /* FlowGraphEventType.SceneReady */ });
                    }
                }, true);
            }
        }
    }
    _startPendingEvents() {
        for (const context of this._executionContexts) {
            for (const type in this._eventBlocks) {
                const order = this._getContextualOrder(type, context);
                for (const block of order) {
                    block._startPendingTasks(context);
                }
            }
        }
    }
    _getContextualOrder(type, context) {
        const order = this._eventBlocks[type].sort((a, b) => b.initPriority - a.initPriority);
        if (type === "MeshPick" /* FlowGraphEventType.MeshPick */) {
            const meshPickOrder = [];
            for (const block1 of order) {
                // If the block is a mesh pick, guarantee that picks of children meshes come before picks of parent meshes
                const mesh1 = block1.asset.getValue(context);
                let i = 0;
                for (; i < order.length; i++) {
                    const block2 = order[i];
                    const mesh2 = block2.asset.getValue(context);
                    if (mesh1 && mesh2 && _IsDescendantOf(mesh1, mesh2)) {
                        break;
                    }
                }
                meshPickOrder.splice(i, 0, block1);
            }
            return meshPickOrder;
        }
        return order;
    }
    /**
     * Disposes of the flow graph. Cancels any pending tasks and removes all event listeners.
     */
    dispose() {
        // Always release the scene-event wiring, even for a stopped or never-started graph.
        // The scene event coordinator attaches per-frame, pointer and keyboard observers to the
        // scene in its constructor, so a graph that is removed from its coordinator (or disposed)
        // while stopped would otherwise leak those observers and keep incurring per-frame overhead.
        this._detachEventObserver();
        this._sceneEventCoordinator.dispose();
        if (this.state === 0 /* FlowGraphState.Stopped */) {
            // Nothing is executing, so there is no run state to clear. Authored blocks are left
            // intact on purpose: the editor re-points a stopped graph across preview scenes via
            // setScene(), and each preview scene disposal raises a SceneDispose event that calls
            // dispose() here. Wiping the blocks would destroy the user's graph on every reset.
            return;
        }
        this.state = 0 /* FlowGraphState.Stopped */;
        for (const context of this._executionContexts) {
            context._clearPendingBlocks();
            context._clearPendingActivation();
        }
        this._executionContexts.length = 0;
        for (const type in this._eventBlocks) {
            this._eventBlocks[type].length = 0;
        }
        this._allBlocks.length = 0;
    }
    /**
     * Executes a function in all blocks of a flow graph, starting with the event blocks.
     * @param visitor the function to execute.
     */
    visitAllBlocks(visitor) {
        const visitList = [];
        const idsAddedToVisitList = new Set();
        for (const type in this._eventBlocks) {
            for (const block of this._eventBlocks[type]) {
                visitList.push(block);
                idsAddedToVisitList.add(block.uniqueId);
            }
        }
        while (visitList.length > 0) {
            const block = visitList.pop();
            visitor(block);
            for (const dataIn of block.dataInputs) {
                for (const connection of dataIn._connectedPoint) {
                    if (!idsAddedToVisitList.has(connection._ownerBlock.uniqueId)) {
                        visitList.push(connection._ownerBlock);
                        idsAddedToVisitList.add(connection._ownerBlock.uniqueId);
                    }
                }
            }
            if (block instanceof FlowGraphExecutionBlock) {
                for (const signalOut of block.signalOutputs) {
                    for (const connection of signalOut._connectedPoint) {
                        if (!idsAddedToVisitList.has(connection._ownerBlock.uniqueId)) {
                            visitList.push(connection._ownerBlock);
                            idsAddedToVisitList.add(connection._ownerBlock.uniqueId);
                        }
                    }
                }
            }
        }
    }
    /**
     * Validates the flow graph and returns all issues found.
     * Uses the tracked block list for complete validation including unreachable block detection.
     * @returns The validation result containing errors and warnings.
     */
    validate() {
        return ValidateFlowGraphWithBlockList(this, this._allBlocks);
    }
    /**
     * Serializes a graph
     * @param serializationObject the object to write the values in
     * @param valueSerializeFunction a function to serialize complex values
     */
    serialize(serializationObject = {}, valueSerializeFunction) {
        serializationObject.name = this.name;
        serializationObject.uniqueId = this.uniqueId;
        serializationObject.allBlocks = [];
        // Collect all blocks: traversal-reachable ones plus any registered
        // orphans in _allBlocks (e.g. disconnected blocks in the editor).
        const seen = new Set();
        const serializeBlock = (block) => {
            if (seen.has(block.uniqueId)) {
                return;
            }
            seen.add(block.uniqueId);
            const serializedBlock = {};
            block.serialize(serializedBlock);
            serializationObject.allBlocks.push(serializedBlock);
        };
        this.visitAllBlocks(serializeBlock);
        for (const block of this._allBlocks) {
            serializeBlock(block);
        }
        serializationObject.executionContexts = [];
        for (const context of this._executionContexts) {
            const serializedContext = {};
            context.serialize(serializedContext, valueSerializeFunction);
            serializationObject.executionContexts.push(serializedContext);
        }
    }
    /**
     * Launches the flow graph editor for this graph.
     * The editor is lazy-loaded from {@link FlowGraph.EditorURL} the first time it is used.
     * @param config defines the configuration of the editor
     * @returns a promise fulfilled when the editor is visible
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    async edit(config) {
        return await new Promise((resolve) => {
            this._BJSFLOWGRAPHEDITOR = this._BJSFLOWGRAPHEDITOR || this._getGlobalFlowGraphEditor();
            if (typeof this._BJSFLOWGRAPHEDITOR === "undefined") {
                const editorUrl = config && config.editorURL ? config.editorURL : FlowGraph.EditorURL;
                // Load the editor bundle and add it to the DOM.
                Tools.LoadBabylonScript(editorUrl, () => {
                    this._BJSFLOWGRAPHEDITOR = this._BJSFLOWGRAPHEDITOR || this._getGlobalFlowGraphEditor();
                    this._createFlowGraphEditor(config?.flowGraphEditorConfig);
                    resolve();
                });
            }
            else {
                this._createFlowGraphEditor(config?.flowGraphEditorConfig);
                resolve();
            }
        });
    }
    /**
     * Creates the flow graph editor window.
     * @param additionalConfig additional configuration forwarded to `FlowGraphEditor.Show()`
     */
    _createFlowGraphEditor(additionalConfig) {
        const editorConfig = {
            flowGraph: this,
            hostScene: this._scene,
            // edit() always targets the developer's own live graph and scene, so the editor should
            // attach to that scene instead of spinning up a throwaway preview scene. A caller can
            // still override this via additionalConfig.
            attachToLiveScene: true,
            ...additionalConfig,
        };
        this._BJSFLOWGRAPHEDITOR.FlowGraphEditor.Show(editorConfig);
    }
}
/**
 * Define the URL to load the flow graph editor script from.
 */
FlowGraph.EditorURL = `${Tools._DefaultCdnUrl}/v${AbstractEngine.Version}/flowGraphEditor/babylon.flowGraphEditor.js`;
//# sourceMappingURL=flowGraph.js.map