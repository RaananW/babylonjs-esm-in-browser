/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { NodeParticleBlock } from "../nodeParticleBlock.js";
import { NodeParticleBlockConnectionPointTypes } from "../Enums/nodeParticleBlockConnectionPointTypes.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to define a gradient entry for a gradient block
 */
let ParticleGradientValueBlock = (() => {
    var _a;
    let _classSuper = NodeParticleBlock;
    let _reference_decorators;
    let _reference_initializers = [];
    let _reference_extraInitializers = [];
    return _a = class ParticleGradientValueBlock extends _classSuper {
            /**
             * Creates a new ParticleGradientEntryBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name);
                /**
                 * Gets or sets the epsilon value used for comparison
                 */
                this.reference = __runInitializers(this, _reference_initializers, 0);
                __runInitializers(this, _reference_extraInitializers);
                this.registerInput("value", NodeParticleBlockConnectionPointTypes.AutoDetect);
                this.registerOutput("output", NodeParticleBlockConnectionPointTypes.BasedOnInput);
                this._outputs[0]._typeConnectionSource = this._inputs[0];
                this._outputs[0]._typeConnectionSourceTranslation = (type) => {
                    switch (type) {
                        case NodeParticleBlockConnectionPointTypes.Float:
                            return NodeParticleBlockConnectionPointTypes.FloatGradient;
                        case NodeParticleBlockConnectionPointTypes.Vector2:
                            return NodeParticleBlockConnectionPointTypes.Vector2Gradient;
                        case NodeParticleBlockConnectionPointTypes.Vector3:
                            return NodeParticleBlockConnectionPointTypes.Vector3Gradient;
                        case NodeParticleBlockConnectionPointTypes.Color4:
                            return NodeParticleBlockConnectionPointTypes.Color4Gradient;
                    }
                    return type;
                };
                this._inputs[0].addExcludedConnectionPointFromAllowedTypes(NodeParticleBlockConnectionPointTypes.Float |
                    NodeParticleBlockConnectionPointTypes.Vector2 |
                    NodeParticleBlockConnectionPointTypes.Vector3 |
                    NodeParticleBlockConnectionPointTypes.Color4);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "ParticleGradientValueBlock";
            }
            /**
             * Gets the value operand input component
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
            _build() {
                this.output._storedFunction = (state) => {
                    return null;
                };
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.reference = this.reference;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.reference = serializationObject.reference;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _reference_decorators = [editableInPropertyPage("Reference", 1 /* PropertyTypeForEdition.Float */, "ADVANCED", { embedded: true, notifiers: { rebuild: true }, min: 0, max: 1 })];
            __esDecorate(null, null, _reference_decorators, { kind: "field", name: "reference", static: false, private: false, access: { has: obj => "reference" in obj, get: obj => obj.reference, set: (obj, value) => { obj.reference = value; } }, metadata: _metadata }, _reference_initializers, _reference_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { ParticleGradientValueBlock };
let _Registered = false;
/**
 * Register side effects for particleGradientValueBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterParticleGradientValueBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ParticleGradientValueBlock", ParticleGradientValueBlock);
}
//# sourceMappingURL=particleGradientValueBlock.pure.js.map