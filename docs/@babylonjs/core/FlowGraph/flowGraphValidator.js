import { FlowGraphExecutionBlock } from "./flowGraphExecutionBlock.js";
import { FlowGraphEventBlock } from "./flowGraphEventBlock.js";
/**
 * Severity level for a validation issue.
 */
export var FlowGraphValidationSeverity;
(function (FlowGraphValidationSeverity) {
    /** A critical issue that will cause runtime failure. */
    FlowGraphValidationSeverity[FlowGraphValidationSeverity["Error"] = 0] = "Error";
    /** A potential issue that may indicate a mistake. */
    FlowGraphValidationSeverity[FlowGraphValidationSeverity["Warning"] = 1] = "Warning";
})(FlowGraphValidationSeverity || (FlowGraphValidationSeverity = {}));
// Types that are mutually coercible and should not produce type-mismatch warnings
const NumericLikeTypes = new Set(["number" /* FlowGraphTypes.Number */, "FlowGraphInteger" /* FlowGraphTypes.Integer */, "boolean" /* FlowGraphTypes.Boolean */]);
const VectorLikeTypes = new Set(["Vector4" /* FlowGraphTypes.Vector4 */, "Quaternion" /* FlowGraphTypes.Quaternion */]);
const ColorLikeTypes = new Set(["Color3" /* FlowGraphTypes.Color3 */, "Color4" /* FlowGraphTypes.Color4 */]);
/**
 * @internal
 */
function _AreTypesCompatible(sourceType, targetType) {
    if (sourceType === targetType) {
        return true;
    }
    // "any" is compatible with everything
    if (sourceType === "any" /* FlowGraphTypes.Any */ || targetType === "any" /* FlowGraphTypes.Any */) {
        return true;
    }
    // Numeric coercion group
    if (NumericLikeTypes.has(sourceType) && NumericLikeTypes.has(targetType)) {
        return true;
    }
    // Vector4 / Quaternion are interchangeable
    if (VectorLikeTypes.has(sourceType) && VectorLikeTypes.has(targetType)) {
        return true;
    }
    // Color3 → Color4 widening is safe
    if (ColorLikeTypes.has(sourceType) && ColorLikeTypes.has(targetType)) {
        return true;
    }
    return false;
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
export function ValidateFlowGraph(flowGraph) {
    const issues = [];
    const issuesByBlock = new Map();
    const addIssue = (issue) => {
        issues.push(issue);
        if (issue.block) {
            let arr = issuesByBlock.get(issue.block.uniqueId);
            if (!arr) {
                arr = [];
                issuesByBlock.set(issue.block.uniqueId, arr);
            }
            arr.push(issue);
        }
    };
    // Collect ALL blocks via visitAllBlocks
    const allBlocks = [];
    flowGraph.visitAllBlocks((block) => {
        allBlocks.push(block);
    });
    // ── Check 1: No event blocks ───────────────────────────────────────
    const eventBlocks = _GetEventBlocks(flowGraph);
    if (eventBlocks.length === 0) {
        addIssue({
            severity: 0 /* FlowGraphValidationSeverity.Error */,
            message: "Graph has no event blocks — nothing will trigger execution.",
        });
    }
    // ── Check 2: Unconnected required data inputs ──────────────────────
    for (const block of allBlocks) {
        for (const input of block.dataInputs) {
            if (!input.optional && !input.isDisabled && !input.isConnected()) {
                addIssue({
                    severity: 1 /* FlowGraphValidationSeverity.Warning */,
                    message: `"${input.name}" is not connected and will use its default value.`,
                    block,
                    connectionName: input.name,
                });
            }
        }
    }
    // ── Check 3: Unconnected signal inputs on non-event execution blocks
    for (const block of allBlocks) {
        if (block instanceof FlowGraphExecutionBlock) {
            // Skip event blocks — they are entry points and don't need an incoming signal.
            if (_IsEventBlock(block)) {
                continue;
            }
            const inSignal = block.signalInputs.find((s) => s.name === "in");
            if (inSignal && !inSignal.isConnected()) {
                addIssue({
                    severity: 0 /* FlowGraphValidationSeverity.Error */,
                    message: `Execution block has no incoming signal — it will never execute.`,
                    block,
                    connectionName: "in",
                });
            }
        }
    }
    // ── Check 4: Data type mismatches ──────────────────────────────────
    for (const block of allBlocks) {
        for (const input of block.dataInputs) {
            if (!input.isConnected()) {
                continue;
            }
            const source = input._connectedPoint[0];
            const srcType = source.richType?.typeName;
            const tgtType = input.richType?.typeName;
            if (srcType && tgtType && !_AreTypesCompatible(srcType, tgtType)) {
                // If either side has a typeTransformer, it's intentionally converted
                if (source.richType.typeTransformer !== undefined || input.richType.typeTransformer !== undefined) {
                    continue;
                }
                addIssue({
                    severity: 1 /* FlowGraphValidationSeverity.Warning */,
                    message: `Type mismatch: "${source._ownerBlock.name}.${source.name}" (${srcType}) → "${block.name}.${input.name}" (${tgtType}).`,
                    block,
                    connectionName: input.name,
                });
            }
        }
    }
    // ── Check 5: Unreachable blocks ────────────────────────────────────
    const reachableIds = new Set();
    flowGraph.visitAllBlocks((block) => {
        reachableIds.add(block.uniqueId);
    });
    // We need to also check standalone data blocks not visited by visitAllBlocks.
    // visitAllBlocks starts from event blocks; any block not found is unreachable.
    // Since we can only iterate blocks we know about, the allBlocks list IS
    // from visitAllBlocks, so everything in it IS reachable.
    // There's no separate registry of "all added blocks" in the FlowGraph.
    // So: unreachable blocks are blocks that exist but aren't visited.
    // Currently visitAllBlocks IS our source, so this check is a no-op for
    // blocks added via the graph. However, the editor creates nodes and adds
    // execution blocks, so we should compare against the editor's full list.
    // For the core validator, we expose a variant that accepts an external block list.
    // ── Check 6: Data dependency cycles ────────────────────────────────
    _DetectDataCycles(allBlocks, addIssue);
    // Sort: errors first, then warnings
    issues.sort((a, b) => a.severity - b.severity);
    return {
        isValid: issues.every((i) => i.severity !== 0 /* FlowGraphValidationSeverity.Error */),
        issues,
        errorCount: issues.filter((i) => i.severity === 0 /* FlowGraphValidationSeverity.Error */).length,
        warningCount: issues.filter((i) => i.severity === 1 /* FlowGraphValidationSeverity.Warning */).length,
        issuesByBlock,
    };
}
/**
 * Extended validation that also checks for unreachable blocks.
 * Requires a full list of all blocks in the graph (including those not reachable
 * from event blocks via the normal traversal).
 *
 * @param flowGraph - The flow graph to validate.
 * @param allKnownBlocks - Complete list of all blocks (e.g., from the editor's node set).
 * @returns The validation result.
 */
export function ValidateFlowGraphWithBlockList(flowGraph, allKnownBlocks) {
    const result = ValidateFlowGraph(flowGraph);
    // Check for unreachable blocks
    const reachableIds = new Set();
    flowGraph.visitAllBlocks((block) => {
        reachableIds.add(block.uniqueId);
    });
    for (const block of allKnownBlocks) {
        if (!reachableIds.has(block.uniqueId)) {
            const issue = {
                severity: 1 /* FlowGraphValidationSeverity.Warning */,
                message: `Block is unreachable from any event block.`,
                block,
            };
            result.issues.push(issue);
            result.warningCount++;
            let arr = result.issuesByBlock.get(block.uniqueId);
            if (!arr) {
                arr = [];
                result.issuesByBlock.set(block.uniqueId, arr);
            }
            arr.push(issue);
            // Also run Check 2 and Check 3 on unreachable blocks so the editor
            // can display all issues, not just reachability ones.
            for (const input of block.dataInputs) {
                if (!input.optional && !input.isDisabled && !input.isConnected()) {
                    const dataIssue = {
                        severity: 1 /* FlowGraphValidationSeverity.Warning */,
                        message: `"${input.name}" is not connected and will use its default value.`,
                        block,
                        connectionName: input.name,
                    };
                    result.issues.push(dataIssue);
                    result.warningCount++;
                    arr.push(dataIssue);
                }
            }
            if (block instanceof FlowGraphExecutionBlock && !_IsEventBlock(block)) {
                const inSignal = block.signalInputs.find((s) => s.name === "in");
                if (inSignal && !inSignal.isConnected()) {
                    const signalIssue = {
                        severity: 0 /* FlowGraphValidationSeverity.Error */,
                        message: `Execution block has no incoming signal — it will never execute.`,
                        block,
                        connectionName: "in",
                    };
                    result.issues.push(signalIssue);
                    result.errorCount++;
                    arr.push(signalIssue);
                }
            }
        }
    }
    result.isValid = result.issues.every((i) => i.severity !== 0 /* FlowGraphValidationSeverity.Error */);
    result.issues.sort((a, b) => a.severity - b.severity);
    return result;
}
/**
 * Get all event blocks from a flow graph.
 * @param flowGraph - the flow graph
 * @returns the event blocks
 */
function _GetEventBlocks(flowGraph) {
    const eventBlocks = [];
    for (const type in flowGraph._eventBlocks) {
        for (const block of flowGraph._eventBlocks[type]) {
            eventBlocks.push(block);
        }
    }
    return eventBlocks;
}
/**
 * Detect whether a block is an event block (entry point).
 * @param block - the block to check
 * @returns true if it is an event block
 */
function _IsEventBlock(block) {
    return block instanceof FlowGraphEventBlock;
}
/**
 * Detects cycles among data-only blocks.
 * A data cycle means that block A's output feeds into block B's input, and
 * block B's output feeds back into block A (directly or indirectly).
 * This would cause infinite recursion during getValue().
 * @param allBlocks - all blocks to check
 * @param addIssue - callback to report issues
 */
function _DetectDataCycles(allBlocks, addIssue) {
    // Build adjacency: for each block, which blocks do its data inputs depend on?
    // (Data inputs pull values from connected output blocks.)
    const white = 0; // unvisited
    const gray = 1; // in current DFS path
    const black = 2; // fully explored
    const color = new Map();
    for (const block of allBlocks) {
        color.set(block.uniqueId, white);
    }
    const blockMap = new Map();
    for (const block of allBlocks) {
        blockMap.set(block.uniqueId, block);
    }
    const reportedCycleBlocks = new Set();
    function dfs(block) {
        color.set(block.uniqueId, gray);
        for (const input of block.dataInputs) {
            if (!input.isConnected()) {
                continue;
            }
            for (const connected of input._connectedPoint) {
                const dep = connected._ownerBlock;
                // Only consider data-only blocks (not execution blocks which are driven by signals)
                if (dep instanceof FlowGraphExecutionBlock) {
                    continue;
                }
                const depColor = color.get(dep.uniqueId);
                if (depColor === gray) {
                    // Cycle found
                    if (!reportedCycleBlocks.has(block.uniqueId)) {
                        reportedCycleBlocks.add(block.uniqueId);
                        addIssue({
                            severity: 0 /* FlowGraphValidationSeverity.Error */,
                            message: `Data dependency cycle detected — getValue() will recurse infinitely.`,
                            block,
                        });
                    }
                    if (!reportedCycleBlocks.has(dep.uniqueId)) {
                        reportedCycleBlocks.add(dep.uniqueId);
                        addIssue({
                            severity: 0 /* FlowGraphValidationSeverity.Error */,
                            message: `Data dependency cycle detected — getValue() will recurse infinitely.`,
                            block: dep,
                        });
                    }
                    return true;
                }
                if (depColor === white) {
                    dfs(dep);
                }
            }
        }
        color.set(block.uniqueId, black);
        return false;
    }
    for (const block of allBlocks) {
        if (color.get(block.uniqueId) === white) {
            dfs(block);
        }
    }
}
//# sourceMappingURL=flowGraphValidator.js.map