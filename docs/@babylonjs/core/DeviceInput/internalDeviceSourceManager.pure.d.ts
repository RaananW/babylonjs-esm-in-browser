/** This file must only contain pure code and pure imports */
import { type IDisposable } from "../scene.pure.js";
import { DeviceType } from "./InputDevices/deviceEnums.js";
import { type Observable } from "../Misc/observable.pure.js";
import { type IDeviceInputSystem } from "./inputInterfaces.js";
import { DeviceSource } from "./InputDevices/deviceSource.js";
import { type IUIEvent } from "../Events/deviceInputEvents.js";
import { type AbstractEngine } from "../Engines/abstractEngine.pure.js";
type Distribute<T> = T extends DeviceType ? DeviceSource<T> : never;
export type DeviceSourceType = Distribute<DeviceType>;
/** @internal */
export interface IObservableManager {
    onDeviceConnectedObservable: Observable<DeviceSourceType>;
    onDeviceDisconnectedObservable: Observable<DeviceSourceType>;
    _onInputChanged(deviceType: DeviceType, deviceSlot: number, eventData: IUIEvent): void;
    _addDevice(deviceSource: DeviceSource<DeviceType>): void;
    _removeDevice(deviceType: DeviceType, deviceSlot: number): void;
}
/** @internal */
export declare class InternalDeviceSourceManager implements IDisposable {
    readonly _deviceInputSystem: IDeviceInputSystem;
    private readonly _devices;
    private readonly _registeredManagers;
    _refCount: number;
    constructor(engine: AbstractEngine);
    readonly registerManager: (manager: IObservableManager) => void;
    readonly unregisterManager: (manager: IObservableManager) => void;
    dispose(): void;
}
export {};
