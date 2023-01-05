// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "backgroundFragmentDeclaration";
const shader = `uniform vec4 vEyePosition;
uniform vec4 vPrimaryColorShadow;
uniform float shadowLevel;
uniform vec2 vDiffuseInfos;
#ifdef REFLECTION
uniform vec2 vReflectionInfos;
#if defined(REFLECTIONFRESNEL) || defined(OPACITYFRESNEL)
uniform vec3 vBackgroundCenter;
#ifdef REFLECTIONFRESNEL
uniform vec4 vReflectionControl;
#if defined(REFLECTIONMAP_SPHERICAL) || defined(REFLECTIONMAP_PROJECTION) || defined(REFRACTION)
uniform mat4 view;
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const backgroundFragmentDeclaration = { name, shader };
//# sourceMappingURL=backgroundFragmentDeclaration.js.map