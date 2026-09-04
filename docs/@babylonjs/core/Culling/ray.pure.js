/** This file must only contain pure code and pure imports */
import { Scene } from "../scene.pure.js";
import { Camera } from "../Cameras/camera.pure.js";
import { AddRayExtensions, CreatePickingRayInCameraSpace, CreatePickingRayInCameraSpaceToRef, CreatePickingRayToRef, MultiPick, MultiPickWithRay, Pick, PickWithBoundingInfo, PickWithRay, } from "./ray.core.js";
export * from "./ray.core.js";
let _Registered = false;
/**
 * Register side effects for ray.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterRay() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    // Picking
    AddRayExtensions(Scene, Camera);
    Scene.prototype.createPickingRayToRef = function (x, y, world, result, camera, cameraViewSpace = false, enableDistantPicking = false) {
        return CreatePickingRayToRef(this, x, y, world, result, camera, cameraViewSpace, enableDistantPicking);
    };
    Scene.prototype.createPickingRayInCameraSpace = function (x, y, camera) {
        return CreatePickingRayInCameraSpace(this, x, y, camera);
    };
    Scene.prototype.createPickingRayInCameraSpaceToRef = function (x, y, result, camera) {
        return CreatePickingRayInCameraSpaceToRef(this, x, y, result, camera);
    };
    Scene.prototype.pickWithBoundingInfo = function (x, y, predicate, fastCheck, camera) {
        return PickWithBoundingInfo(this, x, y, predicate, fastCheck, camera);
    };
    Scene.prototype.pick = function (x, y, predicate, fastCheck, camera, trianglePredicate, _enableDistantPicking = false) {
        return Pick(this, x, y, predicate, fastCheck, camera, trianglePredicate, _enableDistantPicking);
    };
    Scene.prototype.pickWithRay = function (ray, predicate, fastCheck, trianglePredicate) {
        return PickWithRay(this, ray, predicate, fastCheck, trianglePredicate);
    };
    Scene.prototype.multiPick = function (x, y, predicate, camera, trianglePredicate) {
        return MultiPick(this, x, y, predicate, camera, trianglePredicate);
    };
    Scene.prototype.multiPickWithRay = function (ray, predicate, trianglePredicate) {
        return MultiPickWithRay(this, ray, predicate, trianglePredicate);
    };
}
//# sourceMappingURL=ray.pure.js.map