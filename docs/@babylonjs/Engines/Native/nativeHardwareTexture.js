/** @internal */
export class NativeHardwareTexture {
    constructor(existingTexture, engine) {
        this._engine = engine;
        this.set(existingTexture);
    }
    get underlyingResource() {
        return this._nativeTexture;
    }
    setUsage() { }
    set(hardwareTexture) {
        this._nativeTexture = hardwareTexture;
    }
    reset() {
        this._nativeTexture = null;
    }
    release() {
        if (this._nativeTexture) {
            this._engine.deleteTexture(this._nativeTexture);
        }
        this.reset();
    }
}
//# sourceMappingURL=nativeHardwareTexture.js.map