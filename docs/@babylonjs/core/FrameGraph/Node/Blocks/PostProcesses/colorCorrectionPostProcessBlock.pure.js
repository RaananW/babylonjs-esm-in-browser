/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { FrameGraphColorCorrectionTask } from "../../../Tasks/PostProcesses/colorCorrectionTask.js";
import { ThinColorCorrectionPostProcess } from "../../../../PostProcesses/thinColorCorrectionPostProcess.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "./baseWithPropertiesPostProcessBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that implements the color correction post process
 */
let NodeRenderGraphColorCorrectionPostProcessBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBaseWithPropertiesPostProcessBlock;
    let _instanceExtraInitializers = [];
    let _get_colorTableUrl_decorators;
    return _a = class NodeRenderGraphColorCorrectionPostProcessBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new NodeRenderGraphColorCorrectionPostProcessBlock
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             * @param colorTableUrl defines the URL of the color table
             */
            constructor(name, frameGraph, scene, colorTableUrl = "") {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this._additionalConstructionParameters = [colorTableUrl];
                this._finalizeInputOutputRegistering();
                this._frameGraphTask = new FrameGraphColorCorrectionTask(this.name, frameGraph, colorTableUrl, new ThinColorCorrectionPostProcess(name, frameGraph.scene, colorTableUrl));
            }
            _createTask(colorTableUrl) {
                const sourceSamplingMode = this._frameGraphTask.sourceSamplingMode;
                this._frameGraphTask.dispose();
                this._frameGraphTask = new FrameGraphColorCorrectionTask(this.name, this._frameGraph, colorTableUrl, new ThinColorCorrectionPostProcess(this.name, this._frameGraph.scene, colorTableUrl));
                this._frameGraphTask.sourceSamplingMode = sourceSamplingMode;
                this._additionalConstructionParameters = [colorTableUrl];
            }
            /** The color table URL */
            get colorTableUrl() {
                return this._frameGraphTask.postProcess.colorTableUrl;
            }
            set colorTableUrl(value) {
                this._createTask(value);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphColorCorrectionPostProcessBlock";
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_colorTableUrl_decorators = [editableInPropertyPage("Color Table URL", 11 /* PropertyTypeForEdition.String */, "PROPERTIES")];
            __esDecorate(_a, null, _get_colorTableUrl_decorators, { kind: "getter", name: "colorTableUrl", static: false, private: false, access: { has: obj => "colorTableUrl" in obj, get: obj => obj.colorTableUrl }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphColorCorrectionPostProcessBlock };
let _Registered = false;
/**
 * Register side effects for colorCorrectionPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterColorCorrectionPostProcessBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphColorCorrectionPostProcessBlock", NodeRenderGraphColorCorrectionPostProcessBlock);
}
//# sourceMappingURL=colorCorrectionPostProcessBlock.pure.js.map