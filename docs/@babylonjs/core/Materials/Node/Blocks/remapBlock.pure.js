/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../Enums/nodeMaterialBlockTargets.js";
import { Vector2 } from "../../../Maths/math.vector.pure.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to remap a float from a range to a new one
 */
let RemapBlock = (() => {
    var _a;
    let _classSuper = NodeMaterialBlock;
    let _sourceRange_decorators;
    let _sourceRange_initializers = [];
    let _sourceRange_extraInitializers = [];
    let _targetRange_decorators;
    let _targetRange_initializers = [];
    let _targetRange_extraInitializers = [];
    return _a = class RemapBlock extends _classSuper {
            /**
             * Creates a new RemapBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name, NodeMaterialBlockTargets.Neutral);
                /**
                 * Gets or sets the source range
                 */
                this.sourceRange = __runInitializers(this, _sourceRange_initializers, new Vector2(-1, 1));
                /**
                 * Gets or sets the target range
                 */
                this.targetRange = (__runInitializers(this, _sourceRange_extraInitializers), __runInitializers(this, _targetRange_initializers, new Vector2(0, 1)));
                __runInitializers(this, _targetRange_extraInitializers);
                this.registerInput("input", NodeMaterialBlockConnectionPointTypes.AutoDetect);
                this.registerInput("sourceMin", NodeMaterialBlockConnectionPointTypes.Float, true);
                this.registerInput("sourceMax", NodeMaterialBlockConnectionPointTypes.Float, true);
                this.registerInput("targetMin", NodeMaterialBlockConnectionPointTypes.Float, true);
                this.registerInput("targetMax", NodeMaterialBlockConnectionPointTypes.Float, true);
                this.registerOutput("output", NodeMaterialBlockConnectionPointTypes.BasedOnInput);
                this._outputs[0]._typeConnectionSource = this._inputs[0];
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "RemapBlock";
            }
            /**
             * Gets the input component
             */
            get input() {
                return this._inputs[0];
            }
            /**
             * Gets the source min input component
             */
            get sourceMin() {
                return this._inputs[1];
            }
            /**
             * Gets the source max input component
             */
            get sourceMax() {
                return this._inputs[2];
            }
            /**
             * Gets the target min input component
             */
            get targetMin() {
                return this._inputs[3];
            }
            /**
             * Gets the target max input component
             */
            get targetMax() {
                return this._inputs[4];
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
                const sourceMin = this.sourceMin.isConnected ? this.sourceMin.associatedVariableName : this._writeFloat(this.sourceRange.x);
                const sourceMax = this.sourceMax.isConnected ? this.sourceMax.associatedVariableName : this._writeFloat(this.sourceRange.y);
                const targetMin = this.targetMin.isConnected ? this.targetMin.associatedVariableName : this._writeFloat(this.targetRange.x);
                const targetMax = this.targetMax.isConnected ? this.targetMax.associatedVariableName : this._writeFloat(this.targetRange.y);
                state.compilationString +=
                    state._declareOutput(output) +
                        ` = ${targetMin} + (${this._inputs[0].associatedVariableName} - ${sourceMin}) * (${targetMax} - ${targetMin}) / (${sourceMax} - ${sourceMin});\n`;
                return this;
            }
            _dumpPropertiesCode() {
                let codeString = super._dumpPropertiesCode() + `${this._codeVariableName}.sourceRange = new BABYLON.Vector2(${this.sourceRange.x}, ${this.sourceRange.y});\n`;
                codeString += `${this._codeVariableName}.targetRange = new BABYLON.Vector2(${this.targetRange.x}, ${this.targetRange.y});\n`;
                return codeString;
            }
            /**
             * Serializes the block
             * @returns the serialized object
             */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.sourceRange = this.sourceRange.asArray();
                serializationObject.targetRange = this.targetRange.asArray();
                return serializationObject;
            }
            /**
             * Deserializes the block from a serialization object
             * @param serializationObject - the object to deserialize from
             * @param scene - the current scene
             * @param rootUrl - the root URL for loading
             */
            _deserialize(serializationObject, scene, rootUrl) {
                super._deserialize(serializationObject, scene, rootUrl);
                this.sourceRange = Vector2.FromArray(serializationObject.sourceRange);
                this.targetRange = Vector2.FromArray(serializationObject.targetRange);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _sourceRange_decorators = [editableInPropertyPage("From", 3 /* PropertyTypeForEdition.Vector2 */)];
            _targetRange_decorators = [editableInPropertyPage("To", 3 /* PropertyTypeForEdition.Vector2 */)];
            __esDecorate(null, null, _sourceRange_decorators, { kind: "field", name: "sourceRange", static: false, private: false, access: { has: obj => "sourceRange" in obj, get: obj => obj.sourceRange, set: (obj, value) => { obj.sourceRange = value; } }, metadata: _metadata }, _sourceRange_initializers, _sourceRange_extraInitializers);
            __esDecorate(null, null, _targetRange_decorators, { kind: "field", name: "targetRange", static: false, private: false, access: { has: obj => "targetRange" in obj, get: obj => obj.targetRange, set: (obj, value) => { obj.targetRange = value; } }, metadata: _metadata }, _targetRange_initializers, _targetRange_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { RemapBlock };
let _Registered = false;
/**
 * Register side effects for remapBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterRemapBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.RemapBlock", RemapBlock);
}
//# sourceMappingURL=remapBlock.pure.js.map