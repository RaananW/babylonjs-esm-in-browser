import { FloatingOriginCurrentScene } from "./floatingOriginMatrixOverrides.js";
import { Vector3 } from "../Maths/math.vector.pure.js";
/** @internal */
export function AddClipPlaneUniforms(uniforms) {
    if (uniforms.indexOf("vClipPlane") === -1) {
        uniforms.push("vClipPlane");
    }
    if (uniforms.indexOf("vClipPlane2") === -1) {
        uniforms.push("vClipPlane2");
    }
    if (uniforms.indexOf("vClipPlane3") === -1) {
        uniforms.push("vClipPlane3");
    }
    if (uniforms.indexOf("vClipPlane4") === -1) {
        uniforms.push("vClipPlane4");
    }
    if (uniforms.indexOf("vClipPlane5") === -1) {
        uniforms.push("vClipPlane5");
    }
    if (uniforms.indexOf("vClipPlane6") === -1) {
        uniforms.push("vClipPlane6");
    }
}
/** @internal */
export function PrepareStringDefinesForClipPlanes(primaryHolder, secondaryHolder, defines) {
    const clipPlane = !!(primaryHolder.clipPlane ?? secondaryHolder.clipPlane);
    const clipPlane2 = !!(primaryHolder.clipPlane2 ?? secondaryHolder.clipPlane2);
    const clipPlane3 = !!(primaryHolder.clipPlane3 ?? secondaryHolder.clipPlane3);
    const clipPlane4 = !!(primaryHolder.clipPlane4 ?? secondaryHolder.clipPlane4);
    const clipPlane5 = !!(primaryHolder.clipPlane5 ?? secondaryHolder.clipPlane5);
    const clipPlane6 = !!(primaryHolder.clipPlane6 ?? secondaryHolder.clipPlane6);
    if (clipPlane) {
        defines.push("#define CLIPPLANE");
    }
    if (clipPlane2) {
        defines.push("#define CLIPPLANE2");
    }
    if (clipPlane3) {
        defines.push("#define CLIPPLANE3");
    }
    if (clipPlane4) {
        defines.push("#define CLIPPLANE4");
    }
    if (clipPlane5) {
        defines.push("#define CLIPPLANE5");
    }
    if (clipPlane6) {
        defines.push("#define CLIPPLANE6");
    }
}
/** @internal */
export function PrepareDefinesForClipPlanes(primaryHolder, secondaryHolder, defines) {
    let changed = false;
    const clipPlane = !!(primaryHolder.clipPlane ?? secondaryHolder.clipPlane);
    const clipPlane2 = !!(primaryHolder.clipPlane2 ?? secondaryHolder.clipPlane2);
    const clipPlane3 = !!(primaryHolder.clipPlane3 ?? secondaryHolder.clipPlane3);
    const clipPlane4 = !!(primaryHolder.clipPlane4 ?? secondaryHolder.clipPlane4);
    const clipPlane5 = !!(primaryHolder.clipPlane5 ?? secondaryHolder.clipPlane5);
    const clipPlane6 = !!(primaryHolder.clipPlane6 ?? secondaryHolder.clipPlane6);
    // Do not factorize this code, it breaks browsers optimizations.
    if (defines["CLIPPLANE"] !== clipPlane) {
        defines["CLIPPLANE"] = clipPlane;
        changed = true;
    }
    if (defines["CLIPPLANE2"] !== clipPlane2) {
        defines["CLIPPLANE2"] = clipPlane2;
        changed = true;
    }
    if (defines["CLIPPLANE3"] !== clipPlane3) {
        defines["CLIPPLANE3"] = clipPlane3;
        changed = true;
    }
    if (defines["CLIPPLANE4"] !== clipPlane4) {
        defines["CLIPPLANE4"] = clipPlane4;
        changed = true;
    }
    if (defines["CLIPPLANE5"] !== clipPlane5) {
        defines["CLIPPLANE5"] = clipPlane5;
        changed = true;
    }
    if (defines["CLIPPLANE6"] !== clipPlane6) {
        defines["CLIPPLANE6"] = clipPlane6;
        changed = true;
    }
    return changed;
}
/** @internal */
export function BindClipPlane(effect, primaryHolder, secondaryHolder) {
    let clipPlane = primaryHolder.clipPlane ?? secondaryHolder.clipPlane;
    SetClipPlane(effect, "vClipPlane", clipPlane);
    clipPlane = primaryHolder.clipPlane2 ?? secondaryHolder.clipPlane2;
    SetClipPlane(effect, "vClipPlane2", clipPlane);
    clipPlane = primaryHolder.clipPlane3 ?? secondaryHolder.clipPlane3;
    SetClipPlane(effect, "vClipPlane3", clipPlane);
    clipPlane = primaryHolder.clipPlane4 ?? secondaryHolder.clipPlane4;
    SetClipPlane(effect, "vClipPlane4", clipPlane);
    clipPlane = primaryHolder.clipPlane5 ?? secondaryHolder.clipPlane5;
    SetClipPlane(effect, "vClipPlane5", clipPlane);
    clipPlane = primaryHolder.clipPlane6 ?? secondaryHolder.clipPlane6;
    SetClipPlane(effect, "vClipPlane6", clipPlane);
}
function SetClipPlane(effect, uniformName, clipPlane) {
    if (clipPlane) {
        // Original clipplane is using equation normal.dot(p) + d = 0
        // Assume we have p' = p - offset, that means normal.dot(p') + d' = 0
        // So to get the offset plane,
        // normal.dot(p' + offset) + d = 0
        // normal.dot(p') + normal.dot(offset) + d = 0
        // -d' + normal.dot(offset) + d = 0
        // d' = d + normal.dot(offset)
        const offset = FloatingOriginCurrentScene.getScene()?.floatingOriginOffset || Vector3.ZeroReadOnly;
        effect.setFloat4(uniformName, clipPlane.normal.x, clipPlane.normal.y, clipPlane.normal.z, clipPlane.d + Vector3.Dot(clipPlane.normal, offset));
    }
}
//# sourceMappingURL=clipPlaneMaterialHelper.js.map