/** This file must only contain pure code and pure imports */
import { NodeGeometryBlockConnectionPointTypes } from "../../Enums/nodeGeometryConnectionPointTypes.js";
import { NodeGeometryBlock } from "../../nodeGeometryBlock.js";
import { TextureTools } from "../../../../Misc/textureTools.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to load texture data
 */
export class GeometryTextureBlock extends NodeGeometryBlock {
    /**
     * Gets the texture data
     */
    get textureData() {
        return this._data;
    }
    /**
     * Gets the texture width
     */
    get textureWidth() {
        return this._width;
    }
    /**
     * Gets the texture height
     */
    get textureHeight() {
        return this._height;
    }
    /**
     * Creates a new GeometryTextureBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this._data = null;
        /**
         * Gets or sets a boolean indicating that this block should serialize its cached data
         */
        this.serializedCachedData = false;
        this.registerOutput("texture", NodeGeometryBlockConnectionPointTypes.Texture);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "GeometryTextureBlock";
    }
    /**
     * Gets the texture component
     */
    get texture() {
        return this._outputs[0];
    }
    async _prepareImgToLoadAsync(url) {
        return await new Promise((resolve, reject) => {
            const img = new Image();
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, img.width, img.height);
                const pixels = imageData.data;
                const floatArray = new Float32Array(pixels.length);
                for (let i = 0; i < pixels.length; i++) {
                    floatArray[i] = pixels[i] / 255.0;
                }
                this._data = floatArray;
                this._width = img.width;
                this._height = img.height;
                resolve();
            };
            img.onerror = () => {
                this._data = null;
                reject(new Error("Failed to load image"));
            };
            img.src = url;
        });
    }
    /**
     * Remove stored data
     */
    cleanData() {
        this._data = null;
    }
    /**
     * Load the texture data from a Float32Array
     * @param data defines the data to load
     * @param width defines the width of the texture
     * @param height defines the height of the texture
     */
    loadTextureFromData(data, width, height) {
        this._data = data;
        this._width = width;
        this._height = height;
    }
    /**
     * Load the texture data
     * @param imageFile defines the file to load data from
     * @returns a promise fulfilled when image data is loaded
     */
    async loadTextureFromFileAsync(imageFile) {
        return await this._prepareImgToLoadAsync(URL.createObjectURL(imageFile));
    }
    /**
     * Load the texture data
     * @param url defines the url to load data from
     * @returns a promise fulfilled when image data is loaded
     */
    async loadTextureFromUrlAsync(url) {
        return await this._prepareImgToLoadAsync(url);
    }
    /**
     * Load the texture data
     * @param texture defines the source texture
     * @returns a promise fulfilled when image data is loaded
     */
    async extractFromTextureAsync(texture) {
        return await new Promise((resolve, reject) => {
            if (!texture.isReady()) {
                texture.onLoadObservable.addOnce(async () => {
                    try {
                        await this.extractFromTextureAsync(texture);
                        resolve();
                    }
                    catch (e) {
                        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                        reject(e);
                    }
                });
                return;
            }
            const size = texture.getSize();
            TextureTools.GetTextureDataAsync(texture, size.width, size.height)
                // eslint-disable-next-line github/no-then
                .then((data) => {
                const floatArray = new Float32Array(data.length);
                for (let i = 0; i < data.length; i++) {
                    floatArray[i] = data[i] / 255.0;
                }
                this._data = floatArray;
                this._width = size.width;
                this._height = size.height;
                resolve();
            })
                // eslint-disable-next-line github/no-then
                .catch(reject);
        });
    }
    _buildBlock() {
        if (!this._data) {
            this.texture._storedValue = null;
            return;
        }
        const textureData = {
            data: this._data,
            width: this._width,
            height: this._height,
        };
        this.texture._storedValue = textureData;
    }
    /**
     * Serializes this block in a JSON representation
     * @returns the serialized block object
     */
    serialize() {
        const serializationObject = super.serialize();
        serializationObject.width = this._width;
        serializationObject.height = this._height;
        serializationObject.serializedCachedData = this.serializedCachedData;
        if (this._data && this.serializedCachedData) {
            serializationObject.data = Array.from(this._data);
        }
        return serializationObject;
    }
    /** @internal */
    _deserialize(serializationObject) {
        super._deserialize(serializationObject);
        this._width = serializationObject.width;
        this._height = serializationObject.height;
        if (serializationObject.data) {
            this._data = new Float32Array(serializationObject.data);
            this.serializedCachedData = true;
        }
        else {
            this.serializedCachedData = !!serializationObject.serializedCachedData;
        }
    }
}
let _Registered = false;
/**
 * Register side effects for geometryTextureBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterGeometryTextureBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.GeometryTextureBlock", GeometryTextureBlock);
}
//# sourceMappingURL=geometryTextureBlock.pure.js.map