// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrDirectLightingFalloffFunctions";
const shader = `float computeDistanceLightFalloff_Standard(vec3 lightOffset,float range)
return computeDistanceLightFalloff_Physical(lightDistanceSquared);
return computeDistanceLightFalloff_GLTF(lightDistanceSquared,inverseSquaredRange);
return computeDistanceLightFalloff_Standard(lightOffset,range);
}
return computeDirectionalLightFalloff_Physical(lightDirection,directionToLightCenterW,cosHalfAngle);
return computeDirectionalLightFalloff_GLTF(lightDirection,directionToLightCenterW,lightAngleScale,lightAngleOffset);
return computeDirectionalLightFalloff_Standard(lightDirection,directionToLightCenterW,cosHalfAngle,exponent);
}`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrDirectLightingFalloffFunctions = { name, shader };
//# sourceMappingURL=pbrDirectLightingFalloffFunctions.js.map