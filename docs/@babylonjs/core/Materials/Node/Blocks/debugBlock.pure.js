/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../Enums/nodeMaterialBlockTargets.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to render intermediate debug values
 * Please note that the node needs to be active to be generated in the shader
 * Only one DebugBlock should be active at a time
 */
let NodeMaterialDebugBlock = (() => {
    var _a;
    let _classSuper = NodeMaterialBlock;
    let _renderAlpha_decorators;
    let _renderAlpha_initializers = [];
    let _renderAlpha_extraInitializers = [];
    return _a = class NodeMaterialDebugBlock extends _classSuper {
            /**
             * Gets or sets a boolean indicating that the block is active
             */
            get isActive() {
                return this._isActive && this.debug.isConnected;
            }
            set isActive(value) {
                if (this._isActive === value) {
                    return;
                }
                this._isActive = value;
            }
            /**
             * Creates a new NodeMaterialDebugBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name, NodeMaterialBlockTargets.Fragment, true, true);
                this._isActive = false;
                /** @internal */
                this._forcedActive = false;
                /** Gets or sets a boolean indicating if we want to render alpha when using a rgba input*/
                this.renderAlpha = __runInitializers(this, _renderAlpha_initializers, false);
                __runInitializers(this, _renderAlpha_extraInitializers);
                this.registerInput("debug", NodeMaterialBlockConnectionPointTypes.AutoDetect, true);
                this.debug.excludedConnectionPointTypes.push(NodeMaterialBlockConnectionPointTypes.Matrix);
            }
            /** @internal */
            get _isFinalOutputAndActive() {
                return this.isActive || this._forcedActive;
            }
            /** @internal */
            get _hasPrecedence() {
                return true;
            }
            /**
             * Gets the rgba input component
             */
            get debug() {
                return this._inputs[0];
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeMaterialDebugBlock";
            }
            _buildBlock(state) {
                super._buildBlock(state);
                if (!this._isFinalOutputAndActive) {
                    return this;
                }
                let outputString = "gl_FragColor";
                if (state.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
                    outputString = "fragmentOutputs.color";
                }
                const debug = this.debug;
                if (!debug.connectedPoint) {
                    return this;
                }
                if (debug.connectedPoint.type === NodeMaterialBlockConnectionPointTypes.Float) {
                    state.compilationString += `${outputString}  = vec4${state.fSuffix}(${debug.associatedVariableName}, ${debug.associatedVariableName}, ${debug.associatedVariableName}, 1.0);\n`;
                }
                else if (debug.connectedPoint.type === NodeMaterialBlockConnectionPointTypes.Vector2) {
                    state.compilationString += `${outputString}  = vec4${state.fSuffix}(${debug.associatedVariableName}, 0., 1.0);\n`;
                }
                else if (debug.connectedPoint.type === NodeMaterialBlockConnectionPointTypes.Color3 || debug.connectedPoint.type === NodeMaterialBlockConnectionPointTypes.Vector3) {
                    state.compilationString += `${outputString}  = vec4${state.fSuffix}(${debug.associatedVariableName}, 1.0);\n`;
                }
                else if (this.renderAlpha) {
                    state.compilationString += `${outputString}  =${debug.associatedVariableName};\n`;
                }
                else {
                    state.compilationString += `${outputString}  = vec4${state.fSuffix}(${debug.associatedVariableName}.rgb, 1.0);\n`;
                }
                return this;
            }
            /**
             * Serializes the block
             * @returns the serialized object
             */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.isActive = this._isActive;
                serializationObject.renderAlpha = this.renderAlpha;
                serializationObject._forcedActive = this._forcedActive;
                return serializationObject;
            }
            /**
             * Deserializes the block
             * @param serializationObject - the serialization object
             * @param scene - the scene
             * @param rootUrl - the root URL
             */
            _deserialize(serializationObject, scene, rootUrl) {
                super._deserialize(serializationObject, scene, rootUrl);
                this.isActive = serializationObject.isActive;
                this.renderAlpha = serializationObject.renderAlpha;
                this._forcedActive = serializationObject._forcedActive;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _renderAlpha_decorators = [editableInPropertyPage("Render Alpha", 0 /* PropertyTypeForEdition.Boolean */, undefined)];
            __esDecorate(null, null, _renderAlpha_decorators, { kind: "field", name: "renderAlpha", static: false, private: false, access: { has: obj => "renderAlpha" in obj, get: obj => obj.renderAlpha, set: (obj, value) => { obj.renderAlpha = value; } }, metadata: _metadata }, _renderAlpha_initializers, _renderAlpha_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeMaterialDebugBlock };
let _Registered = false;
/**
 * Register side effects for materialsNodeBlocksDebugBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterMaterialsNodeBlocksDebugBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeMaterialDebugBlock", NodeMaterialDebugBlock);
}
//# sourceMappingURL=debugBlock.pure.js.map