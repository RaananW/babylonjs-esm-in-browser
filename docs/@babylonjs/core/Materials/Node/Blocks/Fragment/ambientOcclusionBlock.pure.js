/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { NodeMaterialConnectionPointCustomObject } from "../../nodeMaterialConnectionPointCustomObject.js";
import { RandomRange } from "../../../../Maths/math.scalar.functions.js";
import { RawTexture } from "../../../Textures/rawTexture.js";

import { Texture } from "../../../Textures/texture.pure.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { ImageSourceBlock } from "../Dual/imageSourceBlock.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to evaluate screen spaceambient occlusion in a shader
 */
let AmbientOcclusionBlock = (() => {
    var _a;
    let _classSuper = NodeMaterialBlock;
    let _radius_decorators;
    let _radius_initializers = [];
    let _radius_extraInitializers = [];
    let _area_decorators;
    let _area_initializers = [];
    let _area_extraInitializers = [];
    let _fallOff_decorators;
    let _fallOff_initializers = [];
    let _fallOff_extraInitializers = [];
    return _a = class AmbientOcclusionBlock extends _classSuper {
            /**
             * Create a new AmbientOcclusionBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name, NodeMaterialBlockTargets.Fragment);
                /**
                 * Defines the radius around the analyzed pixel used by the SSAO post-process
                 */
                this.radius = __runInitializers(this, _radius_initializers, 0.0001);
                /**
                 * Related to fallOff, used to interpolate SSAO samples (first interpolate function input) based on the occlusion difference of each pixel
                 * Must not be equal to fallOff and superior to fallOff.
                 */
                this.area = (__runInitializers(this, _radius_extraInitializers), __runInitializers(this, _area_initializers, 0.0075));
                /**
                 * Related to area, used to interpolate SSAO samples (second interpolate function input) based on the occlusion difference of each pixel
                 * Must not be equal to area and inferior to area.
                 */
                this.fallOff = (__runInitializers(this, _area_extraInitializers), __runInitializers(this, _fallOff_initializers, 0.000001));
                __runInitializers(this, _fallOff_extraInitializers);
                this.registerInput("source", NodeMaterialBlockConnectionPointTypes.Object, true, NodeMaterialBlockTargets.VertexAndFragment, new NodeMaterialConnectionPointCustomObject("source", this, 0 /* NodeMaterialConnectionPointDirection.Input */, ImageSourceBlock, "ImageSourceBlock"));
                this.registerInput("screenSize", NodeMaterialBlockConnectionPointTypes.Vector2);
                this.registerOutput("occlusion", NodeMaterialBlockConnectionPointTypes.Float);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "AmbientOcclusionBlock";
            }
            /**
             * Gets the source component
             */
            get source() {
                return this._inputs[0];
            }
            /**
             * Gets the screenSize component
             */
            get screenSize() {
                return this._inputs[1];
            }
            /**
             * Gets the occlusion output
             */
            get occlusion() {
                return this._outputs[0];
            }
            /**
             * Bind data to effect
             * @param effect - the effect to bind to
             */
            bind(effect) {
                if (!this._randomTexture) {
                    this._createRandomTexture(effect.getEngine());
                }
                effect.setTexture(this._randomSamplerName, this._randomTexture);
            }
            _createRandomTexture(engine) {
                const size = 512;
                const data = new Uint8Array(size * size * 4);
                for (let index = 0; index < data.length;) {
                    data[index++] = Math.floor(Math.max(0.0, RandomRange(-1.0, 1.0)) * 255);
                    data[index++] = Math.floor(Math.max(0.0, RandomRange(-1.0, 1.0)) * 255);
                    data[index++] = Math.floor(Math.max(0.0, RandomRange(-1.0, 1.0)) * 255);
                    data[index++] = 255;
                }
                const texture = RawTexture.CreateRGBATexture(data, size, size, engine, false, false, 2);
                texture.name = "SSAORandomTexture";
                texture.wrapU = Texture.WRAP_ADDRESSMODE;
                texture.wrapV = Texture.WRAP_ADDRESSMODE;
                this._randomTexture = texture;
            }
            _buildBlock(state) {
                super._buildBlock(state);
                if (!this.source.connectedPoint) {
                    return this;
                }
                state.sharedData.bindableBlocks.push(this);
                const depthSource = this.source.connectedPoint.ownerBlock;
                const occlusion = this._outputs[0];
                const screenSize = this.screenSize;
                let functionString;
                // Get view position from depth
                if (state.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
                    functionString = `fn normalFromDepth(depth: f32, coords: vec2f, radius: f32) -> vec3f {
                let offset1: vec2f = vec2f(0.0, radius);
                let offset2: vec2f = vec2f(radius, 0.0);

                let depth1: f32 = textureSampleLevel(${depthSource.samplerName}, ${depthSource.samplerName}Sampler, coords + offset1, 0.0).r;
                let depth2: f32 = textureSampleLevel(${depthSource.samplerName}, ${depthSource.samplerName}Sampler, coords + offset2, 0.0).r;

                let p1: vec3f = vec3f(offset1, depth1 - depth);
                let p2: vec3f = vec3f(offset2, depth2 - depth);

                var normal: vec3f = cross(p1, p2);
                normal.z = -normal.z;

                return normalize(normal);
            }
            `;
                }
                else {
                    functionString = `vec3 normalFromDepth(float depth, vec2 coords, float radius) {
                vec2 offset1 = vec2(0.0, radius);
                vec2 offset2 = vec2(radius, 0.0);

                float depth1 = textureLod(${depthSource.samplerName}, coords + offset1, 0.0).r;
                float depth2 = textureLod(${depthSource.samplerName}, coords + offset2, 0.0).r;

                vec3 p1 = vec3(offset1, depth1 - depth);
                vec3 p2 = vec3(offset2, depth2 - depth);

                vec3 normal = cross(p1, p2);
                normal.z = -normal.z;

                return normalize(normal);
            }
            `;
                }
                state._emitFunction("normalFromDepth", functionString, "// normalFromDepth function");
                // Calculate ambient occlusion
                this._randomSamplerName = state._getFreeVariableName("randomSampler");
                state._emit2DSampler(this._randomSamplerName);
                if (state.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
                    functionString = `
            const sampleSphere: array<vec3f, 16> = array<vec3f, 16>(
                vec3f( 0.5381,  0.1856, -0.4319),
                vec3f( 0.1379,  0.2486,  0.4430),
                vec3f( 0.3371,  0.5679, -0.0057),
                vec3f(-0.6999, -0.0451, -0.0019),
                vec3f( 0.0689, -0.1598, -0.8547),
                vec3f( 0.0560,  0.0069, -0.1843),
                vec3f(-0.0146,  0.1402,  0.0762),
                vec3f( 0.0100, -0.1924, -0.0344),
                vec3f(-0.3577, -0.5301, -0.4358),
                vec3f(-0.3169,  0.1063,  0.0158),
                vec3f( 0.0103, -0.5869,  0.0046),
                vec3f(-0.0897, -0.4940,  0.3287),
                vec3f( 0.7119, -0.0154, -0.0918),
                vec3f(-0.0533,  0.0596, -0.5411),
                vec3f( 0.0352, -0.0631,  0.5460),
                vec3f(-0.4776,  0.2847, -0.0271)
            );

            fn computeOcclusion(screenSize: vec2f) -> f32 {
                let uv: vec2f = fragmentInputs.position.xy / screenSize;
                let random: vec3f = normalize(textureSampleLevel(${this._randomSamplerName}, ${this._randomSamplerName}Sampler, uv * 4.0, 0.0).rgb);
                let depth: f32 = textureSampleLevel(${depthSource.samplerName}, ${depthSource.samplerName}Sampler, uv, 0.0).r;
                let position: vec3f = vec3f(uv, depth);
                let normal: vec3f = normalFromDepth(depth, uv, ${this.radius}f);

                let radiusDepth: f32 = ${this.radius}f / depth;
                var occlusion: f32 = 0.0;

                var ray: vec3f;
                var hemiRay: vec3f;
                var occlusionDepth: f32;
                var difference: f32;

                for (var i: i32 = 0; i < 16; i++)
                {
                    ray = radiusDepth * reflect(sampleSphere[i], random);
                    hemiRay = position + sign(dot(ray, normal)) * ray;

                    occlusionDepth = textureSample(${depthSource.samplerName}, ${depthSource.samplerName}Sampler, clamp(hemiRay.xy, vec2f(0.001, 0.001), vec2f(0.999, 0.999))).r;
                    difference = depth - occlusionDepth;

                    occlusion += step(${this.fallOff}f, difference) * (1.0 - smoothstep(${this.fallOff}f, ${this.area}f, difference));
                }

                return clamp(1.0 - occlusion / 16.0, 0.0, 1.0);
            }
            `;
                }
                else {
                    functionString = `
            const vec3 sampleSphere[16] = vec3[](
                vec3( 0.5381,  0.1856, -0.4319),
                vec3( 0.1379,  0.2486,  0.4430),
                vec3( 0.3371,  0.5679, -0.0057),
                vec3(-0.6999, -0.0451, -0.0019),
                vec3( 0.0689, -0.1598, -0.8547),
                vec3( 0.0560,  0.0069, -0.1843),
                vec3(-0.0146,  0.1402,  0.0762),
                vec3( 0.0100, -0.1924, -0.0344),
                vec3(-0.3577, -0.5301, -0.4358),
                vec3(-0.3169,  0.1063,  0.0158),
                vec3( 0.0103, -0.5869,  0.0046),
                vec3(-0.0897, -0.4940,  0.3287),
                vec3( 0.7119, -0.0154, -0.0918),
                vec3(-0.0533,  0.0596, -0.5411),
                vec3( 0.0352, -0.0631,  0.5460),
                vec3(-0.4776,  0.2847, -0.0271)
            );

            float computeOcclusion(vec2 screenSize) {
                vec2 uv = gl_FragCoord.xy / screenSize;
                vec3 random = normalize(textureLod(${this._randomSamplerName}, uv * 4., 0.0).rgb);
                float depth = textureLod(${depthSource.samplerName}, uv, 0.0).r;              
                vec3 position = vec3(uv, depth);
                vec3 normal = normalFromDepth(depth, uv, ${this.radius} );

                float radiusDepth = ${this.radius} / depth;
                float occlusion = 0.0;

                vec3 ray;
                vec3 hemiRay;
                float occlusionDepth;
                float difference;

                for (int i = 0; i < 16; i++)
                {
                    ray = radiusDepth * reflect(sampleSphere[i], random);
                    hemiRay = position + sign(dot(ray, normal)) * ray;

                    occlusionDepth = texture2D(${depthSource.samplerName}, clamp(hemiRay.xy, vec2(0.001, 0.001), vec2(0.999, 0.999))).r;
                    difference = depth - occlusionDepth;

                    occlusion += step(${this.fallOff}, difference) * (1.0 - smoothstep(${this.fallOff}, ${this.area}, difference));
                }

                return clamp(1.0 - occlusion / 16.0, 0.0, 1.0);
            }
            `;
                }
                state._emitFunction("computeOcclusion", functionString, "// computeOcclusion function");
                state.compilationString += state._declareOutput(occlusion) + ` = computeOcclusion(${screenSize.associatedVariableName});`;
                return this;
            }
            /**
             * Releases the resources held by the block
             */
            dispose() {
                if (this._randomTexture) {
                    this._randomTexture.dispose();
                    this._randomTexture = null;
                }
                super.dispose();
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _radius_decorators = [editableInPropertyPage("radius", 1 /* PropertyTypeForEdition.Float */, "ADVANCED", {
                    min: 0.0001,
                })];
            _area_decorators = [editableInPropertyPage("area", 1 /* PropertyTypeForEdition.Float */, "ADVANCED", {
                    min: 0,
                })];
            _fallOff_decorators = [editableInPropertyPage("fallOff", 1 /* PropertyTypeForEdition.Float */, "ADVANCED", {
                    min: 0,
                })];
            __esDecorate(null, null, _radius_decorators, { kind: "field", name: "radius", static: false, private: false, access: { has: obj => "radius" in obj, get: obj => obj.radius, set: (obj, value) => { obj.radius = value; } }, metadata: _metadata }, _radius_initializers, _radius_extraInitializers);
            __esDecorate(null, null, _area_decorators, { kind: "field", name: "area", static: false, private: false, access: { has: obj => "area" in obj, get: obj => obj.area, set: (obj, value) => { obj.area = value; } }, metadata: _metadata }, _area_initializers, _area_extraInitializers);
            __esDecorate(null, null, _fallOff_decorators, { kind: "field", name: "fallOff", static: false, private: false, access: { has: obj => "fallOff" in obj, get: obj => obj.fallOff, set: (obj, value) => { obj.fallOff = value; } }, metadata: _metadata }, _fallOff_initializers, _fallOff_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { AmbientOcclusionBlock };
let _Registered = false;
/**
 * Register side effects for ambientOcclusionBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterAmbientOcclusionBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.AmbientOcclusionBlock", AmbientOcclusionBlock);
}
//# sourceMappingURL=ambientOcclusionBlock.pure.js.map