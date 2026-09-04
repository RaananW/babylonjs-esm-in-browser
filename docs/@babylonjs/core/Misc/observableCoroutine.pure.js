import { inlineScheduler, runCoroutineAsync } from "./coroutine.js";
import { Observable } from "./observable.pure.js";
let _Registered = false;
/**
 * Register side effects for observableCoroutine.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterObservableCoroutine() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    function CreateObservableScheduler(observable) {
        const coroutines = new Array();
        const onSteps = new Array();
        const onErrors = new Array();
        const observer = observable.add(() => {
            const count = coroutines.length;
            for (let i = 0; i < count; i++) {
                inlineScheduler(coroutines.shift(), onSteps.shift(), onErrors.shift());
            }
        });
        const scheduler = (coroutine, onStep, onError) => {
            coroutines.push(coroutine);
            onSteps.push(onStep);
            onErrors.push(onError);
        };
        return {
            scheduler: scheduler,
            dispose: () => {
                observable.remove(observer);
            },
        };
    }
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    Observable.prototype.runCoroutineAsync = function (coroutine) {
        if (!this._coroutineScheduler) {
            const schedulerAndDispose = CreateObservableScheduler(this);
            this._coroutineScheduler = schedulerAndDispose.scheduler;
            this._coroutineSchedulerDispose = schedulerAndDispose.dispose;
        }
        return runCoroutineAsync(coroutine, this._coroutineScheduler);
    };
    Observable.prototype.cancelAllCoroutines = function () {
        if (this._coroutineSchedulerDispose) {
            this._coroutineSchedulerDispose();
        }
        this._coroutineScheduler = undefined;
        this._coroutineSchedulerDispose = undefined;
    };
}
//# sourceMappingURL=observableCoroutine.pure.js.map