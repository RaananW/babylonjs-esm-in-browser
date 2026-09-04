/**
 * Registers all event flow graph blocks for deserialization.
 */
export declare function RegisterFlowGraphEventBlocks(): void;
/**
 * Registers all execution flow graph blocks for deserialization.
 */
export declare function RegisterFlowGraphExecutionBlocks(): void;
/**
 * Registers all data flow graph blocks for deserialization.
 */
export declare function RegisterFlowGraphDataBlocks(): void;
/**
 * Registers all flow graph blocks in the type store.
 *
 * Note: Unlike other block systems, FlowGraph deserialization uses dynamic `import()` via
 * `blockFactory()` and does NOT require pre-registration. This function is provided for
 * architectural consistency and for scenarios where eager class registration is needed
 * (e.g., external tooling that queries the type store).
 */
export declare function RegisterAllFlowGraphBlocks(): void;
