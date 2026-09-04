import { Observable } from "../../Misc/observable.js";
import { _AbstractSoundInstance } from "./abstractSoundInstance.js";
/** @internal */
export class _StreamingSoundInstance extends _AbstractSoundInstance {
    constructor(sound) {
        super(sound);
        /** @internal */
        this.onReadyObservable = new Observable();
        /** @internal */
        this.preloadedPromise = new Promise((resolve, reject) => {
            this._rejectPreloadedPromise = reject;
            this._resolvePreloadedPromise = resolve;
        });
        this.onErrorObservable.add(this._rejectPreloadedPromise);
        this.onReadyObservable.add(this._resolvePreloadedPromise);
    }
    /** @internal */
    set startOffset(value) {
        this._options.startOffset = value;
    }
    /** @internal */
    dispose() {
        super.dispose();
        this.onErrorObservable.clear();
        this.onReadyObservable.clear();
        this._resolvePreloadedPromise();
    }
}
//# sourceMappingURL=streamingSoundInstance.js.map