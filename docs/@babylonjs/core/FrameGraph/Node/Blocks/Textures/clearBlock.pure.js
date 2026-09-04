/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeRenderGraphBlock } from "../../nodeRenderGraphBlock.js";
import { NodeRenderGraphBlockConnectionPointTypes } from "../../Types/nodeRenderGraphTypes.js";
import { Color4 } from "../../../../Maths/math.color.pure.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { FrameGraphClearTextureTask } from "../../../Tasks/Texture/clearTextureTask.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to clear a texture
 */
let NodeRenderGraphClearBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBlock;
    let _instanceExtraInitializers = [];
    let _get_color_decorators;
    let _get_clearColor_decorators;
    let _get_convertColorToLinearSpace_decorators;
    let _get_clearDepth_decorators;
    let _get_clearStencil_decorators;
    return _a = class NodeRenderGraphClearBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new NodeRenderGraphClearBlock
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             */
            constructor(name, frameGraph, scene) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this.registerInput("target", NodeRenderGraphBlockConnectionPointTypes.AutoDetect, true);
                this.registerInput("depth", NodeRenderGraphBlockConnectionPointTypes.AutoDetect, true);
                this._addDependenciesInput();
                this.registerOutput("output", NodeRenderGraphBlockConnectionPointTypes.BasedOnInput);
                this.registerOutput("outputDepth", NodeRenderGraphBlockConnectionPointTypes.BasedOnInput);
                this.target.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureAll | NodeRenderGraphBlockConnectionPointTypes.ResourceContainer);
                this.depth.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureDepthStencilAttachment | NodeRenderGraphBlockConnectionPointTypes.TextureBackBufferDepthStencilAttachment);
                this.output._typeConnectionSource = this.target;
                this.outputDepth._typeConnectionSource = this.depth;
                this._frameGraphTask = new FrameGraphClearTextureTask(name, frameGraph);
            }
            /** Gets or sets the clear color */
            get color() {
                return this._frameGraphTask.color;
            }
            set color(value) {
                this._frameGraphTask.color = value;
            }
            /** Gets or sets a boolean indicating whether the color part of the texture should be cleared. */
            get clearColor() {
                return !!this._frameGraphTask.clearColor;
            }
            set clearColor(value) {
                this._frameGraphTask.clearColor = value;
            }
            /** Gets or sets a boolean indicating whether the color should be converted to linear space. */
            get convertColorToLinearSpace() {
                return !!this._frameGraphTask.convertColorToLinearSpace;
            }
            set convertColorToLinearSpace(value) {
                this._frameGraphTask.convertColorToLinearSpace = value;
            }
            /** Gets or sets a boolean indicating whether the depth part of the texture should be cleared. */
            get clearDepth() {
                return !!this._frameGraphTask.clearDepth;
            }
            set clearDepth(value) {
                this._frameGraphTask.clearDepth = value;
            }
            /** Gets or sets a boolean indicating whether the stencil part of the texture should be cleared. */
            get clearStencil() {
                return !!this._frameGraphTask.clearStencil;
            }
            set clearStencil(value) {
                this._frameGraphTask.clearStencil = value;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphClearBlock";
            }
            /**
             * Gets the target input component
             */
            get target() {
                return this._inputs[0];
            }
            /**
             * Gets the depth texture input component
             */
            get depth() {
                return this._inputs[1];
            }
            /**
             * Gets the output component
             */
            get output() {
                return this._outputs[0];
            }
            /**
             * Gets the output depth component
             */
            get outputDepth() {
                return this._outputs[1];
            }
            _buildBlock(state) {
                super._buildBlock(state);
                this.output.value = this._frameGraphTask.outputTexture;
                this.outputDepth.value = this._frameGraphTask.outputDepthTexture;
                this._frameGraphTask.targetTexture = this._getConnectedTextures(this.target.connectedPoint);
                this._frameGraphTask.depthTexture = this.depth.connectedPoint?.value;
            }
            _dumpPropertiesCode() {
                const codes = [];
                codes.push(`${this._codeVariableName}.color = new BABYLON.Color4(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a});`);
                codes.push(`${this._codeVariableName}.clearColor = ${this.clearColor};`);
                codes.push(`${this._codeVariableName}.convertColorToLinearSpace = ${this.convertColorToLinearSpace};`);
                codes.push(`${this._codeVariableName}.clearDepth = ${this.clearDepth};`);
                codes.push(`${this._codeVariableName}.clearStencil = ${this.clearStencil};`);
                return super._dumpPropertiesCode() + codes.join("\n");
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.color = this.color.asArray();
                serializationObject.clearColor = this.clearColor;
                serializationObject.convertColorToLinearSpace = this.convertColorToLinearSpace;
                serializationObject.clearDepth = this.clearDepth;
                serializationObject.clearStencil = this.clearStencil;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.color = Color4.FromArray(serializationObject.color);
                this.clearColor = serializationObject.clearColor;
                this.convertColorToLinearSpace = !!serializationObject.convertColorToLinearSpace;
                this.clearDepth = serializationObject.clearDepth;
                this.clearStencil = serializationObject.clearStencil;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_color_decorators = [editableInPropertyPage("Color", 7 /* PropertyTypeForEdition.Color4 */)];
            _get_clearColor_decorators = [editableInPropertyPage("Clear color", 0 /* PropertyTypeForEdition.Boolean */, undefined, { embedded: true })];
            _get_convertColorToLinearSpace_decorators = [editableInPropertyPage("Convert color to linear space", 0 /* PropertyTypeForEdition.Boolean */)];
            _get_clearDepth_decorators = [editableInPropertyPage("Clear depth", 0 /* PropertyTypeForEdition.Boolean */, undefined, { embedded: true })];
            _get_clearStencil_decorators = [editableInPropertyPage("Clear stencil", 0 /* PropertyTypeForEdition.Boolean */, undefined, { embedded: true })];
            __esDecorate(_a, null, _get_color_decorators, { kind: "getter", name: "color", static: false, private: false, access: { has: obj => "color" in obj, get: obj => obj.color }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_clearColor_decorators, { kind: "getter", name: "clearColor", static: false, private: false, access: { has: obj => "clearColor" in obj, get: obj => obj.clearColor }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_convertColorToLinearSpace_decorators, { kind: "getter", name: "convertColorToLinearSpace", static: false, private: false, access: { has: obj => "convertColorToLinearSpace" in obj, get: obj => obj.convertColorToLinearSpace }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_clearDepth_decorators, { kind: "getter", name: "clearDepth", static: false, private: false, access: { has: obj => "clearDepth" in obj, get: obj => obj.clearDepth }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_clearStencil_decorators, { kind: "getter", name: "clearStencil", static: false, private: false, access: { has: obj => "clearStencil" in obj, get: obj => obj.clearStencil }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphClearBlock };
let _Registered = false;
/**
 * Register side effects for clearBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterClearBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphClearBlock", NodeRenderGraphClearBlock);
}
//# sourceMappingURL=clearBlock.pure.js.map