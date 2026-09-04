/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeRenderGraphBlock } from "../../nodeRenderGraphBlock.js";
import { NodeRenderGraphBlockConnectionPointTypes } from "../../Types/nodeRenderGraphTypes.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { FrameGraphHighlightLayerTask } from "../../../Tasks/Layers/highlightLayerTask.js";

import { NodeRenderGraphConnectionPointCustomObject } from "../../nodeRenderGraphConnectionPointCustomObject.js";
import { NodeRenderGraphBaseObjectRendererBlock } from "../Rendering/baseObjectRendererBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that implements the highlight layer
 */
let NodeRenderGraphHighlightLayerBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBlock;
    let _instanceExtraInitializers = [];
    let _get_layerTextureRatio_decorators;
    let _get_layerTextureFixedSize_decorators;
    let _get_blurTextureSizeRatio_decorators;
    let _get_isStroke_decorators;
    let _get_layerTextureType_decorators;
    let _get_blurHorizontalSize_decorators;
    let _get_blurVerticalSize_decorators;
    return _a = class NodeRenderGraphHighlightLayerBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new NodeRenderGraphHighlightLayerBlock
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             * @param layerTextureRatio multiplication factor applied to the main texture size to compute the size of the layer render target texture (default: 0.5)
             * @param layerTextureFixedSize defines the fixed size of the layer render target texture. Takes precedence over layerTextureRatio if provided (default: undefined)
             * @param blurTextureSizeRatio defines the factor to apply to the layer texture size to create the blur textures (default: 0.5)
             * @param isStroke should we display highlight as a solid stroke? (default: false)
             * @param layerTextureType defines the type of the layer texture (default: 0)
             */
            constructor(name, frameGraph, scene, layerTextureRatio = 0.5, layerTextureFixedSize, blurTextureSizeRatio = 0.5, isStroke = false, layerTextureType = 0) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this._additionalConstructionParameters = [layerTextureRatio, layerTextureFixedSize, blurTextureSizeRatio, isStroke, layerTextureType];
                this.registerInput("target", NodeRenderGraphBlockConnectionPointTypes.AutoDetect);
                this.registerInput("layer", NodeRenderGraphBlockConnectionPointTypes.AutoDetect, true);
                this.registerInput("objectRenderer", NodeRenderGraphBlockConnectionPointTypes.Object, true, new NodeRenderGraphConnectionPointCustomObject("objectRenderer", this, 0 /* NodeRenderGraphConnectionPointDirection.Input */, NodeRenderGraphBaseObjectRendererBlock, "NodeRenderGraphBaseObjectRendererBlock"));
                this._addDependenciesInput();
                this.registerOutput("output", NodeRenderGraphBlockConnectionPointTypes.BasedOnInput);
                this.target.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureAllButBackBufferDepthStencil);
                this.layer.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureAllButBackBuffer);
                this.output._typeConnectionSource = this.target;
                this._frameGraphTask = new FrameGraphHighlightLayerTask(this.name, this._frameGraph, this._scene, {
                    mainTextureRatio: layerTextureRatio,
                    mainTextureFixedSize: layerTextureFixedSize,
                    blurTextureSizeRatio,
                    isStroke,
                    mainTextureType: layerTextureType,
                });
            }
            _createTask(layerTextureRatio, layerTextureFixedSize, blurTextureSizeRatio, isStroke, layerTextureType) {
                const blurHorizontalSize = this.blurHorizontalSize;
                const blurVerticalSize = this.blurVerticalSize;
                this._frameGraphTask?.dispose();
                this._frameGraphTask = new FrameGraphHighlightLayerTask(this.name, this._frameGraph, this._scene, {
                    mainTextureRatio: layerTextureRatio,
                    mainTextureFixedSize: layerTextureFixedSize,
                    blurTextureSizeRatio,
                    isStroke,
                    mainTextureType: layerTextureType,
                });
                this.blurHorizontalSize = blurHorizontalSize;
                this.blurVerticalSize = blurVerticalSize;
                this._additionalConstructionParameters = [layerTextureRatio, layerTextureFixedSize, blurTextureSizeRatio, isStroke, layerTextureType];
            }
            /** Multiplication factor applied to the main texture size to compute the size of the layer render target texture */
            get layerTextureRatio() {
                return this._frameGraphTask.layer._options.mainTextureRatio;
            }
            set layerTextureRatio(value) {
                const options = this._frameGraphTask.layer._options;
                this._createTask(value, options.mainTextureFixedSize, options.blurTextureSizeRatio, options.isStroke, options.mainTextureType);
            }
            /** Defines the fixed size of the layer render target texture. Takes precedence over layerTextureRatio if provided */
            get layerTextureFixedSize() {
                return this._frameGraphTask.layer._options.mainTextureFixedSize;
            }
            set layerTextureFixedSize(value) {
                const options = this._frameGraphTask.layer._options;
                this._createTask(options.mainTextureRatio, value, options.blurTextureSizeRatio, options.isStroke, options.mainTextureType);
            }
            /** Defines the factor to apply to the layer texture size to create the blur textures */
            get blurTextureSizeRatio() {
                return this._frameGraphTask.layer._options.blurTextureSizeRatio;
            }
            set blurTextureSizeRatio(value) {
                const options = this._frameGraphTask.layer._options;
                this._createTask(options.mainTextureRatio, options.mainTextureFixedSize, value, options.isStroke, options.mainTextureType);
            }
            /** Should we display highlight as a solid stroke? */
            get isStroke() {
                return this._frameGraphTask.layer._options.isStroke;
            }
            set isStroke(value) {
                const options = this._frameGraphTask.layer._options;
                this._createTask(options.mainTextureRatio, options.mainTextureFixedSize, options.blurTextureSizeRatio, value, options.mainTextureType);
            }
            /** Defines the type of the layer texture */
            get layerTextureType() {
                return this._frameGraphTask.layer._options.mainTextureType;
            }
            set layerTextureType(value) {
                const options = this._frameGraphTask.layer._options;
                this._createTask(options.mainTextureRatio, options.mainTextureFixedSize, options.blurTextureSizeRatio, options.isStroke, value);
            }
            /** How big is the horizontal kernel of the blur texture */
            get blurHorizontalSize() {
                return this._frameGraphTask.layer.blurHorizontalSize;
            }
            set blurHorizontalSize(value) {
                this._frameGraphTask.layer.blurHorizontalSize = value;
            }
            /** How big is the vertical kernel of the blur texture */
            get blurVerticalSize() {
                return this._frameGraphTask.layer.blurVerticalSize;
            }
            set blurVerticalSize(value) {
                this._frameGraphTask.layer.blurVerticalSize = value;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphHighlightLayerBlock";
            }
            /**
             * Gets the target texture input component
             */
            get target() {
                return this._inputs[0];
            }
            /**
             * Gets the layer input component
             */
            get layer() {
                return this._inputs[1];
            }
            /**
             * Gets the objectRenderer input component
             */
            get objectRenderer() {
                return this._inputs[2];
            }
            /**
             * Gets the output component
             */
            get output() {
                return this._outputs[0];
            }
            _buildBlock(state) {
                super._buildBlock(state);
                this.output.value = this._frameGraphTask.outputTexture;
                this._frameGraphTask.targetTexture = this.target.connectedPoint?.value;
                this._frameGraphTask.layerTexture = this.layer.connectedPoint?.value;
                this._frameGraphTask.objectRendererTask = this.objectRenderer.connectedPoint?.value;
            }
            _dumpPropertiesCode() {
                const codes = [];
                codes.push(`${this._codeVariableName}.blurHorizontalSize = ${this.blurHorizontalSize};`);
                codes.push(`${this._codeVariableName}.blurVerticalSize = ${this.blurVerticalSize};`);
                return super._dumpPropertiesCode() + codes.join("\n");
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.blurHorizontalSize = this.blurHorizontalSize;
                serializationObject.blurVerticalSize = this.blurVerticalSize;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.blurHorizontalSize = serializationObject.blurHorizontalSize;
                this.blurVerticalSize = serializationObject.blurVerticalSize;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_layerTextureRatio_decorators = [editableInPropertyPage("Layer texture ratio", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES")];
            _get_layerTextureFixedSize_decorators = [editableInPropertyPage("Layer texture fixed size", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES")];
            _get_blurTextureSizeRatio_decorators = [editableInPropertyPage("Blur texture size ratio", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES")];
            _get_isStroke_decorators = [editableInPropertyPage("Is stroke", 0 /* PropertyTypeForEdition.Boolean */, "PROPERTIES")];
            _get_layerTextureType_decorators = [editableInPropertyPage("Layer texture type", 10 /* PropertyTypeForEdition.TextureType */, "PROPERTIES")];
            _get_blurHorizontalSize_decorators = [editableInPropertyPage("Blur horizontal size", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES", { min: 0, max: 4 })];
            _get_blurVerticalSize_decorators = [editableInPropertyPage("Blur vertical size", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES", { min: 0, max: 4 })];
            __esDecorate(_a, null, _get_layerTextureRatio_decorators, { kind: "getter", name: "layerTextureRatio", static: false, private: false, access: { has: obj => "layerTextureRatio" in obj, get: obj => obj.layerTextureRatio }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_layerTextureFixedSize_decorators, { kind: "getter", name: "layerTextureFixedSize", static: false, private: false, access: { has: obj => "layerTextureFixedSize" in obj, get: obj => obj.layerTextureFixedSize }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_blurTextureSizeRatio_decorators, { kind: "getter", name: "blurTextureSizeRatio", static: false, private: false, access: { has: obj => "blurTextureSizeRatio" in obj, get: obj => obj.blurTextureSizeRatio }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_isStroke_decorators, { kind: "getter", name: "isStroke", static: false, private: false, access: { has: obj => "isStroke" in obj, get: obj => obj.isStroke }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_layerTextureType_decorators, { kind: "getter", name: "layerTextureType", static: false, private: false, access: { has: obj => "layerTextureType" in obj, get: obj => obj.layerTextureType }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_blurHorizontalSize_decorators, { kind: "getter", name: "blurHorizontalSize", static: false, private: false, access: { has: obj => "blurHorizontalSize" in obj, get: obj => obj.blurHorizontalSize }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_blurVerticalSize_decorators, { kind: "getter", name: "blurVerticalSize", static: false, private: false, access: { has: obj => "blurVerticalSize" in obj, get: obj => obj.blurVerticalSize }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphHighlightLayerBlock };
let _Registered = false;
/**
 * Register side effects for highlightLayerBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterHighlightLayerBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphHighlightLayerBlock", NodeRenderGraphHighlightLayerBlock);
}
//# sourceMappingURL=highlightLayerBlock.pure.js.map