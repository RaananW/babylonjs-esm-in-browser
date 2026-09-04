import { PointerEventTypes } from "../Events/pointerEvents.js";
import { KeyboardEventTypes } from "../Events/keyboardEvents.js";
import { Observable } from "../Misc/observable.js";
import { _IsMacPlatform } from "./utils.js";
/**
 * This class is responsible for coordinating the events that are triggered in the scene.
 * It registers all observers needed to track certain events and triggers the blocks that are listening to them.
 * Abstracting the events from the class will allow us to easily change the events that are being listened to, and trigger them in any order.
 */
export class FlowGraphSceneEventCoordinator {
    constructor(scene) {
        /**
         * register to this observable to get flow graph event notifications.
         */
        this.onEventTriggeredObservable = new Observable();
        /**
         * Was scene-ready already triggered?
         */
        this.sceneReadyTriggered = false;
        this._pointerUnderMeshState = {};
        this._onBlurHandler = null;
        /**
         * The set of keys currently pressed, keyed by `event.code`.
         * Keyboard event blocks use this to determine whether a key is held.
         *
         * In addition to physical key codes, a virtual `"CommandOrControl"` entry
         * is maintained: it tracks Meta (Cmd) on macOS and Ctrl on Windows/Linux,
         * enabling platform-agnostic shortcut checks via the IsKeyPressed block.
         */
        this.pressedKeys = new Set();
        this._startingTime = 0;
        this._scene = scene;
        this._initialize();
    }
    _initialize() {
        this._sceneReadyObserver = this._scene.onReadyObservable.addOnce(() => {
            if (!this.sceneReadyTriggered) {
                this.onEventTriggeredObservable.notifyObservers({ type: "SceneReady" /* FlowGraphEventType.SceneReady */ });
                this.sceneReadyTriggered = true;
            }
        });
        this._sceneDisposeObserver = this._scene.onDisposeObservable.add(() => {
            this.onEventTriggeredObservable.notifyObservers({ type: "SceneDispose" /* FlowGraphEventType.SceneDispose */ });
        });
        this._sceneOnBeforeRenderObserver = this._scene.onBeforeRenderObservable.add(() => {
            const deltaTime = this._scene.getEngine().getDeltaTime() / 1000; // set in seconds
            this.onEventTriggeredObservable.notifyObservers({
                type: "SceneBeforeRender" /* FlowGraphEventType.SceneBeforeRender */,
                payload: {
                    timeSinceStart: this._startingTime,
                    deltaTime,
                },
            });
            this._startingTime += deltaTime;
        });
        this._meshPickedObserver = this._scene.onPointerObservable.add((pointerInfo) => {
            this.onEventTriggeredObservable.notifyObservers({ type: "MeshPick" /* FlowGraphEventType.MeshPick */, payload: pointerInfo });
        }, PointerEventTypes.POINTERPICK); // should it be pointerdown?
        this._pointerDownObserver = this._scene.onPointerObservable.add((pointerInfo) => {
            this.onEventTriggeredObservable.notifyObservers({ type: "PointerDown" /* FlowGraphEventType.PointerDown */, payload: pointerInfo });
        }, PointerEventTypes.POINTERDOWN);
        this._pointerUpObserver = this._scene.onPointerObservable.add((pointerInfo) => {
            this.onEventTriggeredObservable.notifyObservers({ type: "PointerUp" /* FlowGraphEventType.PointerUp */, payload: pointerInfo });
        }, PointerEventTypes.POINTERUP);
        this._pointerMoveObserver = this._scene.onPointerObservable.add((pointerInfo) => {
            this.onEventTriggeredObservable.notifyObservers({ type: "PointerMove" /* FlowGraphEventType.PointerMove */, payload: pointerInfo });
        }, PointerEventTypes.POINTERMOVE);
        this._meshUnderPointerObserver = this._scene.onMeshUnderPointerUpdatedObservable.add((data) => {
            // check if the data has changed. Check the state of the last change and see if it is a mesh or null.
            // if it is a mesh and the previous state was null, trigger over event. If it is null and the previous state was a mesh, trigger out event.
            // if it is a mesh and the previous state was a mesh, trigger out from the old mesh and over the new mesh
            // if it is null and the previous state was null, do nothing.
            const pointerId = data.pointerId;
            const mesh = data.mesh;
            const previousState = this._pointerUnderMeshState[pointerId];
            if (!previousState && mesh) {
                this.onEventTriggeredObservable.notifyObservers({ type: "PointerOver" /* FlowGraphEventType.PointerOver */, payload: { pointerId, mesh } });
            }
            else if (previousState && !mesh) {
                this.onEventTriggeredObservable.notifyObservers({ type: "PointerOut" /* FlowGraphEventType.PointerOut */, payload: { pointerId, mesh: previousState } });
            }
            else if (previousState && mesh && previousState !== mesh) {
                this.onEventTriggeredObservable.notifyObservers({ type: "PointerOut" /* FlowGraphEventType.PointerOut */, payload: { pointerId, mesh: previousState, over: mesh } });
                this.onEventTriggeredObservable.notifyObservers({ type: "PointerOver" /* FlowGraphEventType.PointerOver */, payload: { pointerId, mesh, out: previousState } });
            }
            this._pointerUnderMeshState[pointerId] = mesh;
        }, PointerEventTypes.POINTERMOVE);
        this._keyDownObserver = this._scene.onKeyboardObservable.add((keyboardInfo) => {
            const code = keyboardInfo.event.code;
            this.pressedKeys.add(code);
            if (FlowGraphSceneEventCoordinator._COMMAND_OR_CTRL_CODES.has(code)) {
                this.pressedKeys.add("CommandOrControl");
            }
            this.onEventTriggeredObservable.notifyObservers({ type: "KeyDown" /* FlowGraphEventType.KeyDown */, payload: keyboardInfo });
        }, KeyboardEventTypes.KEYDOWN);
        this._keyUpObserver = this._scene.onKeyboardObservable.add((keyboardInfo) => {
            const code = keyboardInfo.event.code;
            this.pressedKeys.delete(code);
            if (FlowGraphSceneEventCoordinator._COMMAND_OR_CTRL_CODES.has(code)) {
                // Only remove CommandOrControl if neither left nor right is still held
                let stillHeld = false;
                for (const c of Array.from(FlowGraphSceneEventCoordinator._COMMAND_OR_CTRL_CODES)) {
                    if (c !== code && this.pressedKeys.has(c)) {
                        stillHeld = true;
                        break;
                    }
                }
                if (!stillHeld) {
                    this.pressedKeys.delete("CommandOrControl");
                }
            }
            this.onEventTriggeredObservable.notifyObservers({ type: "KeyUp" /* FlowGraphEventType.KeyUp */, payload: keyboardInfo });
        }, KeyboardEventTypes.KEYUP);
        // Clear all tracked keys when the window/tab loses focus.
        // Without this, held keys would appear "stuck" after an Alt-Tab
        // because the keyup event fires in the other window.
        const canvas = this._scene.getEngine().getRenderingCanvas();
        if (canvas) {
            this._onBlurHandler = () => this.pressedKeys.clear();
            canvas.addEventListener("blur", this._onBlurHandler);
        }
    }
    dispose() {
        this._sceneDisposeObserver?.remove();
        this._sceneReadyObserver?.remove();
        this._sceneOnBeforeRenderObserver?.remove();
        this._meshPickedObserver?.remove();
        this._meshUnderPointerObserver?.remove();
        this._pointerDownObserver?.remove();
        this._pointerUpObserver?.remove();
        this._pointerMoveObserver?.remove();
        this._keyDownObserver?.remove();
        this._keyUpObserver?.remove();
        if (this._onBlurHandler) {
            const canvas = this._scene.getEngine().getRenderingCanvas();
            canvas?.removeEventListener("blur", this._onBlurHandler);
            this._onBlurHandler = null;
        }
        this.pressedKeys.clear();
        this.onEventTriggeredObservable.clear();
    }
}
/** The physical key codes that map to the virtual CommandOrControl key on this platform. */
FlowGraphSceneEventCoordinator._COMMAND_OR_CTRL_CODES = _IsMacPlatform ? new Set(["MetaLeft", "MetaRight"]) : new Set(["ControlLeft", "ControlRight"]);
//# sourceMappingURL=flowGraphSceneEventCoordinator.js.map