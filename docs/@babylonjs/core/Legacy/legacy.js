/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-restricted-imports */
import * as BABYLON from "../index.js";
import * as DebugImport from "../Debug/index.js";
import { RegisterMathColor } from "../Maths/math.color.pure.js";
import { RegisterMathVector } from "../Maths/math.vector.pure.js";
/**
 * Legacy support, defining window.BABYLON (global variable).
 *
 * This is the entry point for the UMD module.
 * The entry point for a future ESM package should be index.ts
 */
const GlobalObject = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : undefined;
function RegisterLegacyGlobal() {
    if (typeof GlobalObject === "undefined") {
        return;
    }
    GlobalObject.BABYLON = GlobalObject.BABYLON || {};
    const BABYLONGLOBAL = GlobalObject.BABYLON;
    if (!BABYLONGLOBAL.Debug) {
        BABYLONGLOBAL.Debug = BABYLONGLOBAL.Debug || {};
        for (const key in DebugImport) {
            if (!BABYLONGLOBAL.Debug[key]) {
                BABYLONGLOBAL.Debug[key] = DebugImport[key];
            }
        }
    }
    for (const key in BABYLON) {
        if (!BABYLONGLOBAL[key]) {
            BABYLONGLOBAL[key] = BABYLON[key];
        }
    }
}
function RegisterLegacyRuntime() {
    RegisterMathColor();
    RegisterMathVector();
    RegisterLegacyGlobal();
}
RegisterLegacyRuntime();
export * from "../index.js";
export const Debug = {
    AxesViewer: BABYLON.AxesViewer,
    BoneAxesViewer: BABYLON.BoneAxesViewer,
    PhysicsViewer: BABYLON.PhysicsViewer,
    SkeletonViewer: BABYLON.SkeletonViewer,
};
//# sourceMappingURL=legacy.js.map