/** This file must only contain pure code and pure imports */
import { Observable } from "./observable.pure.js";
import { type EventState } from "./observable.js";
/**
 * Represent a list of observers registered to multiple Observables object.
 */
export declare class MultiObserver<T> {
    private _observers;
    private _observables;
    /**
     * Release associated resources
     */
    dispose(): void;
    /**
     * Raise a callback when one of the observable will notify
     * @param observables defines a list of observables to watch
     * @param callback defines the callback to call on notification
     * @param mask defines the mask used to filter notifications
     * @param scope defines the current scope used to restore the JS context
     * @returns the new MultiObserver
     */
    static Watch<T>(observables: Observable<T>[], callback: (eventData: T, eventState: EventState) => void, mask?: number, scope?: any): MultiObserver<T>;
}
/**
 * Register side effects for observableExtensions.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterObservableExtensions(): void;
