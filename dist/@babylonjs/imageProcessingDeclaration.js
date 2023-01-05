// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "imageProcessingDeclaration";
const shader = `#ifdef EXPOSURE
uniform float exposureLinear;
#ifdef CONTRAST
uniform float contrast;
#if defined(VIGNETTE) || defined(DITHER)
uniform vec2 vInverseScreenSize;
#ifdef VIGNETTE
uniform vec4 vignetteSettings1;
#ifdef COLORCURVES
uniform vec4 vCameraColorCurveNegative;
#ifdef COLORGRADING
#ifdef COLORGRADING3D
uniform highp sampler3D txColorTransform;
uniform sampler2D txColorTransform;
uniform vec4 colorTransformSettings;
#ifdef DITHER
uniform float ditherIntensity;
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const imageProcessingDeclaration = { name, shader };
//# sourceMappingURL=imageProcessingDeclaration.js.map