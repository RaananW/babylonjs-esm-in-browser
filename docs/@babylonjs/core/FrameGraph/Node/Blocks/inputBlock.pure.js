/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { Observable } from "../../../Misc/observable.pure.js";
import { NodeRenderGraphBlockConnectionPointTypes } from "../Types/nodeRenderGraphTypes.js";
import { NodeRenderGraphBlock } from "../nodeRenderGraphBlock.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { backbufferColorTextureHandle, backbufferDepthStencilTextureHandle } from "../../../FrameGraph/frameGraphTypes.js";

import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to expose an input value
 */
let NodeRenderGraphInputBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBlock;
    let _isExternal_decorators;
    let _isExternal_initializers = [];
    let _isExternal_extraInitializers = [];
    return _a = class NodeRenderGraphInputBlock extends _classSuper {
            /**
             * Gets or sets the connection point type (default is Undefined)
             */
            get type() {
                return this._type;
            }
            /**
             * Creates a new NodeRenderGraphInputBlock
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             * @param type defines the type of the input (can be set to NodeRenderGraphBlockConnectionPointTypes.Undefined)
             */
            constructor(name, frameGraph, scene, type = NodeRenderGraphBlockConnectionPointTypes.Undefined) {
                super(name, frameGraph, scene);
                this._storedValue = null;
                this._type = NodeRenderGraphBlockConnectionPointTypes.Undefined;
                /** Gets an observable raised when the value is changed */
                this.onValueChangedObservable = new Observable();
                /** Indicates that the input is externally managed */
                this.isExternal = __runInitializers(this, _isExternal_initializers, false);
                /** Gets or sets the options to create the input value */
                this.creationOptions = __runInitializers(this, _isExternal_extraInitializers);
                this._type = type;
                this._isInput = true;
                this.registerOutput("output", type);
                this.setDefaultValue();
            }
            /**
             * Set the input block to its default value (based on its type)
             */
            setDefaultValue() {
                switch (this.type) {
                    case NodeRenderGraphBlockConnectionPointTypes.Texture:
                    case NodeRenderGraphBlockConnectionPointTypes.TextureViewDepth:
                    case NodeRenderGraphBlockConnectionPointTypes.TextureScreenDepth:
                    case NodeRenderGraphBlockConnectionPointTypes.TextureNormalizedViewDepth:
                    case NodeRenderGraphBlockConnectionPointTypes.TextureViewNormal:
                    case NodeRenderGraphBlockConnectionPointTypes.TextureWorldNormal:
                    case NodeRenderGraphBlockConnectionPointTypes.TextureAlbedo:
                    case NodeRenderGraphBlockConnectionPointTypes.TextureReflectivity:
                    case NodeRenderGraphBlockConnectionPointTypes.TextureLocalPosition:
                    case NodeRenderGraphBlockConnectionPointTypes.TextureWorldPosition:
                    case NodeRenderGraphBlockConnectionPointTypes.TextureVelocity:
                    case NodeRenderGraphBlockConnectionPointTypes.TextureLinearVelocity:
                    case NodeRenderGraphBlockConnectionPointTypes.TextureIrradiance:
                    case NodeRenderGraphBlockConnectionPointTypes.TextureAlbedoSqrt: {
                        const options = {
                            size: { width: 100, height: 100 },
                            options: {
                                createMipMaps: false,
                                targetTypes: [3553],
                                types: [0],
                                formats: [5],
                                layerCounts: [0],
                                samples: 1,
                                useSRGBBuffers: [false],
                                creationFlags: [0],
                            },
                            sizeIsPercentage: true,
                            isHistoryTexture: false,
                        };
                        this.creationOptions = options;
                        break;
                    }
                    case NodeRenderGraphBlockConnectionPointTypes.TextureDepthStencilAttachment: {
                        const options = {
                            size: { width: 100, height: 100 },
                            options: {
                                createMipMaps: false,
                                targetTypes: [3553],
                                types: [0],
                                formats: [13],
                                layerCounts: [0],
                                useSRGBBuffers: [false],
                                creationFlags: [0],
                                labels: [this.name],
                                samples: 1,
                            },
                            sizeIsPercentage: true,
                            isHistoryTexture: false,
                        };
                        this.creationOptions = options;
                        break;
                    }
                    case NodeRenderGraphBlockConnectionPointTypes.ObjectList:
                        this.value = { meshes: null, particleSystems: null };
                        this.isExternal = true;
                        break;
                    case NodeRenderGraphBlockConnectionPointTypes.Camera:
                        this.value = this._scene.cameras[0];
                        this.isExternal = true;
                        break;
                    default:
                        this.isExternal = true;
                }
            }
            /**
             * Gets or sets the value of that point.
             */
            get value() {
                return this._storedValue;
            }
            set value(value) {
                this._storedValue = value;
                this.output.value = undefined;
                this.onValueChangedObservable.notifyObservers(this);
            }
            /**
             * Gets the value as a specific type
             * @returns the value as a specific type
             */
            getTypedValue() {
                return this._storedValue;
            }
            /**
             * Gets the value as an internal texture
             * @returns The internal texture stored in value if value is an internal texture, otherwise null
             */
            getInternalTextureFromValue() {
                if (this._storedValue._swapAndDie) {
                    return this._storedValue;
                }
                return null;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphInputBlock";
            }
            /**
             * Gets the output component
             */
            get output() {
                return this._outputs[0];
            }
            /**
             * Check if the block is a texture of any type
             * @returns true if the block is a texture
             */
            isAnyTexture() {
                return (this.type & NodeRenderGraphBlockConnectionPointTypes.TextureAll) !== 0;
            }
            /**
             * Gets a boolean indicating that the connection point is the back buffer texture
             * @returns true if the connection point is the back buffer texture
             */
            isBackBuffer() {
                return (this.type & NodeRenderGraphBlockConnectionPointTypes.TextureBackBuffer) !== 0;
            }
            /**
             * Gets a boolean indicating that the connection point is a depth/stencil attachment texture
             * @returns true if the connection point is a depth/stencil attachment texture
             */
            isBackBufferDepthStencilAttachment() {
                return (this.type & NodeRenderGraphBlockConnectionPointTypes.TextureBackBufferDepthStencilAttachment) !== 0;
            }
            /**
             * Check if the block is a camera
             * @returns true if the block is a camera
             */
            isCamera() {
                return (this.type & NodeRenderGraphBlockConnectionPointTypes.Camera) !== 0;
            }
            /**
             * Check if the block is an object list
             * @returns true if the block is an object list
             */
            isObjectList() {
                return (this.type & NodeRenderGraphBlockConnectionPointTypes.ObjectList) !== 0;
            }
            /**
             * Check if the block is a shadow light
             * @returns true if the block is a shadow light
             */
            isShadowLight() {
                return (this.type & NodeRenderGraphBlockConnectionPointTypes.ShadowLight) !== 0;
            }
            _buildBlock(state) {
                super._buildBlock(state);
                if (this.isExternal) {
                    if (this.isBackBuffer()) {
                        this.output.value = backbufferColorTextureHandle;
                    }
                    else if (this.isBackBufferDepthStencilAttachment()) {
                        this.output.value = backbufferDepthStencilTextureHandle;
                    }
                    else if (this.isCamera()) {
                        this.output.value = this.getTypedValue();
                    }
                    else if (this.isObjectList()) {
                        this.output.value = this.getTypedValue();
                    }
                    else if (this.isShadowLight()) {
                        this.output.value = this.getTypedValue();
                    }
                    else {
                        if (this._storedValue === undefined || this._storedValue === null) {
                            throw new Error(`NodeRenderGraphInputBlock: External input "${this.name}" is not set`);
                        }
                        const texture = this.getInternalTextureFromValue();
                        if (texture) {
                            this.output.value = this._frameGraph.textureManager.importTexture(this.name, texture, this.output.value);
                        }
                    }
                    return;
                }
                if ((this.type & NodeRenderGraphBlockConnectionPointTypes.TextureAllButBackBuffer) !== 0) {
                    const textureCreateOptions = this.creationOptions;
                    if (!textureCreateOptions) {
                        throw new Error(`NodeRenderGraphInputBlock: Creation options are missing for texture "${this.name}"`);
                    }
                    this.output.value = this._frameGraph.textureManager.createRenderTargetTexture(this.name, textureCreateOptions);
                }
            }
            dispose() {
                this._storedValue = null;
                this.onValueChangedObservable.clear();
                super.dispose();
            }
            _dumpPropertiesCode() {
                const codes = [];
                codes.push(`${this._codeVariableName}.isExternal = ${this.isExternal};`);
                if (this.isAnyTexture()) {
                    if (!this.isExternal) {
                        codes.push(`${this._codeVariableName}.creationOptions = ${JSON.stringify(this.creationOptions)};`);
                    }
                    else {
                        codes.push(`${this._codeVariableName}.value = EXTERNAL_TEXTURE; // TODO: set the external texture`);
                    }
                }
                else if (this.isCamera()) {
                    codes.push(`${this._codeVariableName}.value = EXTERNAL_CAMERA; // TODO: set the external camera`);
                }
                else if (this.isObjectList()) {
                    codes.push(`${this._codeVariableName}.value = EXTERNAL_OBJECT_LIST; // TODO: set the external object list`);
                }
                else if (this.isShadowLight()) {
                    codes.push(`${this._codeVariableName}.value = EXTERNAL_SHADOW_LIGHT; // TODO: set the external shadow light`);
                }
                return super._dumpPropertiesCode() + codes.join("\n");
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.type = this.type;
                serializationObject.isExternal = this.isExternal;
                if (this.creationOptions) {
                    serializationObject.creationOptions = this.creationOptions;
                }
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this._type = serializationObject.type;
                this.output.type = this._type;
                this.isExternal = serializationObject.isExternal;
                if (serializationObject.creationOptions) {
                    if (serializationObject.creationOptions.options.depthTextureFormat !== undefined) {
                        // Backward compatibility - remove this code in the future
                        serializationObject.creationOptions.options.formats = [serializationObject.creationOptions.options.depthTextureFormat];
                    }
                    this.creationOptions = serializationObject.creationOptions;
                }
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _isExternal_decorators = [editableInPropertyPage("Is external", 0 /* PropertyTypeForEdition.Boolean */, "PROPERTIES")];
            __esDecorate(null, null, _isExternal_decorators, { kind: "field", name: "isExternal", static: false, private: false, access: { has: obj => "isExternal" in obj, get: obj => obj.isExternal, set: (obj, value) => { obj.isExternal = value; } }, metadata: _metadata }, _isExternal_initializers, _isExternal_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphInputBlock };
let _Registered = false;
/**
 * Register side effects for frameGraphNodeBlocksInputBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFrameGraphNodeBlocksInputBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphInputBlock", NodeRenderGraphInputBlock);
}
//# sourceMappingURL=inputBlock.pure.js.map