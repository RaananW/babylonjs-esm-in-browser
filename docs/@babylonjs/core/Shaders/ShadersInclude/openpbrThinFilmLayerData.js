// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "openpbrThinFilmLayerData";
const shader = `#ifdef THIN_FILM
float thin_film_weight=vThinFilmWeight;float thin_film_thickness=vThinFilmThickness.r*1000.0; 
float thin_film_ior=vThinFilmIor;
#ifdef THIN_FILM_WEIGHT
float thinFilmWeightFromTexture=TEXRD(thinFilmWeightSampler,vThinFilmWeightUV+uvOffset).r*vThinFilmWeightInfos.y;
#endif
#ifdef THIN_FILM_THICKNESS
float thinFilmThicknessFromTexture=TEXRD(thinFilmThicknessSampler,vThinFilmThicknessUV+uvOffset).g*vThinFilmThicknessInfos.y;
#endif
#ifdef THIN_FILM_WEIGHT
thin_film_weight*=thinFilmWeightFromTexture;
#endif
#ifdef THIN_FILM_THICKNESS
thin_film_thickness*=thinFilmThicknessFromTexture;
#endif
float thin_film_ior_scale=clamp(2.0f*abs(thin_film_ior-1.0f),0.0f,1.0f);
#endif
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStore[name]) {
    ShaderStore.IncludesShadersStore[name] = shader;
}
/** @internal */
export const openpbrThinFilmLayerData = { name, shader };
//# sourceMappingURL=openpbrThinFilmLayerData.js.map