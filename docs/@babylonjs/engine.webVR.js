import { Engine } from "../../Engines/engine.js";
import { Size } from "../../Maths/math.size.js";
import { Observable } from "../../Misc/observable.js";
import { Tools } from "../../Misc/tools.js";
import { IsWindowObjectExist } from "../../Misc/domManagement.js";
Object.defineProperty(Engine.prototype, "isInVRExclusivePointerMode", {
    get: function () {
        return this._vrExclusivePointerMode;
    },
    enumerable: true,
    configurable: true,
});
Engine.prototype._prepareVRComponent = function () {
    this._vrSupported = false;
    this._vrExclusivePointerMode = false;
    this.onVRDisplayChangedObservable = new Observable();
    this.onVRRequestPresentComplete = new Observable();
    this.onVRRequestPresentStart = new Observable();
};
Engine.prototype.isVRDevicePresent = function () {
    return !!this._vrDisplay;
};
Engine.prototype.getVRDevice = function () {
    return this._vrDisplay;
};
Engine.prototype.initWebVR = function () {
    this.initWebVRAsync();
    return this.onVRDisplayChangedObservable;
};
Engine.prototype.initWebVRAsync = function () {
    const notifyObservers = () => {
        const eventArgs = {
            vrDisplay: this._vrDisplay,
            vrSupported: this._vrSupported,
        };
        this.onVRDisplayChangedObservable.notifyObservers(eventArgs);
        this._webVRInitPromise = new Promise((res) => {
            res(eventArgs);
        });
    };
    if (!this._onVrDisplayConnect) {
        this._onVrDisplayConnect = (event) => {
            this._vrDisplay = event.display;
            notifyObservers();
        };
        this._onVrDisplayDisconnect = () => {
            this._vrDisplay.cancelAnimationFrame(this._frameHandler);
            this._vrDisplay = undefined;
            this._frameHandler = Engine.QueueNewFrame(this._boundRenderFunction);
            notifyObservers();
        };
        this._onVrDisplayPresentChange = () => {
            this._vrExclusivePointerMode = this._vrDisplay && this._vrDisplay.isPresenting;
        };
        const hostWindow = this.getHostWindow();
        if (hostWindow) {
            hostWindow.addEventListener("vrdisplayconnect", this._onVrDisplayConnect);
            hostWindow.addEventListener("vrdisplaydisconnect", this._onVrDisplayDisconnect);
            hostWindow.addEventListener("vrdisplaypresentchange", this._onVrDisplayPresentChange);
        }
    }
    this._webVRInitPromise = this._webVRInitPromise || this._getVRDisplaysAsync();
    this._webVRInitPromise.then(notifyObservers);
    return this._webVRInitPromise;
};
Engine.prototype._getVRDisplaysAsync = function () {
    return new Promise((res) => {
        if (navigator.getVRDisplays) {
            navigator.getVRDisplays().then((devices) => {
                this._vrSupported = true;
                // note that devices may actually be an empty array. This is fine;
                // we expect this._vrDisplay to be undefined in this case.
                this._vrDisplay = devices[0];
                res({
                    vrDisplay: this._vrDisplay,
                    vrSupported: this._vrSupported,
                });
            });
        }
        else {
            this._vrDisplay = undefined;
            this._vrSupported = false;
            res({
                vrDisplay: this._vrDisplay,
                vrSupported: this._vrSupported,
            });
        }
    });
};
Engine.prototype.enableVR = function (options) {
    if (this._vrDisplay && !this._vrDisplay.isPresenting) {
        const onResolved = () => {
            this.onVRRequestPresentComplete.notifyObservers(true);
            this._onVRFullScreenTriggered();
        };
        const onRejected = () => {
            this.onVRRequestPresentComplete.notifyObservers(false);
        };
        this.onVRRequestPresentStart.notifyObservers(this);
        const presentationAttributes = {
            highRefreshRate: this.vrPresentationAttributes ? this.vrPresentationAttributes.highRefreshRate : false,
            foveationLevel: this.vrPresentationAttributes ? this.vrPresentationAttributes.foveationLevel : 1,
            multiview: (this.getCaps().multiview || this.getCaps().oculusMultiview) && options.useMultiview,
        };
        this._vrDisplay
            .requestPresent([
            {
                source: this.getRenderingCanvas(),
                attributes: presentationAttributes,
                ...presentationAttributes,
            },
        ])
            .then(onResolved)
            .catch(onRejected);
    }
};
Engine.prototype._onVRFullScreenTriggered = function () {
    if (this._vrDisplay && this._vrDisplay.isPresenting) {
        //get the old size before we change
        this._oldSize = new Size(this.getRenderWidth(), this.getRenderHeight());
        this._oldHardwareScaleFactor = this.getHardwareScalingLevel();
        //get the width and height, change the render size
        const leftEye = this._vrDisplay.getEyeParameters("left");
        this.setHardwareScalingLevel(1);
        this.setSize(leftEye.renderWidth * 2, leftEye.renderHeight);
    }
    else {
        this.setHardwareScalingLevel(this._oldHardwareScaleFactor);
        this.setSize(this._oldSize.width, this._oldSize.height);
    }
};
Engine.prototype.disableVR = function () {
    if (this._vrDisplay && this._vrDisplay.isPresenting) {
        this._vrDisplay
            .exitPresent()
            .then(() => this._onVRFullScreenTriggered())
            .catch(() => this._onVRFullScreenTriggered());
    }
    if (IsWindowObjectExist()) {
        window.removeEventListener("vrdisplaypointerrestricted", this._onVRDisplayPointerRestricted);
        window.removeEventListener("vrdisplaypointerunrestricted", this._onVRDisplayPointerUnrestricted);
        if (this._onVrDisplayConnect) {
            window.removeEventListener("vrdisplayconnect", this._onVrDisplayConnect);
            if (this._onVrDisplayDisconnect) {
                window.removeEventListener("vrdisplaydisconnect", this._onVrDisplayDisconnect);
            }
            if (this._onVrDisplayPresentChange) {
                window.removeEventListener("vrdisplaypresentchange", this._onVrDisplayPresentChange);
            }
            this._onVrDisplayConnect = null;
            this._onVrDisplayDisconnect = null;
        }
    }
};
Engine.prototype._connectVREvents = function (canvas, document) {
    this._onVRDisplayPointerRestricted = () => {
        if (canvas) {
            canvas.requestPointerLock();
        }
    };
    this._onVRDisplayPointerUnrestricted = () => {
        // Edge fix - for some reason document is not present and this is window
        if (!document) {
            const hostWindow = this.getHostWindow();
            if (hostWindow.document && hostWindow.document.exitPointerLock) {
                hostWindow.document.exitPointerLock();
            }
            return;
        }
        if (!document.exitPointerLock) {
            return;
        }
        document.exitPointerLock();
    };
    if (IsWindowObjectExist()) {
        const hostWindow = this.getHostWindow();
        hostWindow.addEventListener("vrdisplaypointerrestricted", this._onVRDisplayPointerRestricted, false);
        hostWindow.addEventListener("vrdisplaypointerunrestricted", this._onVRDisplayPointerUnrestricted, false);
    }
};
Engine.prototype._submitVRFrame = function () {
    // Submit frame to the vr device, if enabled
    if (this._vrDisplay && this._vrDisplay.isPresenting) {
        // TODO: We should only submit the frame if we read frameData successfully.
        try {
            this._vrDisplay.submitFrame();
        }
        catch (e) {
            Tools.Warn("webVR submitFrame has had an unexpected failure: " + e);
        }
    }
};
Engine.prototype.isVRPresenting = function () {
    return this._vrDisplay && this._vrDisplay.isPresenting;
};
Engine.prototype._requestVRFrame = function () {
    this._frameHandler = Engine.QueueNewFrame(this._boundRenderFunction, this._vrDisplay);
};
//# sourceMappingURL=engine.webVR.js.map