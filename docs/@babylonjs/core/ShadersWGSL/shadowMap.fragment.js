// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { packingFunctionsWGSL } from "./ShadersInclude/packingFunctions.js";
import { bayerDitherFunctionsWGSL } from "./ShadersInclude/bayerDitherFunctions.js";
import { shadowMapFragmentExtraDeclarationWGSL } from "./ShadersInclude/shadowMapFragmentExtraDeclaration.js";
import { clipPlaneFragmentDeclarationWGSL } from "./ShadersInclude/clipPlaneFragmentDeclaration.js";
import { clipPlaneFragmentWGSL } from "./ShadersInclude/clipPlaneFragment.js";
import { shadowMapFragmentWGSL } from "./ShadersInclude/shadowMapFragment.js";
const name = "shadowMapPixelShader";
const shader = `#include<shadowMapFragmentExtraDeclaration>
#ifdef ALPHATEXTURE
varying vUV: vec2f;var diffuseSamplerSampler: sampler;var diffuseSampler: texture_2d<f32>;
#endif
#include<clipPlaneFragmentDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#include<clipPlaneFragment>
#ifdef ALPHATEXTURE
var opacityMap: vec4f=textureSample(diffuseSampler,diffuseSamplerSampler,fragmentInputs.vUV);var alphaFromAlphaTexture: f32=opacityMap.a;
#if SM_SOFTTRANSPARENTSHADOW==1
if (uniforms.softTransparentShadowSM.y==1.0) {opacityMap=vec4f(opacityMap.rgb* vec3f(0.3,0.59,0.11),opacityMap.a);alphaFromAlphaTexture=opacityMap.x+opacityMap.y+opacityMap.z;}
#endif
#ifdef ALPHATESTVALUE
if (alphaFromAlphaTexture<ALPHATESTVALUE) {discard;}
#endif
#endif
#if SM_SOFTTRANSPARENTSHADOW==1
#ifdef ALPHATEXTURE
if ((bayerDither8(floor(((fragmentInputs.position.xy)%(8.0)))))/64.0>=uniforms.softTransparentShadowSM.x*alphaFromAlphaTexture) {discard;}
#else
if ((bayerDither8(floor(((fragmentInputs.position.xy)%(8.0)))))/64.0>=uniforms.softTransparentShadowSM.x) {discard;} 
#endif
#endif
#include<shadowMapFragment>
}`;
// Sideeffect
if (!ShaderStore.ShadersStoreWGSL[name]) {
    ShaderStore.ShadersStoreWGSL[name] = shader;
}
const includes = [packingFunctionsWGSL, bayerDitherFunctionsWGSL, shadowMapFragmentExtraDeclarationWGSL, clipPlaneFragmentDeclarationWGSL, clipPlaneFragmentWGSL, shadowMapFragmentWGSL];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStoreWGSL[inc.name]) {
        ShaderStore.IncludesShadersStoreWGSL[inc.name] = inc.shader;
    }
}
/** @internal */
export const shadowMapPixelShaderWGSL = { name, shader };
//# sourceMappingURL=shadowMap.fragment.js.map