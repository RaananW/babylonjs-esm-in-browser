import { Tools } from "@babylonjs/core/Misc/tools.js";
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
export class GaussianSplattingDownloadManager {
    /**
     * Creates a download manager.
     * @param options concurrency and retry limits
     */
    constructor(options) {
        this._activeCount = 0;
        this._queue = [];
        // Idempotency: maps a URL to its task while the download is queued or in flight. The entry is removed
        // once the download settles so a later request (after the bytes were consumed) downloads again.
        this._pending = new Map();
        // Maps a group id to the set of URLs currently downloading (or queued) under it, for bulk cancellation.
        this._groups = new Map();
        this._disposed = false;
        this.maxConcurrent = Math.max(1, options?.maxConcurrent ?? 2);
        this.maxRetries = Math.max(0, options?.maxRetries ?? 2);
    }
    /**
     * Whether there are no downloads queued or in flight.
     */
    get isIdle() {
        return this._pending.size === 0;
    }
    /**
     * Downloads a file as an `ArrayBuffer`, queued behind the concurrency cap and retried on failure.
     * Concurrent requests for the same URL resolve from a single shared download.
     * @param url the file URL to download
     * @param groupId optional group tag so related downloads can be cancelled together via {@link cancelGroup}
     * @returns a promise resolving with the downloaded bytes
     */
    async loadFileAsync(url, groupId) {
        if (this._disposed) {
            throw new Error("GaussianSplattingDownloadManager has been disposed.");
        }
        const existing = this._pending.get(url);
        if (existing) {
            return await existing.promise;
        }
        const task = {
            url,
            groupId,
            settled: false,
            cancelled: false,
            started: false,
            slotReleased: false,
        };
        task.promise = new Promise((resolve, reject) => {
            task.resolve = resolve;
            task.reject = reject;
        });
        this._pending.set(url, task);
        if (groupId !== undefined) {
            let urls = this._groups.get(groupId);
            if (!urls) {
                urls = new Set();
                this._groups.set(groupId, urls);
            }
            urls.add(url);
        }
        this._queue.push(task);
        this._pump();
        return await task.promise;
    }
    /**
     * Cancels a single pending download by URL. A queued download is dropped before it starts; an in-flight
     * download has its underlying HTTP request aborted and its concurrency slot freed. No-op if the URL is
     * not currently pending.
     * @param url the URL to cancel
     */
    cancel(url) {
        const task = this._pending.get(url);
        if (!task) {
            return;
        }
        this._abort(task, new Error(`GaussianSplattingDownloadManager: download cancelled (${url}).`));
    }
    /**
     * Cancels every pending download tagged with the given group id.
     * @param groupId the group whose downloads should be cancelled
     */
    cancelGroup(groupId) {
        const urls = this._groups.get(groupId);
        if (!urls) {
            return;
        }
        // Copy first: cancel() mutates the group set as each URL settles.
        for (const url of Array.from(urls)) {
            this.cancel(url);
        }
        this._groups.delete(groupId);
    }
    /**
     * Cancels every queued download and aborts every in-flight download, preventing new downloads from
     * starting.
     */
    dispose() {
        if (this._disposed) {
            return;
        }
        this._disposed = true;
        this._queue.length = 0;
        for (const task of Array.from(this._pending.values())) {
            this._abort(task, new Error("GaussianSplattingDownloadManager has been disposed."));
        }
    }
    /**
     * Aborts a task: drops it from the queue (if not started), aborts its in-flight HTTP request (if started),
     * unwinds its current attempt, settles its promise, and frees its concurrency slot.
     * @param task the task to abort
     * @param reason the rejection reason
     */
    _abort(task, reason) {
        if (task.settled) {
            return;
        }
        task.cancelled = true;
        const queueIndex = this._queue.indexOf(task);
        if (queueIndex !== -1) {
            this._queue.splice(queueIndex, 1);
        }
        // Abort the underlying HTTP request (no-op for a queued task whose request has not been created).
        task.request?.abort();
        // abort() does not fire the error callback, so unwind the awaited attempt explicitly.
        task.cancelAttempt?.(reason);
        this._settle(task, () => task.reject(reason));
        if (task.started) {
            this._releaseSlot(task);
        }
    }
    /**
     * Settles a task exactly once, removing it from the pending map and its group.
     * @param task the task to settle
     * @param settleFn resolves or rejects the task's promise
     */
    _settle(task, settleFn) {
        if (task.settled) {
            return;
        }
        task.settled = true;
        this._pending.delete(task.url);
        if (task.groupId !== undefined) {
            const urls = this._groups.get(task.groupId);
            if (urls) {
                urls.delete(task.url);
                if (urls.size === 0) {
                    this._groups.delete(task.groupId);
                }
            }
        }
        settleFn();
    }
    /**
     * Releases a task's concurrency slot exactly once and pumps the queue.
     * @param task the task whose slot to release
     */
    _releaseSlot(task) {
        if (task.slotReleased) {
            return;
        }
        task.slotReleased = true;
        this._activeCount--;
        this._pump();
    }
    /**
     * Starts as many queued downloads as the concurrency cap allows.
     */
    _pump() {
        while (!this._disposed && this._activeCount < this.maxConcurrent && this._queue.length > 0) {
            const task = this._queue.shift();
            if (task.settled) {
                continue;
            }
            task.started = true;
            this._activeCount++;
            void this._runTaskAsync(task).finally(() => {
                this._releaseSlot(task);
            });
        }
    }
    /**
     * Runs a single download with retries, settling the task's shared promise. The idempotency entry is
     * removed the moment the task settles so a later request for the same URL starts a fresh download.
     * @param task the queued download to run
     */
    async _runTaskAsync(task) {
        let lastError;
        // attempt 0 is the initial try; attempts 1..maxRetries are retries (PlayCanvas retries immediately).
        for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
            if (this._disposed || task.cancelled) {
                return;
            }
            try {
                // eslint-disable-next-line no-await-in-loop
                const buffer = await this._downloadAttemptAsync(task);
                this._settle(task, () => task.resolve(buffer));
                return;
            }
            catch (e) {
                task.cancelAttempt = undefined;
                if (this._disposed || task.cancelled) {
                    // The task was already settled by cancel()/dispose(); just stop retrying.
                    return;
                }
                lastError = e;
            }
        }
        this._settle(task, () => task.reject(lastError));
    }
    /**
     * Performs one download attempt, exposing the request handle (for abort) and an attempt-rejecter on the
     * task so cancellation can both abort the HTTP request and unwind this awaited attempt.
     * @param task the download task
     * @returns a promise resolving with the downloaded bytes
     */
    async _downloadAttemptAsync(task) {
        return await new Promise((resolve, reject) => {
            task.cancelAttempt = reject;
            task.request = Tools.LoadFile(task.url, (data) => resolve(data), undefined, undefined, true, (_request, exception) => reject(exception instanceof Error ? exception : new Error(`GaussianSplattingDownloadManager: failed to load ${task.url}.`)));
        });
    }
}
//# sourceMappingURL=gaussianSplattingDownloadManager.js.map