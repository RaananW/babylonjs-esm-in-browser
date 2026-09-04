/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { NodeRenderGraphBlockConnectionPointTypes } from "../../Types/nodeRenderGraphTypes.js";
import { NodeRenderGraphBlock } from "../../nodeRenderGraphBlock.js";
import { FrameGraphUtilityLayerRendererTask } from "../../../Tasks/Rendering/utilityLayerRendererTask.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to render an utility layer in the frame graph
 */
let NodeRenderGraphUtilityLayerRendererBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBlock;
    let _instanceExtraInitializers = [];
    let _get_handleEvents_decorators;
    return _a = class NodeRenderGraphUtilityLayerRendererBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Creates a new NodeRenderGraphUtilityLayerRendererBlock
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             * @param handleEvents If the utility layer should handle events.
             */
            constructor(name, frameGraph, scene, handleEvents = true) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this._additionalConstructionParameters = [handleEvents];
                this.registerInput("target", NodeRenderGraphBlockConnectionPointTypes.AutoDetect);
                this.registerInput("camera", NodeRenderGraphBlockConnectionPointTypes.Camera);
                this._addDependenciesInput();
                this.registerOutput("output", NodeRenderGraphBlockConnectionPointTypes.BasedOnInput);
                this.target.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureAll);
                this.output._typeConnectionSource = this.target;
                this._frameGraphTask = new FrameGraphUtilityLayerRendererTask(name, frameGraph, scene, handleEvents);
            }
            _createTask(handleEvents) {
                const disabled = this._frameGraphTask.disabled;
                this._frameGraphTask.dispose();
                this._frameGraphTask = new FrameGraphUtilityLayerRendererTask(this.name, this._frameGraph, this._scene, handleEvents);
                this._additionalConstructionParameters = [handleEvents];
                this._frameGraphTask.disabled = disabled;
            }
            /** If the utility layer should handle events */
            get handleEvents() {
                return this._frameGraphTask.layer.handleEvents;
            }
            set handleEvents(value) {
                this._createTask(value);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphUtilityLayerRendererBlock";
            }
            /**
             * Gets the target input component
             */
            get target() {
                return this._inputs[0];
            }
            /**
             * Gets the camera input component
             */
            get camera() {
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
                this.output.value = this._frameGraphTask.outputTexture;
                this._frameGraphTask.targetTexture = this.target.connectedPoint?.value;
                this._frameGraphTask.camera = this.camera.connectedPoint?.value;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_handleEvents_decorators = [editableInPropertyPage("Handle events", 0 /* PropertyTypeForEdition.Boolean */, "PROPERTIES")];
            __esDecorate(_a, null, _get_handleEvents_decorators, { kind: "getter", name: "handleEvents", static: false, private: false, access: { has: obj => "handleEvents" in obj, get: obj => obj.handleEvents }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphUtilityLayerRendererBlock };
let _Registered = false;
/**
 * Register side effects for utilityLayerRendererBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterUtilityLayerRendererBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphUtilityLayerRendererBlock", NodeRenderGraphUtilityLayerRendererBlock);
}
//# sourceMappingURL=utilityLayerRendererBlock.pure.js.map