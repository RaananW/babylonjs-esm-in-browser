/** This file must only contain pure code and pure imports */
/**
 * Message commands exchanged with the Gaussian Splatting depth-sort worker. Every message carries a
 * `command` field naming the intended work, instead of inferring it from which payload is present.
 */
export declare const GaussianSplattingSortWorkerCommand: {
    /** Main -> worker: set the source splat centers (stride 4: xyz + 1). */
    readonly POSITIONS: "positions";
    /** Main -> worker: patch a contiguous sub-range of the existing source splat centers in place. */
    readonly POSITIONS_UPDATE: "positionsUpdate";
    /** Main -> worker: set the compound-mesh rig node matrices. */
    readonly PART_MATRICES: "partMatrices";
    /** Main -> worker: set the compound-mesh per-splat rig node indices. */
    readonly PART_INDICES: "partIndices";
    /** Main -> worker: set the active source-splat ranges (flat [start0, count0, ...]). */
    readonly INTERVALS: "intervals";
    /** Main -> worker: sort the active splats for a camera view. */
    readonly SORT: "sort";
    /** Worker -> main: a completed sort result. */
    readonly SORTED: "sorted";
};
/**
 * Depth-sort web worker body for Gaussian Splatting meshes.
 *
 * The function is self-contained: it is serialized with `Function.prototype.toString()` and run
 * inside a `Blob`-backed `Worker`, so it must not reference anything from its enclosing module
 * (including {@link GaussianSplattingSortWorkerCommand} — the command literals are duplicated here).
 *
 * The intended work for each message is selected explicitly via its `command` field:
 * - `positions`    set source splat centers (stride 4: xyz + 1).
 * - `partMatrices` set compound-mesh rig node matrices.
 * - `partIndices`  set compound-mesh per-splat rig node indices.
 * - `intervals`    set active source-splat ranges (flat [start0, count0, ...]); persisted across sorts.
 * - `sort`         sort the active splats for `{ worldMatrix, cameraForward, cameraPosition, depthMix,
 *                  cameraId, sortRequestId, rightHanded }` and post back a `sorted` result.
 *
 * @param self - the worker global scope
 */
export declare const GaussianSplattingSortWorker: (self: Worker) => void;
