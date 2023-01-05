import { SceneLoader } from "../Loading/sceneLoader.js";
import { Logger } from "../Misc/logger.js";
import { FilesInputStore } from "./filesInputStore.js";
/**
 * Class used to help managing file picking and drag-n-drop
 */
export class FilesInput {
    /**
     * Creates a new FilesInput
     * @param engine defines the rendering engine
     * @param scene defines the hosting scene
     * @param sceneLoadedCallback callback called when scene is loaded
     * @param progressCallback callback called to track progress
     * @param additionalRenderLoopLogicCallback callback called to add user logic to the rendering loop
     * @param textureLoadingCallback callback called when a texture is loading
     * @param startingProcessingFilesCallback callback called when the system is about to process all files
     * @param onReloadCallback callback called when a reload is requested
     * @param errorCallback callback call if an error occurs
     */
    constructor(engine, scene, sceneLoadedCallback, progressCallback, additionalRenderLoopLogicCallback, textureLoadingCallback, startingProcessingFilesCallback, onReloadCallback, errorCallback) {
        /**
         * Callback called when a file is processed
         */
        this.onProcessFileCallback = () => {
            return true;
        };
        /**
         * Function used when loading the scene file
         * @param sceneFile
         * @param onProgress
         */
        this.loadAsync = (sceneFile, onProgress) => SceneLoader.LoadAsync("file:", sceneFile, this._engine, onProgress);
        this._engine = engine;
        this._currentScene = scene;
        this._sceneLoadedCallback = sceneLoadedCallback;
        this._progressCallback = progressCallback;
        this._additionalRenderLoopLogicCallback = additionalRenderLoopLogicCallback;
        this._textureLoadingCallback = textureLoadingCallback;
        this._startingProcessingFilesCallback = startingProcessingFilesCallback;
        this._onReloadCallback = onReloadCallback;
        this._errorCallback = errorCallback;
    }
    /**
     * List of files ready to be loaded
     */
    static get FilesToLoad() {
        return FilesInputStore.FilesToLoad;
    }
    /**
     * Calls this function to listen to drag'n'drop events on a specific DOM element
     * @param elementToMonitor defines the DOM element to track
     */
    monitorElementForDragNDrop(elementToMonitor) {
        if (elementToMonitor) {
            this._elementToMonitor = elementToMonitor;
            this._dragEnterHandler = (e) => {
                this._drag(e);
            };
            this._dragOverHandler = (e) => {
                this._drag(e);
            };
            this._dropHandler = (e) => {
                this._drop(e);
            };
            this._elementToMonitor.addEventListener("dragenter", this._dragEnterHandler, false);
            this._elementToMonitor.addEventListener("dragover", this._dragOverHandler, false);
            this._elementToMonitor.addEventListener("drop", this._dropHandler, false);
        }
    }
    /** Gets the current list of files to load */
    get filesToLoad() {
        return this._filesToLoad;
    }
    /**
     * Release all associated resources
     */
    dispose() {
        if (!this._elementToMonitor) {
            return;
        }
        this._elementToMonitor.removeEventListener("dragenter", this._dragEnterHandler);
        this._elementToMonitor.removeEventListener("dragover", this._dragOverHandler);
        this._elementToMonitor.removeEventListener("drop", this._dropHandler);
    }
    _renderFunction() {
        if (this._additionalRenderLoopLogicCallback) {
            this._additionalRenderLoopLogicCallback();
        }
        if (this._currentScene) {
            if (this._textureLoadingCallback) {
                const remaining = this._currentScene.getWaitingItemsCount();
                if (remaining > 0) {
                    this._textureLoadingCallback(remaining);
                }
            }
            this._currentScene.render();
        }
    }
    _drag(e) {
        e.stopPropagation();
        e.preventDefault();
    }
    _drop(eventDrop) {
        eventDrop.stopPropagation();
        eventDrop.preventDefault();
        this.loadFiles(eventDrop);
    }
    _traverseFolder(folder, files, remaining, callback) {
        const reader = folder.createReader();
        const relativePath = folder.fullPath.replace(/^\//, "").replace(/(.+?)\/?$/, "$1/");
        reader.readEntries((entries) => {
            remaining.count += entries.length;
            for (const entry of entries) {
                if (entry.isFile) {
                    entry.file((file) => {
                        file.correctName = relativePath + file.name;
                        files.push(file);
                        if (--remaining.count === 0) {
                            callback();
                        }
                    });
                }
                else if (entry.isDirectory) {
                    this._traverseFolder(entry, files, remaining, callback);
                }
            }
            if (--remaining.count === 0) {
                callback();
            }
        });
    }
    _processFiles(files) {
        for (let i = 0; i < files.length; i++) {
            const name = files[i].correctName.toLowerCase();
            const extension = name.split(".").pop();
            if (!this.onProcessFileCallback(files[i], name, extension, (sceneFile) => (this._sceneFileToLoad = sceneFile))) {
                continue;
            }
            if (SceneLoader.IsPluginForExtensionAvailable("." + extension)) {
                this._sceneFileToLoad = files[i];
            }
            FilesInput.FilesToLoad[name] = files[i];
        }
    }
    /**
     * Load files from a drop event
     * @param event defines the drop event to use as source
     */
    loadFiles(event) {
        // Handling data transfer via drag'n'drop
        if (event && event.dataTransfer && event.dataTransfer.files) {
            this._filesToLoad = event.dataTransfer.files;
        }
        // Handling files from input files
        if (event && event.target && event.target.files) {
            this._filesToLoad = event.target.files;
        }
        if (!this._filesToLoad || this._filesToLoad.length === 0) {
            return;
        }
        if (this._startingProcessingFilesCallback) {
            this._startingProcessingFilesCallback(this._filesToLoad);
        }
        if (this._filesToLoad && this._filesToLoad.length > 0) {
            const files = new Array();
            const folders = [];
            const items = event.dataTransfer ? event.dataTransfer.items : null;
            for (let i = 0; i < this._filesToLoad.length; i++) {
                const fileToLoad = this._filesToLoad[i];
                const name = fileToLoad.name.toLowerCase();
                let entry;
                fileToLoad.correctName = name;
                if (items) {
                    const item = items[i];
                    if (item.getAsEntry) {
                        entry = item.getAsEntry();
                    }
                    else if (item.webkitGetAsEntry) {
                        entry = item.webkitGetAsEntry();
                    }
                }
                if (!entry) {
                    files.push(fileToLoad);
                }
                else {
                    if (entry.isDirectory) {
                        folders.push(entry);
                    }
                    else {
                        files.push(fileToLoad);
                    }
                }
            }
            if (folders.length === 0) {
                this._processFiles(files);
                this._processReload();
            }
            else {
                const remaining = { count: folders.length };
                for (const folder of folders) {
                    this._traverseFolder(folder, files, remaining, () => {
                        this._processFiles(files);
                        if (remaining.count === 0) {
                            this._processReload();
                        }
                    });
                }
            }
        }
    }
    _processReload() {
        if (this._onReloadCallback) {
            this._onReloadCallback(this._sceneFileToLoad);
        }
        else {
            this.reload();
        }
    }
    /**
     * Reload the current scene from the loaded files
     */
    reload() {
        // If a scene file has been provided
        if (this._sceneFileToLoad) {
            if (this._currentScene) {
                if (Logger.errorsCount > 0) {
                    Logger.ClearLogCache();
                }
                this._engine.stopRenderLoop();
            }
            SceneLoader.ShowLoadingScreen = false;
            this._engine.displayLoadingUI();
            this.loadAsync(this._sceneFileToLoad, this._progressCallback)
                .then((scene) => {
                if (this._currentScene) {
                    this._currentScene.dispose();
                }
                this._currentScene = scene;
                if (this._sceneLoadedCallback) {
                    this._sceneLoadedCallback(this._sceneFileToLoad, this._currentScene);
                }
                // Wait for textures and shaders to be ready
                this._currentScene.executeWhenReady(() => {
                    this._engine.hideLoadingUI();
                    this._engine.runRenderLoop(() => {
                        this._renderFunction();
                    });
                });
            })
                .catch((error) => {
                this._engine.hideLoadingUI();
                if (this._errorCallback) {
                    this._errorCallback(this._sceneFileToLoad, this._currentScene, error.message);
                }
            });
        }
        else {
            Logger.Error("Please provide a valid .babylon file.");
        }
    }
}
//# sourceMappingURL=filesInput.js.map