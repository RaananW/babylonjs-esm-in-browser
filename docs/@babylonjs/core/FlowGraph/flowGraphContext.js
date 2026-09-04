import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { serialize } from "../Misc/decorators.js";
import { RandomGUID } from "../Misc/guid.js";
import { defaultValueSerializationFunction } from "./serialization.js";
import { Observable } from "../Misc/observable.js";
import { GetFlowGraphAssetWithType } from "./flowGraphAssetsContext.js";
import { FlowGraphLogger } from "./flowGraphLogger.js";
/**
 * The context represents the current state and execution of the flow graph.
 * It contains both user-defined variables, which are derived from
 * a more general variable definition, and execution variables that
 * are set by the blocks.
 */
let FlowGraphContext = (() => {
    var _a;
    let _uniqueId_decorators;
    let _uniqueId_initializers = [];
    let _uniqueId_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    return _a = class FlowGraphContext {
            /**
             * Enable logging on this context
             */
            get enableLogging() {
                return this._enableLogging;
            }
            set enableLogging(value) {
                if (this._enableLogging === value) {
                    return;
                }
                this._enableLogging = value;
                if (this._enableLogging) {
                    this.logger = new FlowGraphLogger();
                    this.logger.logToConsole = true;
                }
                else {
                    this.logger = null;
                }
            }
            constructor(params) {
                /**
                 * A randomly generated GUID for each context.
                 */
                this.uniqueId = __runInitializers(this, _uniqueId_initializers, RandomGUID());
                /**
                 * An optional user-facing name for the context.
                 * Defaults to an empty string; the editor may assign a label like "Context 0".
                 */
                this.name = (__runInitializers(this, _uniqueId_extraInitializers), __runInitializers(this, _name_initializers, ""));
                /**
                 * These are the variables defined by a user.
                 */
                this._userVariables = (__runInitializers(this, _name_extraInitializers), {});
                /**
                 * Optional type annotations for user variables.
                 * Keys are variable names; values are type name strings (e.g. "number", "Vector3", "Mesh").
                 * This map is maintained by the editor and persisted through serialization so
                 * that a variable's declared type survives even when its value is undefined.
                 */
                this._variableTypes = {};
                /**
                 * These are the variables set by the blocks.
                 */
                this._executionVariables = {};
                /**
                 * A context-specific global variables, available to all blocks in the context.
                 */
                this._globalContextVariables = {};
                /**
                 * These are the values for the data connection points
                 */
                this._connectionValues = {};
                /**
                 * These are blocks that have currently pending tasks/listeners that need to be cleaned up.
                 */
                this._pendingBlocks = [];
                /**
                 * A monotonically increasing ID for each execution.
                 * Incremented for every block executed.
                 */
                this._executionId = 0;
                /**
                 * Observable that is triggered when a node is executed.
                 */
                this.onNodeExecutedObservable = new Observable();
                /**
                 * Observable triggered when a breakpoint is hit.
                 * Observers receive the pending activation (block, context, signal) that was paused.
                 */
                this.onBreakpointHitObservable = new Observable();
                /**
                 * A predicate called before each execution block runs.
                 * If it returns true, execution is paused before the block and a
                 * pending activation is stored, which can be resumed via
                 * {@link continueExecution} or {@link stepExecution}.
                 *
                 * Set to `null` to disable breakpoint checking.
                 */
                this.breakpointPredicate = null;
                /**
                 * The activation that is currently paused due to a breakpoint hit.
                 * `null` when execution is not paused on a breakpoint.
                 */
                this._pendingActivation = null;
                /**
                 * When true, the next activation will pause regardless of the breakpoint predicate.
                 * Set by {@link stepExecution}.
                 */
                this._stepMode = false;
                /**
                 * When set, the breakpoint check is skipped for this specific block uniqueId
                 * on the very next call to {@link _shouldBreak}. Used by continue/step to avoid
                 * immediately re-hitting the breakpoint on the block being resumed.
                 */
                this._skipBreakpointForBlockId = null;
                /**
                 * Whether to treat data as right-handed.
                 * This is used when serializing data from a right-handed system, while running the context in a left-handed system, for example in glTF parsing.
                 * Default is false.
                 */
                this.treatDataAsRightHanded = false;
                this._enableLogging = false;
                this._configuration = params;
                this.assetsContext = params.assetsContext ?? params.scene;
            }
            /**
             * Check if a user-defined variable is defined.
             * @param name the name of the variable
             * @returns true if the variable is defined
             */
            hasVariable(name) {
                return name in this._userVariables;
            }
            /**
             * Set a user-defined variable.
             * @param name the name of the variable
             * @param value the value of the variable
             */
            setVariable(name, value) {
                this._userVariables[name] = value;
                this.logger?.addLogItem({
                    time: Date.now(),
                    className: this.getClassName(),
                    uniqueId: this.uniqueId,
                    action: "ContextVariableSet" /* FlowGraphAction.ContextVariableSet */,
                    payload: {
                        name,
                        value,
                    },
                });
            }
            /**
             * Get an assets from the assets context based on its type and index in the array
             * @param type The type of the asset
             * @param index The index of the asset
             * @returns The asset or null if not found
             */
            getAsset(type, index) {
                return GetFlowGraphAssetWithType(this.assetsContext, type, index);
            }
            /**
             * Get a user-defined variable.
             * @param name the name of the variable
             * @returns the value of the variable
             */
            getVariable(name) {
                this.logger?.addLogItem({
                    time: Date.now(),
                    className: this.getClassName(),
                    uniqueId: this.uniqueId,
                    action: "ContextVariableGet" /* FlowGraphAction.ContextVariableGet */,
                    payload: {
                        name,
                        value: this._userVariables[name],
                    },
                });
                return this._userVariables[name];
            }
            /**
             * Gets all user variables map
             */
            get userVariables() {
                return this._userVariables;
            }
            /**
             * Set the declared type annotation for a user variable.
             * @param name - the variable name
             * @param typeName - the type name string (e.g. "number", "Vector3", "Mesh")
             */
            setVariableType(name, typeName) {
                this._variableTypes[name] = typeName;
            }
            /**
             * Get the declared type annotation for a user variable.
             * @param name - the variable name
             * @returns the type name string, or undefined if no type was declared
             */
            getVariableType(name) {
                return this._variableTypes[name];
            }
            /**
             * Gets all variable type annotations.
             */
            get variableTypes() {
                return this._variableTypes;
            }
            /**
             * Get the scene that the context belongs to.
             * @returns the scene
             */
            getScene() {
                return this._configuration.scene;
            }
            /**
             * Encodes an event source key as the opaque reference exposed by event blocks on their `event`
             * output. Delegates to the {@link IFlowGraphHostResolver} configured on the coordinator, so the
             * reference format is owned by the environment hosting the graph.
             * @param key the event source key (e.g. `"sceneReady"`, `"sceneTick"`, or a custom event id)
             * @returns the event reference
             */
            getEventReference(key) {
                return this._configuration.coordinator._getEventReference(key);
            }
            /**
             * Decodes the array index denoted by a reference. Returns `undefined` when no host resolver is
             * configured or the host does not recognise the value as an indexed reference.
             * @param reference the reference to decode
             * @returns the index the reference denotes, or `undefined` when it does not denote one
             */
            decodeIndexReference(reference) {
                return this._configuration.coordinator.config.hostResolver?.decodeIndexReference?.(reference);
            }
            /**
             * Maps a runtime object to the reference the host addresses it by. Returns `undefined` when no
             * host resolver is configured or the host cannot address the object.
             * @param object the runtime object to address
             * @param hint optional disambiguation hint telling the host which kind of reference is wanted
             * @returns the reference for the object, or `undefined` when it cannot be addressed
             */
            getObjectReference(object, hint) {
                return this._configuration.coordinator.config.hostResolver?.getObjectReference?.(object, hint);
            }
            _getUniqueIdPrefixedName(obj, name) {
                return `${obj.uniqueId}_${name}`;
            }
            /**
             * @internal
             * @param name name of the variable
             * @param defaultValue default value to return if the variable is not defined
             * @returns the variable value or the default value if the variable is not defined
             */
            _getGlobalContextVariable(name, defaultValue) {
                this.logger?.addLogItem({
                    time: Date.now(),
                    className: this.getClassName(),
                    uniqueId: this.uniqueId,
                    action: "GlobalVariableGet" /* FlowGraphAction.GlobalVariableGet */,
                    payload: {
                        name,
                        defaultValue,
                        possibleValue: this._globalContextVariables[name],
                    },
                });
                if (this._hasGlobalContextVariable(name)) {
                    return this._globalContextVariables[name];
                }
                else {
                    return defaultValue;
                }
            }
            /**
             * Set a global context variable
             * @internal
             * @param name the name of the variable
             * @param value the value of the variable
             */
            _setGlobalContextVariable(name, value) {
                this.logger?.addLogItem({
                    time: Date.now(),
                    className: this.getClassName(),
                    uniqueId: this.uniqueId,
                    action: "GlobalVariableSet" /* FlowGraphAction.GlobalVariableSet */,
                    payload: { name, value },
                });
                this._globalContextVariables[name] = value;
            }
            /**
             * Delete a global context variable
             * @internal
             * @param name the name of the variable
             */
            _deleteGlobalContextVariable(name) {
                this.logger?.addLogItem({
                    time: Date.now(),
                    className: this.getClassName(),
                    uniqueId: this.uniqueId,
                    action: "GlobalVariableDelete" /* FlowGraphAction.GlobalVariableDelete */,
                    payload: { name },
                });
                delete this._globalContextVariables[name];
            }
            /**
             * Check if a global context variable is defined
             * @internal
             * @param name the name of the variable
             * @returns true if the variable is defined
             */
            _hasGlobalContextVariable(name) {
                return name in this._globalContextVariables;
            }
            /**
             * Set an internal execution variable
             * @internal
             * @param name
             * @param value
             */
            _setExecutionVariable(block, name, value) {
                this._executionVariables[this._getUniqueIdPrefixedName(block, name)] = value;
            }
            /**
             * Get an internal execution variable
             * @internal
             * @param name
             * @returns
             */
            _getExecutionVariable(block, name, defaultValue) {
                if (this._hasExecutionVariable(block, name)) {
                    return this._executionVariables[this._getUniqueIdPrefixedName(block, name)];
                }
                else {
                    return defaultValue;
                }
            }
            /**
             * Delete an internal execution variable
             * @internal
             * @param block
             * @param name
             */
            _deleteExecutionVariable(block, name) {
                delete this._executionVariables[this._getUniqueIdPrefixedName(block, name)];
            }
            /**
             * Check if an internal execution variable is defined
             * @internal
             * @param block
             * @param name
             * @returns
             */
            _hasExecutionVariable(block, name) {
                return this._getUniqueIdPrefixedName(block, name) in this._executionVariables;
            }
            /**
             * Check if a connection value is defined
             * @internal
             * @param connectionPoint
             * @returns
             */
            _hasConnectionValue(connectionPoint) {
                return connectionPoint.uniqueId in this._connectionValues;
            }
            /**
             * Set a connection value
             * @internal
             * @param connectionPoint
             * @param value
             */
            _setConnectionValue(connectionPoint, value) {
                this._connectionValues[connectionPoint.uniqueId] = value;
                this.logger?.addLogItem({
                    time: Date.now(),
                    className: this.getClassName(),
                    uniqueId: this.uniqueId,
                    action: "SetConnectionValue" /* FlowGraphAction.SetConnectionValue */,
                    payload: {
                        connectionPointId: connectionPoint.uniqueId,
                        value,
                    },
                });
            }
            /**
             * Set a connection value by key
             * @internal
             * @param key the key of the connection value
             * @param value the value of the connection
             */
            _setConnectionValueByKey(key, value) {
                this._connectionValues[key] = value;
            }
            /**
             * Get a connection value
             * @internal
             * @param connectionPoint
             * @returns
             */
            _getConnectionValue(connectionPoint) {
                this.logger?.addLogItem({
                    time: Date.now(),
                    className: this.getClassName(),
                    uniqueId: this.uniqueId,
                    action: "GetConnectionValue" /* FlowGraphAction.GetConnectionValue */,
                    payload: {
                        connectionPointId: connectionPoint.uniqueId,
                        value: this._connectionValues[connectionPoint.uniqueId],
                    },
                });
                return this._connectionValues[connectionPoint.uniqueId];
            }
            /**
             * Get the configuration
             * @internal
             * @param name
             * @param value
             */
            get configuration() {
                return this._configuration;
            }
            /**
             * Check if there are any pending blocks in this context
             * @returns true if there are pending blocks
             */
            get hasPendingBlocks() {
                return this._pendingBlocks.length > 0;
            }
            /**
             * Add a block to the list of blocks that have pending tasks.
             * @internal
             * @param block
             */
            _addPendingBlock(block) {
                // check if block is already in the array
                if (this._pendingBlocks.includes(block)) {
                    return;
                }
                this._pendingBlocks.push(block);
                // sort pending blocks by priority
                this._pendingBlocks.sort((a, b) => a.priority - b.priority);
            }
            /**
             * Remove a block from the list of blocks that have pending tasks.
             * @internal
             * @param block
             */
            _removePendingBlock(block) {
                const index = this._pendingBlocks.indexOf(block);
                if (index !== -1) {
                    this._pendingBlocks.splice(index, 1);
                }
            }
            /**
             * Clear all pending blocks.
             * @internal
             */
            _clearPendingBlocks() {
                for (const block of this._pendingBlocks) {
                    block._cancelPendingTasks(this);
                }
                this._pendingBlocks.length = 0;
            }
            /**
             * @internal
             * Function that notifies the node executed observable
             * @param node
             */
            _notifyExecuteNode(node) {
                this.onNodeExecutedObservable.notifyObservers(node);
                this.logger?.addLogItem({
                    time: Date.now(),
                    className: node.getClassName(),
                    uniqueId: node.uniqueId,
                    action: "ExecuteBlock" /* FlowGraphAction.ExecuteBlock */,
                });
            }
            _notifyOnTick(framePayload) {
                // set the values as global variables
                this._setGlobalContextVariable("timeSinceStart", framePayload.timeSinceStart);
                this._setGlobalContextVariable("deltaTime", framePayload.deltaTime);
                // iterate the pending blocks and run each one's onFrame function
                for (const block of this._pendingBlocks) {
                    block._executeOnTick?.(this);
                }
            }
            /**
             * @internal
             */
            _increaseExecutionId() {
                this._executionId++;
            }
            /**
             * A monotonically increasing ID for each execution.
             * Incremented for every block executed.
             */
            get executionId() {
                return this._executionId;
            }
            // ── Breakpoint API ─────────────────────────────────────────────────
            /**
             * Check whether the given block should break before executing.
             * Called by the signal connection infrastructure.
             * @internal
             * @param block the block about to execute
             * @param signal the signal that is triggering the execution
             * @returns true if execution should be paused (breakpoint hit)
             */
            _shouldBreak(block, signal) {
                // If continue/step just resumed this specific block, let it through
                if (this._skipBreakpointForBlockId === block.uniqueId) {
                    this._skipBreakpointForBlockId = null;
                    return false;
                }
                // If already paused on a breakpoint, silently block further execution
                // without overwriting the pending activation or re-notifying observers.
                if (this._pendingActivation) {
                    return true;
                }
                if (this._stepMode) {
                    this._stepMode = false;
                    this._pendingActivation = { block, context: this, signal };
                    this.onBreakpointHitObservable.notifyObservers(this._pendingActivation);
                    return true;
                }
                if (this.breakpointPredicate && this.breakpointPredicate(block)) {
                    this._pendingActivation = { block, context: this, signal };
                    this.onBreakpointHitObservable.notifyObservers(this._pendingActivation);
                    return true;
                }
                return false;
            }
            /**
             * Returns the currently paused activation, or null if not paused.
             */
            get pendingActivation() {
                return this._pendingActivation;
            }
            /**
             * Resume execution from a breakpoint hit.
             * The paused block and all downstream blocks will execute normally until
             * the next breakpoint (if any) is hit.
             */
            continueExecution() {
                const pending = this._pendingActivation;
                if (!pending) {
                    return;
                }
                this._pendingActivation = null;
                // Tell _shouldBreak to skip the breakpoint for this block on re-entry
                this._skipBreakpointForBlockId = pending.block.uniqueId;
                pending.signal._activateSignal(this);
                // Clear in case no re-entry happened (shouldn't linger)
                this._skipBreakpointForBlockId = null;
            }
            /**
             * Execute exactly the paused block and then pause again before the next
             * execution block fires. If no activation is pending, this is a no-op.
             */
            stepExecution() {
                const pending = this._pendingActivation;
                if (!pending) {
                    return;
                }
                this._pendingActivation = null;
                // Enable step mode so the very next input-signal activation will pause
                this._stepMode = true;
                // Tell _shouldBreak to skip the breakpoint for this block on re-entry
                this._skipBreakpointForBlockId = pending.block.uniqueId;
                pending.signal._activateSignal(this);
                // If nothing further executed (end of chain), clear step mode
                this._stepMode = false;
                this._skipBreakpointForBlockId = null;
            }
            /**
             * Discard any pending breakpoint activation without resuming.
             * Used when stopping or resetting the graph.
             * @internal
             */
            _clearPendingActivation() {
                this._pendingActivation = null;
                this._stepMode = false;
                this._skipBreakpointForBlockId = null;
            }
            /**
             * Serializes a context
             * @param serializationObject the object to write the values in
             * @param valueSerializationFunction a function to serialize complex values
             */
            serialize(serializationObject = {}, valueSerializationFunction = defaultValueSerializationFunction) {
                serializationObject.uniqueId = this.uniqueId;
                serializationObject.name = this.name;
                serializationObject._userVariables = {};
                for (const key in this._userVariables) {
                    valueSerializationFunction(key, this._userVariables[key], serializationObject._userVariables);
                }
                // Persist variable type annotations (editor metadata)
                if (Object.keys(this._variableTypes).length > 0) {
                    serializationObject._variableTypes = { ...this._variableTypes };
                }
                serializationObject._connectionValues = {};
                for (const key in this._connectionValues) {
                    valueSerializationFunction(key, this._connectionValues[key], serializationObject._connectionValues);
                }
                // serialize assets context, if not scene
                if (this.assetsContext !== this.getScene()) {
                    serializationObject._assetsContext = {
                        meshes: this.assetsContext.meshes.map((m) => m.id),
                        materials: this.assetsContext.materials.map((m) => m.id),
                        textures: this.assetsContext.textures.map((m) => m.name),
                        animations: this.assetsContext.animations.map((m) => m.name),
                        lights: this.assetsContext.lights.map((m) => m.id),
                        cameras: this.assetsContext.cameras.map((m) => m.id),
                        sounds: this.assetsContext.sounds?.map((m) => m.name),
                        skeletons: this.assetsContext.skeletons.map((m) => m.id),
                        particleSystems: this.assetsContext.particleSystems.map((m) => m.name),
                        geometries: this.assetsContext.geometries.map((m) => m.id),
                        multiMaterials: this.assetsContext.multiMaterials.map((m) => m.id),
                        transformNodes: this.assetsContext.transformNodes.map((m) => m.id),
                    };
                }
            }
            /**
             * @returns the class name of the object.
             */
            getClassName() {
                return "FlowGraphContext";
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _uniqueId_decorators = [serialize()];
            _name_decorators = [serialize()];
            __esDecorate(null, null, _uniqueId_decorators, { kind: "field", name: "uniqueId", static: false, private: false, access: { has: obj => "uniqueId" in obj, get: obj => obj.uniqueId, set: (obj, value) => { obj.uniqueId = value; } }, metadata: _metadata }, _uniqueId_initializers, _uniqueId_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { FlowGraphContext };
//# sourceMappingURL=flowGraphContext.js.map