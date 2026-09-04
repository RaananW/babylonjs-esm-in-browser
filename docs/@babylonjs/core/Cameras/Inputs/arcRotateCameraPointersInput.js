import { __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { serialize } from "../../Misc/decorators.js";
import { CameraInputTypes } from "../../Cameras/cameraInputsManager.js";
import { OrbitCameraPointersInput } from "../../Cameras/Inputs/orbitCameraPointersInput.js";
/**
 * Manage the pointers inputs to control an arc rotate camera.
 * Uses the inputMap on the movement class to determine which button maps to which interaction.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
 */
let ArcRotateCameraPointersInput = (() => {
    var _a;
    let _classSuper = OrbitCameraPointersInput;
    let _buttons_decorators;
    let _buttons_initializers = [];
    let _buttons_extraInitializers = [];
    let _angularSensibilityX_decorators;
    let _angularSensibilityX_initializers = [];
    let _angularSensibilityX_extraInitializers = [];
    let _angularSensibilityY_decorators;
    let _angularSensibilityY_initializers = [];
    let _angularSensibilityY_extraInitializers = [];
    let _pinchPrecision_decorators;
    let _pinchPrecision_initializers = [];
    let _pinchPrecision_extraInitializers = [];
    let _pinchDeltaPercentage_decorators;
    let _pinchDeltaPercentage_initializers = [];
    let _pinchDeltaPercentage_extraInitializers = [];
    let _useNaturalPinchZoom_decorators;
    let _useNaturalPinchZoom_initializers = [];
    let _useNaturalPinchZoom_extraInitializers = [];
    let _panningSensibility_decorators;
    let _panningSensibility_initializers = [];
    let _panningSensibility_extraInitializers = [];
    return _a = class ArcRotateCameraPointersInput extends _classSuper {
            constructor() {
                super(...arguments);
                /**
                 * Defines the buttons associated with the input to handle camera move.
                 */
                this.buttons = __runInitializers(this, _buttons_initializers, [0, 1, 2]);
                /**
                 * Defines the pointer angular sensibility  along the X axis or how fast is
                 * the camera rotating.
                 */
                this.angularSensibilityX = (__runInitializers(this, _buttons_extraInitializers), __runInitializers(this, _angularSensibilityX_initializers, 1000.0));
                /**
                 * Defines the pointer angular sensibility along the Y axis or how fast is
                 * the camera rotating.
                 */
                this.angularSensibilityY = (__runInitializers(this, _angularSensibilityX_extraInitializers), __runInitializers(this, _angularSensibilityY_initializers, 1000.0));
                /**
                 * Defines the pointer pinch precision or how fast is the camera zooming.
                 */
                this.pinchPrecision = (__runInitializers(this, _angularSensibilityY_extraInitializers), __runInitializers(this, _pinchPrecision_initializers, 12.0));
                /**
                 * pinchDeltaPercentage will be used instead of pinchPrecision if different
                 * from 0.
                 * It defines the percentage of current camera.radius to use as delta when
                 * pinch zoom is used.
                 */
                this.pinchDeltaPercentage = (__runInitializers(this, _pinchPrecision_extraInitializers), __runInitializers(this, _pinchDeltaPercentage_initializers, 0));
                /**
                 * When useNaturalPinchZoom is true, multi touch zoom will zoom in such
                 * that any object in the plane at the camera's target point will scale
                 * perfectly with finger motion.
                 * Overrides pinchDeltaPercentage and pinchPrecision.
                 */
                this.useNaturalPinchZoom = (__runInitializers(this, _pinchDeltaPercentage_extraInitializers), __runInitializers(this, _useNaturalPinchZoom_initializers, false));
                /**
                 * Defines the pointer panning sensibility or how fast is the camera moving.
                 */
                this.panningSensibility = (__runInitializers(this, _useNaturalPinchZoom_extraInitializers), __runInitializers(this, _panningSensibility_initializers, 1000.0));
                /**
                 * Revers pinch action direction.
                 */
                this.pinchInwards = (__runInitializers(this, _panningSensibility_extraInitializers), true);
                /** Cached resolved inputMap entry for the current pointer gesture */
                this._activeEntry = null;
                /** Cached conditions object for pointer-lock fallback resolution to avoid per-event allocations */
                this._pointerLockConditions = { button: 0, modifiers: {} };
                /**
                 * Modifier state stored separately from `_pointerConditions` so it can be typed as a
                 * concrete (non-optional) object. This avoids non-null assertions when updating modifier
                 * fields on every pointer-down, and the conditions object holds the same reference so
                 * resolveInteraction sees the live state.
                 */
                this._pointerModifiers = { ctrl: false, alt: false, shift: false };
                /** Cached conditions object for pointer-down resolution */
                this._pointerConditions = { modifiers: this._pointerModifiers };
            }
            /**
             * Gets the class name of the current input.
             * @returns the class name
             */
            getClassName() {
                return "ArcRotateCameraPointersInput";
            }
            /**
             * Move camera from multi touch panning positions.
             * @param previousMultiTouchPanPosition
             * @param multiTouchPanPosition
             */
            _computeMultiTouchPanning(previousMultiTouchPanPosition, multiTouchPanPosition) {
                if (previousMultiTouchPanPosition && multiTouchPanPosition) {
                    const moveDeltaX = multiTouchPanPosition.x - previousMultiTouchPanPosition.x;
                    const moveDeltaY = multiTouchPanPosition.y - previousMultiTouchPanPosition.y;
                    // Multi-touch pan is a gesture (no button), so consult the default pointer→pan entry for an
                    // explicit `sensitivity` override. When unset, fall back to the legacy `panningSensibility`
                    // (treating panningSensibility=0 as "panning disabled" for backward compatibility).
                    const panEntry = this.camera.movement.input.getEntry("pointer", "pan");
                    const panScale = panEntry?.sensitivity ?? (this.panningSensibility !== 0 ? 1 / this.panningSensibility : 0);
                    if (panScale !== 0) {
                        this.camera.movement.activeInput = true;
                        this.camera.movement.panAccumulatedPixels.x += -moveDeltaX * panScale;
                        this.camera.movement.panAccumulatedPixels.y += moveDeltaY * panScale;
                    }
                }
            }
            /**
             * Move camera from multitouch (pinch) zoom distances.
             * @param previousPinchSquaredDistance
             * @param pinchSquaredDistance
             */
            _computePinchZoom(previousPinchSquaredDistance, pinchSquaredDistance) {
                const radius = this.camera.radius || _a.MinimumRadiusForPinch;
                if (this.useNaturalPinchZoom) {
                    this.camera.radius = (radius * Math.sqrt(previousPinchSquaredDistance)) / Math.sqrt(pinchSquaredDistance);
                }
                else if (this.pinchDeltaPercentage) {
                    const delta = (pinchSquaredDistance - previousPinchSquaredDistance) * 0.001 * radius * this.pinchDeltaPercentage;
                    this.camera.movement.activeInput = true;
                    this.camera.movement.zoomAccumulatedPixels += delta;
                }
                else {
                    const delta = (pinchSquaredDistance - previousPinchSquaredDistance) /
                        ((this.pinchPrecision * (this.pinchInwards ? 1 : -1) * (this.angularSensibilityX + this.angularSensibilityY)) / 2);
                    this.camera.movement.activeInput = true;
                    this.camera.movement.zoomAccumulatedPixels += delta;
                }
            }
            /**
             * Called on pointer POINTERMOVE event if only a single touch is active.
             * @param point current touch point
             * @param offsetX offset on X
             * @param offsetY offset on Y
             */
            onTouch(point, offsetX, offsetY) {
                // In pointer-lock mode, mouse movement rotates the camera even without a button held.
                // This matches legacy behavior where pointer-lock mouse deltas always drove rotation.
                const entry = this._activeEntry ?? (this.camera.getEngine().isPointerLock ? this.camera.movement.input.resolveInteraction("pointer", this._pointerLockConditions) : null);
                if (entry) {
                    // Per-pixel scale. The inputMap entry's `sensitivity` takes precedence so consumers can
                    // tune feel declaratively (and so we can phase out the legacy sensibility properties).
                    // When `sensitivity` is unset, fall back to the legacy properties for backward compat.
                    // For rotate, a single `sensitivity` value applies to both axes; the legacy fallback
                    // preserves separate X/Y tuning via `angularSensibilityX/Y`.
                    if (entry.interaction === "pan") {
                        const panScale = entry.sensitivity ?? (this.panningSensibility !== 0 ? 1 / this.panningSensibility : 0);
                        if (panScale !== 0) {
                            this.camera.movement.activeInput = true;
                            this.camera.movement.panAccumulatedPixels.x += -offsetX * panScale;
                            this.camera.movement.panAccumulatedPixels.y += offsetY * panScale;
                        }
                    }
                    else if (entry.interaction === "rotate") {
                        const rotateScaleX = entry.sensitivityX ?? entry.sensitivity ?? 1 / this.angularSensibilityX;
                        const rotateScaleY = entry.sensitivityY ?? entry.sensitivity ?? 1 / this.angularSensibilityY;
                        this.camera.movement.activeInput = true;
                        this.camera.movement.rotationAccumulatedPixels.x += -offsetX * rotateScaleX;
                        this.camera.movement.rotationAccumulatedPixels.y += -offsetY * rotateScaleY;
                    }
                }
            }
            /**
             * Called on pointer POINTERDOUBLETAP event.
             */
            onDoubleTap() {
                if (this.camera.useInputToRestoreState) {
                    this.camera.restoreState();
                }
            }
            /**
             * Called on pointer POINTERMOVE event if multiple touches are active.
             * @param pointA point A
             * @param pointB point B
             * @param previousPinchSquaredDistance distance between points in previous pinch
             * @param pinchSquaredDistance distance between points in current pinch
             * @param previousMultiTouchPanPosition multi-touch position in previous step
             * @param multiTouchPanPosition multi-touch position in current step
             */
            onMultiTouch(pointA, pointB, previousPinchSquaredDistance, pinchSquaredDistance, previousMultiTouchPanPosition, multiTouchPanPosition) {
                this._shouldStartPinchZoom =
                    this._twoFingerActivityCount < 20 && Math.abs(Math.sqrt(pinchSquaredDistance) - Math.sqrt(previousPinchSquaredDistance)) > this.camera.pinchToPanMaxDistance;
                super.onMultiTouch(pointA, pointB, previousPinchSquaredDistance, pinchSquaredDistance, previousMultiTouchPanPosition, multiTouchPanPosition);
            }
            /**
             * Called each time a new POINTERDOWN event occurs. Ie, for each button
             * press.
             * @param evt Defines the event to track
             */
            onButtonDown(evt) {
                this._pointerConditions.button = evt.button;
                this._pointerModifiers.ctrl = evt.ctrlKey;
                this._pointerModifiers.alt = evt.altKey;
                this._pointerModifiers.shift = evt.shiftKey;
                this._activeEntry = this.camera.movement.input.resolveInteraction("pointer", this._pointerConditions);
                super.onButtonDown(evt);
            }
            /**
             * Called each time a new POINTERUP event occurs. Ie, for each button
             * release.
             * @param _evt Defines the event to track
             */
            onButtonUp(_evt) {
                this._activeEntry = null;
                super.onButtonUp(_evt);
            }
            /**
             * Called when window becomes inactive.
             */
            onLostFocus() {
                this._activeEntry = null;
                super.onLostFocus();
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _buttons_decorators = [serialize()];
            _angularSensibilityX_decorators = [serialize()];
            _angularSensibilityY_decorators = [serialize()];
            _pinchPrecision_decorators = [serialize()];
            _pinchDeltaPercentage_decorators = [serialize()];
            _useNaturalPinchZoom_decorators = [serialize()];
            _panningSensibility_decorators = [serialize()];
            __esDecorate(null, null, _buttons_decorators, { kind: "field", name: "buttons", static: false, private: false, access: { has: obj => "buttons" in obj, get: obj => obj.buttons, set: (obj, value) => { obj.buttons = value; } }, metadata: _metadata }, _buttons_initializers, _buttons_extraInitializers);
            __esDecorate(null, null, _angularSensibilityX_decorators, { kind: "field", name: "angularSensibilityX", static: false, private: false, access: { has: obj => "angularSensibilityX" in obj, get: obj => obj.angularSensibilityX, set: (obj, value) => { obj.angularSensibilityX = value; } }, metadata: _metadata }, _angularSensibilityX_initializers, _angularSensibilityX_extraInitializers);
            __esDecorate(null, null, _angularSensibilityY_decorators, { kind: "field", name: "angularSensibilityY", static: false, private: false, access: { has: obj => "angularSensibilityY" in obj, get: obj => obj.angularSensibilityY, set: (obj, value) => { obj.angularSensibilityY = value; } }, metadata: _metadata }, _angularSensibilityY_initializers, _angularSensibilityY_extraInitializers);
            __esDecorate(null, null, _pinchPrecision_decorators, { kind: "field", name: "pinchPrecision", static: false, private: false, access: { has: obj => "pinchPrecision" in obj, get: obj => obj.pinchPrecision, set: (obj, value) => { obj.pinchPrecision = value; } }, metadata: _metadata }, _pinchPrecision_initializers, _pinchPrecision_extraInitializers);
            __esDecorate(null, null, _pinchDeltaPercentage_decorators, { kind: "field", name: "pinchDeltaPercentage", static: false, private: false, access: { has: obj => "pinchDeltaPercentage" in obj, get: obj => obj.pinchDeltaPercentage, set: (obj, value) => { obj.pinchDeltaPercentage = value; } }, metadata: _metadata }, _pinchDeltaPercentage_initializers, _pinchDeltaPercentage_extraInitializers);
            __esDecorate(null, null, _useNaturalPinchZoom_decorators, { kind: "field", name: "useNaturalPinchZoom", static: false, private: false, access: { has: obj => "useNaturalPinchZoom" in obj, get: obj => obj.useNaturalPinchZoom, set: (obj, value) => { obj.useNaturalPinchZoom = value; } }, metadata: _metadata }, _useNaturalPinchZoom_initializers, _useNaturalPinchZoom_extraInitializers);
            __esDecorate(null, null, _panningSensibility_decorators, { kind: "field", name: "panningSensibility", static: false, private: false, access: { has: obj => "panningSensibility" in obj, get: obj => obj.panningSensibility, set: (obj, value) => { obj.panningSensibility = value; } }, metadata: _metadata }, _panningSensibility_initializers, _panningSensibility_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        /**
         * The minimum radius used for pinch, to avoid radius lock at 0
         */
        _a.MinimumRadiusForPinch = 0.001,
        _a;
})();
export { ArcRotateCameraPointersInput };
CameraInputTypes["ArcRotateCameraPointersInput"] = ArcRotateCameraPointersInput;
//# sourceMappingURL=arcRotateCameraPointersInput.js.map