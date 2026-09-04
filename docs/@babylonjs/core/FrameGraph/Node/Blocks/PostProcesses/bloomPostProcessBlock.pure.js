/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { FrameGraphBloomTask } from "../../../Tasks/PostProcesses/bloomTask.js";
import { NodeRenderGraphBasePostProcessBlock } from "./basePostProcessBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that implements the bloom post process
 */
let NodeRenderGraphBloomPostProcessBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBasePostProcessBlock;
    let _instanceExtraInitializers = [];
    let _get_bloomScale_decorators;
    let _get_hdr_decorators;
    let _get_threshold_decorators;
    let _get_weight_decorators;
    let _get_kernel_decorators;
    return _a = class NodeRenderGraphBloomPostProcessBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new NodeRenderGraphBloomPostProcessBlock
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             * @param hdr If high dynamic range textures should be used (default: false)
             * @param bloomScale The scale of the bloom effect (default: 0.5)
             */
            constructor(name, frameGraph, scene, hdr = false, bloomScale = 0.5) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this._additionalConstructionParameters = [hdr, bloomScale];
                this._finalizeInputOutputRegistering();
                this._frameGraphTask = new FrameGraphBloomTask(this.name, frameGraph, 0.75, 64, 0.2, hdr, bloomScale);
            }
            _createTask(bloomScale, hdr) {
                const sourceSamplingMode = this._frameGraphTask.sourceSamplingMode;
                const threshold = this._frameGraphTask.bloom.threshold;
                const weight = this._frameGraphTask.bloom.weight;
                const kernel = this._frameGraphTask.bloom.kernel;
                this._frameGraphTask.dispose();
                this._frameGraphTask = new FrameGraphBloomTask(this.name, this._frameGraph, weight, kernel, threshold, hdr, bloomScale);
                this._frameGraphTask.sourceSamplingMode = sourceSamplingMode;
                this._additionalConstructionParameters = [hdr, bloomScale];
            }
            /** The quality of the blur effect */
            get bloomScale() {
                return this._frameGraphTask.bloom.scale;
            }
            set bloomScale(value) {
                this._createTask(value, this._frameGraphTask.hdr);
            }
            /** If high dynamic range textures should be used */
            get hdr() {
                return this._frameGraphTask.hdr;
            }
            set hdr(value) {
                this._createTask(this._frameGraphTask.bloom.scale, value);
            }
            /** The luminance threshold to find bright areas of the image to bloom. */
            get threshold() {
                return this._frameGraphTask.bloom.threshold;
            }
            set threshold(value) {
                this._frameGraphTask.bloom.threshold = value;
            }
            /** The strength of the bloom. */
            get weight() {
                return this._frameGraphTask.bloom.weight;
            }
            set weight(value) {
                this._frameGraphTask.bloom.weight = value;
            }
            /** Specifies the size of the bloom blur kernel, relative to the final output size */
            get kernel() {
                return this._frameGraphTask.bloom.kernel;
            }
            set kernel(value) {
                this._frameGraphTask.bloom.kernel = value;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphBloomPostProcessBlock";
            }
            _dumpPropertiesCode() {
                const codes = [];
                codes.push(`${this._codeVariableName}.threshold = ${this.threshold};`);
                codes.push(`${this._codeVariableName}.weight = ${this.weight};`);
                codes.push(`${this._codeVariableName}.kernel = ${this.kernel};`);
                return super._dumpPropertiesCode() + codes.join("\n");
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.threshold = this.threshold;
                serializationObject.weight = this.weight;
                serializationObject.kernel = this.kernel;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.threshold = serializationObject.threshold;
                this.weight = serializationObject.weight;
                this.kernel = serializationObject.kernel;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_bloomScale_decorators = [editableInPropertyPage("Bloom scale", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES")];
            _get_hdr_decorators = [editableInPropertyPage("HDR", 0 /* PropertyTypeForEdition.Boolean */, "PROPERTIES")];
            _get_threshold_decorators = [editableInPropertyPage("Threshold", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES", { min: 0, max: 1 })];
            _get_weight_decorators = [editableInPropertyPage("Weight", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES", { min: 0, max: 10 })];
            _get_kernel_decorators = [editableInPropertyPage("Kernel", 2 /* PropertyTypeForEdition.Int */, "PROPERTIES", { min: 1, max: 128 })];
            __esDecorate(_a, null, _get_bloomScale_decorators, { kind: "getter", name: "bloomScale", static: false, private: false, access: { has: obj => "bloomScale" in obj, get: obj => obj.bloomScale }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_hdr_decorators, { kind: "getter", name: "hdr", static: false, private: false, access: { has: obj => "hdr" in obj, get: obj => obj.hdr }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_threshold_decorators, { kind: "getter", name: "threshold", static: false, private: false, access: { has: obj => "threshold" in obj, get: obj => obj.threshold }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_weight_decorators, { kind: "getter", name: "weight", static: false, private: false, access: { has: obj => "weight" in obj, get: obj => obj.weight }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_kernel_decorators, { kind: "getter", name: "kernel", static: false, private: false, access: { has: obj => "kernel" in obj, get: obj => obj.kernel }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphBloomPostProcessBlock };
let _Registered = false;
/**
 * Register side effects for bloomPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterBloomPostProcessBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphBloomPostProcessBlock", NodeRenderGraphBloomPostProcessBlock);
}
//# sourceMappingURL=bloomPostProcessBlock.pure.js.map