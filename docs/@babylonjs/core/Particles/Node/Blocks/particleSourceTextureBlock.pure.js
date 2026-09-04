/** This file must only contain pure code and pure imports */
import { Texture } from "../../../Materials/Textures/texture.pure.js";
import { NodeParticleBlockConnectionPointTypes } from "../Enums/nodeParticleBlockConnectionPointTypes.js";
import { NodeParticleBlock } from "../nodeParticleBlock.js";
import { TextureTools } from "../../../Misc/textureTools.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to provide a texture for particles in a particle system
 */
export class ParticleTextureSourceBlock extends NodeParticleBlock {
    /**
     * Gets or sets the URL of the texture to be used by this block.
     */
    get url() {
        return this._url;
    }
    set url(value) {
        if (this._url === value) {
            return;
        }
        this._cachedData = null;
        this._url = value;
        this._textureDataUrl = "";
        this._sourceTexture = null;
    }
    /**
     * Gets or sets the data URL of the texture to be used by this block.
     * This is a base64 encoded string representing the texture data.
     */
    get textureDataUrl() {
        return this._textureDataUrl;
    }
    set textureDataUrl(value) {
        if (this._textureDataUrl === value) {
            return;
        }
        this._cachedData = null;
        this._textureDataUrl = value;
        this._url = "";
        this._sourceTexture = null;
    }
    /**
     * Gets the texture directly set on this block.
     * This value will not be serialized.
     */
    get sourceTexture() {
        return this._sourceTexture;
    }
    /**
     * Directly sets the texture to be used by this block.
     * This value will not be serialized.
     */
    set sourceTexture(value) {
        if (this._sourceTexture === value) {
            return;
        }
        this._cachedData = null;
        this._sourceTexture = value;
        this._url = value.url || "";
        this._textureDataUrl = "";
    }
    /**
     * Gets the texture set on this block.
     * This value will not be serialized.
     */
    get texture() {
        return this.sourceTexture;
    }
    /**
     * Sets the texture to be used by this block.
     * This value will not be serialized.
     */
    set texture(value) {
        this.sourceTexture = value;
    }
    /**
     * Create a new ParticleTextureSourceBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this._url = "";
        this._textureDataUrl = "";
        this._sourceTexture = null;
        this._cachedData = null;
        this._clonedTextures = [];
        /**
         * Gets or sets the strenght of the flow map effect
         */
        this.invertY = true;
        /**
         * Indicates if the texture data should be serialized as a base64 string.
         */
        this.serializedCachedData = false;
        this.registerOutput("texture", NodeParticleBlockConnectionPointTypes.Texture);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "ParticleTextureSourceBlock";
    }
    /**
     * Gets the texture output component
     */
    get textureOutput() {
        return this._outputs[0];
    }
    /**
     * Gets the texture content as a promise
     * @returns a promise that resolves to the texture content, including width, height, and pixel data
     */
    async extractTextureContentAsync() {
        if (!this.textureOutput._storedValue && !this._sourceTexture) {
            return null;
        }
        if (this._cachedData) {
            return this._cachedData;
        }
        const texture = this.textureOutput._storedValue || this._sourceTexture;
        return await new Promise((resolve, reject) => {
            const extractProceduralTextureContentAsync = async (proceduralTexture) => {
                if (!proceduralTexture.isReady()) {
                    const effect = proceduralTexture.getEffect();
                    await new Promise((resolveReady) => {
                        let settled = false;
                        let errorObserver = null;
                        const settle = (ready) => {
                            if (settled) {
                                return;
                            }
                            settled = true;
                            errorObserver?.remove();
                            resolveReady(ready);
                        };
                        errorObserver = effect.onErrorObservable.add(() => {
                            settle(false);
                        });
                        effect.executeWhenCompiled(() => {
                            settle(true);
                        });
                    });
                }
                if (!proceduralTexture.isReady()) {
                    return null;
                }
                proceduralTexture.render();
                const data = await proceduralTexture.getContent();
                if (!data) {
                    return null;
                }
                const size = proceduralTexture.getSize();
                return {
                    width: size.width,
                    height: size.height,
                    data: new Uint8ClampedArray(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)),
                };
            };
            if (!texture.isReady()) {
                if (texture.getContent) {
                    void (async () => {
                        try {
                            this._cachedData = await extractProceduralTextureContentAsync(texture);
                            resolve(this._cachedData);
                        }
                        catch (e) {
                            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                            reject(e);
                        }
                    })();
                    return;
                }
                let settled = false;
                let loadObserver = null;
                let internalErrorObserver = null;
                let textureErrorObserver = null;
                const cleanup = () => {
                    loadObserver?.remove();
                    internalErrorObserver?.remove();
                    textureErrorObserver?.remove();
                };
                const settle = (textureContent) => {
                    if (settled) {
                        return;
                    }
                    settled = true;
                    cleanup();
                    resolve(textureContent);
                };
                const fail = (error) => {
                    if (settled) {
                        return;
                    }
                    settled = true;
                    cleanup();
                    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                    reject(error);
                };
                if (texture.loadingError) {
                    settle(null);
                    return;
                }
                const loadObservable = texture.onLoadObservable;
                if (!loadObservable) {
                    settle(null);
                    return;
                }
                loadObserver = loadObservable.addOnce(async () => {
                    try {
                        this._cachedData = await this.extractTextureContentAsync();
                        settle(this._cachedData);
                    }
                    catch (e) {
                        fail(e);
                    }
                });
                internalErrorObserver =
                    texture.getInternalTexture()?.onErrorObservable.addOnce(() => {
                        settle(null);
                    }) ?? null;
                textureErrorObserver = Texture.OnTextureLoadErrorObservable.add((erroredTexture) => {
                    if (erroredTexture === texture) {
                        settle(null);
                    }
                });
                if (texture.loadingError) {
                    settle(null);
                    return;
                }
                if (texture.isReady()) {
                    void (async () => {
                        try {
                            this._cachedData = await this.extractTextureContentAsync();
                            settle(this._cachedData);
                        }
                        catch (e) {
                            fail(e);
                        }
                    })();
                }
                return;
            }
            const size = texture.getSize();
            if (texture.getContent) {
                extractProceduralTextureContentAsync(texture)
                    // eslint-disable-next-line github/no-then
                    ?.then((data) => {
                    this._cachedData = data;
                    resolve(this._cachedData);
                })
                    // eslint-disable-next-line github/no-then
                    .catch(reject);
            }
            else {
                TextureTools.GetTextureDataAsync(texture, size.width, size.height)
                    // eslint-disable-next-line github/no-then
                    .then((data) => {
                    this._cachedData = {
                        width: size.width,
                        height: size.height,
                        data: new Uint8ClampedArray(data),
                    };
                    texture.dispose();
                    resolve(this._cachedData);
                })
                    // eslint-disable-next-line github/no-then
                    .catch(reject);
            }
        });
    }
    /**
     * Builds the block
     * @param state defines the current build state
     */
    _build(state) {
        if (this._sourceTexture) {
            // The same NodeParticleSystemSet can be built into multiple scenes/engines
            // (original system scene, editor preview scene).
            // Textures are engine-specific, so we need to handle cross-engine cases.
            const sourceScene = this._sourceTexture.getScene?.();
            const sourceEngine = sourceScene?.getEngine?.();
            const targetEngine = state.scene.getEngine();
            if (sourceEngine && sourceEngine !== targetEngine) {
                // Cross-engine: recreate texture from URL if available, preserving invertY
                const url = this._sourceTexture.url || this._url;
                if (url) {
                    const invertY = this._sourceTexture.invertY ?? this.invertY;
                    const tex = new Texture(url, state.scene, undefined, invertY);
                    this._copyTextureProperties(this._sourceTexture, tex);
                    this._clonedTextures.push(tex);
                    this.textureOutput._storedValue = tex;
                    return;
                }
                // No URL available - use the source texture directly as fallback
                // This may not render correctly but avoids breaking completely
                this.textureOutput._storedValue = this._sourceTexture;
                return;
            }
            // Same engine: clone works correctly and preserves all properties
            const cloned = this._sourceTexture.clone();
            if (cloned) {
                this._clonedTextures.push(cloned);
                this.textureOutput._storedValue = cloned;
            }
            else {
                this.textureOutput._storedValue = this._sourceTexture;
            }
            return;
        }
        if (!this._textureDataUrl && !this._url) {
            this.textureOutput._storedValue = null;
            return;
        }
        if (this._textureDataUrl) {
            const tex = new Texture(this._textureDataUrl, state.scene, undefined, this.invertY);
            this._clonedTextures.push(tex);
            this.textureOutput._storedValue = tex;
            return;
        }
        const tex = new Texture(this._url, state.scene, undefined, this.invertY);
        this._clonedTextures.push(tex);
        this.textureOutput._storedValue = tex;
    }
    /**
     * Serializes this block
     * @returns the serialization object
     */
    serialize() {
        const serializationObject = super.serialize();
        serializationObject.url = this.url;
        serializationObject.serializedCachedData = this.serializedCachedData;
        serializationObject.invertY = this.invertY;
        if (this.serializedCachedData) {
            serializationObject.textureDataUrl = this.textureDataUrl;
        }
        return serializationObject;
    }
    /**
     * Deserializes this block from a serialization object
     * @param serializationObject the serialization object
     */
    _deserialize(serializationObject) {
        super._deserialize(serializationObject);
        this.url = serializationObject.url;
        this.serializedCachedData = !!serializationObject.serializedCachedData;
        this.invertY = !!serializationObject.invertY;
        if (serializationObject.textureDataUrl) {
            this.textureDataUrl = serializationObject.textureDataUrl;
        }
    }
    /**
     * Disposes the block and its associated resources
     */
    dispose() {
        // Dispose all cloned textures we created
        for (const tex of this._clonedTextures) {
            tex.dispose();
        }
        this._clonedTextures = [];
        this.textureOutput._storedValue = null;
        // Never dispose _sourceTexture - it's owned by the caller
        super.dispose();
    }
    /**
     * Copies texture properties from source to target texture
     * @param source - The source texture to copy properties from
     * @param target - The target texture to copy properties to
     */
    _copyTextureProperties(source, target) {
        // BaseTexture properties
        target.hasAlpha = source.hasAlpha;
        target.level = source.level;
        target.coordinatesIndex = source.coordinatesIndex;
        target.coordinatesMode = source.coordinatesMode;
        target.wrapU = source.wrapU;
        target.wrapV = source.wrapV;
        target.wrapR = source.wrapR;
        target.anisotropicFilteringLevel = source.anisotropicFilteringLevel;
        // Texture-specific properties (if both are Texture instances)
        const sourceTexture = source;
        const targetTexture = target;
        if (sourceTexture.uOffset !== undefined && targetTexture.uOffset !== undefined) {
            targetTexture.uOffset = sourceTexture.uOffset;
            targetTexture.vOffset = sourceTexture.vOffset;
            targetTexture.uScale = sourceTexture.uScale;
            targetTexture.vScale = sourceTexture.vScale;
            targetTexture.uAng = sourceTexture.uAng;
            targetTexture.vAng = sourceTexture.vAng;
            targetTexture.wAng = sourceTexture.wAng;
        }
    }
}
let _Registered = false;
/**
 * Register side effects for particleSourceTextureBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterParticleSourceTextureBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ParticleTextureSourceBlock", ParticleTextureSourceBlock);
}
//# sourceMappingURL=particleSourceTextureBlock.pure.js.map