/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeRenderGraphBlock } from "../../nodeRenderGraphBlock.js";
import { NodeRenderGraphBlockConnectionPointTypes } from "../../Types/nodeRenderGraphTypes.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { FrameGraphSelectionOutlineLayerTask } from "../../../Tasks/Layers/selectionOutlineTask.js";

import { NodeRenderGraphConnectionPointCustomObject } from "../../nodeRenderGraphConnectionPointCustomObject.js";
import { NodeRenderGraphBaseObjectRendererBlock } from "../Rendering/baseObjectRendererBlock.js";
import { Color3 } from "../../../../Maths/math.color.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that implements the selection outline layer
 */
let NodeRenderGraphSelectionOutlineLayerBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBlock;
    let _instanceExtraInitializers = [];
    let _get_layerTextureRatio_decorators;
    let _get_layerTextureFixedSize_decorators;
    let _get_layerTextureType_decorators;
    let _get_outlineColor_decorators;
    let _get_outlineThickness_decorators;
    let _get_occlusionStrength_decorators;
    let _get_occlusionThreshold_decorators;
    let _get_useDepthOcclusion_decorators;
    return _a = class NodeRenderGraphSelectionOutlineLayerBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new NodeRenderGraphSelectionOutlineLayerBlock
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             * @param layerTextureRatio multiplication factor applied to the main texture size to compute the size of the layer render target texture (default: 1.0)
             * @param layerTextureFixedSize defines the fixed size of the layer render target texture. Takes precedence over layerTextureRatio if provided (default: undefined)
             * @param layerTextureType defines the type of the layer texture (default: 2)
             */
            constructor(name, frameGraph, scene, layerTextureRatio = 1.0, layerTextureFixedSize, layerTextureType = 2) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this._additionalConstructionParameters = [layerTextureRatio, layerTextureFixedSize, layerTextureType];
                this.registerInput("target", NodeRenderGraphBlockConnectionPointTypes.AutoDetect);
                this.registerInput("layer", NodeRenderGraphBlockConnectionPointTypes.AutoDetect, true);
                this.registerInput("objectRenderer", NodeRenderGraphBlockConnectionPointTypes.Object, false, new NodeRenderGraphConnectionPointCustomObject("objectRenderer", this, 0 /* NodeRenderGraphConnectionPointDirection.Input */, NodeRenderGraphBaseObjectRendererBlock, "NodeRenderGraphBaseObjectRendererBlock"));
                this.registerInput("depth", NodeRenderGraphBlockConnectionPointTypes.AutoDetect, true);
                this.depth.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureViewDepth | NodeRenderGraphBlockConnectionPointTypes.TextureNormalizedViewDepth);
                this._addDependenciesInput();
                this.registerOutput("output", NodeRenderGraphBlockConnectionPointTypes.BasedOnInput);
                this.target.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureAllButBackBufferDepthStencil);
                this.layer.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureAllButBackBuffer);
                this.output._typeConnectionSource = this.target;
                this._frameGraphTask = new FrameGraphSelectionOutlineLayerTask(this.name, this._frameGraph, this._scene, {
                    mainTextureRatio: layerTextureRatio,
                    mainTextureFixedSize: layerTextureFixedSize,
                    mainTextureType: layerTextureType,
                });
            }
            _createTask(layerTextureRatio, layerTextureFixedSize, layerTextureType) {
                const outlineColor = this.outlineColor;
                const outlineThickness = this.outlineThickness;
                const occlusionStrength = this.occlusionStrength;
                const occlusionThreshold = this.occlusionThreshold;
                const useDepthOcclusion = this.useDepthOcclusion;
                this._frameGraphTask?.dispose();
                this._frameGraphTask = new FrameGraphSelectionOutlineLayerTask(this.name, this._frameGraph, this._scene, {
                    mainTextureRatio: layerTextureRatio,
                    mainTextureFixedSize: layerTextureFixedSize,
                    mainTextureType: layerTextureType,
                });
                this.outlineColor = outlineColor;
                this.outlineThickness = outlineThickness;
                this.occlusionStrength = occlusionStrength;
                this.occlusionThreshold = occlusionThreshold;
                this.useDepthOcclusion = useDepthOcclusion;
                this._additionalConstructionParameters = [layerTextureRatio, layerTextureFixedSize, layerTextureType];
            }
            /** Multiplication factor applied to the main texture size to compute the size of the layer render target texture */
            get layerTextureRatio() {
                return this._frameGraphTask.layer._options.mainTextureRatio;
            }
            set layerTextureRatio(value) {
                const options = this._frameGraphTask.layer._options;
                this._createTask(value, options.mainTextureFixedSize, options.mainTextureType);
            }
            /** Defines the fixed size of the layer render target texture. Takes precedence over layerTextureRatio if provided */
            get layerTextureFixedSize() {
                return this._frameGraphTask.layer._options.mainTextureFixedSize;
            }
            set layerTextureFixedSize(value) {
                const options = this._frameGraphTask.layer._options;
                this._createTask(options.mainTextureRatio, value, options.mainTextureType);
            }
            /** Defines the type of the layer texture */
            get layerTextureType() {
                return this._frameGraphTask.layer._options.mainTextureType;
            }
            set layerTextureType(value) {
                const options = this._frameGraphTask.layer._options;
                this._createTask(options.mainTextureRatio, options.mainTextureFixedSize, value);
            }
            /** The outline color */
            get outlineColor() {
                return this._frameGraphTask.layer.outlineColor;
            }
            set outlineColor(value) {
                this._frameGraphTask.layer.outlineColor = value;
            }
            /** The thickness of the edges */
            get outlineThickness() {
                return this._frameGraphTask.layer.outlineThickness;
            }
            set outlineThickness(value) {
                this._frameGraphTask.layer.outlineThickness = value;
            }
            /** The strength of the occlusion effect */
            get occlusionStrength() {
                return this._frameGraphTask.layer.occlusionStrength;
            }
            set occlusionStrength(value) {
                this._frameGraphTask.layer.occlusionStrength = value;
            }
            /** The occlusion threshold */
            get occlusionThreshold() {
                return this._frameGraphTask.layer.occlusionThreshold;
            }
            set occlusionThreshold(value) {
                this._frameGraphTask.layer.occlusionThreshold = value;
            }
            /** Whether to use depth when drawing selection outlines */
            get useDepthOcclusion() {
                return this._frameGraphTask.layer.useDepthOcclusion;
            }
            set useDepthOcclusion(value) {
                this._frameGraphTask.layer.useDepthOcclusion = value;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphSelectionOutlineLayerBlock";
            }
            /**
             * Gets the target texture input component
             */
            get target() {
                return this._inputs[0];
            }
            /**
             * Gets the layer texture input component
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
             * Gets the depth input component
             */
            get depth() {
                return this._inputs[3];
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
                this._frameGraphTask.depthTexture = this.depth.connectedPoint?.value;
            }
            _dumpPropertiesCode() {
                const codes = [];
                codes.push(`${this._codeVariableName}.outlineColor = new BABYLON.Color3(${this.outlineColor.r}, ${this.outlineColor.g}, ${this.outlineColor.b});`);
                codes.push(`${this._codeVariableName}.outlineThickness = ${this.outlineThickness};`);
                codes.push(`${this._codeVariableName}.occlusionStrength = ${this.occlusionStrength};`);
                codes.push(`${this._codeVariableName}.occlusionThreshold = ${this.occlusionThreshold};`);
                codes.push(`${this._codeVariableName}.useDepthOcclusion = ${this.useDepthOcclusion};`);
                return super._dumpPropertiesCode() + codes.join("\n");
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.outlineColor = this.outlineColor.asArray();
                serializationObject.outlineThickness = this.outlineThickness;
                serializationObject.occlusionStrength = this.occlusionStrength;
                serializationObject.occlusionThreshold = this.occlusionThreshold;
                serializationObject.useDepthOcclusion = this.useDepthOcclusion;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.outlineColor = Color3.FromArray(serializationObject.outlineColor);
                this.outlineThickness = serializationObject.outlineThickness;
                this.occlusionStrength = serializationObject.occlusionStrength;
                this.occlusionThreshold = serializationObject.occlusionThreshold;
                this.useDepthOcclusion = serializationObject.useDepthOcclusion ?? true;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_layerTextureRatio_decorators = [editableInPropertyPage("Layer texture ratio", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES")];
            _get_layerTextureFixedSize_decorators = [editableInPropertyPage("Layer texture fixed size", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES")];
            _get_layerTextureType_decorators = [editableInPropertyPage("Layer texture type", 10 /* PropertyTypeForEdition.TextureType */, "PROPERTIES")];
            _get_outlineColor_decorators = [editableInPropertyPage("Outline color", 6 /* PropertyTypeForEdition.Color3 */, "PROPERTIES")];
            _get_outlineThickness_decorators = [editableInPropertyPage("Outline thickness", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES", { min: 0, max: 30 })];
            _get_occlusionStrength_decorators = [editableInPropertyPage("Occlusion strength", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES", { min: 0, max: 1 })];
            _get_occlusionThreshold_decorators = [editableInPropertyPage("Occlusion threshold", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES", { min: 0, max: 1 })];
            _get_useDepthOcclusion_decorators = [editableInPropertyPage("Use depth occlusion", 0 /* PropertyTypeForEdition.Boolean */, "PROPERTIES")];
            __esDecorate(_a, null, _get_layerTextureRatio_decorators, { kind: "getter", name: "layerTextureRatio", static: false, private: false, access: { has: obj => "layerTextureRatio" in obj, get: obj => obj.layerTextureRatio }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_layerTextureFixedSize_decorators, { kind: "getter", name: "layerTextureFixedSize", static: false, private: false, access: { has: obj => "layerTextureFixedSize" in obj, get: obj => obj.layerTextureFixedSize }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_layerTextureType_decorators, { kind: "getter", name: "layerTextureType", static: false, private: false, access: { has: obj => "layerTextureType" in obj, get: obj => obj.layerTextureType }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_outlineColor_decorators, { kind: "getter", name: "outlineColor", static: false, private: false, access: { has: obj => "outlineColor" in obj, get: obj => obj.outlineColor }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_outlineThickness_decorators, { kind: "getter", name: "outlineThickness", static: false, private: false, access: { has: obj => "outlineThickness" in obj, get: obj => obj.outlineThickness }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_occlusionStrength_decorators, { kind: "getter", name: "occlusionStrength", static: false, private: false, access: { has: obj => "occlusionStrength" in obj, get: obj => obj.occlusionStrength }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_occlusionThreshold_decorators, { kind: "getter", name: "occlusionThreshold", static: false, private: false, access: { has: obj => "occlusionThreshold" in obj, get: obj => obj.occlusionThreshold }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_useDepthOcclusion_decorators, { kind: "getter", name: "useDepthOcclusion", static: false, private: false, access: { has: obj => "useDepthOcclusion" in obj, get: obj => obj.useDepthOcclusion }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphSelectionOutlineLayerBlock };
let _Registered = false;
/**
 * Register side effects for selectionOutlineLayerBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterSelectionOutlineLayerBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphSelectionOutlineLayerBlock", NodeRenderGraphSelectionOutlineLayerBlock);
}
//# sourceMappingURL=selectionOutlineLayerBlock.pure.js.map