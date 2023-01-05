// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "screenSpaceReflectionPixelShader";
const shader = `uniform sampler2D textureSampler;
uniform sampler2D reflectivitySampler;
uniform mat4 view;
struct ReflectionInfo {
depth*=-1.0;
if(((depth-dir.z)<threshold) && depth<=0.0)
return smoothReflectionInfo(dir,hitCoord);
info.color=texture2D(textureSampler,projectedCoord.xy).rgb;
}
void main()
vec4 albedoFull=texture2D(textureSampler,vUV);
reflected.z*=-1.0;
float reflectionMultiplier=clamp(pow(spec*strength,reflectionSpecularFalloffExponent)*screenEdgefactor*reflected.z,0.0,0.9);
gl_FragColor=texture2D(textureSampler,vUV);
}
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const screenSpaceReflectionPixelShader = { name, shader };
//# sourceMappingURL=screenSpaceReflection.fragment.js.map