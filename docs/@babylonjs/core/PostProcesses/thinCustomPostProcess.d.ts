import { type Nullable, type AbstractEngine, type EffectWrapperCreationOptions, type Effect } from "../index.js";
import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { Observable } from "../Misc/observable.js";
/**
 * Class used to apply a custom post process
 */
export declare class ThinCustomPostProcess extends EffectWrapper {
    /**
     * Observable triggered when the post process is bound
     */
    onBindObservable: Observable<Effect>;
    /**
     * Constructs a new custom post process
     * @param name Name of the effect
     * @param engine Engine to use to render the effect. If not provided, the last created engine will be used
     * @param options Options to configure the effect
     */
    constructor(name: string, engine?: Nullable<AbstractEngine>, options?: EffectWrapperCreationOptions);
    bind(noDefaultBindings?: boolean): void;
}
