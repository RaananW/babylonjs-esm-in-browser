// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrDebug";
const shader = `#if DEBUGMODE>0
if (vClipSpacePosition.x/vClipSpacePosition.w>=vDebugMode.x) {
gl_FragColor.rgb=vPositionW.rgb;
#elif DEBUGMODE==2 && defined(NORMAL)
gl_FragColor.rgb=vNormalW.rgb;
#elif DEBUGMODE==3 && defined(BUMP) || DEBUGMODE==3 && defined(PARALLAX) || DEBUGMODE==3 && defined(ANISOTROPIC)
gl_FragColor.rgb=TBN[0];
#elif DEBUGMODE==4 && defined(BUMP) || DEBUGMODE==4 && defined(PARALLAX) || DEBUGMODE==4 && defined(ANISOTROPIC)
gl_FragColor.rgb=TBN[1];
#elif DEBUGMODE==5
gl_FragColor.rgb=normalW;
#elif DEBUGMODE==6 && defined(MAINUV1)
gl_FragColor.rgb=vec3(vMainUV1,0.0);
gl_FragColor.rgb=vec3(vMainUV2,0.0);
gl_FragColor.rgb=clearcoatOut.TBNClearCoat[0];
#elif DEBUGMODE==9 && defined(CLEARCOAT) && defined(CLEARCOAT_BUMP)
gl_FragColor.rgb=clearcoatOut.TBNClearCoat[1];
#elif DEBUGMODE==10 && defined(CLEARCOAT)
gl_FragColor.rgb=clearcoatOut.clearCoatNormalW;
#elif DEBUGMODE==11 && defined(ANISOTROPIC)
gl_FragColor.rgb=anisotropicOut.anisotropicNormal;
#elif DEBUGMODE==12 && defined(ANISOTROPIC)
gl_FragColor.rgb=anisotropicOut.anisotropicTangent;
#elif DEBUGMODE==13 && defined(ANISOTROPIC)
gl_FragColor.rgb=anisotropicOut.anisotropicBitangent;
#elif DEBUGMODE==20 && defined(ALBEDO)
gl_FragColor.rgb=albedoTexture.rgb;
gl_FragColor.rgb=aoOut.ambientOcclusionColorMap.rgb;
gl_FragColor.rgb=opacityMap.rgb;
gl_FragColor.rgb=emissiveColorTex.rgb;
#elif DEBUGMODE==24 && defined(LIGHTMAP)
gl_FragColor.rgb=lightmapColor.rgb;
#elif DEBUGMODE==25 && defined(REFLECTIVITY) && defined(METALLICWORKFLOW)
gl_FragColor.rgb=reflectivityOut.surfaceMetallicColorMap.rgb;
gl_FragColor.rgb=reflectivityOut.surfaceReflectivityColorMap.rgb;
#elif DEBUGMODE==27 && defined(CLEARCOAT) && defined(CLEARCOAT_TEXTURE)
gl_FragColor.rgb=vec3(clearcoatOut.clearCoatMapData.rg,0.0);
gl_FragColor.rgb=clearcoatOut.clearCoatTintMapData.rgb;
gl_FragColor.rgb=sheenOut.sheenMapData.rgb;
gl_FragColor.rgb=anisotropicOut.anisotropyMapData.rgb;
gl_FragColor.rgb=subSurfaceOut.thicknessMap.rgb;
gl_FragColor.rgb=subSurfaceOut.environmentRefraction.rgb;
#elif DEBUGMODE==41 && defined(REFLECTION)
gl_FragColor.rgb=reflectionOut.environmentRadiance.rgb;
#elif DEBUGMODE==42 && defined(CLEARCOAT) && defined(REFLECTION)
gl_FragColor.rgb=clearcoatOut.environmentClearCoatRadiance.rgb;
#elif DEBUGMODE==50
gl_FragColor.rgb=diffuseBase.rgb;
#elif DEBUGMODE==51 && defined(SPECULARTERM)
gl_FragColor.rgb=specularBase.rgb;
#elif DEBUGMODE==52 && defined(CLEARCOAT)
gl_FragColor.rgb=clearCoatBase.rgb;
#elif DEBUGMODE==53 && defined(SHEEN)
gl_FragColor.rgb=sheenBase.rgb;
#elif DEBUGMODE==54 && defined(REFLECTION)
gl_FragColor.rgb=reflectionOut.environmentIrradiance.rgb;
#elif DEBUGMODE==60
gl_FragColor.rgb=surfaceAlbedo.rgb;
#elif DEBUGMODE==61
gl_FragColor.rgb=clearcoatOut.specularEnvironmentR0;
#elif DEBUGMODE==62 && defined(METALLICWORKFLOW)
gl_FragColor.rgb=vec3(reflectivityOut.metallicRoughness.r);
gl_FragColor.rgb=reflectivityOut.metallicF0;
gl_FragColor.rgb=vec3(roughness);
gl_FragColor.rgb=vec3(alphaG);
gl_FragColor.rgb=vec3(NdotV);
gl_FragColor.rgb=clearcoatOut.clearCoatColor.rgb;
#elif DEBUGMODE==67 && defined(CLEARCOAT)
gl_FragColor.rgb=vec3(clearcoatOut.clearCoatRoughness);
gl_FragColor.rgb=vec3(clearcoatOut.clearCoatNdotV);
gl_FragColor.rgb=subSurfaceOut.transmittance;
gl_FragColor.rgb=subSurfaceOut.refractionTransmittance;
gl_FragColor.rgb=vec3(seo);
gl_FragColor.rgb=vec3(eho);
gl_FragColor.rgb=vec3(energyConservationFactor);
gl_FragColor.rgb=specularEnvironmentReflectance;
#elif DEBUGMODE==84 && defined(CLEARCOAT) && defined(ENVIRONMENTBRDF) && !defined(REFLECTIONMAP_SKYBOX)
gl_FragColor.rgb=clearcoatOut.clearCoatEnvironmentReflectance;
#elif DEBUGMODE==85 && defined(SHEEN) && defined(REFLECTION)
gl_FragColor.rgb=sheenOut.sheenEnvironmentReflectance;
#elif DEBUGMODE==86 && defined(ALPHABLEND)
gl_FragColor.rgb=vec3(luminanceOverAlpha);
gl_FragColor.rgb=vec3(alpha);
gl_FragColor.rgb*=vDebugMode.y;
gl_FragColor.rgb=normalize(gl_FragColor.rgb)*0.5+0.5;
#ifdef DEBUGMODE_GAMMA
gl_FragColor.rgb=toGammaSpace(gl_FragColor.rgb);
gl_FragColor.a=1.0;
gl_FragData[0]=toLinearSpace(gl_FragColor); 
return;
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrDebug = { name, shader };
//# sourceMappingURL=pbrDebug.js.map