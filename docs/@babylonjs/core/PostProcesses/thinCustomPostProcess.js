import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { EngineStore } from "../Engines/engineStore.js";
import { Observable } from "../Misc/observable.js";
/**
 * Class used to apply a custom post process
 */
export class ThinCustomPostProcess extends EffectWrapper {
    /**
     * Constructs a new custom post process
     * @param name Name of the effect
     * @param engine Engine to use to render the effect. If not provided, the last created engine will be used
     * @param options Options to configure the effect
     */
    constructor(name, engine = null, options) {
        super({
            name,
            engine: engine || EngineStore.LastCreatedEngine,
            useShaderStore: true,
            useAsPostProcess: true,
            ...options,
        });
        /**
         * Observable triggered when the post process is bound
         */
        this.onBindObservable = new Observable();
    }
    bind(noDefaultBindings = false) {
        super.bind(noDefaultBindings);
        this.onBindObservable.notifyObservers(this._drawWrapper.effect);
    }
}
//# sourceMappingURL=thinCustomPostProcess.js.map