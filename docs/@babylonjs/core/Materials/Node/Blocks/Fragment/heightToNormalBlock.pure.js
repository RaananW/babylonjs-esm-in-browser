/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to convert a height vector to a normal
 */
let HeightToNormalBlock = (() => {
    var _a;
    let _classSuper = NodeMaterialBlock;
    let _generateInWorldSpace_decorators;
    let _generateInWorldSpace_initializers = [];
    let _generateInWorldSpace_extraInitializers = [];
    let _automaticNormalizationNormal_decorators;
    let _automaticNormalizationNormal_initializers = [];
    let _automaticNormalizationNormal_extraInitializers = [];
    let _automaticNormalizationTangent_decorators;
    let _automaticNormalizationTangent_initializers = [];
    let _automaticNormalizationTangent_extraInitializers = [];
    return _a = class HeightToNormalBlock extends _classSuper {
            /**
             * Creates a new HeightToNormalBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name, NodeMaterialBlockTargets.Fragment);
                /**
                 * Defines if the output should be generated in world or tangent space.
                 * Note that in tangent space the result is also scaled by 0.5 and offsetted by 0.5 so that it can directly be used as a PerturbNormal.normalMapColor input
                 */
                this.generateInWorldSpace = __runInitializers(this, _generateInWorldSpace_initializers, false);
                /**
                 * Defines that the worldNormal input will be normalized by the HeightToNormal block before being used
                 */
                this.automaticNormalizationNormal = (__runInitializers(this, _generateInWorldSpace_extraInitializers), __runInitializers(this, _automaticNormalizationNormal_initializers, true));
                /**
                 * Defines that the worldTangent input will be normalized by the HeightToNormal block before being used
                 */
                this.automaticNormalizationTangent = (__runInitializers(this, _automaticNormalizationNormal_extraInitializers), __runInitializers(this, _automaticNormalizationTangent_initializers, true));
                __runInitializers(this, _automaticNormalizationTangent_extraInitializers);
                this.registerInput("input", NodeMaterialBlockConnectionPointTypes.Float);
                this.registerInput("worldPosition", NodeMaterialBlockConnectionPointTypes.Vector3);
                this.registerInput("worldNormal", NodeMaterialBlockConnectionPointTypes.Vector3);
                this.registerInput("worldTangent", NodeMaterialBlockConnectionPointTypes.AutoDetect, true);
                this.registerOutput("output", NodeMaterialBlockConnectionPointTypes.Vector4);
                this.registerOutput("xyz", NodeMaterialBlockConnectionPointTypes.Vector3);
                this._inputs[3].addExcludedConnectionPointFromAllowedTypes(NodeMaterialBlockConnectionPointTypes.Color3 | NodeMaterialBlockConnectionPointTypes.Vector3 | NodeMaterialBlockConnectionPointTypes.Vector4);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "HeightToNormalBlock";
            }
            /**
             * Gets the input component
             */
            get input() {
                return this._inputs[0];
            }
            /**
             * Gets the position component
             */
            get worldPosition() {
                return this._inputs[1];
            }
            /**
             * Gets the normal component
             */
            get worldNormal() {
                return this._inputs[2];
            }
            /**
             * Gets the tangent component
             */
            get worldTangent() {
                return this._inputs[3];
            }
            /**
             * Gets the output component
             */
            get output() {
                return this._outputs[0];
            }
            /**
             * Gets the xyz component
             */
            get xyz() {
                return this._outputs[1];
            }
            _buildBlock(state) {
                super._buildBlock(state);
                const output = this._outputs[0];
                const isWebGPU = state.shaderLanguage === 1 /* ShaderLanguage.WGSL */;
                const fPrefix = state.fSuffix;
                if (!this.generateInWorldSpace && !this.worldTangent.isConnected) {
                    state.sharedData.raiseBuildError(`You must connect the 'worldTangent' input of the ${this.name} block!`);
                }
                const startCode = this.generateInWorldSpace
                    ? ""
                    : `
            vec3 biTangent = cross(norm, tgt);
            mat3 TBN = mat3(tgt, biTangent, norm);
            `;
                const endCode = this.generateInWorldSpace
                    ? ""
                    : `
            result = TBN * result;
            result = result * vec3(0.5) + vec3(0.5);
            `;
                let heightToNormal = `
            vec4 heightToNormal(float height, vec3 position, vec3 tangent, vec3 normal) {
                vec3 tgt = ${this.automaticNormalizationTangent ? "normalize(tangent);" : "tangent;"}
                vec3 norm = ${this.automaticNormalizationNormal ? "normalize(normal);" : "normal;"}
                ${startCode}
                vec3 worlddX = dFdx(position);
                vec3 worlddY = dFdy(position);
                vec3 crossX = cross(norm, worlddX);
                vec3 crossY = cross(worlddY, norm);
                float d = abs(dot(crossY, worlddX));
                vec3 inToNormal = vec3(((((height + dFdx(height)) - height) * crossY) + (((height + dFdy(height)) - height) * crossX)) * sign(d));
                inToNormal.y *= -1.0;
                vec3 result = normalize((d * norm) - inToNormal);
                ${endCode}
                return vec4(result, 0.);
            }`;
                if (isWebGPU) {
                    heightToNormal = state._babylonSLtoWGSL(heightToNormal);
                }
                else {
                    state._emitExtension("derivatives", "#extension GL_OES_standard_derivatives : enable");
                }
                state._emitFunction("heightToNormal", heightToNormal, "// heightToNormal");
                state.compilationString +=
                    state._declareOutput(output) +
                        ` = heightToNormal(${this.input.associatedVariableName}, ${this.worldPosition.associatedVariableName}, ${this.worldTangent.isConnected ? this.worldTangent.associatedVariableName : `vec3${fPrefix}(0.)`}.xyz, ${this.worldNormal.associatedVariableName});\n`;
                if (this.xyz.hasEndpoints) {
                    state.compilationString += state._declareOutput(this.xyz) + ` = ${this.output.associatedVariableName}.xyz;\n`;
                }
                return this;
            }
            _dumpPropertiesCode() {
                let codeString = super._dumpPropertiesCode();
                codeString += `${this._codeVariableName}.generateInWorldSpace = ${this.generateInWorldSpace};\n`;
                codeString += `${this._codeVariableName}.automaticNormalizationNormal = ${this.automaticNormalizationNormal};\n`;
                codeString += `${this._codeVariableName}.automaticNormalizationTangent = ${this.automaticNormalizationTangent};\n`;
                return codeString;
            }
            /**
             * Serializes the block
             * @returns the serialized object
             */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.generateInWorldSpace = this.generateInWorldSpace;
                serializationObject.automaticNormalizationNormal = this.automaticNormalizationNormal;
                serializationObject.automaticNormalizationTangent = this.automaticNormalizationTangent;
                return serializationObject;
            }
            /**
             * Deserializes the block
             * @param serializationObject - the serialization object
             * @param scene - the scene
             * @param rootUrl - the root url
             */
            _deserialize(serializationObject, scene, rootUrl) {
                super._deserialize(serializationObject, scene, rootUrl);
                this.generateInWorldSpace = serializationObject.generateInWorldSpace;
                this.automaticNormalizationNormal = serializationObject.automaticNormalizationNormal;
                this.automaticNormalizationTangent = serializationObject.automaticNormalizationTangent;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _generateInWorldSpace_decorators = [editableInPropertyPage("Generate in world space instead of tangent space", 0 /* PropertyTypeForEdition.Boolean */, "PROPERTIES", { notifiers: { update: true } })];
            _automaticNormalizationNormal_decorators = [editableInPropertyPage("Force normalization for the worldNormal input", 0 /* PropertyTypeForEdition.Boolean */, "PROPERTIES", { notifiers: { update: true } })];
            _automaticNormalizationTangent_decorators = [editableInPropertyPage("Force normalization for the worldTangent input", 0 /* PropertyTypeForEdition.Boolean */, "PROPERTIES", { notifiers: { update: true } })];
            __esDecorate(null, null, _generateInWorldSpace_decorators, { kind: "field", name: "generateInWorldSpace", static: false, private: false, access: { has: obj => "generateInWorldSpace" in obj, get: obj => obj.generateInWorldSpace, set: (obj, value) => { obj.generateInWorldSpace = value; } }, metadata: _metadata }, _generateInWorldSpace_initializers, _generateInWorldSpace_extraInitializers);
            __esDecorate(null, null, _automaticNormalizationNormal_decorators, { kind: "field", name: "automaticNormalizationNormal", static: false, private: false, access: { has: obj => "automaticNormalizationNormal" in obj, get: obj => obj.automaticNormalizationNormal, set: (obj, value) => { obj.automaticNormalizationNormal = value; } }, metadata: _metadata }, _automaticNormalizationNormal_initializers, _automaticNormalizationNormal_extraInitializers);
            __esDecorate(null, null, _automaticNormalizationTangent_decorators, { kind: "field", name: "automaticNormalizationTangent", static: false, private: false, access: { has: obj => "automaticNormalizationTangent" in obj, get: obj => obj.automaticNormalizationTangent, set: (obj, value) => { obj.automaticNormalizationTangent = value; } }, metadata: _metadata }, _automaticNormalizationTangent_initializers, _automaticNormalizationTangent_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { HeightToNormalBlock };
let _Registered = false;
/**
 * Register side effects for heightToNormalBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterHeightToNormalBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.HeightToNormalBlock", HeightToNormalBlock);
}
//# sourceMappingURL=heightToNormalBlock.pure.js.map