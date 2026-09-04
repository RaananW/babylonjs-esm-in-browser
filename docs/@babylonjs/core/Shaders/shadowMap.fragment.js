// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { packingFunctions } from "./ShadersInclude/packingFunctions.js";
import { bayerDitherFunctions } from "./ShadersInclude/bayerDitherFunctions.js";
import { shadowMapFragmentExtraDeclaration } from "./ShadersInclude/shadowMapFragmentExtraDeclaration.js";
import { clipPlaneFragmentDeclaration } from "./ShadersInclude/clipPlaneFragmentDeclaration.js";
import { clipPlaneFragment } from "./ShadersInclude/clipPlaneFragment.js";
import { shadowMapFragment } from "./ShadersInclude/shadowMapFragment.js";
const name = "shadowMapPixelShader";
const shader = `#include<shadowMapFragmentExtraDeclaration>
#ifdef ALPHATEXTURE
varying vec2 vUV;uniform sampler2D diffuseSampler;
#endif
#include<clipPlaneFragmentDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{
#include<clipPlaneFragment>
#ifdef ALPHATEXTURE
vec4 opacityMap=texture2D(diffuseSampler,vUV);float alphaFromAlphaTexture=opacityMap.a;
#if SM_SOFTTRANSPARENTSHADOW==1
if (softTransparentShadowSM.y==1.0) {opacityMap.rgb=opacityMap.rgb*vec3(0.3,0.59,0.11);alphaFromAlphaTexture=opacityMap.x+opacityMap.y+opacityMap.z;}
#endif
#ifdef ALPHATESTVALUE
if (alphaFromAlphaTexture<ALPHATESTVALUE)
discard;
#endif
#endif
#if SM_SOFTTRANSPARENTSHADOW==1
#ifdef ALPHATEXTURE
if ((bayerDither8(floor(mod(gl_FragCoord.xy,8.0))))/64.0>=softTransparentShadowSM.x*alphaFromAlphaTexture) discard;
#else
if ((bayerDither8(floor(mod(gl_FragCoord.xy,8.0))))/64.0>=softTransparentShadowSM.x) discard;
#endif
#endif
#include<shadowMapFragment>
}`;
// Sideeffect
if (!ShaderStore.ShadersStore[name]) {
    ShaderStore.ShadersStore[name] = shader;
}
const includes = [packingFunctions, bayerDitherFunctions, shadowMapFragmentExtraDeclaration, clipPlaneFragmentDeclaration, clipPlaneFragment, shadowMapFragment];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStore[inc.name]) {
        ShaderStore.IncludesShadersStore[inc.name] = inc.shader;
    }
}
/** @internal */
export const shadowMapPixelShader = { name, shader };
//# sourceMappingURL=shadowMap.fragment.js.map