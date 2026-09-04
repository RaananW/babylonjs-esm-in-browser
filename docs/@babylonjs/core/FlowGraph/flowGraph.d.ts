import { Observable } from "../Misc/observable.js";
import { type Scene } from "../scene.js";
import { type FlowGraphEventBlock } from "./flowGraphEventBlock.js";
import { FlowGraphContext } from "./flowGraphContext.js";
import { type FlowGraphBlock } from "./flowGraphBlock.js";
import { type FlowGraphCoordinator } from "./flowGraphCoordinator.js";
import { type IObjectAccessor } from "./typeDefinitions.js";
import { type IPathToObjectConverter } from "../ObjectModel/objectModelInterfaces.js";
import { type IAssetContainer } from "../IAssetContainer.js";
import { FlowGraphEventType } from "./flowGraphEventType.js";
import { FlowGraphSceneEventCoordinator } from "./flowGraphSceneEventCoordinator.js";
import { type IFlowGraphValidationResult } from "./flowGraphValidator.js";
/**
 * Interface used to configure the launch of the flow graph editor.
 */
export interface IFlowGraphEditorLaunchOptions {
    /** Define the URL to load the flow graph editor script from */
    editorURL?: string;
    /** Additional configuration forwarded to `FlowGraphEditor.Show()` (e.g. hostScene, hostElement) */
    flowGraphEditorConfig?: {
        hostScene?: Scene;
        hostElement?: HTMLElement;
        attachToLiveScene?: boolean;
    };
}
export declare enum FlowGraphState {
    /**
     * The graph is stopped
     */
    Stopped = 0,
    /**
     * The graph is running
     */
    Started = 1,
    /**
     * The graph is paused (contexts kept, pending tasks cancelled)
     */
    Paused = 2
}
/**
 * Parameters used to create a flow graph.
 */
export interface IFlowGraphParams {
    /**
     * The scene that the flow graph belongs to.
     */
    scene: Scene;
    /**
     * The event coordinator used by the flow graph.
     */
    coordinator: FlowGraphCoordinator;
    /**
     * Optional human-readable name for the graph.
     * Defaults to "Graph" if not provided.
     */
    name?: string;
    /**
     * Optional unique identifier for the graph.
     * If not provided, a random UUID is generated.
     */
    uniqueId?: string;
}
/**
 * Options for parsing a flow graph.
 */
export interface IFlowGraphParseOptions {
    /**
     * A function that parses complex values in a scene.
     * @param key the key of the value
     * @param serializationObject the object to read the value from
     * @param assetsContainer the assets container to read assets from
     * @param scene the scene to read the value from
     */
    valueParseFunction?: (key: string, serializationObject: any, assetsContainer: IAssetContainer, scene: Scene) => any;
    /**
     * The flow graph coordinator.
     */
    coordinator: FlowGraphCoordinator;
    /**
     * A function that converts a path to an object accessor.
     */
    pathConverter?: IPathToObjectConverter<IObjectAccessor>;
}
/**
 * Class used to represent a flow graph.
 * A flow graph is a graph of blocks that can be used to create complex logic.
 * Blocks can be added to the graph and connected to each other.
 * The graph can then be started, which will init and start all of its event blocks.
 *
 * @experimental FlowGraph is still in development and is subject to change.
 */
export declare class FlowGraph {
    /**
     * A human-readable name for this graph.
     */
    name: string;
    /**
     * A unique identifier for this graph. Auto-generated if not provided.
     */
    uniqueId: string;
    /**
     * Define the URL to load the flow graph editor script from.
     */
    static EditorURL: string;
    private _BJSFLOWGRAPHEDITOR;
    /** @returns the flow graph editor from a UMD bundle or the BABYLON global, or undefined if not loaded */
    private _getGlobalFlowGraphEditor;
    /**
     * An observable that is triggered when the state of the graph changes.
     */
    onStateChangedObservable: Observable<FlowGraphState>;
    /** @internal */
    _eventBlocks: {
        [keyof in FlowGraphEventType]: FlowGraphEventBlock[];
    };
    /**
     * All blocks that belong to this graph, including unreachable ones.
     * @internal
     */
    _allBlocks: FlowGraphBlock[];
    /**
     * @internal
     */
    readonly _scene: Scene;
    /**
     * The scene associated with this flow graph.
     */
    get scene(): Scene;
    private _coordinator;
    /**
     * The coordinator that owns this flow graph.
     */
    get coordinator(): FlowGraphCoordinator;
    private _executionContexts;
    private _sceneEventCoordinator;
    /**
     * The scene event coordinator for this graph.
     * Provides access to runtime event state such as currently pressed keys.
     */
    get sceneEventCoordinator(): FlowGraphSceneEventCoordinator;
    private _eventObserver;
    /**
     * The state of the graph
     */
    private _state;
    /**
     * The state of the graph
     */
    get state(): FlowGraphState;
    /**
     * The state of the graph
     */
    set state(value: FlowGraphState);
    /**
     * Construct a Flow Graph
     * @param params construction parameters. currently only the scene
     */
    constructor(params: IFlowGraphParams);
    private _attachEventObserver;
    private _detachEventObserver;
    /**
     * Sets a new scene for this flow graph, re-wiring all event listeners.
     * This is useful when the scene the flow graph should listen to changes
     * (e.g. when a new scene is loaded in an editor preview).
     * If the graph is currently running, it will be stopped first and must be
     * restarted manually after calling this method.
     * @param scene the new scene to attach to
     */
    setScene(scene: Scene): void;
    /**
     * Create a context. A context represents one self contained execution for the graph, with its own variables.
     * @returns the context, where you can get and set variables
     */
    createContext(): FlowGraphContext;
    /**
     * Returns the execution context at a given index
     * @param index the index of the context
     * @returns the execution context at that index
     */
    getContext(index: number): FlowGraphContext;
    /**
     * Returns the number of execution contexts currently attached to this graph.
     */
    get contextCount(): number;
    /**
     * Remove an execution context by index. Any pending async blocks on
     * the context are cleared before removal.
     * @param index the index of the context to remove
     * @returns the removed context, or undefined if the index was out of range
     */
    removeContext(index: number): FlowGraphContext | undefined;
    /**
     * Returns all blocks registered in this graph, including disconnected ones.
     * @returns a read-only array of all blocks
     */
    getAllBlocks(): readonly FlowGraphBlock[];
    /**
     * Register a block with the graph. This does not wire any connections;
     * it simply ensures the block is tracked so that serialization, editor
     * display, and validation see it even when it is not reachable from an
     * event block.
     * @param block the block to register
     */
    addBlock(block: FlowGraphBlock): void;
    /**
     * Remove a block from the graph. Disconnects all of its ports and, if it
     * is an event block, unregisters it from the event-block lists.
     * @param block the block to remove
     */
    removeBlock(block: FlowGraphBlock): void;
    /**
     * Add an event block. When the graph is started, it will start listening to events
     * from the block and execute the graph when they are triggered.
     * @param block the event block to be added
     */
    addEventBlock(block: FlowGraphEventBlock): void;
    /**
     * Stops the flow graph. Cancels all pending tasks and clears execution contexts,
     * but keeps event blocks so the graph can be restarted.
     */
    stop(): void;
    /**
     * Pauses the flow graph. Cancels pending tasks but keeps execution contexts and event blocks.
     * Call start() to resume.
     */
    pause(): void;
    /**
     * Starts the flow graph. Initializes the event blocks and starts listening to events.
     * Can also be called to resume from a paused state.
     */
    start(): void;
    private _startPendingEvents;
    private _getContextualOrder;
    /**
     * Disposes of the flow graph. Cancels any pending tasks and removes all event listeners.
     */
    dispose(): void;
    /**
     * Executes a function in all blocks of a flow graph, starting with the event blocks.
     * @param visitor the function to execute.
     */
    visitAllBlocks(visitor: (block: FlowGraphBlock) => void): void;
    /**
     * Validates the flow graph and returns all issues found.
     * Uses the tracked block list for complete validation including unreachable block detection.
     * @returns The validation result containing errors and warnings.
     */
    validate(): IFlowGraphValidationResult;
    /**
     * Serializes a graph
     * @param serializationObject the object to write the values in
     * @param valueSerializeFunction a function to serialize complex values
     */
    serialize(serializationObject?: any, valueSerializeFunction?: (key: string, value: any, serializationObject: any) => void): void;
    /**
     * Launches the flow graph editor for this graph.
     * The editor is lazy-loaded from {@link FlowGraph.EditorURL} the first time it is used.
     * @param config defines the configuration of the editor
     * @returns a promise fulfilled when the editor is visible
     */
    edit(config?: IFlowGraphEditorLaunchOptions): Promise<void>;
    /**
     * Creates the flow graph editor window.
     * @param additionalConfig additional configuration forwarded to `FlowGraphEditor.Show()`
     */
    private _createFlowGraphEditor;
}
