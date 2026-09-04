import { type IAbstractSoundInstanceOptions, _AbstractSoundInstance } from "./abstractSoundInstance.js";
import { type IStaticSoundOptionsBase, type IStaticSoundPlayOptions, type IStaticSoundStopOptions } from "./staticSound.js";
/**
 * Options for creating a static sound instance.
 * @internal
 */
export interface IStaticSoundInstanceOptions extends IAbstractSoundInstanceOptions, IStaticSoundOptionsBase {
}
/** @internal */
export declare abstract class _StaticSoundInstance extends _AbstractSoundInstance {
    protected abstract readonly _options: IStaticSoundInstanceOptions;
    abstract set loopStart(value: number);
    abstract set loopEnd(value: number);
    abstract set pitch(value: number);
    abstract set playbackRate(value: number);
    abstract play(options: Partial<IStaticSoundPlayOptions>): void;
    abstract stop(options?: Partial<IStaticSoundStopOptions>): void;
}
