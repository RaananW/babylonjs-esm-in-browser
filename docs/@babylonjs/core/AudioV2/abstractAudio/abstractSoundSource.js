import { AbstractAudioOutNode } from "./abstractAudioOutNode.js";
/**
 * Abstract class representing a sound in the audio engine.
 */
export class AbstractSoundSource extends AbstractAudioOutNode {
    constructor(name, engine, options, nodeType = 2 /* AudioNodeType.HAS_OUTPUTS */) {
        super(name, engine, nodeType);
        this._spatialAutoUpdate = true;
        this._spatialMinUpdateTime = 0;
        this._outBus = null;
        this._spatial = null;
        this._onOutBusDisposed = null;
        if (typeof options.spatialAutoUpdate === "boolean") {
            this._spatialAutoUpdate = options.spatialAutoUpdate;
        }
        if (typeof options.spatialMinUpdateTime === "number") {
            this._spatialMinUpdateTime = options.spatialMinUpdateTime;
        }
    }
    /**
     * The output bus for the sound.
     * @see {@link AudioEngineV2.defaultMainBus}
     */
    get outBus() {
        return this._outBus;
    }
    set outBus(outBus) {
        if (this._outBus === outBus) {
            return;
        }
        if (this._outBus) {
            if (this._onOutBusDisposed) {
                this._outBus.onDisposeObservable.removeCallback(this._onOutBusDisposed);
                this._onOutBusDisposed = null;
            }
            if (!this._disconnect(this._outBus)) {
                throw new Error("Disconnect failed");
            }
        }
        this._outBus = outBus;
        if (this._outBus) {
            this._onOutBusDisposed = () => {
                this._outBus = null;
            };
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
        if (this._outBus && this._onOutBusDisposed) {
            this._outBus.onDisposeObservable.removeCallback(this._onOutBusDisposed);
            this._onOutBusDisposed = null;
        }
        this._outBus = null;
    }
    _initSpatialProperty() {
        return (this._spatial = this._createSpatialProperty(this._spatialAutoUpdate, this._spatialMinUpdateTime));
    }
    /** @internal */
    get _isSpatial() {
        return this._spatial !== null;
    }
    set _isSpatial(value) {
        if (value && !this._spatial) {
            this._initSpatialProperty();
        }
        else if (!value && this._spatial) {
            this._spatial.dispose();
            this._spatial = null;
        }
    }
}
//# sourceMappingURL=abstractSoundSource.js.map