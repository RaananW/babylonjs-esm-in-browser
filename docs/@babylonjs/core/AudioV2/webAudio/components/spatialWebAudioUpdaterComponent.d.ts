/** @internal */
export declare class _SpatialWebAudioUpdaterComponent {
    private _autoUpdate;
    private _lastUpdateTime;
    /**
     * The minimum time in seconds between spatial audio updates. Defaults to `0`.
     * @internal
     */
    minUpdateTime: number;
    /** @internal */
    constructor(parent: {
        update: () => void;
    }, autoUpdate: boolean, minUpdateTime: number);
    /** @internal */
    dispose(): void;
}
