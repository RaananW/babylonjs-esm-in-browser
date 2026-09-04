import { type Scene } from "../scene.js";
import { type FlowGraphAsyncExecutionBlock } from "./flowGraphAsyncExecutionBlock.js";
import { type FlowGraphBlock } from "./flowGraphBlock.js";
import { type FlowGraphDataConnection } from "./flowGraphDataConnection.js";
import { type FlowGraph } from "./flowGraph.js";
import { type FlowGraphCoordinator } from "./flowGraphCoordinator.js";
import { type FlowGraphSceneEventCoordinator } from "./flowGraphSceneEventCoordinator.js";
import { Observable } from "../Misc/observable.js";
import { type AssetType, type FlowGraphAssetType } from "./flowGraphAssetsContext.js";
import { type IAssetContainer } from "../IAssetContainer.js";
import { type Nullable } from "../types.js";
import { FlowGraphLogger } from "./flowGraphLogger.js";
import { type IFlowGraphOnTickEventPayload } from "./Blocks/Event/flowGraphSceneTickEventBlock.js";
import { type FlowGraphExecutionBlock } from "./flowGraphExecutionBlock.js";
import { type FlowGraphSignalConnection } from "./flowGraphSignalConnection.js";
/**
 * Represents a pending signal activation that was paused by a breakpoint.
 */
export interface IFlowGraphPendingActivation {
    /** The block that was about to execute */
    readonly block: FlowGraphExecutionBlock;
    /** The context in which execution was paused */
    readonly context: FlowGraphContext;
    /** The signal connection that triggered the execution */
    readonly signal: FlowGraphSignalConnection;
}
/**
 * Construction parameters for the context.
 */
export interface IFlowGraphContextConfiguration {
    /**
     * The scene that the flow graph context belongs to.
     */
    readonly scene: Scene;
    /**
     * The event coordinator used by the flow graph context.
     */
    readonly coordinator: FlowGraphCoordinator;
    /**
     * The scene event coordinator that tracks runtime event state
     * (e.g. currently pressed keyboard keys).
     * When not provided, keyboard polling blocks (e.g. IsKeyPressed) will
     * report no keys pressed.
     */
    readonly sceneEventCoordinator?: FlowGraphSceneEventCoordinator;
    /**
     * The assets context used by the flow graph context.
     * If none is provided, a default one will be created.
     */
    readonly assetsContext?: IAssetContainer;
}
/**
 * Options for parsing a context.
 */
export interface IFlowGraphContextParseOptions {
    /**
     * A function that parses a value from a serialization object.
     * @param key the key of the value
     * @param serializationObject the object containing the value
     * @param assetsContainer the assets container
     * @param scene the current scene
     * @returns
     */
    readonly valueParseFunction?: (key: string, serializationObject: any, assetsContainer: IAssetContainer, scene: Scene) => any;
    /**
     * The graph that the context is being parsed in.
     */
    readonly graph: FlowGraph;
}
/**
 * The context represents the current state and execution of the flow graph.
 * It contains both user-defined variables, which are derived from
 * a more general variable definition, and execution variables that
 * are set by the blocks.
 */
export declare class FlowGraphContext {
    /**
     * A randomly generated GUID for each context.
     */
    uniqueId: string;
    /**
     * An optional user-facing name for the context.
     * Defaults to an empty string; the editor may assign a label like "Context 0".
     */
    name: string;
    /**
     * These are the variables defined by a user.
     */
    private _userVariables;
    /**
     * Optional type annotations for user variables.
     * Keys are variable names; values are type name strings (e.g. "number", "Vector3", "Mesh").
     * This map is maintained by the editor and persisted through serialization so
     * that a variable's declared type survives even when its value is undefined.
     */
    private _variableTypes;
    /**
     * These are the variables set by the blocks.
     */
    private _executionVariables;
    /**
     * A context-specific global variables, available to all blocks in the context.
     */
    private _globalContextVariables;
    /**
     * These are the values for the data connection points
     */
    private _connectionValues;
    /**
     * These are the variables set by the graph.
     */
    private readonly _configuration;
    /**
     * These are blocks that have currently pending tasks/listeners that need to be cleaned up.
     */
    private _pendingBlocks;
    /**
     * A monotonically increasing ID for each execution.
     * Incremented for every block executed.
     */
    private _executionId;
    /**
     * Observable that is triggered when a node is executed.
     */
    onNodeExecutedObservable: Observable<FlowGraphBlock>;
    /**
     * Observable triggered when a breakpoint is hit.
     * Observers receive the pending activation (block, context, signal) that was paused.
     */
    onBreakpointHitObservable: Observable<IFlowGraphPendingActivation>;
    /**
     * A predicate called before each execution block runs.
     * If it returns true, execution is paused before the block and a
     * pending activation is stored, which can be resumed via
     * {@link continueExecution} or {@link stepExecution}.
     *
     * Set to `null` to disable breakpoint checking.
     */
    breakpointPredicate: Nullable<(block: FlowGraphExecutionBlock) => boolean>;
    /**
     * The activation that is currently paused due to a breakpoint hit.
     * `null` when execution is not paused on a breakpoint.
     */
    private _pendingActivation;
    /**
     * When true, the next activation will pause regardless of the breakpoint predicate.
     * Set by {@link stepExecution}.
     */
    private _stepMode;
    /**
     * When set, the breakpoint check is skipped for this specific block uniqueId
     * on the very next call to {@link _shouldBreak}. Used by continue/step to avoid
     * immediately re-hitting the breakpoint on the block being resumed.
     */
    private _skipBreakpointForBlockId;
    /**
     * The assets context used by the flow graph context.
     * Note that it can be shared between flow graph contexts.
     */
    assetsContext: IAssetContainer;
    /**
     * Whether to treat data as right-handed.
     * This is used when serializing data from a right-handed system, while running the context in a left-handed system, for example in glTF parsing.
     * Default is false.
     */
    treatDataAsRightHanded: boolean;
    private _enableLogging;
    /**
     * The logger used by the context to log actions.
     */
    logger: Nullable<FlowGraphLogger>;
    /**
     * Enable logging on this context
     */
    get enableLogging(): boolean;
    set enableLogging(value: boolean);
    constructor(params: IFlowGraphContextConfiguration);
    /**
     * Check if a user-defined variable is defined.
     * @param name the name of the variable
     * @returns true if the variable is defined
     */
    hasVariable(name: string): boolean;
    /**
     * Set a user-defined variable.
     * @param name the name of the variable
     * @param value the value of the variable
     */
    setVariable(name: string, value: any): void;
    /**
     * Get an assets from the assets context based on its type and index in the array
     * @param type The type of the asset
     * @param index The index of the asset
     * @returns The asset or null if not found
     */
    getAsset<T extends FlowGraphAssetType>(type: T, index: number): Nullable<AssetType<T>>;
    /**
     * Get a user-defined variable.
     * @param name the name of the variable
     * @returns the value of the variable
     */
    getVariable(name: string): any;
    /**
     * Gets all user variables map
     */
    get userVariables(): {
        [key: string]: any;
    };
    /**
     * Set the declared type annotation for a user variable.
     * @param name - the variable name
     * @param typeName - the type name string (e.g. "number", "Vector3", "Mesh")
     */
    setVariableType(name: string, typeName: string): void;
    /**
     * Get the declared type annotation for a user variable.
     * @param name - the variable name
     * @returns the type name string, or undefined if no type was declared
     */
    getVariableType(name: string): string | undefined;
    /**
     * Gets all variable type annotations.
     */
    get variableTypes(): {
        [key: string]: string;
    };
    /**
     * Get the scene that the context belongs to.
     * @returns the scene
     */
    getScene(): Scene;
    /**
     * Encodes an event source key as the opaque reference exposed by event blocks on their `event`
     * output. Delegates to the {@link IFlowGraphHostResolver} configured on the coordinator, so the
     * reference format is owned by the environment hosting the graph.
     * @param key the event source key (e.g. `"sceneReady"`, `"sceneTick"`, or a custom event id)
     * @returns the event reference
     */
    getEventReference(key: string): string;
    /**
     * Decodes the array index denoted by a reference. Returns `undefined` when no host resolver is
     * configured or the host does not recognise the value as an indexed reference.
     * @param reference the reference to decode
     * @returns the index the reference denotes, or `undefined` when it does not denote one
     */
    decodeIndexReference(reference: string): number | undefined;
    /**
     * Maps a runtime object to the reference the host addresses it by. Returns `undefined` when no
     * host resolver is configured or the host cannot address the object.
     * @param object the runtime object to address
     * @param hint optional disambiguation hint telling the host which kind of reference is wanted
     * @returns the reference for the object, or `undefined` when it cannot be addressed
     */
    getObjectReference(object: object, hint?: string): string | undefined;
    private _getUniqueIdPrefixedName;
    /**
     * @internal
     * @param name name of the variable
     * @param defaultValue default value to return if the variable is not defined
     * @returns the variable value or the default value if the variable is not defined
     */
    _getGlobalContextVariable<T>(name: string, defaultValue: T): T;
    /**
     * Set a global context variable
     * @internal
     * @param name the name of the variable
     * @param value the value of the variable
     */
    _setGlobalContextVariable<T>(name: string, value: T): void;
    /**
     * Delete a global context variable
     * @internal
     * @param name the name of the variable
     */
    _deleteGlobalContextVariable(name: string): void;
    /**
     * Check if a global context variable is defined
     * @internal
     * @param name the name of the variable
     * @returns true if the variable is defined
     */
    _hasGlobalContextVariable(name: string): boolean;
    /**
     * Set an internal execution variable
     * @internal
     * @param name
     * @param value
     */
    _setExecutionVariable(block: FlowGraphBlock, name: string, value: any): void;
    /**
     * Get an internal execution variable
     * @internal
     * @param name
     * @returns
     */
    _getExecutionVariable<T>(block: FlowGraphBlock, name: string, defaultValue: T): T;
    /**
     * Delete an internal execution variable
     * @internal
     * @param block
     * @param name
     */
    _deleteExecutionVariable(block: FlowGraphBlock, name: string): void;
    /**
     * Check if an internal execution variable is defined
     * @internal
     * @param block
     * @param name
     * @returns
     */
    _hasExecutionVariable(block: FlowGraphBlock, name: string): boolean;
    /**
     * Check if a connection value is defined
     * @internal
     * @param connectionPoint
     * @returns
     */
    _hasConnectionValue(connectionPoint: FlowGraphDataConnection<any>): boolean;
    /**
     * Set a connection value
     * @internal
     * @param connectionPoint
     * @param value
     */
    _setConnectionValue<T>(connectionPoint: FlowGraphDataConnection<T>, value: T): void;
    /**
     * Set a connection value by key
     * @internal
     * @param key the key of the connection value
     * @param value the value of the connection
     */
    _setConnectionValueByKey<T>(key: string, value: T): void;
    /**
     * Get a connection value
     * @internal
     * @param connectionPoint
     * @returns
     */
    _getConnectionValue<T>(connectionPoint: FlowGraphDataConnection<T>): T;
    /**
     * Get the configuration
     * @internal
     * @param name
     * @param value
     */
    get configuration(): IFlowGraphContextConfiguration;
    /**
     * Check if there are any pending blocks in this context
     * @returns true if there are pending blocks
     */
    get hasPendingBlocks(): boolean;
    /**
     * Add a block to the list of blocks that have pending tasks.
     * @internal
     * @param block
     */
    _addPendingBlock(block: FlowGraphAsyncExecutionBlock): void;
    /**
     * Remove a block from the list of blocks that have pending tasks.
     * @internal
     * @param block
     */
    _removePendingBlock(block: FlowGraphAsyncExecutionBlock): void;
    /**
     * Clear all pending blocks.
     * @internal
     */
    _clearPendingBlocks(): void;
    /**
     * @internal
     * Function that notifies the node executed observable
     * @param node
     */
    _notifyExecuteNode(node: FlowGraphBlock): void;
    _notifyOnTick(framePayload: IFlowGraphOnTickEventPayload): void;
    /**
     * @internal
     */
    _increaseExecutionId(): void;
    /**
     * A monotonically increasing ID for each execution.
     * Incremented for every block executed.
     */
    get executionId(): number;
    /**
     * Check whether the given block should break before executing.
     * Called by the signal connection infrastructure.
     * @internal
     * @param block the block about to execute
     * @param signal the signal that is triggering the execution
     * @returns true if execution should be paused (breakpoint hit)
     */
    _shouldBreak(block: FlowGraphExecutionBlock, signal: FlowGraphSignalConnection): boolean;
    /**
     * Returns the currently paused activation, or null if not paused.
     */
    get pendingActivation(): Nullable<IFlowGraphPendingActivation>;
    /**
     * Resume execution from a breakpoint hit.
     * The paused block and all downstream blocks will execute normally until
     * the next breakpoint (if any) is hit.
     */
    continueExecution(): void;
    /**
     * Execute exactly the paused block and then pause again before the next
     * execution block fires. If no activation is pending, this is a no-op.
     */
    stepExecution(): void;
    /**
     * Discard any pending breakpoint activation without resuming.
     * Used when stopping or resetting the graph.
     * @internal
     */
    _clearPendingActivation(): void;
    /**
     * Serializes a context
     * @param serializationObject the object to write the values in
     * @param valueSerializationFunction a function to serialize complex values
     */
    serialize(serializationObject?: any, valueSerializationFunction?: (key: string, value: any, serializationObject: any) => void): void;
    /**
     * @returns the class name of the object.
     */
    getClassName(): string;
}
