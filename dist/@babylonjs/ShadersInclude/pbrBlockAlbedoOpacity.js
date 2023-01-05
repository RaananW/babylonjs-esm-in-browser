// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrBlockAlbedoOpacity";
const shader = `struct albedoOpacityOutParams
void albedoOpacityBlock(
in vec4 albedoTexture,
#ifdef OPACITY
in vec4 opacityMap,
#ifdef DETAIL
in vec4 detailColor,
out albedoOpacityOutParams outParams
#if defined(ALPHAFROMALBEDO) || defined(ALPHATEST)
alpha*=albedoTexture.a;
#ifdef GAMMAALBEDO
surfaceAlbedo*=toLinearSpace(albedoTexture.rgb);
surfaceAlbedo*=albedoTexture.rgb;
surfaceAlbedo*=albedoInfos.y;
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
surfaceAlbedo*=vColor.rgb;
#ifdef DETAIL
float detailAlbedo=2.0*mix(0.5,detailColor.r,vDetailInfos.y);
#define CUSTOM_FRAGMENT_UPDATE_ALBEDO
#ifdef OPACITY
#ifdef OPACITYRGB
alpha=getLuminance(opacityMap.rgb);
alpha*=opacityMap.a;
alpha*=vOpacityInfos.y;
#if defined(VERTEXALPHA) || defined(INSTANCESCOLOR) && defined(INSTANCES)
alpha*=vColor.a;
#if !defined(SS_LINKREFRACTIONTOTRANSPARENCY) && !defined(ALPHAFRESNEL)
#ifdef ALPHATEST
if (alpha<ALPHATESTVALUE)
alpha=1.0;
#endif
#endif
outParams.surfaceAlbedo=surfaceAlbedo;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrBlockAlbedoOpacity = { name, shader };
//# sourceMappingURL=pbrBlockAlbedoOpacity.js.map