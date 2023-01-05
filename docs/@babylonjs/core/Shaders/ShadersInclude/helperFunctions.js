// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "helperFunctions";
const shader = `const float PI=3.1415926535897932384626433832795;
#define absEps(x) abs(x)+Epsilon
#define maxEps(x) max(x,Epsilon)
#define saturateEps(x) clamp(x,Epsilon,1.0)
mat3 transposeMat3(mat3 inMatrix) {
vec3 toLinearSpaceExact(vec3 color)
return mix(remainingSection,nearZeroSection,lessThanEqual(color,vec3(0.04045)));
return
}
return mix(remainingSection,nearZeroSection,lessThanEqual(color,vec3(0.0031308)));
return
}
float toLinearSpace(float color)
float nearZeroSection=0.0773993808*color;
return pow(color,LinearEncodePowerApprox);
}
return toLinearSpaceExact(color);
return pow(color,vec3(LinearEncodePowerApprox));
}
return vec4(toLinearSpaceExact(color.rgb),color.a);
return vec4(pow(color.rgb,vec3(LinearEncodePowerApprox)),color.a);
}
float nearZeroSection=12.92*color;
return pow(color,GammaEncodePowerApprox);
}
return toGammaSpaceExact(color);
return pow(color,vec3(GammaEncodePowerApprox));
}
return vec4(toGammaSpaceExact(color.rgb),color.a);
return vec4(pow(color.rgb,vec3(GammaEncodePowerApprox)),color.a);
}
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const helperFunctions = { name, shader };
//# sourceMappingURL=helperFunctions.js.map