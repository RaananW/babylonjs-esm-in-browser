import { type _WebAudioEngine } from "./webAudioEngine.js";
/**
 * Adds a UI button that starts the audio engine's underlying audio context when the user presses it.
 * @internal
 */
export declare class _WebAudioUnmuteUI {
    private _button;
    private _enabled;
    private _engine;
    private _style;
    /** @internal */
    constructor(engine: _WebAudioEngine, parentElement?: HTMLElement);
    /** @internal */
    dispose(): void;
    /** @internal */
    get enabled(): boolean;
    set enabled(value: boolean);
    private _show;
    private _hide;
    private _onStateChanged;
}
