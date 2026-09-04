/** This file must only contain pure code and pure imports */
import { Color4 } from "../../Maths/math.color.pure.js";
import { ShaderMaterial } from "../shaderMaterial.pure.js";
/**
 * A material to use for fast depth-only rendering.
 * @since 5.0.0
 */
export class OcclusionMaterial extends ShaderMaterial {
    constructor(name, scene) {
        super(name, scene, "color", {
            attributes: ["position"],
            uniforms: ["world", "viewProjection", "color"],
        });
        this.disableColorWrite = true;
        this.forceDepthWrite = true;
        this.setColor4("color", new Color4(0, 0, 0, 1));
    }
}
//# sourceMappingURL=occlusionMaterial.pure.js.map