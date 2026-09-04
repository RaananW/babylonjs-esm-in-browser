import { Deferred } from "./deferred.js";
/**
 * Provides a simple way of creating the rough equivalent of an async critical section.
 *
 * @example
 * ```typescript
 * const myLock = new AsyncLock();
 *
 * private async MyFuncAsync(): Promise<void> {
 *   await myLock.lockAsync(async () => {
 *     await operation1Async();
 *     await operation2Async();
 *   });
 * }
 * ```
 */
export class AsyncLock {
    constructor() {
        this._currentOperation = Promise.resolve();
    }
    /**
     * Executes the provided function when the lock is acquired (e.g. when the previous operation finishes).
     * @param func The function to execute.
     * @param signal An optional signal that can be used to abort the operation.
     * @returns A promise that resolves when the func finishes executing.
     */
    // eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
    lockAsync(func, signal) {
        signal?.throwIfAborted();
        const wrappedFunc = signal
            ? // eslint-disable-next-line @typescript-eslint/promise-function-async
                () => {
                    signal.throwIfAborted();
                    return func();
                }
            : func;
        // eslint-disable-next-line github/no-then
        const newOperation = this._currentOperation.then(wrappedFunc);
        // NOTE: It would be simpler to just hold a Promise<unknown>, but this class should not prevent an object held by the returned promise from being garbage collected.
        this._currentOperation = new Promise((resolve) => {
            // eslint-disable-next-line github/no-then
            newOperation.then(() => resolve(), resolve);
        });
        return newOperation;
    }
    /**
     * Executes the provided function when all the specified locks are acquired.
     * @param func The function to execute.
     * @param locks The locks to acquire.
     * @param signal An optional signal that can be used to abort the operation.
     * @returns A promise that resolves when the func finishes executing.
     */
    static async LockAsync(func, locks, signal) {
        signal?.throwIfAborted();
        if (locks.length === 0) {
            return await func();
        }
        const deferred = new Deferred();
        let acquiredLocks = 0;
        for (const lock of locks) {
            lock.lockAsync(async () => {
                acquiredLocks++;
                if (acquiredLocks === locks.length) {
                    deferred.resolve(await func());
                }
                return await deferred.promise;
                // eslint-disable-next-line github/no-then
            }, signal).catch((e) => deferred.reject(e));
        }
        return await deferred.promise;
    }
}
//# sourceMappingURL=asyncLock.js.map