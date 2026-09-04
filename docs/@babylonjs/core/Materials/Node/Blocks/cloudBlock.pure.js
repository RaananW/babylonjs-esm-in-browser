/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../Enums/nodeMaterialBlockTargets.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * block used to Generate Fractal Brownian Motion Clouds
 */
let CloudBlock = (() => {
    var _a;
    let _classSuper = NodeMaterialBlock;
    let _octaves_decorators;
    let _octaves_initializers = [];
    let _octaves_extraInitializers = [];
    return _a = class CloudBlock extends _classSuper {
            /**
             * Creates a new CloudBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name, NodeMaterialBlockTargets.Neutral);
                /** Gets or sets the number of octaves */
                this.octaves = __runInitializers(this, _octaves_initializers, 6.0);
                __runInitializers(this, _octaves_extraInitializers);
                this.registerInput("seed", NodeMaterialBlockConnectionPointTypes.AutoDetect);
                this.registerInput("chaos", NodeMaterialBlockConnectionPointTypes.AutoDetect, true);
                this.registerInput("offsetX", NodeMaterialBlockConnectionPointTypes.Float, true);
                this.registerInput("offsetY", NodeMaterialBlockConnectionPointTypes.Float, true);
                this.registerInput("offsetZ", NodeMaterialBlockConnectionPointTypes.Float, true);
                this.registerOutput("output", NodeMaterialBlockConnectionPointTypes.Float);
                this._inputs[0].acceptedConnectionPointTypes.push(NodeMaterialBlockConnectionPointTypes.Vector2);
                this._inputs[0].acceptedConnectionPointTypes.push(NodeMaterialBlockConnectionPointTypes.Vector3);
                this._linkConnectionTypes(0, 1);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "CloudBlock";
            }
            /**
             * Gets the seed input component
             */
            get seed() {
                return this._inputs[0];
            }
            /**
             * Gets the chaos input component
             */
            get chaos() {
                return this._inputs[1];
            }
            /**
             * Gets the offset X input component
             */
            get offsetX() {
                return this._inputs[2];
            }
            /**
             * Gets the offset Y input component
             */
            get offsetY() {
                return this._inputs[3];
            }
            /**
             * Gets the offset Z input component
             */
            get offsetZ() {
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
                if (!this.seed.isConnected) {
                    return;
                }
                if (!this._outputs[0].hasEndpoints) {
                    return;
                }
                let functionString = `

        float cloudRandom(float p) { 
            float temp = fract(p * 0.011); 
            temp *= temp + 7.5; 
            temp *= temp + temp; 
            return fract(temp); 
        }

        // Based on Morgan McGuire @morgan3d
        // https://www.shadertoy.com/view/4dS3Wd
        float cloudNoise2(vec2 x, vec2 chaos) {
            vec2 step = chaos * vec2(75., 120.) + vec2(75., 120.);

            vec2 i = floor(x);
            vec2 f = fract(x);

            float n = dot(i, step);

            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(
                    mix(cloudRandom(n + dot(step, vec2(0, 0))), cloudRandom(n + dot(step, vec2(1, 0))), u.x),
                    mix(cloudRandom(n + dot(step, vec2(0, 1))), cloudRandom(n + dot(step, vec2(1, 1))), u.x),
                    u.y
                );
        }

        float cloudNoise3(vec3 x, vec3 chaos) {
            vec3 step = chaos * vec3(60., 120., 75.) + vec3(60., 120., 75.);

            vec3 i = floor(x);
            vec3 f = fract(x);

            float n = dot(i, step);

            vec3 u = f * f * (3.0 - 2.0 * f);
            return mix(mix(mix( cloudRandom(n + dot(step, vec3(0, 0, 0))), cloudRandom(n + dot(step, vec3(1, 0, 0))), u.x),
                           mix( cloudRandom(n + dot(step, vec3(0, 1, 0))), cloudRandom(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
                       mix(mix( cloudRandom(n + dot(step, vec3(0, 0, 1))), cloudRandom(n + dot(step, vec3(1, 0, 1))), u.x),
                           mix( cloudRandom(n + dot(step, vec3(0, 1, 1))), cloudRandom(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
        }`;
                let fractalBrownianString = `
        float fbm2(vec2 st, vec2 chaos) {
            // Initial values
            float value = 0.0;
            float amplitude = .5;
            float frequency = 0.;

            // Loop of octaves
            vec2 tempST = st;
            for (int i = 0; i < OCTAVES; i++) {
                value += amplitude * cloudNoise2(tempST, chaos);
                tempST *= 2.0;
                amplitude *= 0.5;
            }
            return value;
        }

        float fbm3(vec3 x, vec3 chaos) {
            // Initial values
            float value = 0.0;
            float amplitude = 0.5;
            vec3 tempX = x;
            for (int i = 0; i < OCTAVES; i++) {
                value += amplitude * cloudNoise3(tempX, chaos);
                tempX = tempX * 2.0;
                amplitude *= 0.5;
            }
            return value;
        }`;
                if (state.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
                    functionString = state._babylonSLtoWGSL(functionString);
                    fractalBrownianString = state._babylonSLtoWGSL(fractalBrownianString);
                }
                const fbmNewName = `fbm${this.octaves}`;
                state._emitFunction("CloudBlockCode", functionString, "// CloudBlockCode");
                state._emitFunction("CloudBlockCodeFBM" + this.octaves, fractalBrownianString.replace(/fbm/gi, fbmNewName).replace(/OCTAVES/gi, (this.octaves | 0).toString()), "// CloudBlockCode FBM");
                const localVariable = state._getFreeVariableName("st");
                const seedType = this.seed.connectedPoint?.type || NodeMaterialBlockConnectionPointTypes.Vector3;
                state.compilationString += `${state._declareLocalVar(localVariable, seedType)} = ${this.seed.associatedVariableName};\n`;
                if (this.offsetX.isConnected) {
                    state.compilationString += `${localVariable}.x += 0.1 * ${this.offsetX.associatedVariableName};\n`;
                }
                if (this.offsetY.isConnected) {
                    state.compilationString += `${localVariable}.y += 0.1 * ${this.offsetY.associatedVariableName};\n`;
                }
                if (this.offsetZ.isConnected && seedType === NodeMaterialBlockConnectionPointTypes.Vector3) {
                    state.compilationString += `${localVariable}.z += 0.1 * ${this.offsetZ.associatedVariableName};\n`;
                }
                let chaosValue;
                if (this.chaos.isConnected) {
                    chaosValue = this.chaos.associatedVariableName;
                }
                else {
                    const addF = state.fSuffix;
                    chaosValue = this.seed.connectedPoint?.type === NodeMaterialBlockConnectionPointTypes.Vector2 ? `vec2${addF}(0., 0.)` : `vec3${addF}(0., 0., 0.)`;
                }
                state.compilationString +=
                    state._declareOutput(this._outputs[0]) +
                        ` = ${fbmNewName}${this.seed.connectedPoint?.type === NodeMaterialBlockConnectionPointTypes.Vector2 ? "2" : "3"}(${localVariable}, ${chaosValue});\n`;
                return this;
            }
            _dumpPropertiesCode() {
                const codeString = super._dumpPropertiesCode() + `${this._codeVariableName}.octaves = ${this.octaves};\n`;
                return codeString;
            }
            /**
             * Serializes the block
             * @returns the serialized object
             */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.octaves = this.octaves;
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
                this.octaves = serializationObject.octaves;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _octaves_decorators = [editableInPropertyPage("Octaves", 2 /* PropertyTypeForEdition.Int */, undefined, { embedded: true })];
            __esDecorate(null, null, _octaves_decorators, { kind: "field", name: "octaves", static: false, private: false, access: { has: obj => "octaves" in obj, get: obj => obj.octaves, set: (obj, value) => { obj.octaves = value; } }, metadata: _metadata }, _octaves_initializers, _octaves_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { CloudBlock };
let _Registered = false;
/**
 * Register side effects for cloudBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterCloudBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.CloudBlock", CloudBlock);
}
//# sourceMappingURL=cloudBlock.pure.js.map