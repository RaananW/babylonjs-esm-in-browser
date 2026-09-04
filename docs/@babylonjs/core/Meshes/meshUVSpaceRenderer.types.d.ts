import { type Nullable } from "../types.js";
import { type ShaderMaterial } from "../Materials/shaderMaterial.js";
declare module "../scene.pure.js" {
    /** @internal */
    interface Scene {
        /** @internal */
        _meshUVSpaceRendererShader: Nullable<ShaderMaterial>;
        /** @internal */
        _meshUVSpaceRendererMaskShader: Nullable<ShaderMaterial>;
    }
}
