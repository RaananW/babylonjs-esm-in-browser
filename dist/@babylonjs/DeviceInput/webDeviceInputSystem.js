import { DomManagement } from "../Misc/domManagement.js";
import { Tools } from "../Misc/tools.js";
import { DeviceEventFactory } from "./eventFactory.js";
import { DeviceType, PointerInput } from "./InputDevices/deviceEnums.js";
// eslint-disable-next-line @typescript-eslint/naming-convention
const MAX_KEYCODES = 255;
// eslint-disable-next-line @typescript-eslint/naming-convention
const MAX_POINTER_INPUTS = Object.keys(PointerInput).length / 2;
/** @internal */
export class WebDeviceInputSystem {
    constructor(engine, onDeviceConnected, onDeviceDisconnected, onInputChanged) {
        // Private Members
        this._inputs = [];
        this._keyboardActive = false;
        this._pointerActive = false;
        this._usingSafari = Tools.IsSafari();
        // Found solution for determining if MacOS is being used here:
        // https://stackoverflow.com/questions/10527983/best-way-to-detect-mac-os-x-or-windows-computers-with-javascript-or-jquery
        this._usingMacOS = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this._keyboardDownEvent = (evt) => { };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this._keyboardUpEvent = (evt) => { };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this._keyboardBlurEvent = (evt) => { };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this._pointerMoveEvent = (evt) => { };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this._pointerDownEvent = (evt) => { };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this._pointerUpEvent = (evt) => { };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this._pointerCancelEvent = (evt) => { };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this._pointerWheelEvent = (evt) => { };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this._pointerBlurEvent = (evt) => { };
        this._eventsAttached = false;
        this._mouseId = -1;
        this._isUsingFirefox = DomManagement.IsNavigatorAvailable() && navigator.userAgent && navigator.userAgent.indexOf("Firefox") !== -1;
        this._maxTouchPoints = 0;
        this._pointerInputClearObserver = null;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this._gamepadConnectedEvent = (evt) => { };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this._gamepadDisconnectedEvent = (evt) => { };
        this._eventPrefix = Tools.GetPointerPrefix(engine);
        this._engine = engine;
        this._onDeviceConnected = onDeviceConnected;
        this._onDeviceDisconnected = onDeviceDisconnected;
        this._onInputChanged = onInputChanged;
        this._enableEvents();
        if (this._usingMacOS) {
            this._metaKeys = [];
        }
        // Set callback to enable event handler switching when inputElement changes
        if (!this._engine._onEngineViewChanged) {
            this._engine._onEngineViewChanged = () => {
                this._enableEvents();
            };
        }
    }
    // Public functions
    /**
     * Checks for current device input value, given an id and input index. Throws exception if requested device not initialized.
     * @param deviceType Enum specifying device type
     * @param deviceSlot "Slot" or index that device is referenced in
     * @param inputIndex Id of input to be checked
     * @returns Current value of input
     */
    pollInput(deviceType, deviceSlot, inputIndex) {
        const device = this._inputs[deviceType][deviceSlot];
        if (!device) {
            throw `Unable to find device ${DeviceType[deviceType]}`;
        }
        if (deviceType >= DeviceType.DualShock && deviceType <= DeviceType.DualSense) {
            this._updateDevice(deviceType, deviceSlot, inputIndex);
        }
        const currentValue = device[inputIndex];
        if (currentValue === undefined) {
            throw `Unable to find input ${inputIndex} for device ${DeviceType[deviceType]} in slot ${deviceSlot}`;
        }
        if (inputIndex === PointerInput.Move) {
            Tools.Warn(`Unable to provide information for PointerInput.Move.  Try using PointerInput.Horizontal or PointerInput.Vertical for move data.`);
        }
        return currentValue;
    }
    /**
     * Check for a specific device in the DeviceInputSystem
     * @param deviceType Type of device to check for
     * @returns bool with status of device's existence
     */
    isDeviceAvailable(deviceType) {
        return this._inputs[deviceType] !== undefined;
    }
    /**
     * Dispose of all the eventlisteners
     */
    dispose() {
        // Callbacks
        this._onDeviceConnected = () => { };
        this._onDeviceDisconnected = () => { };
        this._onInputChanged = () => { };
        delete this._engine._onEngineViewChanged;
        if (this._elementToAttachTo) {
            this._disableEvents();
        }
    }
    /**
     * Enable listening for user input events
     */
    _enableEvents() {
        const inputElement = this === null || this === void 0 ? void 0 : this._engine.getInputElement();
        if (inputElement && (!this._eventsAttached || this._elementToAttachTo !== inputElement)) {
            // Remove events before adding to avoid double events or simultaneous events on multiple canvases
            this._disableEvents();
            // If the inputs array has already been created, zero it out to before setting up events
            if (this._inputs) {
                for (const inputs of this._inputs) {
                    if (inputs) {
                        for (const deviceSlotKey in inputs) {
                            const deviceSlot = +deviceSlotKey;
                            const device = inputs[deviceSlot];
                            if (device) {
                                for (let inputIndex = 0; inputIndex < device.length; inputIndex++) {
                                    device[inputIndex] = 0;
                                }
                            }
                        }
                    }
                }
            }
            this._elementToAttachTo = inputElement;
            // Set tab index for the inputElement to the engine's canvasTabIndex, if and only if the element's tab index is -1
            this._elementToAttachTo.tabIndex = this._elementToAttachTo.tabIndex !== -1 ? this._elementToAttachTo.tabIndex : this._engine.canvasTabIndex;
            this._handleKeyActions();
            this._handlePointerActions();
            this._handleGamepadActions();
            this._eventsAttached = true;
            // Check for devices that are already connected but aren't registered. Currently, only checks for gamepads and mouse
            this._checkForConnectedDevices();
        }
    }
    /**
     * Disable listening for user input events
     */
    _disableEvents() {
        if (this._elementToAttachTo) {
            // Blur Events
            this._elementToAttachTo.removeEventListener("blur", this._keyboardBlurEvent);
            this._elementToAttachTo.removeEventListener("blur", this._pointerBlurEvent);
            // Keyboard Events
            this._elementToAttachTo.removeEventListener("keydown", this._keyboardDownEvent);
            this._elementToAttachTo.removeEventListener("keyup", this._keyboardUpEvent);
            // Pointer Events
            this._elementToAttachTo.removeEventListener(this._eventPrefix + "move", this._pointerMoveEvent);
            this._elementToAttachTo.removeEventListener(this._eventPrefix + "down", this._pointerDownEvent);
            this._elementToAttachTo.removeEventListener(this._eventPrefix + "up", this._pointerUpEvent);
            this._elementToAttachTo.removeEventListener(this._eventPrefix + "cancel", this._pointerCancelEvent);
            this._elementToAttachTo.removeEventListener(this._wheelEventName, this._pointerWheelEvent);
            // Gamepad Events
            window.removeEventListener("gamepadconnected", this._gamepadConnectedEvent);
            window.removeEventListener("gamepaddisconnected", this._gamepadDisconnectedEvent);
        }
        if (this._pointerInputClearObserver) {
            this._engine.onEndFrameObservable.remove(this._pointerInputClearObserver);
        }
        this._eventsAttached = false;
    }
    /**
     * Checks for existing connections to devices and register them, if necessary
     * Currently handles gamepads and mouse
     */
    _checkForConnectedDevices() {
        if (navigator.getGamepads) {
            const gamepads = navigator.getGamepads();
            for (const gamepad of gamepads) {
                if (gamepad) {
                    this._addGamePad(gamepad);
                }
            }
        }
        // If the device in use has mouse capabilities, pre-register mouse
        if (typeof matchMedia === "function" && matchMedia("(pointer:fine)").matches) {
            // This will provide a dummy value for the cursor position and is expected to be overridden when the first mouse event happens.
            // There isn't any good way to get the current position outside of a pointer event so that's why this was done.
            this._addPointerDevice(DeviceType.Mouse, 0, 0, 0);
        }
    }
    // Private functions
    /**
     * Add a gamepad to the DeviceInputSystem
     * @param gamepad A single DOM Gamepad object
     */
    _addGamePad(gamepad) {
        const deviceType = this._getGamepadDeviceType(gamepad.id);
        const deviceSlot = gamepad.index;
        this._gamepads = this._gamepads || new Array(gamepad.index + 1);
        this._registerDevice(deviceType, deviceSlot, gamepad.buttons.length + gamepad.axes.length);
        this._gamepads[deviceSlot] = deviceType;
    }
    /**
     * Add pointer device to DeviceInputSystem
     * @param deviceType Type of Pointer to add
     * @param deviceSlot Pointer ID (0 for mouse, pointerId for Touch)
     * @param currentX Current X at point of adding
     * @param currentY Current Y at point of adding
     */
    _addPointerDevice(deviceType, deviceSlot, currentX, currentY) {
        if (!this._pointerActive) {
            this._pointerActive = true;
        }
        this._registerDevice(deviceType, deviceSlot, MAX_POINTER_INPUTS);
        const pointer = this._inputs[deviceType][deviceSlot]; /* initialize our pointer position immediately after registration */
        pointer[0] = currentX;
        pointer[1] = currentY;
    }
    /**
     * Add device and inputs to device array
     * @param deviceType Enum specifying device type
     * @param deviceSlot "Slot" or index that device is referenced in
     * @param numberOfInputs Number of input entries to create for given device
     */
    _registerDevice(deviceType, deviceSlot, numberOfInputs) {
        if (deviceSlot === undefined) {
            throw `Unable to register device ${DeviceType[deviceType]} to undefined slot.`;
        }
        if (!this._inputs[deviceType]) {
            this._inputs[deviceType] = {};
        }
        if (!this._inputs[deviceType][deviceSlot]) {
            const device = new Array(numberOfInputs);
            device.fill(0);
            this._inputs[deviceType][deviceSlot] = device;
            this._onDeviceConnected(deviceType, deviceSlot);
        }
    }
    /**
     * Given a specific device name, remove that device from the device map
     * @param deviceType Enum specifying device type
     * @param deviceSlot "Slot" or index that device is referenced in
     */
    _unregisterDevice(deviceType, deviceSlot) {
        if (this._inputs[deviceType][deviceSlot]) {
            delete this._inputs[deviceType][deviceSlot];
            this._onDeviceDisconnected(deviceType, deviceSlot);
        }
    }
    /**
     * Handle all actions that come from keyboard interaction
     */
    _handleKeyActions() {
        this._keyboardDownEvent = (evt) => {
            if (!this._keyboardActive) {
                this._keyboardActive = true;
                this._registerDevice(DeviceType.Keyboard, 0, MAX_KEYCODES);
            }
            const kbKey = this._inputs[DeviceType.Keyboard][0];
            if (kbKey) {
                kbKey[evt.keyCode] = 1;
                const deviceEvent = evt;
                deviceEvent.inputIndex = evt.keyCode;
                if (this._usingMacOS && evt.metaKey && evt.key !== "Meta") {
                    if (!this._metaKeys.includes(evt.keyCode)) {
                        this._metaKeys.push(evt.keyCode);
                    }
                }
                this._onInputChanged(DeviceType.Keyboard, 0, deviceEvent);
            }
        };
        this._keyboardUpEvent = (evt) => {
            if (!this._keyboardActive) {
                this._keyboardActive = true;
                this._registerDevice(DeviceType.Keyboard, 0, MAX_KEYCODES);
            }
            const kbKey = this._inputs[DeviceType.Keyboard][0];
            if (kbKey) {
                kbKey[evt.keyCode] = 0;
                const deviceEvent = evt;
                deviceEvent.inputIndex = evt.keyCode;
                if (this._usingMacOS && evt.key === "Meta" && this._metaKeys.length > 0) {
                    for (const keyCode of this._metaKeys) {
                        const deviceEvent = DeviceEventFactory.CreateDeviceEvent(DeviceType.Keyboard, 0, keyCode, 0, this, this._elementToAttachTo);
                        kbKey[keyCode] = 0;
                        this._onInputChanged(DeviceType.Keyboard, 0, deviceEvent);
                    }
                    this._metaKeys.splice(0, this._metaKeys.length);
                }
                this._onInputChanged(DeviceType.Keyboard, 0, deviceEvent);
            }
        };
        this._keyboardBlurEvent = () => {
            if (this._keyboardActive) {
                const kbKey = this._inputs[DeviceType.Keyboard][0];
                for (let i = 0; i < kbKey.length; i++) {
                    if (kbKey[i] !== 0) {
                        kbKey[i] = 0;
                        const deviceEvent = DeviceEventFactory.CreateDeviceEvent(DeviceType.Keyboard, 0, i, 0, this, this._elementToAttachTo);
                        this._onInputChanged(DeviceType.Keyboard, 0, deviceEvent);
                    }
                }
                if (this._usingMacOS) {
                    this._metaKeys.splice(0, this._metaKeys.length);
                }
            }
        };
        this._elementToAttachTo.addEventListener("keydown", this._keyboardDownEvent);
        this._elementToAttachTo.addEventListener("keyup", this._keyboardUpEvent);
        this._elementToAttachTo.addEventListener("blur", this._keyboardBlurEvent);
    }
    /**
     * Handle all actions that come from pointer interaction
     */
    _handlePointerActions() {
        // If maxTouchPoints is defined, use that value.  Otherwise, allow for a minimum for supported gestures like pinch
        this._maxTouchPoints = (DomManagement.IsNavigatorAvailable() && navigator.maxTouchPoints) || 2;
        if (!this._activeTouchIds) {
            this._activeTouchIds = new Array(this._maxTouchPoints);
        }
        for (let i = 0; i < this._maxTouchPoints; i++) {
            this._activeTouchIds[i] = -1;
        }
        this._pointerMoveEvent = (evt) => {
            const deviceType = this._getPointerType(evt);
            const deviceSlot = deviceType === DeviceType.Mouse ? 0 : this._activeTouchIds.indexOf(evt.pointerId);
            if (!this._inputs[deviceType]) {
                this._inputs[deviceType] = {};
            }
            if (!this._inputs[deviceType][deviceSlot]) {
                this._addPointerDevice(deviceType, deviceSlot, evt.clientX, evt.clientY);
            }
            const pointer = this._inputs[deviceType][deviceSlot];
            if (pointer) {
                const deviceEvent = evt;
                deviceEvent.inputIndex = PointerInput.Move;
                pointer[PointerInput.Horizontal] = evt.clientX;
                pointer[PointerInput.Vertical] = evt.clientY;
                this._onInputChanged(deviceType, deviceSlot, deviceEvent);
                // Lets Propagate the event for move with same position.
                if (!this._usingSafari && evt.button !== -1) {
                    deviceEvent.inputIndex = evt.button + 2;
                    pointer[evt.button + 2] = pointer[evt.button + 2] ? 0 : 1; // Reverse state of button if evt.button has value
                    this._onInputChanged(deviceType, deviceSlot, deviceEvent);
                }
            }
        };
        this._pointerDownEvent = (evt) => {
            const deviceType = this._getPointerType(evt);
            let deviceSlot = deviceType === DeviceType.Mouse ? 0 : evt.pointerId;
            if (deviceType === DeviceType.Touch) {
                const idx = this._activeTouchIds.indexOf(-1);
                if (idx >= 0) {
                    deviceSlot = idx;
                    this._activeTouchIds[idx] = evt.pointerId;
                }
                else {
                    // We can't find an open slot to store new pointer so just return (can only support max number of touches)
                    Tools.Warn(`Max number of touches exceeded.  Ignoring touches in excess of ${this._maxTouchPoints}`);
                    return;
                }
            }
            if (!this._inputs[deviceType]) {
                this._inputs[deviceType] = {};
            }
            if (!this._inputs[deviceType][deviceSlot]) {
                this._addPointerDevice(deviceType, deviceSlot, evt.clientX, evt.clientY);
            }
            else if (deviceType === DeviceType.Touch) {
                this._onDeviceConnected(deviceType, deviceSlot);
            }
            const pointer = this._inputs[deviceType][deviceSlot];
            if (pointer) {
                const previousHorizontal = pointer[PointerInput.Horizontal];
                const previousVertical = pointer[PointerInput.Vertical];
                if (deviceType === DeviceType.Mouse) {
                    // Mouse; Among supported browsers, value is either 1 or 0 for mouse
                    if (this._mouseId === -1) {
                        if (evt.pointerId === undefined) {
                            // If there is no pointerId (eg. manually dispatched MouseEvent)
                            this._mouseId = this._isUsingFirefox ? 0 : 1;
                        }
                        else {
                            this._mouseId = evt.pointerId;
                        }
                    }
                    if (!document.pointerLockElement) {
                        try {
                            this._elementToAttachTo.setPointerCapture(this._mouseId);
                        }
                        catch (e) {
                            // DO NOTHING
                        }
                    }
                }
                else {
                    // Touch; Since touches are dynamically assigned, only set capture if we have an id
                    if (evt.pointerId && !document.pointerLockElement) {
                        try {
                            this._elementToAttachTo.setPointerCapture(evt.pointerId);
                        }
                        catch (e) {
                            // DO NOTHING
                        }
                    }
                }
                pointer[PointerInput.Horizontal] = evt.clientX;
                pointer[PointerInput.Vertical] = evt.clientY;
                pointer[evt.button + 2] = 1;
                const deviceEvent = evt;
                // NOTE: The +2 used here to is because PointerInput has the same value progression for its mouse buttons as PointerEvent.button
                // However, we have our X and Y values front-loaded to group together the touch inputs but not break this progression
                // EG. ([X, Y, Left-click], Middle-click, etc...)
                deviceEvent.inputIndex = evt.button + 2;
                this._onInputChanged(deviceType, deviceSlot, deviceEvent);
                if (previousHorizontal !== evt.clientX || previousVertical !== evt.clientY) {
                    deviceEvent.inputIndex = PointerInput.Move;
                    this._onInputChanged(deviceType, deviceSlot, deviceEvent);
                }
            }
        };
        this._pointerUpEvent = (evt) => {
            var _a, _b, _c, _d, _e;
            const deviceType = this._getPointerType(evt);
            const deviceSlot = deviceType === DeviceType.Mouse ? 0 : this._activeTouchIds.indexOf(evt.pointerId);
            if (deviceType === DeviceType.Touch) {
                if (deviceSlot === -1) {
                    return;
                }
                else {
                    this._activeTouchIds[deviceSlot] = -1;
                }
            }
            const pointer = (_a = this._inputs[deviceType]) === null || _a === void 0 ? void 0 : _a[deviceSlot];
            if (pointer && pointer[evt.button + 2] !== 0) {
                const previousHorizontal = pointer[PointerInput.Horizontal];
                const previousVertical = pointer[PointerInput.Vertical];
                pointer[PointerInput.Horizontal] = evt.clientX;
                pointer[PointerInput.Vertical] = evt.clientY;
                pointer[evt.button + 2] = 0;
                const deviceEvent = evt;
                if (previousHorizontal !== evt.clientX || previousVertical !== evt.clientY) {
                    deviceEvent.inputIndex = PointerInput.Move;
                    this._onInputChanged(deviceType, deviceSlot, deviceEvent);
                }
                // NOTE: The +2 used here to is because PointerInput has the same value progression for its mouse buttons as PointerEvent.button
                // However, we have our X and Y values front-loaded to group together the touch inputs but not break this progression
                // EG. ([X, Y, Left-click], Middle-click, etc...)
                deviceEvent.inputIndex = evt.button + 2;
                if (deviceType === DeviceType.Mouse && this._mouseId >= 0 && ((_c = (_b = this._elementToAttachTo).hasPointerCapture) === null || _c === void 0 ? void 0 : _c.call(_b, this._mouseId))) {
                    this._elementToAttachTo.releasePointerCapture(this._mouseId);
                }
                else if (evt.pointerId && ((_e = (_d = this._elementToAttachTo).hasPointerCapture) === null || _e === void 0 ? void 0 : _e.call(_d, evt.pointerId))) {
                    this._elementToAttachTo.releasePointerCapture(evt.pointerId);
                }
                this._onInputChanged(deviceType, deviceSlot, deviceEvent);
                if (deviceType === DeviceType.Touch) {
                    this._onDeviceDisconnected(deviceType, deviceSlot);
                }
            }
        };
        this._pointerCancelEvent = (evt) => {
            var _a, _b, _c, _d;
            if (evt.pointerType === "mouse") {
                const pointer = this._inputs[DeviceType.Mouse][0];
                if (this._mouseId >= 0 && ((_b = (_a = this._elementToAttachTo).hasPointerCapture) === null || _b === void 0 ? void 0 : _b.call(_a, this._mouseId))) {
                    this._elementToAttachTo.releasePointerCapture(this._mouseId);
                }
                for (let inputIndex = PointerInput.LeftClick; inputIndex <= PointerInput.BrowserForward; inputIndex++) {
                    if (pointer[inputIndex] === 1) {
                        pointer[inputIndex] = 0;
                        const deviceEvent = DeviceEventFactory.CreateDeviceEvent(DeviceType.Mouse, 0, inputIndex, 0, this, this._elementToAttachTo);
                        this._onInputChanged(DeviceType.Mouse, 0, deviceEvent);
                    }
                }
            }
            else {
                const deviceSlot = this._activeTouchIds.indexOf(evt.pointerId);
                if ((_d = (_c = this._elementToAttachTo).hasPointerCapture) === null || _d === void 0 ? void 0 : _d.call(_c, evt.pointerId)) {
                    this._elementToAttachTo.releasePointerCapture(evt.pointerId);
                }
                this._inputs[DeviceType.Touch][deviceSlot][PointerInput.LeftClick] = 0;
                const deviceEvent = DeviceEventFactory.CreateDeviceEvent(DeviceType.Touch, deviceSlot, PointerInput.LeftClick, 0, this, this._elementToAttachTo);
                this._onInputChanged(DeviceType.Touch, deviceSlot, deviceEvent);
                this._activeTouchIds[deviceSlot] = -1;
                this._onDeviceDisconnected(DeviceType.Touch, deviceSlot);
            }
        };
        // Set Wheel Event Name, code originally from scene.inputManager
        this._wheelEventName =
            "onwheel" in document.createElement("div")
                ? "wheel" // Modern browsers support "wheel"
                : document.onmousewheel !== undefined
                    ? "mousewheel" // Webkit and IE support at least "mousewheel"
                    : "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox
        // Code originally in scene.inputManager.ts
        // Chrome reports warning in console if wheel listener doesn't set an explicit passive option.
        // IE11 only supports captureEvent:boolean, not options:object, and it defaults to false.
        // Feature detection technique copied from: https://github.com/github/eventlistener-polyfill (MIT license)
        let passiveSupported = false;
        const noop = function () { };
        try {
            const options = Object.defineProperty({}, "passive", {
                get: function () {
                    passiveSupported = true;
                },
            });
            this._elementToAttachTo.addEventListener("test", noop, options);
            this._elementToAttachTo.removeEventListener("test", noop, options);
        }
        catch (e) {
            /* */
        }
        this._pointerBlurEvent = () => {
            var _a, _b, _c, _d, _e;
            // Handle mouse buttons
            if (this.isDeviceAvailable(DeviceType.Mouse)) {
                const pointer = this._inputs[DeviceType.Mouse][0];
                if (this._mouseId >= 0 && ((_b = (_a = this._elementToAttachTo).hasPointerCapture) === null || _b === void 0 ? void 0 : _b.call(_a, this._mouseId))) {
                    this._elementToAttachTo.releasePointerCapture(this._mouseId);
                }
                for (let inputIndex = PointerInput.LeftClick; inputIndex <= PointerInput.BrowserForward; inputIndex++) {
                    if (pointer[inputIndex] === 1) {
                        pointer[inputIndex] = 0;
                        const deviceEvent = DeviceEventFactory.CreateDeviceEvent(DeviceType.Mouse, 0, inputIndex, 0, this, this._elementToAttachTo);
                        this._onInputChanged(DeviceType.Mouse, 0, deviceEvent);
                    }
                }
            }
            // Handle Active Touches
            if (this.isDeviceAvailable(DeviceType.Touch)) {
                const pointer = this._inputs[DeviceType.Touch];
                for (let deviceSlot = 0; deviceSlot < this._activeTouchIds.length; deviceSlot++) {
                    const pointerId = this._activeTouchIds[deviceSlot];
                    if ((_d = (_c = this._elementToAttachTo).hasPointerCapture) === null || _d === void 0 ? void 0 : _d.call(_c, pointerId)) {
                        this._elementToAttachTo.releasePointerCapture(pointerId);
                    }
                    if (pointerId !== -1 && ((_e = pointer[deviceSlot]) === null || _e === void 0 ? void 0 : _e[PointerInput.LeftClick]) === 1) {
                        pointer[deviceSlot][PointerInput.LeftClick] = 0;
                        const deviceEvent = DeviceEventFactory.CreateDeviceEvent(DeviceType.Touch, deviceSlot, PointerInput.LeftClick, 0, this, this._elementToAttachTo);
                        this._onInputChanged(DeviceType.Touch, deviceSlot, deviceEvent);
                        this._activeTouchIds[deviceSlot] = -1;
                        this._onDeviceDisconnected(DeviceType.Touch, deviceSlot);
                    }
                }
            }
        };
        this._pointerWheelEvent = (evt) => {
            const deviceType = DeviceType.Mouse;
            const deviceSlot = 0;
            if (!this._inputs[deviceType]) {
                this._inputs[deviceType] = [];
            }
            if (!this._inputs[deviceType][deviceSlot]) {
                this._pointerActive = true;
                this._registerDevice(deviceType, deviceSlot, MAX_POINTER_INPUTS);
            }
            const pointer = this._inputs[deviceType][deviceSlot];
            if (pointer) {
                pointer[PointerInput.MouseWheelX] = evt.deltaX || 0;
                pointer[PointerInput.MouseWheelY] = evt.deltaY || evt.wheelDelta || 0;
                pointer[PointerInput.MouseWheelZ] = evt.deltaZ || 0;
                const deviceEvent = evt;
                if (pointer[PointerInput.MouseWheelX] !== 0) {
                    deviceEvent.inputIndex = PointerInput.MouseWheelX;
                    this._onInputChanged(deviceType, deviceSlot, deviceEvent);
                }
                if (pointer[PointerInput.MouseWheelY] !== 0) {
                    deviceEvent.inputIndex = PointerInput.MouseWheelY;
                    this._onInputChanged(deviceType, deviceSlot, deviceEvent);
                }
                if (pointer[PointerInput.MouseWheelZ] !== 0) {
                    deviceEvent.inputIndex = PointerInput.MouseWheelZ;
                    this._onInputChanged(deviceType, deviceSlot, deviceEvent);
                }
            }
        };
        this._elementToAttachTo.addEventListener(this._eventPrefix + "move", this._pointerMoveEvent);
        this._elementToAttachTo.addEventListener(this._eventPrefix + "down", this._pointerDownEvent);
        this._elementToAttachTo.addEventListener(this._eventPrefix + "up", this._pointerUpEvent);
        this._elementToAttachTo.addEventListener(this._eventPrefix + "cancel", this._pointerCancelEvent);
        this._elementToAttachTo.addEventListener("blur", this._pointerBlurEvent);
        this._elementToAttachTo.addEventListener(this._wheelEventName, this._pointerWheelEvent, passiveSupported ? { passive: false } : false);
        // Since there's no up or down event for mouse wheel or delta x/y, clear mouse values at end of frame
        this._pointerInputClearObserver = this._engine.onEndFrameObservable.add(() => {
            if (this.isDeviceAvailable(DeviceType.Mouse)) {
                const pointer = this._inputs[DeviceType.Mouse][0];
                pointer[PointerInput.MouseWheelX] = 0;
                pointer[PointerInput.MouseWheelY] = 0;
                pointer[PointerInput.MouseWheelZ] = 0;
            }
        });
    }
    /**
     * Handle all actions that come from gamepad interaction
     */
    _handleGamepadActions() {
        this._gamepadConnectedEvent = (evt) => {
            this._addGamePad(evt.gamepad);
        };
        this._gamepadDisconnectedEvent = (evt) => {
            if (this._gamepads) {
                const deviceType = this._getGamepadDeviceType(evt.gamepad.id);
                const deviceSlot = evt.gamepad.index;
                this._unregisterDevice(deviceType, deviceSlot);
                delete this._gamepads[deviceSlot];
            }
        };
        window.addEventListener("gamepadconnected", this._gamepadConnectedEvent);
        window.addEventListener("gamepaddisconnected", this._gamepadDisconnectedEvent);
    }
    /**
     * Update all non-event based devices with each frame
     * @param deviceType Enum specifying device type
     * @param deviceSlot "Slot" or index that device is referenced in
     * @param inputIndex Id of input to be checked
     */
    _updateDevice(deviceType, deviceSlot, inputIndex) {
        // Gamepads
        const gp = navigator.getGamepads()[deviceSlot];
        if (gp && deviceType === this._gamepads[deviceSlot]) {
            const device = this._inputs[deviceType][deviceSlot];
            if (inputIndex >= gp.buttons.length) {
                device[inputIndex] = gp.axes[inputIndex - gp.buttons.length].valueOf();
            }
            else {
                device[inputIndex] = gp.buttons[inputIndex].value;
            }
        }
    }
    /**
     * Gets DeviceType from the device name
     * @param deviceName Name of Device from DeviceInputSystem
     * @returns DeviceType enum value
     */
    _getGamepadDeviceType(deviceName) {
        if (deviceName.indexOf("054c") !== -1) {
            // DualShock 4 Gamepad
            return deviceName.indexOf("0ce6") !== -1 ? DeviceType.DualSense : DeviceType.DualShock;
        }
        else if (deviceName.indexOf("Xbox One") !== -1 || deviceName.search("Xbox 360") !== -1 || deviceName.search("xinput") !== -1) {
            // Xbox Gamepad
            return DeviceType.Xbox;
        }
        else if (deviceName.indexOf("057e") !== -1) {
            // Switch Gamepad
            return DeviceType.Switch;
        }
        return DeviceType.Generic;
    }
    /**
     * Get DeviceType from a given pointer/mouse/touch event.
     * @param evt PointerEvent to evaluate
     * @returns DeviceType interpreted from event
     */
    _getPointerType(evt) {
        let deviceType = DeviceType.Mouse;
        if (evt.pointerType === "touch" || evt.pointerType === "pen" || evt.touches) {
            deviceType = DeviceType.Touch;
        }
        return deviceType;
    }
}
//# sourceMappingURL=webDeviceInputSystem.js.map