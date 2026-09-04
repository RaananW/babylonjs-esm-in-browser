/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../Enums/nodeMaterialBlockTargets.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to clamp a float
 */
let ClampBlock = (() => {
    var _a;
    let _classSuper = NodeMaterialBlock;
    let _minimum_decorators;
    let _minimum_initializers = [];
    let _minimum_extraInitializers = [];
    let _maximum_decorators;
    let _maximum_initializers = [];
    let _maximum_extraInitializers = [];
    return _a = class ClampBlock extends _classSuper {
            /**
             * Creates a new ClampBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name, NodeMaterialBlockTargets.Neutral);
                /** Gets or sets the minimum range */
                this.minimum = __runInitializers(this, _minimum_initializers, 0.0);
                /** Gets or sets the maximum range */
                this.maximum = (__runInitializers(this, _minimum_extraInitializers), __runInitializers(this, _maximum_initializers, 1.0));
                __runInitializers(this, _maximum_extraInitializers);
                this.registerInput("value", NodeMaterialBlockConnectionPointTypes.AutoDetect);
                this.registerOutput("output", NodeMaterialBlockConnectionPointTypes.BasedOnInput);
                this._outputs[0]._typeConnectionSource = this._inputs[0];
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "ClampBlock";
            }
            /**
             * Gets the value input component
             */
            get value() {
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
                const output = this._outputs[0];
                const cast = state.shaderLanguage === 1 /* ShaderLanguage.WGSL */ ? state._getShaderType(this.value.type) : "";
                state.compilationString +=
                    state._declareOutput(output) +
                        ` = clamp(${this.value.associatedVariableName}, ${cast}(${this._writeFloat(this.minimum)}), ${cast}(${this._writeFloat(this.maximum)}));\n`;
                return this;
            }
            _dumpPropertiesCode() {
                let codeString = super._dumpPropertiesCode() + `${this._codeVariableName}.minimum = ${this.minimum};\n`;
                codeString += `${this._codeVariableName}.maximum = ${this.maximum};\n`;
                return codeString;
            }
            /**
             * Serializes the block
             * @returns the serialized object
             */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.minimum = this.minimum;
                serializationObject.maximum = this.maximum;
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
                this.minimum = serializationObject.minimum;
                this.maximum = serializationObject.maximum;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _minimum_decorators = [editableInPropertyPage("Minimum", 1 /* PropertyTypeForEdition.Float */, undefined, { embedded: true })];
            _maximum_decorators = [editableInPropertyPage("Maximum", 1 /* PropertyTypeForEdition.Float */, undefined, { embedded: true })];
            __esDecorate(null, null, _minimum_decorators, { kind: "field", name: "minimum", static: false, private: false, access: { has: obj => "minimum" in obj, get: obj => obj.minimum, set: (obj, value) => { obj.minimum = value; } }, metadata: _metadata }, _minimum_initializers, _minimum_extraInitializers);
            __esDecorate(null, null, _maximum_decorators, { kind: "field", name: "maximum", static: false, private: false, access: { has: obj => "maximum" in obj, get: obj => obj.maximum, set: (obj, value) => { obj.maximum = value; } }, metadata: _metadata }, _maximum_initializers, _maximum_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { ClampBlock };
let _Registered = false;
/**
 * Register side effects for clampBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterClampBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ClampBlock", ClampBlock);
}
//# sourceMappingURL=clampBlock.pure.js.map