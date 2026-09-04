/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { NodeGeometryBlockConnectionPointTypes } from "../Enums/nodeGeometryConnectionPointTypes.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { Vector2, Vector3 } from "../../../Maths/math.vector.pure.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Type of mappings supported by the mapping block
 */
export var MappingTypes;
(function (MappingTypes) {
    /** Spherical */
    MappingTypes[MappingTypes["Spherical"] = 0] = "Spherical";
    /** Cylindrical */
    MappingTypes[MappingTypes["Cylindrical"] = 1] = "Cylindrical";
    /** Cubic */
    MappingTypes[MappingTypes["Cubic"] = 2] = "Cubic";
})(MappingTypes || (MappingTypes = {}));
/**
 * Block used to generate UV coordinates
 */
let MappingBlock = (() => {
    var _a;
    let _classSuper = NodeGeometryBlock;
    let _mapping_decorators;
    let _mapping_initializers = [];
    let _mapping_extraInitializers = [];
    return _a = class MappingBlock extends _classSuper {
            /**
             * Create a new MappingBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name);
                /**
                 * Gets or sets the mapping type used by the block
                 */
                this.mapping = __runInitializers(this, _mapping_initializers, MappingTypes.Spherical);
                __runInitializers(this, _mapping_extraInitializers);
                this.registerInput("position", NodeGeometryBlockConnectionPointTypes.Vector3);
                this.registerInput("normal", NodeGeometryBlockConnectionPointTypes.Vector3);
                this.registerInput("center", NodeGeometryBlockConnectionPointTypes.Vector3, true, Vector3.Zero());
                this.registerOutput("uv", NodeGeometryBlockConnectionPointTypes.Vector2);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "MappingBlock";
            }
            /**
             * Gets the position input component
             */
            get position() {
                return this._inputs[0];
            }
            /**
             * Gets the normal input component
             */
            get normal() {
                return this._inputs[1];
            }
            /**
             * Gets the center input component
             */
            get center() {
                return this._inputs[2];
            }
            /**
             * Gets the output component
             */
            get uv() {
                return this._outputs[0];
            }
            _buildBlock() {
                if (!this.position.isConnected) {
                    this.uv._storedFunction = null;
                    this.uv._storedValue = null;
                    return;
                }
                const tempDirection = Vector3.Zero();
                const func = (state) => {
                    const position = this.position.getConnectedValue(state) || Vector3.Zero();
                    const normal = this.normal.getConnectedValue(state) || Vector3.Zero();
                    const center = this.center.getConnectedValue(state);
                    const uv = Vector2.Zero();
                    switch (this.mapping) {
                        case MappingTypes.Spherical: {
                            position.subtractToRef(center, tempDirection);
                            const len = tempDirection.length();
                            if (len > 0) {
                                uv.y = Math.acos(tempDirection.y / len) / Math.PI;
                                if (tempDirection.x !== 0 || tempDirection.z !== 0) {
                                    uv.x = Math.atan2(tempDirection.x, tempDirection.z) / (Math.PI * 2);
                                }
                            }
                            break;
                        }
                        case MappingTypes.Cylindrical: {
                            position.subtractToRef(center, tempDirection);
                            const len = tempDirection.length();
                            if (len > 0) {
                                uv.x = Math.atan2(tempDirection.x / len, tempDirection.z / len) / (Math.PI * 2);
                                uv.y = (tempDirection.y + 1.0) / 2.0;
                            }
                            break;
                        }
                        case MappingTypes.Cubic: {
                            // Find the largest component of the normal vector
                            const absX = Math.abs(normal.x);
                            const absY = Math.abs(normal.y);
                            const absZ = Math.abs(normal.z);
                            const maxDim = Math.max(Math.abs(position.x), Math.abs(position.y), Math.abs(position.z));
                            let u, v;
                            if (absX >= absY && absX >= absZ) {
                                u = position.y / maxDim - center.y;
                                v = position.z / maxDim - center.z;
                            }
                            else if (absY >= absX && absY >= absZ) {
                                u = position.x / maxDim - center.x;
                                v = position.z / maxDim - center.z;
                            }
                            else {
                                u = position.x / maxDim - center.x;
                                v = position.y / maxDim - center.y;
                            }
                            uv.x = (u + 1) / 2;
                            uv.y = (v + 1) / 2;
                        }
                    }
                    return uv;
                };
                this.uv._storedFunction = (state) => {
                    return func(state);
                };
            }
            _dumpPropertiesCode() {
                const codeString = super._dumpPropertiesCode() + `${this._codeVariableName}.mapping = BABYLON.MappingTypes.${MappingTypes[this.mapping]};\n`;
                return codeString;
            }
            /**
             * Serializes this block in a JSON representation
             * @returns the serialized block object
             */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.mapping = this.mapping;
                return serializationObject;
            }
            /** @internal */
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.mapping = serializationObject.mapping;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _mapping_decorators = [editableInPropertyPage("Mapping", 5 /* PropertyTypeForEdition.List */, "ADVANCED", {
                    notifiers: { rebuild: true },
                    embedded: true,
                    options: [
                        { label: "Spherical", value: MappingTypes.Spherical },
                        { label: "Cylindrical", value: MappingTypes.Cylindrical },
                        { label: "Cubic", value: MappingTypes.Cubic },
                    ],
                })];
            __esDecorate(null, null, _mapping_decorators, { kind: "field", name: "mapping", static: false, private: false, access: { has: obj => "mapping" in obj, get: obj => obj.mapping, set: (obj, value) => { obj.mapping = value; } }, metadata: _metadata }, _mapping_initializers, _mapping_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { MappingBlock };
let _Registered = false;
/**
 * Register side effects for mappingBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterMappingBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.MappingBlock", MappingBlock);
}
//# sourceMappingURL=mappingBlock.pure.js.map