/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { FrameGraphLightingVolumeTask } from "../../Tasks/Misc/lightingVolumeTask.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { NodeRenderGraphBlock } from "../nodeRenderGraphBlock.js";
import { NodeRenderGraphBlockConnectionPointTypes } from "../Types/nodeRenderGraphTypes.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block that implements the lighting volume
 */
let NodeRenderGraphLightingVolumeBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBlock;
    let _instanceExtraInitializers = [];
    let _get_tesselation_decorators;
    let _get_frequency_decorators;
    return _a = class NodeRenderGraphLightingVolumeBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new NodeRenderGraphLightingVolumeBlock
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             */
            constructor(name, frameGraph, scene) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this.registerInput("shadowGenerator", NodeRenderGraphBlockConnectionPointTypes.ShadowGenerator);
                this._addDependenciesInput();
                this.registerOutput("output", NodeRenderGraphBlockConnectionPointTypes.ObjectList);
                this._frameGraphTask = new FrameGraphLightingVolumeTask(name, frameGraph);
            }
            /** Gets or sets the tesselation parameter */
            get tesselation() {
                return this._frameGraphTask.lightingVolume.tesselation;
            }
            set tesselation(value) {
                this._frameGraphTask.lightingVolume.tesselation = value;
            }
            /** Gets or sets the refresh frequency parameter */
            get frequency() {
                return this._frameGraphTask.lightingVolume.frequency;
            }
            set frequency(value) {
                this._frameGraphTask.lightingVolume.frequency = value;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphLightingVolumeBlock";
            }
            /**
             * Gets the shadow generator input component
             */
            get shadowGenerator() {
                return this._inputs[0];
            }
            /**
             * Gets the output component
             */
            get output() {
                return this._outputs[0];
            }
            _buildBlock(state) {
                super._buildBlock(state);
                this.output.value = this._frameGraphTask.outputMeshLightingVolume;
                this._frameGraphTask.shadowGenerator = this.shadowGenerator.connectedPoint?.value;
            }
            _dumpPropertiesCode() {
                const codes = [];
                codes.push(`${this._codeVariableName}.tesselation = ${this.tesselation};`);
                codes.push(`${this._codeVariableName}.frequency = ${this.frequency};`);
                return super._dumpPropertiesCode() + codes.join("\n");
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.tesselation = this.tesselation;
                serializationObject.frequency = this.frequency;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.tesselation = serializationObject.tesselation;
                this.frequency = serializationObject.frequency;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_tesselation_decorators = [editableInPropertyPage("Tesselation", 2 /* PropertyTypeForEdition.Int */, "PROPERTIES", { min: 1, max: 4096 })];
            _get_frequency_decorators = [editableInPropertyPage("Refresh frequency", 2 /* PropertyTypeForEdition.Int */, "PROPERTIES")];
            __esDecorate(_a, null, _get_tesselation_decorators, { kind: "getter", name: "tesselation", static: false, private: false, access: { has: obj => "tesselation" in obj, get: obj => obj.tesselation }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_frequency_decorators, { kind: "getter", name: "frequency", static: false, private: false, access: { has: obj => "frequency" in obj, get: obj => obj.frequency }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphLightingVolumeBlock };
let _Registered = false;
/**
 * Register side effects for lightingVolumeBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterLightingVolumeBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphLightingVolumeBlock", NodeRenderGraphLightingVolumeBlock);
}
//# sourceMappingURL=lightingVolumeBlock.pure.js.map