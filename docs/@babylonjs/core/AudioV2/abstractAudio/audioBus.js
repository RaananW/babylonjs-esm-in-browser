import { AbstractAudioBus } from "./abstractAudioBus.js";
/**
 * Abstract class for an audio bus that has spatial audio and stereo output capabilities.
 *
 * Instances of this class can be connected to other audio buses.
 *
 * Audio buses are created by the {@link CreateAudioBusAsync} function.
 */
export class AudioBus extends AbstractAudioBus {
    constructor(name, engine, options) {
        super(name, engine);
        this._spatialAutoUpdate = true;
        this._spatialMinUpdateTime = 0;
        this._outBus = null;
        this._spatial = null;
        this._onOutBusDisposed = () => {
            this.outBus = this.engine.defaultMainBus;
        };
        if (typeof options.spatialAutoUpdate === "boolean") {
            this._spatialAutoUpdate = options.spatialAutoUpdate;
        }
        if (typeof options.spatialMinUpdateTime === "number") {
            this._spatialMinUpdateTime = options.spatialMinUpdateTime;
        }
    }
    /**
     * The output bus of the audio bus. Defaults to the audio engine's default main bus.
     */
    get outBus() {
        return this._outBus;
    }
    set outBus(outBus) {
        if (this._outBus === outBus) {
            return;
        }
        if (this._outBus) {
            this._outBus.onDisposeObservable.removeCallback(this._onOutBusDisposed);
            if (!this._disconnect(this._outBus)) {
                throw new Error("Disconnect failed");
            }
        }
        this._outBus = outBus;
        if (this._outBus) {
            this._outBus.onDisposeObservable.add(this._onOutBusDisposed);
            if (!this._connect(this._outBus)) {
                throw new Error("Connect failed");
            }
        }
    }
    /**
     * The spatial audio features.
     */
    get spatial() {
        if (this._spatial) {
            return this._spatial;
        }
        return this._initSpatialProperty();
    }
    /**
     * Releases associated resources.
     */
    dispose() {
        super.dispose();
        this._spatial?.dispose();
        this._spatial = null;
        if (this._outBus) {
            this._outBus.onDisposeObservable.removeCallback(this._onOutBusDisposed);
        }
        this._outBus = null;
    }
    _initSpatialProperty() {
        return (this._spatial = this._createSpatialProperty(this._spatialAutoUpdate, this._spatialMinUpdateTime));
    }
}
//# sourceMappingURL=audioBus.js.map