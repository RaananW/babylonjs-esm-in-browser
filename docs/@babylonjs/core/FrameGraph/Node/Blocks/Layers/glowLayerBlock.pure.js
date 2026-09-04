/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeRenderGraphBlock } from "../../nodeRenderGraphBlock.js";
import { NodeRenderGraphBlockConnectionPointTypes } from "../../Types/nodeRenderGraphTypes.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { FrameGraphGlowLayerTask } from "../../../Tasks/Layers/glowLayerTask.js";

import { NodeRenderGraphConnectionPointCustomObject } from "../../nodeRenderGraphConnectionPointCustomObject.js";
import { NodeRenderGraphBaseObjectRendererBlock } from "../Rendering/baseObjectRendererBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that implements the glow layer
 */
let NodeRenderGraphGlowLayerBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBlock;
    let _instanceExtraInitializers = [];
    let _get_ldrMerge_decorators;
    let _get_layerTextureRatio_decorators;
    let _get_layerTextureFixedSize_decorators;
    let _get_layerTextureType_decorators;
    let _get_blurKernelSize_decorators;
    let _get_intensity_decorators;
    return _a = class NodeRenderGraphGlowLayerBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new NodeRenderGraphGlowLayerBlock
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             * @param ldrMerge Forces the merge step to be done in ldr (clamp values &gt; 1). Default: false
             * @param layerTextureRatio multiplication factor applied to the main texture size to compute the size of the layer render target texture (default: 0.5)
             * @param layerTextureFixedSize defines the fixed size of the layer render target texture. Takes precedence over layerTextureRatio if provided (default: undefined)
             * @param layerTextureType defines the type of the layer texture (default: 0)
             */
            constructor(name, frameGraph, scene, ldrMerge = false, layerTextureRatio = 0.5, layerTextureFixedSize, layerTextureType = 0) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this._additionalConstructionParameters = [ldrMerge, layerTextureRatio, layerTextureFixedSize, layerTextureType];
                this.registerInput("target", NodeRenderGraphBlockConnectionPointTypes.AutoDetect);
                this.registerInput("layer", NodeRenderGraphBlockConnectionPointTypes.AutoDetect, true);
                this.registerInput("objectRenderer", NodeRenderGraphBlockConnectionPointTypes.Object, false, new NodeRenderGraphConnectionPointCustomObject("objectRenderer", this, 0 /* NodeRenderGraphConnectionPointDirection.Input */, NodeRenderGraphBaseObjectRendererBlock, "NodeRenderGraphBaseObjectRendererBlock"));
                this._addDependenciesInput();
                this.registerOutput("output", NodeRenderGraphBlockConnectionPointTypes.BasedOnInput);
                this.target.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureAllButBackBufferDepthStencil);
                this.layer.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureAllButBackBuffer);
                this.output._typeConnectionSource = this.target;
                this._frameGraphTask = new FrameGraphGlowLayerTask(this.name, this._frameGraph, this._scene, {
                    ldrMerge,
                    mainTextureRatio: layerTextureRatio,
                    mainTextureFixedSize: layerTextureFixedSize,
                    mainTextureType: layerTextureType,
                });
            }
            _createTask(ldrMerge, layerTextureRatio, layerTextureFixedSize, layerTextureType) {
                const blurKernelSize = this.blurKernelSize;
                const intensity = this.intensity;
                this._frameGraphTask?.dispose();
                this._frameGraphTask = new FrameGraphGlowLayerTask(this.name, this._frameGraph, this._scene, {
                    ldrMerge,
                    mainTextureRatio: layerTextureRatio,
                    mainTextureFixedSize: layerTextureFixedSize,
                    mainTextureType: layerTextureType,
                });
                this.blurKernelSize = blurKernelSize;
                this.intensity = intensity;
                this._additionalConstructionParameters = [ldrMerge, layerTextureRatio, layerTextureFixedSize, layerTextureType];
            }
            /** Forces the merge step to be done in ldr (clamp values &gt; 1). Default: false */
            get ldrMerge() {
                return this._frameGraphTask.layer.ldrMerge;
            }
            set ldrMerge(value) {
                const options = this._frameGraphTask.layer._options;
                this._createTask(value, options.mainTextureRatio, options.mainTextureFixedSize, options.mainTextureType);
            }
            /** Multiplication factor applied to the main texture size to compute the size of the layer render target texture */
            get layerTextureRatio() {
                return this._frameGraphTask.layer._options.mainTextureRatio;
            }
            set layerTextureRatio(value) {
                const options = this._frameGraphTask.layer._options;
                this._createTask(options.ldrMerge, value, options.mainTextureFixedSize, options.mainTextureType);
            }
            /** Defines the fixed size of the layer render target texture. Takes precedence over layerTextureRatio if provided */
            get layerTextureFixedSize() {
                return this._frameGraphTask.layer._options.mainTextureFixedSize;
            }
            set layerTextureFixedSize(value) {
                const options = this._frameGraphTask.layer._options;
                this._createTask(options.ldrMerge, options.mainTextureRatio, value, options.mainTextureType);
            }
            /** Defines the type of the layer texture */
            get layerTextureType() {
                return this._frameGraphTask.layer._options.mainTextureType;
            }
            set layerTextureType(value) {
                const options = this._frameGraphTask.layer._options;
                this._createTask(options.ldrMerge, options.mainTextureRatio, options.mainTextureFixedSize, value);
            }
            /** How big is the kernel of the blur texture */
            get blurKernelSize() {
                return this._frameGraphTask.layer.blurKernelSize;
            }
            set blurKernelSize(value) {
                this._frameGraphTask.layer.blurKernelSize = value;
            }
            /** The intensity of the glow */
            get intensity() {
                return this._frameGraphTask.layer.intensity;
            }
            set intensity(value) {
                this._frameGraphTask.layer.intensity = value;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphGlowLayerBlock";
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
                codes.push(`${this._codeVariableName}.blurKernelSize = ${this.blurKernelSize};`);
                codes.push(`${this._codeVariableName}.intensity = ${this.intensity};`);
                return super._dumpPropertiesCode() + codes.join("\n");
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.blurKernelSize = this.blurKernelSize;
                serializationObject.intensity = this.intensity;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.blurKernelSize = serializationObject.blurKernelSize;
                this.intensity = serializationObject.intensity;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_ldrMerge_decorators = [editableInPropertyPage("LDR merge", 0 /* PropertyTypeForEdition.Boolean */, "PROPERTIES")];
            _get_layerTextureRatio_decorators = [editableInPropertyPage("Layer texture ratio", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES")];
            _get_layerTextureFixedSize_decorators = [editableInPropertyPage("Layer texture fixed size", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES")];
            _get_layerTextureType_decorators = [editableInPropertyPage("Layer texture type", 10 /* PropertyTypeForEdition.TextureType */, "PROPERTIES")];
            _get_blurKernelSize_decorators = [editableInPropertyPage("Blur kernel size", 2 /* PropertyTypeForEdition.Int */, "PROPERTIES", { min: 1, max: 256 })];
            _get_intensity_decorators = [editableInPropertyPage("Intensity", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES", { min: 0, max: 5 })];
            __esDecorate(_a, null, _get_ldrMerge_decorators, { kind: "getter", name: "ldrMerge", static: false, private: false, access: { has: obj => "ldrMerge" in obj, get: obj => obj.ldrMerge }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_layerTextureRatio_decorators, { kind: "getter", name: "layerTextureRatio", static: false, private: false, access: { has: obj => "layerTextureRatio" in obj, get: obj => obj.layerTextureRatio }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_layerTextureFixedSize_decorators, { kind: "getter", name: "layerTextureFixedSize", static: false, private: false, access: { has: obj => "layerTextureFixedSize" in obj, get: obj => obj.layerTextureFixedSize }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_layerTextureType_decorators, { kind: "getter", name: "layerTextureType", static: false, private: false, access: { has: obj => "layerTextureType" in obj, get: obj => obj.layerTextureType }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_blurKernelSize_decorators, { kind: "getter", name: "blurKernelSize", static: false, private: false, access: { has: obj => "blurKernelSize" in obj, get: obj => obj.blurKernelSize }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_intensity_decorators, { kind: "getter", name: "intensity", static: false, private: false, access: { has: obj => "intensity" in obj, get: obj => obj.intensity }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphGlowLayerBlock };
let _Registered = false;
/**
 * Register side effects for glowLayerBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterGlowLayerBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphGlowLayerBlock", NodeRenderGraphGlowLayerBlock);
}
//# sourceMappingURL=glowLayerBlock.pure.js.map