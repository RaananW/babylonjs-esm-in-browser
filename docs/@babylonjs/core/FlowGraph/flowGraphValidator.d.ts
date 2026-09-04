import { type FlowGraph } from "./flowGraph.js";
import { type FlowGraphBlock } from "./flowGraphBlock.js";
/**
 * Severity level for a validation issue.
 */
export declare enum FlowGraphValidationSeverity {
    /** A critical issue that will cause runtime failure. */
    Error = 0,
    /** A potential issue that may indicate a mistake. */
    Warning = 1
}
/**
 * A single validation issue found in the flow graph.
 */
export interface IFlowGraphValidationIssue {
    /** The severity level. */
    severity: FlowGraphValidationSeverity;
    /** Human-readable description of the issue. */
    message: string;
    /** The block where the issue was found (if applicable). */
    block?: FlowGraphBlock;
    /** The connection name involved (if applicable). */
    connectionName?: string;
}
/**
 * The result of validating a flow graph.
 */
export interface IFlowGraphValidationResult {
    /** Whether the graph passed validation with no errors. */
    isValid: boolean;
    /** All issues found, ordered by severity (errors first). */
    issues: IFlowGraphValidationIssue[];
    /** Convenience: number of error-level issues. */
    errorCount: number;
    /** Convenience: number of warning-level issues. */
    warningCount: number;
    /** Map from block uniqueId to the issues affecting that block. */
    issuesByBlock: Map<string, IFlowGraphValidationIssue[]>;
}
/**
 * Validates a flow graph and returns all issues found.
 *
 * The following checks are performed:
 * 1. **No event blocks** — the graph has no entry points.
 * 2. **Unconnected required data inputs** — a non-optional data input with no connection.
 * 3. **Unconnected signal inputs** — an execution block whose `in` signal has no connection and
 *    that is not an event block (entry point).
 * 4. **Data type mismatches** — a data connection whose source richType is incompatible with the
 *    target richType.
 * 5. **Unreachable blocks** — blocks not reachable from any event block via signal/data traversal.
 * 6. **Data dependency cycles** — circular data-only connections that would cause infinite recursion.
 *
 * @param flowGraph - The flow graph to validate.
 * @returns The validation result.
 */
export declare function ValidateFlowGraph(flowGraph: FlowGraph): IFlowGraphValidationResult;
/**
 * Extended validation that also checks for unreachable blocks.
 * Requires a full list of all blocks in the graph (including those not reachable
 * from event blocks via the normal traversal).
 *
 * @param flowGraph - The flow graph to validate.
 * @param allKnownBlocks - Complete list of all blocks (e.g., from the editor's node set).
 * @returns The validation result.
 */
export declare function ValidateFlowGraphWithBlockList(flowGraph: FlowGraph, allKnownBlocks: FlowGraphBlock[]): IFlowGraphValidationResult;
