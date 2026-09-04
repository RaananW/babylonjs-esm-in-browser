/** This file must only contain pure code and pure imports */
import { AddAnimationExtensions } from "./animatable.core.js";
import { Bone } from "../Bones/bone.pure.js";
import { Scene } from "../scene.pure.js";
export * from "./animatable.core.js";
let _Registered = false;
/**
 * Register side effects for animatable.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterAnimatable() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    // Connect everything!
    AddAnimationExtensions(Scene, Bone);
}
//# sourceMappingURL=animatable.pure.js.map