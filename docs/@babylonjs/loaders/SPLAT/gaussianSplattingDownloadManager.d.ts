/**
 * Options for {@link GaussianSplattingDownloadManager}.
 */
export interface IGaussianSplattingDownloadManagerOptions {
    /** Maximum number of downloads allowed to run at the same time. PlayCanvas default `2`. */
    maxConcurrent?: number;
    /** Number of times a failed download is retried before rejecting. PlayCanvas default `2` (3 attempts total). */
    maxRetries?: number;
}
/** Identifies a group of related downloads so they can be cancelled together. */
export type DownloadGroupId = string | number;
/**
 * Throttles the file downloads issued while streaming a Gaussian Splatting LOD scene.
 *
 * Mirrors the PlayCanvas gsplat asset loader: at most {@link maxConcurrent} downloads run at once, the
 * rest wait in a FIFO queue, each failed download is retried up to {@link maxRetries} times, and requests
 * are idempotent — concurrent (queued or in-flight) requests for the same URL share a single download.
 *
 * Downloads can be tagged with a group id and cancelled together via {@link cancelGroup}: when a node's
 * target LOD changes before its file finishes loading, the streamer cancels that file's now-unneeded
 * downloads. Cancellation aborts the underlying HTTP request (a queued download is dropped before it
 * starts; an in-flight download is aborted and its concurrency slot freed), so no bandwidth is wasted on
 * data that is no longer needed.
 *
 * Without this throttling, every on-demand LOD decode fans out into many parallel image fetches, so the
 * browser opens dozens of simultaneous connections that compete for bandwidth and delay the splats the
 * camera actually needs.
 * @experimental
 */
export declare class GaussianSplattingDownloadManager {
    /** Maximum number of downloads allowed to run at the same time. */
    readonly maxConcurrent: number;
    /** Number of times a failed download is retried before rejecting. */
    readonly maxRetries: number;
    private _activeCount;
    private readonly _queue;
    private readonly _pending;
    private readonly _groups;
    private _disposed;
    /**
     * Creates a download manager.
     * @param options concurrency and retry limits
     */
    constructor(options?: IGaussianSplattingDownloadManagerOptions);
    /**
     * Whether there are no downloads queued or in flight.
     */
    get isIdle(): boolean;
    /**
     * Downloads a file as an `ArrayBuffer`, queued behind the concurrency cap and retried on failure.
     * Concurrent requests for the same URL resolve from a single shared download.
     * @param url the file URL to download
     * @param groupId optional group tag so related downloads can be cancelled together via {@link cancelGroup}
     * @returns a promise resolving with the downloaded bytes
     */
    loadFileAsync(url: string, groupId?: DownloadGroupId): Promise<ArrayBuffer>;
    /**
     * Cancels a single pending download by URL. A queued download is dropped before it starts; an in-flight
     * download has its underlying HTTP request aborted and its concurrency slot freed. No-op if the URL is
     * not currently pending.
     * @param url the URL to cancel
     */
    cancel(url: string): void;
    /**
     * Cancels every pending download tagged with the given group id.
     * @param groupId the group whose downloads should be cancelled
     */
    cancelGroup(groupId: DownloadGroupId): void;
    /**
     * Cancels every queued download and aborts every in-flight download, preventing new downloads from
     * starting.
     */
    dispose(): void;
    /**
     * Aborts a task: drops it from the queue (if not started), aborts its in-flight HTTP request (if started),
     * unwinds its current attempt, settles its promise, and frees its concurrency slot.
     * @param task the task to abort
     * @param reason the rejection reason
     */
    private _abort;
    /**
     * Settles a task exactly once, removing it from the pending map and its group.
     * @param task the task to settle
     * @param settleFn resolves or rejects the task's promise
     */
    private _settle;
    /**
     * Releases a task's concurrency slot exactly once and pumps the queue.
     * @param task the task whose slot to release
     */
    private _releaseSlot;
    /**
     * Starts as many queued downloads as the concurrency cap allows.
     */
    private _pump;
    /**
     * Runs a single download with retries, settling the task's shared promise. The idempotency entry is
     * removed the moment the task settles so a later request for the same URL starts a fresh download.
     * @param task the queued download to run
     */
    private _runTaskAsync;
    /**
     * Performs one download attempt, exposing the request handle (for abort) and an attempt-rejecter on the
     * task so cancellation can both abort the HTTP request and unwind this awaited attempt.
     * @param task the download task
     * @returns a promise resolving with the downloaded bytes
     */
    private _downloadAttemptAsync;
}
