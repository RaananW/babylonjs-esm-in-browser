/** This file must only contain pure code and pure imports */
import { Tools } from "../Misc/tools.pure.js";
import { Observable } from "../Misc/observable.pure.js";
import { Scene } from "../scene.pure.js";
import { EngineStore } from "../Engines/engineStore.js";
import { AbstractEngine } from "../Engines/abstractEngine.pure.js";
/**
 * Enum of inspector action tab
 */
export var DebugLayerTab;
(function (DebugLayerTab) {
    /**
     * Properties tag (default)
     */
    DebugLayerTab[DebugLayerTab["Properties"] = 0] = "Properties";
    /**
     * Debug tab
     */
    DebugLayerTab[DebugLayerTab["Debug"] = 1] = "Debug";
    /**
     * Statistics tab
     */
    DebugLayerTab[DebugLayerTab["Statistics"] = 2] = "Statistics";
    /**
     * Tools tab
     */
    DebugLayerTab[DebugLayerTab["Tools"] = 3] = "Tools";
    /**
     * Settings tab
     */
    DebugLayerTab[DebugLayerTab["Settings"] = 4] = "Settings";
})(DebugLayerTab || (DebugLayerTab = {}));
/**
 * The debug layer (aka Inspector) is the go to tool in order to better understand
 * what is happening in your scene
 * @see https://doc.babylonjs.com/toolsAndResources/inspector
 */
export class DebugLayer {
    /**
     * Observable triggered when a property is changed through the inspector.
     */
    get onPropertyChangedObservable() {
        if (this.BJSINSPECTOR && this.BJSINSPECTOR.Inspector) {
            return this.BJSINSPECTOR.Inspector.OnPropertyChangedObservable;
        }
        if (!this._onPropertyChangedObservable) {
            this._onPropertyChangedObservable = new Observable();
        }
        return this._onPropertyChangedObservable;
    }
    /**
     * Observable triggered when the selection is changed through the inspector.
     */
    get onSelectionChangedObservable() {
        if (this.BJSINSPECTOR && this.BJSINSPECTOR.Inspector) {
            return this.BJSINSPECTOR.Inspector.OnSelectionChangeObservable;
        }
        if (!this._onSelectionChangedObservable) {
            this._onSelectionChangedObservable = new Observable();
        }
        return this._onSelectionChangedObservable;
    }
    /**
     * Instantiates a new debug layer.
     * The debug layer (aka Inspector) is the go to tool in order to better understand
     * what is happening in your scene
     * @see https://doc.babylonjs.com/toolsAndResources/inspector
     * @param scene Defines the scene to inspect
     */
    constructor(scene) {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        this.BJSINSPECTOR = this._getGlobalInspector();
        this._scene = scene || EngineStore.LastCreatedScene;
        if (!this._scene) {
            return;
        }
        this._scene.onDisposeObservable.add(() => {
            // Debug layer
            if (this._scene._debugLayer) {
                this._scene._debugLayer.hide();
            }
        });
    }
    /**
     * Creates the inspector window.
     * @param config
     */
    _createInspector(config) {
        if (this.isVisible()) {
            return;
        }
        if (this._onPropertyChangedObservable) {
            for (const observer of this._onPropertyChangedObservable.observers) {
                this.BJSINSPECTOR.Inspector.OnPropertyChangedObservable.add(observer);
            }
            this._onPropertyChangedObservable.clear();
            this._onPropertyChangedObservable = undefined;
        }
        if (this._onSelectionChangedObservable) {
            for (const observer of this._onSelectionChangedObservable.observers) {
                this.BJSINSPECTOR.Inspector.OnSelectionChangedObservable.add(observer);
            }
            this._onSelectionChangedObservable.clear();
            this._onSelectionChangedObservable = undefined;
        }
        const userOptions = {
            ...DebugLayer.Config,
            ...config,
        };
        this.BJSINSPECTOR = this.BJSINSPECTOR || this._getGlobalInspector();
        this.BJSINSPECTOR.Inspector.Show(this._scene, userOptions);
    }
    /**
     * Select a specific entity in the scene explorer and highlight a specific block in that entity property grid
     * @param entity defines the entity to select
     * @param lineContainerTitles defines the specific blocks to highlight (could be a string or an array of strings)
     */
    select(entity, lineContainerTitles) {
        if (this.BJSINSPECTOR) {
            if (lineContainerTitles) {
                if (Object.prototype.toString.call(lineContainerTitles) == "[object String]") {
                    this.BJSINSPECTOR.Inspector.MarkLineContainerTitleForHighlighting(lineContainerTitles);
                }
                else {
                    this.BJSINSPECTOR.Inspector.MarkMultipleLineContainerTitlesForHighlighting(lineContainerTitles);
                }
            }
            if (!this.BJSINSPECTOR.Inspector.IsVisible) {
                const waitAndCheck = () => {
                    setTimeout(() => {
                        if (this.BJSINSPECTOR.Inspector.IsVisible) {
                            this.select(entity, lineContainerTitles);
                        }
                        else {
                            waitAndCheck();
                        }
                    }, 100);
                };
                waitAndCheck();
            }
            else {
                this.BJSINSPECTOR.Inspector.OnSelectionChangeObservable.notifyObservers(entity);
            }
        }
    }
    /**
     * Get the inspector from bundle or global
     * @returns the inspector instance if found otherwise, null
     */
    _getGlobalInspector() {
        // UMD global name detection from bundle metadata.
        if (typeof INSPECTOR !== "undefined") {
            return INSPECTOR;
        }
        // In case of module let s check the global emitted from the Inspector entry point.
        if (typeof BABYLON !== "undefined" && typeof BABYLON.Inspector !== "undefined") {
            return BABYLON;
        }
        return undefined;
    }
    /**
     * Get if the inspector is visible or not.
     * @returns true if visible otherwise, false
     */
    isVisible() {
        return this.BJSINSPECTOR && this.BJSINSPECTOR.Inspector.IsVisible;
    }
    /**
     * Hide the inspector and close its window.
     */
    hide() {
        if (this.BJSINSPECTOR) {
            this.BJSINSPECTOR.Inspector.Hide();
        }
    }
    /**
     * Get the number of opened panes in the inspector
     */
    get openedPanes() {
        if (this.BJSINSPECTOR) {
            return this.BJSINSPECTOR.Inspector._OpenedPane;
        }
        return 0;
    }
    /**
     * Update the scene in the inspector
     */
    setAsActiveScene() {
        if (this.BJSINSPECTOR) {
            this.BJSINSPECTOR.Inspector._SetNewScene(this._scene);
        }
    }
    /**
     * Pop up the scene explorer in a separate window
     */
    popupSceneExplorer() {
        if (this.BJSINSPECTOR) {
            this.BJSINSPECTOR.Inspector.PopupSceneExplorer();
        }
    }
    /**
     * Pop up the inspector in a separate window
     */
    popupInspector() {
        if (this.BJSINSPECTOR) {
            this.BJSINSPECTOR.Inspector.PopupInspector();
        }
    }
    /**
     * Pop up the embedded inspector panel
     */
    popupEmbed() {
        if (this.BJSINSPECTOR) {
            this.BJSINSPECTOR.Inspector.PopupEmbed();
        }
    }
    /**
     * Launch the debugLayer.
     * @param config Define the configuration of the inspector
     * @returns a promise fulfilled when the debug layer is visible
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    async show(config) {
        return await new Promise((resolve) => {
            if (typeof this.BJSINSPECTOR == "undefined") {
                const inspectorUrl = config && config.inspectorURL ? config.inspectorURL : DebugLayer.InspectorURL;
                // Load inspector and add it to the DOM
                Tools.LoadBabylonScript(inspectorUrl, () => {
                    this._createInspector(config);
                    resolve(this);
                });
            }
            else {
                // Otherwise creates the inspector
                this._createInspector(config);
                resolve(this);
            }
        });
    }
}
/**
 * Define the url to get the inspector script from.
 * By default it uses the babylonjs CDN.
 * @ignoreNaming
 */
DebugLayer.InspectorURL = `${Tools._DefaultCdnUrl}/v${AbstractEngine.Version}/inspector/babylon.inspector.bundle.js`;
/**
 * The default configuration of the inspector
 */
DebugLayer.Config = {
    overlay: false,
    showExplorer: true,
    showInspector: true,
    embedMode: false,
    handleResize: true,
    enablePopup: true,
};
let _Registered = false;
/**
 * Register side effects for debugLayer.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterDebugLayer() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Object.defineProperty(Scene.prototype, "debugLayer", {
        get: function () {
            if (!this._debugLayer) {
                this._debugLayer = new DebugLayer(this);
            }
            return this._debugLayer;
        },
        enumerable: true,
        configurable: true,
    });
}
//# sourceMappingURL=debugLayer.pure.js.map