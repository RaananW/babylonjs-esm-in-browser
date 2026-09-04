/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../Enums/nodeMaterialBlockTargets.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Operations supported by the Wave block
 */
export var WaveBlockKind;
(function (WaveBlockKind) {
    /** SawTooth */
    WaveBlockKind[WaveBlockKind["SawTooth"] = 0] = "SawTooth";
    /** Square */
    WaveBlockKind[WaveBlockKind["Square"] = 1] = "Square";
    /** Triangle */
    WaveBlockKind[WaveBlockKind["Triangle"] = 2] = "Triangle";
})(WaveBlockKind || (WaveBlockKind = {}));
/**
 * Block used to apply wave operation to floats
 */
let WaveBlock = (() => {
    var _a;
    let _classSuper = NodeMaterialBlock;
    let _kind_decorators;
    let _kind_initializers = [];
    let _kind_extraInitializers = [];
    return _a = class WaveBlock extends _classSuper {
            /**
             * Creates a new WaveBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name, NodeMaterialBlockTargets.Neutral);
                /**
                 * Gets or sets the kibnd of wave to be applied by the block
                 */
                this.kind = __runInitializers(this, _kind_initializers, 0 /* WaveBlockKind.SawTooth */);
                __runInitializers(this, _kind_extraInitializers);
                this.registerInput("input", NodeMaterialBlockConnectionPointTypes.AutoDetect);
                this.registerOutput("output", NodeMaterialBlockConnectionPointTypes.BasedOnInput);
                this._outputs[0]._typeConnectionSource = this._inputs[0];
                this._inputs[0].excludedConnectionPointTypes.push(NodeMaterialBlockConnectionPointTypes.Matrix);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "WaveBlock";
            }
            /**
             * Gets the input component
             */
            get input() {
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
                switch (this.kind) {
                    case 0 /* WaveBlockKind.SawTooth */: {
                        state.compilationString += state._declareOutput(output) + ` = ${this.input.associatedVariableName} - floor(0.5 + ${this.input.associatedVariableName});\n`;
                        break;
                    }
                    case 1 /* WaveBlockKind.Square */: {
                        state.compilationString += state._declareOutput(output) + ` = 1.0 - 2.0 * round(fract(${this.input.associatedVariableName}));\n`;
                        break;
                    }
                    case 2 /* WaveBlockKind.Triangle */: {
                        state.compilationString +=
                            state._declareOutput(output) + ` = 2.0 * abs(2.0 * (${this.input.associatedVariableName} - floor(0.5 + ${this.input.associatedVariableName}))) - 1.0;\n`;
                        break;
                    }
                }
                return this;
            }
            /**
             * Serializes the block
             * @returns the serialized object
             */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.kind = this.kind;
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
                this.kind = serializationObject.kind;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _kind_decorators = [editableInPropertyPage("Kind", 5 /* PropertyTypeForEdition.List */, "ADVANCED", {
                    notifiers: { rebuild: true },
                    embedded: true,
                    options: [
                        { label: "SawTooth", value: 0 /* WaveBlockKind.SawTooth */ },
                        { label: "Square", value: 1 /* WaveBlockKind.Square */ },
                        { label: "Triangle", value: 2 /* WaveBlockKind.Triangle */ },
                    ],
                })];
            __esDecorate(null, null, _kind_decorators, { kind: "field", name: "kind", static: false, private: false, access: { has: obj => "kind" in obj, get: obj => obj.kind, set: (obj, value) => { obj.kind = value; } }, metadata: _metadata }, _kind_initializers, _kind_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { WaveBlock };
let _Registered = false;
/**
 * Register side effects for waveBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterWaveBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.WaveBlock", WaveBlock);
}
//# sourceMappingURL=waveBlock.pure.js.map