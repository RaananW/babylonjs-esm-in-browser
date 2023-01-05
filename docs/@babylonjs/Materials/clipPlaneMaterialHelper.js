/** @internal */
export function addClipPlaneUniforms(uniforms) {
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
export function prepareDefinesForClipPlanes(primaryHolder, secondaryHolder, defines) {
    var _a, _b, _c, _d, _e, _f;
    let changed = false;
    let clipPlane = (_a = primaryHolder.clipPlane) !== null && _a !== void 0 ? _a : secondaryHolder.clipPlane;
    changed = addDefine(clipPlane, defines, "CLIPPLANE") || changed;
    clipPlane = (_b = primaryHolder.clipPlane2) !== null && _b !== void 0 ? _b : secondaryHolder.clipPlane2;
    changed = addDefine(clipPlane, defines, "CLIPPLANE2") || changed;
    clipPlane = (_c = primaryHolder.clipPlane3) !== null && _c !== void 0 ? _c : secondaryHolder.clipPlane3;
    changed = addDefine(clipPlane, defines, "CLIPPLANE3") || changed;
    clipPlane = (_d = primaryHolder.clipPlane4) !== null && _d !== void 0 ? _d : secondaryHolder.clipPlane4;
    changed = addDefine(clipPlane, defines, "CLIPPLANE4") || changed;
    clipPlane = (_e = primaryHolder.clipPlane5) !== null && _e !== void 0 ? _e : secondaryHolder.clipPlane5;
    changed = addDefine(clipPlane, defines, "CLIPPLANE5") || changed;
    clipPlane = (_f = primaryHolder.clipPlane6) !== null && _f !== void 0 ? _f : secondaryHolder.clipPlane6;
    changed = addDefine(clipPlane, defines, "CLIPPLANE6") || changed;
    return changed;
}
/** @internal */
export function bindClipPlane(effect, primaryHolder, secondaryHolder) {
    var _a, _b, _c, _d, _e, _f;
    let clipPlane = (_a = primaryHolder.clipPlane) !== null && _a !== void 0 ? _a : secondaryHolder.clipPlane;
    setClipPlane(effect, "vClipPlane", clipPlane);
    clipPlane = (_b = primaryHolder.clipPlane2) !== null && _b !== void 0 ? _b : secondaryHolder.clipPlane2;
    setClipPlane(effect, "vClipPlane2", clipPlane);
    clipPlane = (_c = primaryHolder.clipPlane3) !== null && _c !== void 0 ? _c : secondaryHolder.clipPlane3;
    setClipPlane(effect, "vClipPlane3", clipPlane);
    clipPlane = (_d = primaryHolder.clipPlane4) !== null && _d !== void 0 ? _d : secondaryHolder.clipPlane4;
    setClipPlane(effect, "vClipPlane4", clipPlane);
    clipPlane = (_e = primaryHolder.clipPlane5) !== null && _e !== void 0 ? _e : secondaryHolder.clipPlane5;
    setClipPlane(effect, "vClipPlane5", clipPlane);
    clipPlane = (_f = primaryHolder.clipPlane6) !== null && _f !== void 0 ? _f : secondaryHolder.clipPlane6;
    setClipPlane(effect, "vClipPlane6", clipPlane);
}
function setClipPlane(effect, uniformName, clipPlane) {
    if (clipPlane) {
        effect.setFloat4(uniformName, clipPlane.normal.x, clipPlane.normal.y, clipPlane.normal.z, clipPlane.d);
    }
}
function addDefine(clipPlane, defines, defineName) {
    let isSet = true;
    if (clipPlane) {
        if (Array.isArray(defines)) {
            const defineString = "#define " + defineName;
            isSet = defines.indexOf(defineString) !== -1;
            if (!isSet) {
                defines.push(defineString);
            }
        }
        else {
            isSet = defines[defineName];
            defines[defineName] = true;
        }
    }
    return !isSet;
}
//# sourceMappingURL=clipPlaneMaterialHelper.js.map