/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { NodeRenderGraphBlock } from "../../nodeRenderGraphBlock.js";
import { FrameGraphVolumetricLightingTask } from "../../../Tasks/PostProcesses/volumetricLightingTask.js";
import { NodeRenderGraphBlockConnectionPointTypes } from "../../Types/nodeRenderGraphTypes.js";
import { Vector3 } from "../../../../Maths/math.vector.pure.js";
import { Color3 } from "../../../../Maths/math.color.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that implements the volumetric lighting post process
 */
let NodeRenderGraphVolumetricLightingBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBlock;
    let _instanceExtraInitializers = [];
    let _get_phaseG_decorators;
    let _get_enableExtinction_decorators;
    let _get_extinction_decorators;
    let _get_lightPower_decorators;
    return _a = class NodeRenderGraphVolumetricLightingBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new NodeRenderGraphVolumetricLightingBlock
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             * @param enableExtinction defines whether to enable extinction coefficients
             */
            constructor(name, frameGraph, scene, enableExtinction = false) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this._additionalConstructionParameters = [enableExtinction];
                this.registerInput("target", NodeRenderGraphBlockConnectionPointTypes.AutoDetect);
                this.registerInput("depth", NodeRenderGraphBlockConnectionPointTypes.AutoDetect);
                this.registerInput("camera", NodeRenderGraphBlockConnectionPointTypes.Camera);
                this.registerInput("lightingVolumeMesh", NodeRenderGraphBlockConnectionPointTypes.ObjectList);
                this.registerInput("light", NodeRenderGraphBlockConnectionPointTypes.ShadowLight);
                this.registerInput("lightingVolumeTexture", NodeRenderGraphBlockConnectionPointTypes.AutoDetect, true);
                this.target.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureAllButBackBuffer);
                this.lightingVolumeTexture.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureAllButBackBuffer);
                this.depth.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureDepthStencilAttachment | NodeRenderGraphBlockConnectionPointTypes.TextureScreenDepth);
                this._addDependenciesInput();
                this.registerOutput("output", NodeRenderGraphBlockConnectionPointTypes.BasedOnInput);
                this.output._typeConnectionSource = () => {
                    return this.target;
                };
                this._frameGraphTask = new FrameGraphVolumetricLightingTask(name, frameGraph, enableExtinction);
            }
            _createTask(enableExtinction) {
                const sourceSamplingMode = this._frameGraphTask.sourceSamplingMode;
                const phaseG = this._frameGraphTask.phaseG;
                const extinction = this._frameGraphTask.extinction;
                const lightPower = this._frameGraphTask.lightPower;
                this._frameGraphTask.dispose();
                this._frameGraphTask = new FrameGraphVolumetricLightingTask(this.name, this._frameGraph, enableExtinction);
                this._frameGraphTask.sourceSamplingMode = sourceSamplingMode;
                this._frameGraphTask.phaseG = phaseG;
                this._frameGraphTask.extinction = extinction;
                this._frameGraphTask.lightPower = lightPower;
                this._additionalConstructionParameters = [enableExtinction];
            }
            /** Gets or sets the phaseG parameter */
            get phaseG() {
                return this._frameGraphTask.phaseG;
            }
            set phaseG(value) {
                this._frameGraphTask.phaseG = value;
            }
            /** If extinction coefficients should be used */
            get enableExtinction() {
                return this._frameGraphTask.enableExtinction;
            }
            set enableExtinction(value) {
                this._createTask(value);
            }
            /** Gets or sets the extinction color */
            get extinction() {
                return this._frameGraphTask.extinction;
            }
            set extinction(value) {
                this._frameGraphTask.extinction = value;
            }
            /** Gets or sets the light power */
            get lightPower() {
                return this._frameGraphTask.lightPower;
            }
            set lightPower(value) {
                this._frameGraphTask.lightPower = value;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphVolumetricLightingBlock";
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
             * Gets the camera input component
             */
            get camera() {
                return this._inputs[2];
            }
            /**
             * Gets the lighting volume mesh input component
             */
            get lightingVolumeMesh() {
                return this._inputs[3];
            }
            /**
             * Gets the light input component
             */
            get light() {
                return this._inputs[4];
            }
            /**
             * Gets the lighting volume texture input component
             */
            get lightingVolumeTexture() {
                return this._inputs[5];
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
                this._frameGraphTask.depthTexture = this.depth.connectedPoint?.value;
                this._frameGraphTask.camera = this.camera.connectedPoint?.value;
                this._frameGraphTask.lightingVolumeMesh = this.lightingVolumeMesh.connectedPoint?.value;
                this._frameGraphTask.light = this.light.connectedPoint?.value;
                this._frameGraphTask.lightingVolumeTexture = this.lightingVolumeTexture.connectedPoint?.value;
            }
            _dumpPropertiesCode() {
                const codes = [];
                codes.push(`${this._codeVariableName}.phaseG = ${this.phaseG};`);
                codes.push(`${this._codeVariableName}.extinction = new BABYLON.Vector3(${this.extinction.x}, ${this.extinction.y}, ${this.extinction.z});`);
                codes.push(`${this._codeVariableName}.lightPower = new Color3(${this.lightPower.r}, ${this.lightPower.g}, ${this.lightPower.b});`);
                return super._dumpPropertiesCode() + codes.join("\n");
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.phaseG = this.phaseG;
                serializationObject.extinction = this.extinction.asArray();
                serializationObject.lightPower = this.lightPower.asArray();
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.phaseG = serializationObject.phaseG;
                this.extinction = Vector3.FromArray(serializationObject.extinction);
                this.lightPower = Color3.FromArray(serializationObject.lightPower);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_phaseG_decorators = [editableInPropertyPage("PhaseG", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES", { min: -0.9, max: 0.9 })];
            _get_enableExtinction_decorators = [editableInPropertyPage("Enable extinction", 0 /* PropertyTypeForEdition.Boolean */, "PROPERTIES")];
            _get_extinction_decorators = [editableInPropertyPage("Extinction", 4 /* PropertyTypeForEdition.Vector3 */, "PROPERTIES")];
            _get_lightPower_decorators = [editableInPropertyPage("Light power", 6 /* PropertyTypeForEdition.Color3 */, "PROPERTIES")];
            __esDecorate(_a, null, _get_phaseG_decorators, { kind: "getter", name: "phaseG", static: false, private: false, access: { has: obj => "phaseG" in obj, get: obj => obj.phaseG }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_enableExtinction_decorators, { kind: "getter", name: "enableExtinction", static: false, private: false, access: { has: obj => "enableExtinction" in obj, get: obj => obj.enableExtinction }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_extinction_decorators, { kind: "getter", name: "extinction", static: false, private: false, access: { has: obj => "extinction" in obj, get: obj => obj.extinction }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_lightPower_decorators, { kind: "getter", name: "lightPower", static: false, private: false, access: { has: obj => "lightPower" in obj, get: obj => obj.lightPower }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphVolumetricLightingBlock };
let _Registered = false;
/**
 * Register side effects for volumetricLightingBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterVolumetricLightingBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphVolumetricLightingBlock", NodeRenderGraphVolumetricLightingBlock);
}
//# sourceMappingURL=volumetricLightingBlock.pure.js.map