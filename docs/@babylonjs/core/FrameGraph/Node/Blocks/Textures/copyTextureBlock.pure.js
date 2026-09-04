/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeRenderGraphBlock } from "../../nodeRenderGraphBlock.js";
import { NodeRenderGraphBlockConnectionPointTypes } from "../../Types/nodeRenderGraphTypes.js";
import { FrameGraphCopyToTextureTask } from "../../../Tasks/Texture/copyToTextureTask.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to copy a texture
 */
let NodeRenderGraphCopyTextureBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBlock;
    let _instanceExtraInitializers = [];
    let _get_useCurrentViewport_decorators;
    let _get_useFullScreenViewport_decorators;
    let _get_viewport_decorators;
    let _get_lodLevel_decorators;
    return _a = class NodeRenderGraphCopyTextureBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new NodeRenderGraphCopyTextureBlock
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             */
            constructor(name, frameGraph, scene) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this._useCurrentViewport = false;
                this._useFullScreenViewport = true;
                this._viewport = { x: 0, y: 0, width: 1, height: 1 };
                this.registerInput("source", NodeRenderGraphBlockConnectionPointTypes.AutoDetect);
                this.registerInput("target", NodeRenderGraphBlockConnectionPointTypes.AutoDetect);
                this._addDependenciesInput();
                this.registerOutput("output", NodeRenderGraphBlockConnectionPointTypes.BasedOnInput);
                this.source.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureAllButBackBuffer);
                this.target.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureAll);
                this.output._typeConnectionSource = this.source;
                this._frameGraphTask = new FrameGraphCopyToTextureTask(name, frameGraph);
            }
            _setViewport() {
                if (this._useCurrentViewport) {
                    this._frameGraphTask.viewport = null;
                }
                else if (this._useFullScreenViewport) {
                    this._frameGraphTask.viewport = undefined;
                }
                else {
                    this._frameGraphTask.viewport = this._viewport;
                }
            }
            /** If true, the current viewport will be left unchanged. */
            get useCurrentViewport() {
                return this._useCurrentViewport;
            }
            set useCurrentViewport(value) {
                this._useCurrentViewport = value;
                this._setViewport();
            }
            /** If true, a full screen viewport will be used. */
            get useFullScreenViewport() {
                return this._useFullScreenViewport;
            }
            set useFullScreenViewport(value) {
                this._useFullScreenViewport = value;
                this._setViewport();
            }
            /** The viewport to use. */
            get viewport() {
                return this._viewport;
            }
            set viewport(value) {
                this._viewport = value;
                this._setViewport();
            }
            /** The LOD level to copy from the source texture (default: 0). */
            get lodLevel() {
                return this._frameGraphTask.lodLevel;
            }
            set lodLevel(value) {
                this._frameGraphTask.lodLevel = value;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphCopyTextureBlock";
            }
            /**
             * Gets the source input component
             */
            get source() {
                return this._inputs[0];
            }
            /**
             * Gets the target input component
             */
            get target() {
                return this._inputs[1];
            }
            /**
             * Gets the output component
             */
            get output() {
                return this._outputs[0];
            }
            _buildBlock(state) {
                super._buildBlock(state);
                this.output.value = this._frameGraphTask.outputTexture; // the value of the output connection point is the "output" texture of the task
                this._frameGraphTask.sourceTexture = this.source.connectedPoint?.value;
                this._frameGraphTask.targetTexture = this.target.connectedPoint?.value;
            }
            _dumpPropertiesCode() {
                const codes = [];
                codes.push(`${this._codeVariableName}.viewport = ${this._useCurrentViewport ? "null" : this._useFullScreenViewport ? "undefined" : JSON.stringify(this._viewport)};`);
                codes.push(`${this._codeVariableName}.lodLevel = ${this.lodLevel};`);
                return super._dumpPropertiesCode() + codes.join("\n");
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.useCurrentViewport = this._useCurrentViewport;
                serializationObject.useFullScreenViewport = this._useFullScreenViewport;
                serializationObject.viewport = this._viewport;
                serializationObject.lodLevel = this.lodLevel;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                if (serializationObject.useCurrentViewport !== undefined) {
                    this._useCurrentViewport = serializationObject.useCurrentViewport;
                    this._useFullScreenViewport = serializationObject.useFullScreenViewport;
                    this._viewport = serializationObject.viewport;
                }
                this.lodLevel = serializationObject.lodLevel ?? 0;
                this._setViewport();
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_useCurrentViewport_decorators = [editableInPropertyPage("Use currently active viewport", 0 /* PropertyTypeForEdition.Boolean */, "PROPERTIES")];
            _get_useFullScreenViewport_decorators = [editableInPropertyPage("Use full screen viewport", 0 /* PropertyTypeForEdition.Boolean */, "PROPERTIES")];
            _get_viewport_decorators = [editableInPropertyPage("    Viewport", 13 /* PropertyTypeForEdition.Viewport */, "PROPERTIES")];
            _get_lodLevel_decorators = [editableInPropertyPage("LOD Level", 2 /* PropertyTypeForEdition.Int */, "PROPERTIES", { min: 0, max: 16 })];
            __esDecorate(_a, null, _get_useCurrentViewport_decorators, { kind: "getter", name: "useCurrentViewport", static: false, private: false, access: { has: obj => "useCurrentViewport" in obj, get: obj => obj.useCurrentViewport }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_useFullScreenViewport_decorators, { kind: "getter", name: "useFullScreenViewport", static: false, private: false, access: { has: obj => "useFullScreenViewport" in obj, get: obj => obj.useFullScreenViewport }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_viewport_decorators, { kind: "getter", name: "viewport", static: false, private: false, access: { has: obj => "viewport" in obj, get: obj => obj.viewport }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_lodLevel_decorators, { kind: "getter", name: "lodLevel", static: false, private: false, access: { has: obj => "lodLevel" in obj, get: obj => obj.lodLevel }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphCopyTextureBlock };
let _Registered = false;
/**
 * Register side effects for copyTextureBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterCopyTextureBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphCopyTextureBlock", NodeRenderGraphCopyTextureBlock);
}
//# sourceMappingURL=copyTextureBlock.pure.js.map