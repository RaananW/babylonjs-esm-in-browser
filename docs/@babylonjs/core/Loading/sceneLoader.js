/* eslint-disable @typescript-eslint/naming-convention */
import { Tools } from "../Misc/tools.pure.js";
import { Observable } from "../Misc/observable.js";
import { Scene } from "../scene.pure.js";
import { EngineStore } from "../Engines/engineStore.js";
import { Logger } from "../Misc/logger.js";

import { SceneLoaderFlags } from "./sceneLoaderFlags.js";
import { IsBase64DataUrl } from "../Misc/fileTools.pure.js";
import { RuntimeError, ErrorCodes } from "../Misc/error.js";
import { RandomGUID } from "../Misc/guid.js";
import { AbstractEngine } from "../Engines/abstractEngine.js";
import { _FetchAsync } from "../Misc/webRequest.fetch.js";
/**
 * Mode that determines how to handle old animation groups before loading new ones.
 */
export var SceneLoaderAnimationGroupLoadingMode;
(function (SceneLoaderAnimationGroupLoadingMode) {
    /**
     * Reset all old animations to initial state then dispose them.
     */
    SceneLoaderAnimationGroupLoadingMode[SceneLoaderAnimationGroupLoadingMode["Clean"] = 0] = "Clean";
    /**
     * Stop all old animations.
     */
    SceneLoaderAnimationGroupLoadingMode[SceneLoaderAnimationGroupLoadingMode["Stop"] = 1] = "Stop";
    /**
     * Restart old animations from first frame.
     */
    SceneLoaderAnimationGroupLoadingMode[SceneLoaderAnimationGroupLoadingMode["Sync"] = 2] = "Sync";
    /**
     * Old animations remains untouched.
     */
    SceneLoaderAnimationGroupLoadingMode[SceneLoaderAnimationGroupLoadingMode["NoSync"] = 3] = "NoSync";
})(SceneLoaderAnimationGroupLoadingMode || (SceneLoaderAnimationGroupLoadingMode = {}));
function IsFactory(pluginOrFactory) {
    return !!pluginOrFactory.createPlugin;
}
function isFile(value) {
    return !!value.name;
}
const onPluginActivatedObservable = new Observable();
const registeredPlugins = {};
let showingLoadingScreen = false;
function getDefaultPlugin() {
    return registeredPlugins[".babylon"];
}
function getPluginForMimeType(mimeType) {
    for (const registeredPluginKey in registeredPlugins) {
        const registeredPlugin = registeredPlugins[registeredPluginKey];
        if (registeredPlugin.mimeType === mimeType) {
            return registeredPlugin;
        }
    }
    return undefined;
}
function getPluginForExtension(extension, returnDefault) {
    const registeredPlugin = registeredPlugins[extension];
    if (registeredPlugin) {
        return registeredPlugin;
    }
    Logger.Warn("Unable to find a plugin to load " +
        extension +
        " files. Trying to use .babylon default plugin. To load from a specific filetype (eg. gltf) see: https://doc.babylonjs.com/features/featuresDeepDive/importers/loadingFileTypes");
    return returnDefault ? getDefaultPlugin() : undefined;
}
function isPluginForExtensionAvailable(extension) {
    return !!registeredPlugins[extension];
}
function getPluginForDirectLoad(data) {
    for (const extension in registeredPlugins) {
        const plugin = registeredPlugins[extension].plugin;
        if (plugin.canDirectLoad && plugin.canDirectLoad(data)) {
            return registeredPlugins[extension];
        }
    }
    return getDefaultPlugin();
}
function getFilenameExtension(sceneFilename) {
    const queryStringPosition = sceneFilename.indexOf("?");
    if (queryStringPosition !== -1) {
        sceneFilename = sceneFilename.substring(0, queryStringPosition);
    }
    const dotPosition = sceneFilename.lastIndexOf(".");
    return sceneFilename.substring(dotPosition, sceneFilename.length).toLowerCase();
}
function getDirectLoad(sceneFilename) {
    if (sceneFilename.substring(0, 5) === "data:") {
        return sceneFilename.substring(5);
    }
    return null;
}
function formatErrorMessage(fileInfo, message, exception) {
    const fromLoad = fileInfo.rawData ? "binary data" : fileInfo.url;
    let errorMessage = "Unable to load from " + fromLoad;
    if (message) {
        errorMessage += `: ${message}`;
    }
    else if (exception) {
        errorMessage += `: ${exception}`;
    }
    return errorMessage;
}
function createLoadError(fileInfo, message, exception) {
    const errorMessage = formatErrorMessage(fileInfo, message, exception);
    return new RuntimeError(errorMessage, ErrorCodes.SceneLoaderError, exception);
}
function getErrorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
// Converts an error into a SceneLoader RuntimeError, leaving an already-wrapped SceneLoader error untouched
// so that it is not double-wrapped (which would duplicate the "Unable to load from ..." prefix).
function toLoadError(fileInfo, error) {
    return error instanceof RuntimeError && error.errorCode === ErrorCodes.SceneLoaderError ? error : createLoadError(fileInfo, getErrorMessage(error), error);
}
const loadAssetContainerNotSupportedMessage = "LoadAssetContainer is not supported by this plugin. Plugin did not provide a loadAssetContainer or loadAssetContainerAsync method.";
// A synchronous plugin exposes the synchronous import/load methods; an asynchronous plugin exposes the *Async methods.
function isSyncPlugin(plugin) {
    const candidate = plugin;
    return !!candidate.importMesh || !!candidate.load || !!candidate.loadAssetContainer;
}
// Adapts a synchronous ISceneLoaderPlugin into an ISceneLoaderPluginAsync so that callers can use a single
// promise-based code path regardless of whether the underlying plugin is synchronous or asynchronous.
// Asynchronous plugins are returned unchanged. The synchronous plugin reports failure via an onError callback
// and/or a falsy return value; both are translated into a rejected promise.
function toAsyncPlugin(plugin, fileInfo) {
    if (!isSyncPlugin(plugin)) {
        return plugin;
    }
    const runSync = (invoke) => {
        let pluginError;
        const result = invoke((message, exception) => {
            pluginError = { message, exception };
        });
        if (!result) {
            throw createLoadError(fileInfo, pluginError?.message, pluginError?.exception);
        }
        return result;
    };
    return {
        name: plugin.name,
        extensions: plugin.extensions,
        importMeshAsync: async (meshesNames, scene, data, rootUrl) => {
            const meshes = [];
            const particleSystems = [];
            const skeletons = [];
            runSync((onError) => plugin.importMesh(meshesNames, scene, data, rootUrl, meshes, particleSystems, skeletons, onError));
            return { meshes, particleSystems, skeletons, animationGroups: [], transformNodes: [], geometries: [], lights: [], spriteManagers: [] };
        },
        loadAsync: async (scene, data, rootUrl) => {
            runSync((onError) => plugin.load(scene, data, rootUrl, onError));
        },
        loadAssetContainerAsync: async (scene, data, rootUrl) => {
            return runSync((onError) => plugin.loadAssetContainer(scene, data, rootUrl, onError));
        },
    };
}
// Reports a load failure to the legacy onError callback. The onError signature requires a Scene, but a scene
// may not be available (e.g. the error occurred before any scene was created). In that case, fall back to
// logging so the error handler does not throw a secondary error and mask the original failure.
function reportLegacyLoadError(onError, reportScene, error) {
    const message = getErrorMessage(error);
    if (onError && reportScene) {
        onError(reportScene, message, error);
    }
    else {
        Logger.Error(message);
    }
}
// Wraps a user supplied progress callback so that an exception thrown by it is logged rather than
// aborting the entire loading operation.
function wrapProgress(onProgress) {
    if (!onProgress) {
        return undefined;
    }
    return (event) => {
        try {
            onProgress(event);
        }
        catch (error) {
            Logger.Warn("Error in onProgress callback: " + getErrorMessage(error));
        }
    };
}
async function loadDataAsync(fileInfo, scene, onProgress, pluginExtension, name, pluginOptions) {
    const directLoad = getDirectLoad(fileInfo.url);
    if (fileInfo.rawData && !pluginExtension) {
        throw new Error("When using ArrayBufferView to load data the file extension must be provided.");
    }
    const fileExtension = !directLoad && !pluginExtension ? getFilenameExtension(fileInfo.url) : "";
    let registeredPlugin = pluginExtension
        ? getPluginForExtension(pluginExtension, true)
        : directLoad
            ? getPluginForDirectLoad(fileInfo.url)
            : getPluginForExtension(fileExtension, false);
    if (!registeredPlugin && fileExtension) {
        if (fileInfo.url && !fileInfo.url.startsWith("blob:")) {
            // Fetching head content to get the mime type
            const response = await _FetchAsync(fileInfo.url, { method: "HEAD", responseHeaders: ["Content-Type"] });
            const mimeType = response.headerValues ? response.headerValues["Content-Type"] : "";
            if (mimeType) {
                registeredPlugin = getPluginForMimeType(mimeType);
            }
        }
        if (!registeredPlugin) {
            registeredPlugin = getDefaultPlugin();
        }
    }
    if (!registeredPlugin) {
        throw new Error(`No plugin or fallback for ${pluginExtension ?? fileInfo.url}`);
    }
    if (pluginOptions?.[registeredPlugin.plugin.name]?.enabled === false) {
        throw new Error(`The '${registeredPlugin.plugin.name}' plugin is disabled via the loader options passed to the loading operation.`);
    }
    if (fileInfo.rawData && !registeredPlugin.isBinary) {
        throw new Error("Loading from ArrayBufferView can not be used with plugins that don't support binary loading.");
    }
    // For plugin factories, the plugin is instantiated on each SceneLoader operation. This makes options handling
    // much simpler as we can just pass the options to the factory, rather than passing options through to every possible
    // plugin call. Given this, options are only supported for plugins that provide a factory function.
    let plugin;
    if (IsFactory(registeredPlugin.plugin)) {
        const pluginFactory = registeredPlugin.plugin;
        try {
            // Only await when the factory is actually asynchronous, so that for synchronous factories the plugin is
            // instantiated (and onPluginActivatedObservable is notified) synchronously within the calling load operation.
            const createdPlugin = pluginFactory.createPlugin((pluginOptions ?? {}));
            plugin = createdPlugin instanceof Promise ? await createdPlugin : createdPlugin;
        }
        catch (error) {
            throw createLoadError(fileInfo, "Error instantiating plugin.", error);
        }
    }
    else {
        plugin = registeredPlugin.plugin;
    }
    if (!plugin) {
        throw new Error(`The loader plugin corresponding to the '${pluginExtension}' file type has not been found. If using es6, please import the plugin you wish to use before.`);
    }
    onPluginActivatedObservable.notifyObservers(plugin);
    // Check if we have a direct load url. If the plugin is registered to handle
    // it or it's not a base64 data url, then pass it through the direct load path.
    if (directLoad && ((plugin.canDirectLoad && plugin.canDirectLoad(fileInfo.url)) || !IsBase64DataUrl(fileInfo.url))) {
        if (plugin.directLoad) {
            let data;
            try {
                data = await plugin.directLoad(scene, directLoad);
            }
            catch (error) {
                throw createLoadError(fileInfo, "Error in directLoad of _loadData: " + error, error);
            }
            return { plugin, data };
        }
        return { plugin, data: directLoad };
    }
    const useArrayBuffer = registeredPlugin.isBinary;
    return await new Promise((resolve, reject) => {
        let request = null;
        let pluginDisposed = false;
        const onDisposeObserver = plugin.onDisposeObservable?.add(() => {
            pluginDisposed = true;
            if (request) {
                request.abort();
                request = null;
            }
            rejectAndCleanup(createLoadError(fileInfo, "Loading was aborted because the plugin was disposed."));
        });
        // Ensure the onDispose observer is removed once the promise settles, so observers do not accumulate across loads.
        const cleanup = () => {
            if (onDisposeObserver) {
                plugin.onDisposeObservable?.remove(onDisposeObserver);
            }
        };
        const resolveAndCleanup = (value) => {
            cleanup();
            resolve(value);
        };
        const rejectAndCleanup = (error) => {
            cleanup();
            reject(error);
        };
        const dataCallback = (data, responseURL) => {
            if (scene.isDisposed) {
                rejectAndCleanup(createLoadError(fileInfo, "Scene has been disposed"));
                return;
            }
            resolveAndCleanup({ plugin, data, responseURL });
        };
        const manifestChecked = () => {
            if (pluginDisposed) {
                return;
            }
            const errorCallback = (request, exception) => {
                rejectAndCleanup(createLoadError(fileInfo, request?.statusText, exception));
            };
            if (!plugin.loadFile && fileInfo.rawData) {
                rejectAndCleanup(createLoadError(fileInfo, "Plugin does not support loading ArrayBufferView."));
                return;
            }
            try {
                request = plugin.loadFile
                    ? plugin.loadFile(scene, fileInfo.rawData || fileInfo.file || fileInfo.url, fileInfo.rootUrl, dataCallback, onProgress, useArrayBuffer, errorCallback, name)
                    : scene._loadFile(fileInfo.file || fileInfo.url, dataCallback, onProgress, true, useArrayBuffer, errorCallback);
            }
            catch (error) {
                rejectAndCleanup(createLoadError(fileInfo, undefined, error));
            }
        };
        const engine = scene.getEngine();
        // File objects and raw data buffers are already in-memory and are not URL-backed requests, so they must
        // not be routed through the offline (manifest/cache) provider.
        let canUseOfflineSupport = !fileInfo.file && !fileInfo.rawData && engine.enableOfflineSupport;
        if (canUseOfflineSupport) {
            // Also check for exceptions
            let exceptionFound = false;
            for (const regex of scene.disableOfflineSupportExceptionRules) {
                if (regex.test(fileInfo.url)) {
                    exceptionFound = true;
                    break;
                }
            }
            canUseOfflineSupport = !exceptionFound;
        }
        if (canUseOfflineSupport && AbstractEngine.OfflineProviderFactory) {
            // Checking if a manifest file has been set for this scene and if offline mode has been requested
            try {
                scene.offlineProvider = AbstractEngine.OfflineProviderFactory(fileInfo.url, manifestChecked, engine.disableManifestCheck);
            }
            catch (error) {
                rejectAndCleanup(createLoadError(fileInfo, undefined, error));
            }
        }
        else {
            manifestChecked();
        }
    });
}
function GetFileInfo(rootUrl, sceneSource) {
    let url;
    let name;
    let file = null;
    let rawData = null;
    if (!sceneSource) {
        url = rootUrl;
        name = Tools.GetFilename(rootUrl);
        rootUrl = Tools.GetFolderPath(rootUrl);
    }
    else if (isFile(sceneSource)) {
        url = `file:${sceneSource.name}`;
        name = sceneSource.name;
        file = sceneSource;
    }
    else if (ArrayBuffer.isView(sceneSource)) {
        url = "";
        name = RandomGUID();
        rawData = sceneSource;
    }
    else if (sceneSource.startsWith("data:")) {
        url = sceneSource;
        name = "";
    }
    else if (rootUrl) {
        const filename = sceneSource;
        if (filename.substring(0, 1) === "/") {
            Tools.Error("Wrong sceneFilename parameter");
            return null;
        }
        url = rootUrl + filename;
        name = filename;
    }
    else {
        url = sceneSource;
        name = Tools.GetFilename(sceneSource);
        rootUrl = Tools.GetFolderPath(sceneSource);
    }
    return {
        url: url,
        rootUrl: rootUrl,
        name: name,
        file: file,
        rawData,
    };
}
/**
 * Adds a new plugin to the list of registered plugins
 * @param plugin defines the plugin to add
 */
export function RegisterSceneLoaderPlugin(plugin) {
    if (typeof plugin.extensions === "string") {
        const extension = plugin.extensions;
        registeredPlugins[extension.toLowerCase()] = {
            plugin: plugin,
            isBinary: false,
        };
    }
    else {
        const extensions = plugin.extensions;
        const keys = Object.keys(extensions);
        for (const extension of keys) {
            registeredPlugins[extension.toLowerCase()] = {
                plugin: plugin,
                isBinary: extensions[extension].isBinary,
                mimeType: extensions[extension].mimeType,
            };
        }
    }
}
/**
 * Adds a new plugin to the list of registered plugins
 * @deprecated Please use {@link RegisterSceneLoaderPlugin} instead.
 * @param plugin defines the plugin to add
 */
export function registerSceneLoaderPlugin(plugin) {
    RegisterSceneLoaderPlugin(plugin);
}
/**
 * Gets metadata for all currently registered scene loader plugins.
 * @returns An array where each entry has metadata for a single scene loader plugin.
 */
export function GetRegisteredSceneLoaderPluginMetadata() {
    return Array.from(Object.entries(registeredPlugins).reduce((pluginMap, [extension, extensionRegistration]) => {
        let pluginMetadata = pluginMap.get(extensionRegistration.plugin.name);
        if (!pluginMetadata) {
            pluginMap.set(extensionRegistration.plugin.name, (pluginMetadata = []));
        }
        pluginMetadata.push({ extension, isBinary: extensionRegistration.isBinary, mimeType: extensionRegistration.mimeType });
        return pluginMap;
    }, new Map())).map(([name, extensions]) => ({ name, extensions }));
}
/**
 * Import meshes into a scene
 * @param source a string that defines the name of the scene file, or starts with "data:" following by the stringified version of the scene, or a File object, or an ArrayBufferView
 * @param scene the instance of BABYLON.Scene to append to
 * @param options an object that configures aspects of how the scene is loaded
 * @returns The loaded list of imported meshes, particle systems, skeletons, and animation groups
 */
export async function ImportMeshAsync(source, scene, options) {
    const { meshNames, rootUrl = "", onProgress, pluginExtension, name, pluginOptions } = options ?? {};
    return await importMeshCoreAsync(meshNames, rootUrl, source, scene, onProgress, pluginExtension, name, pluginOptions);
}
async function importMeshCoreAsync(meshNames, rootUrl, sceneFilename = "", scene = EngineStore.LastCreatedScene, onProgress, pluginExtension, name = "", pluginOptions = {}) {
    if (!scene) {
        throw new Error("No scene available to import mesh to");
    }
    const fileInfo = GetFileInfo(rootUrl, sceneFilename);
    if (!fileInfo) {
        throw new Error("Cannot load file: a valid scene filename or root url was not provided.");
    }
    const loadingToken = {};
    scene.addPendingData(loadingToken);
    const progressHandler = wrapProgress(onProgress);
    try {
        const { plugin, data, responseURL } = await loadDataAsync(fileInfo, scene, progressHandler, pluginExtension ?? null, name, pluginOptions);
        if (plugin.rewriteRootURL) {
            fileInfo.rootUrl = plugin.rewriteRootURL(fileInfo.rootUrl, responseURL);
        }
        let result;
        try {
            result = await toAsyncPlugin(plugin, fileInfo).importMeshAsync(meshNames, scene, data, fileInfo.rootUrl, progressHandler, fileInfo.name);
        }
        catch (error) {
            throw toLoadError(fileInfo, error);
        }
        // eslint-disable-next-line require-atomic-updates
        scene.loadingPluginName = plugin.name;
        scene.importedMeshesFiles.push(fileInfo.url);
        return result;
    }
    finally {
        scene.removePendingData(loadingToken);
    }
}
// This is the core implementation of load scene
async function loadSceneCoreAsync(rootUrl, sceneFilename = "", engine = EngineStore.LastCreatedEngine, onProgress, pluginExtension, name = "", pluginOptions = {}) {
    if (!engine) {
        throw new Error("No engine available");
    }
    const scene = new Scene(engine);
    try {
        await appendSceneCoreAsync(rootUrl, sceneFilename, scene, onProgress, pluginExtension, name, pluginOptions);
    }
    catch (error) {
        // The scene was created here, so dispose it on failure to avoid leaking the partially loaded scene.
        scene.dispose();
        throw error;
    }
    return scene;
}
/**
 * Load a scene
 * @param source a string that defines the name of the scene file, or starts with "data:" following by the stringified version of the scene, or a File object, or an ArrayBufferView
 * @param engine is the instance of BABYLON.Engine to use to create the scene
 * @param options an object that configures aspects of how the scene is loaded
 * @returns The loaded scene
 */
export async function LoadSceneAsync(source, engine, options) {
    const { rootUrl = "", onProgress, pluginExtension, name, pluginOptions } = options ?? {};
    return await loadSceneCoreAsync(rootUrl, source, engine, onProgress, pluginExtension, name, pluginOptions);
}
/**
 * Load a scene
 * @deprecated Please use {@link LoadSceneAsync} instead.
 * @param source a string that defines the name of the scene file, or starts with "data:" following by the stringified version of the scene, or a File object, or an ArrayBufferView
 * @param engine is the instance of BABYLON.Engine to use to create the scene
 * @param options an object that configures aspects of how the scene is loaded
 * @returns The loaded scene
 */
export async function loadSceneAsync(source, engine, options) {
    return await LoadSceneAsync(source, engine, options);
}
// This is the core implementation of append scene
async function appendSceneCoreAsync(rootUrl, sceneFilename = "", scene = EngineStore.LastCreatedScene, onProgress, pluginExtension, name = "", pluginOptions = {}) {
    if (!scene) {
        throw new Error("No scene available to append to");
    }
    const fileInfo = GetFileInfo(rootUrl, sceneFilename);
    if (!fileInfo) {
        throw new Error("Cannot load file: a valid scene filename or root url was not provided.");
    }
    const loadingToken = {};
    scene.addPendingData(loadingToken);
    if (SceneLoaderFlags.ShowLoadingScreen && !showingLoadingScreen) {
        showingLoadingScreen = true;
        scene.getEngine().displayLoadingUI();
        scene.executeWhenReady(() => {
            scene.getEngine().hideLoadingUI();
            showingLoadingScreen = false;
        });
    }
    const progressHandler = wrapProgress(onProgress);
    try {
        const { plugin, data } = await loadDataAsync(fileInfo, scene, progressHandler, pluginExtension ?? null, name, pluginOptions);
        try {
            await toAsyncPlugin(plugin, fileInfo).loadAsync(scene, data, fileInfo.rootUrl, progressHandler, fileInfo.name);
        }
        catch (error) {
            throw toLoadError(fileInfo, error);
        }
        // eslint-disable-next-line require-atomic-updates
        scene.loadingPluginName = plugin.name;
        return scene;
    }
    finally {
        scene.removePendingData(loadingToken);
    }
}
/**
 * Append a scene
 * @param source a string that defines the name of the scene file, or starts with "data:" following by the stringified version of the scene, or a File object, or an ArrayBufferView
 * @param scene is the instance of BABYLON.Scene to append to
 * @param options an object that configures aspects of how the scene is loaded
 * @returns A promise that resolves when the scene is appended
 */
export async function AppendSceneAsync(source, scene, options) {
    const { rootUrl = "", onProgress, pluginExtension, name, pluginOptions } = options ?? {};
    await appendSceneCoreAsync(rootUrl, source, scene, onProgress, pluginExtension, name, pluginOptions);
}
/**
 * Append a scene
 * @deprecated Please use {@link AppendSceneAsync} instead.
 * @param source a string that defines the name of the scene file, or starts with "data:" following by the stringified version of the scene, or a File object, or an ArrayBufferView
 * @param scene is the instance of BABYLON.Scene to append to
 * @param options an object that configures aspects of how the scene is loaded
 * @returns A promise that resolves when the scene is appended
 */
export async function appendSceneAsync(source, scene, options) {
    return await AppendSceneAsync(source, scene, options);
}
// This is the core implementation of load asset container
async function loadAssetContainerCoreAsync(rootUrl, sceneFilename = "", scene = EngineStore.LastCreatedScene, onProgress, pluginExtension, name = "", pluginOptions = {}) {
    if (!scene) {
        throw new Error("No scene available to load asset container to");
    }
    const fileInfo = GetFileInfo(rootUrl, sceneFilename);
    if (!fileInfo) {
        throw new Error("Cannot load file: a valid scene filename or root url was not provided.");
    }
    const loadingToken = {};
    scene.addPendingData(loadingToken);
    const progressHandler = wrapProgress(onProgress);
    try {
        const { plugin, data } = await loadDataAsync(fileInfo, scene, progressHandler, pluginExtension ?? null, name, pluginOptions);
        const asyncPlugin = toAsyncPlugin(plugin, fileInfo);
        if (!asyncPlugin.loadAssetContainerAsync) {
            throw createLoadError(fileInfo, loadAssetContainerNotSupportedMessage);
        }
        let assetContainer;
        try {
            assetContainer = await asyncPlugin.loadAssetContainerAsync(scene, data, fileInfo.rootUrl, progressHandler, fileInfo.name);
        }
        catch (error) {
            throw toLoadError(fileInfo, error);
        }
        assetContainer.populateRootNodes();
        // eslint-disable-next-line require-atomic-updates
        scene.loadingPluginName = plugin.name;
        return assetContainer;
    }
    finally {
        scene.removePendingData(loadingToken);
    }
}
/**
 * Load a scene into an asset container
 * @param source a string that defines the name of the scene file, or starts with "data:" following by the stringified version of the scene, or a File object, or an ArrayBufferView
 * @param scene is the instance of Scene to append to
 * @param options an object that configures aspects of how the scene is loaded
 * @returns The loaded asset container
 */
export async function LoadAssetContainerAsync(source, scene, options) {
    const { rootUrl = "", onProgress, pluginExtension, name, pluginOptions } = options ?? {};
    return await loadAssetContainerCoreAsync(rootUrl, source, scene, onProgress, pluginExtension, name, pluginOptions);
}
/**
 * Load a scene into an asset container
 * @deprecated Please use {@link LoadAssetContainerAsync} instead.
 * @param source a string that defines the name of the scene file, or starts with "data:" following by the stringified version of the scene, or a File object, or an ArrayBufferView
 * @param scene is the instance of Scene to append to
 * @param options an object that configures aspects of how the scene is loaded
 * @returns The loaded asset container
 */
export async function loadAssetContainerAsync(source, scene, options) {
    return await LoadAssetContainerAsync(source, scene, options);
}
// This is the core implementation of import animations
async function importAnimationsCoreAsync(rootUrl, sceneFilename = "", scene = EngineStore.LastCreatedScene, overwriteAnimations = true, animationGroupLoadingMode = 0 /* SceneLoaderAnimationGroupLoadingMode.Clean */, targetConverter = null, onProgress, pluginExtension, name = "", pluginOptions = {}) {
    if (!scene) {
        throw new Error("No scene available to load animations to");
    }
    if (overwriteAnimations) {
        // Reset, stop and dispose all animations before loading new ones
        for (const animatable of scene.animatables) {
            animatable.reset();
        }
        scene.stopAllAnimations();
        const animationGroups = scene.animationGroups.slice();
        for (const animationGroup of animationGroups) {
            animationGroup.dispose();
        }
        const nodes = scene.getNodes();
        for (const node of nodes) {
            if (node.animations) {
                node.animations = [];
            }
        }
    }
    else {
        switch (animationGroupLoadingMode) {
            case 0 /* SceneLoaderAnimationGroupLoadingMode.Clean */:
                const animationGroups = scene.animationGroups.slice();
                for (const animationGroup of animationGroups) {
                    animationGroup.dispose();
                }
                break;
            case 1 /* SceneLoaderAnimationGroupLoadingMode.Stop */:
                for (const animationGroup of scene.animationGroups) {
                    animationGroup.stop();
                }
                break;
            case 2 /* SceneLoaderAnimationGroupLoadingMode.Sync */:
                for (const animationGroup of scene.animationGroups) {
                    animationGroup.reset();
                    animationGroup.restart();
                }
                break;
            case 3 /* SceneLoaderAnimationGroupLoadingMode.NoSync */:
                // nothing to do
                break;
            default:
                throw new Error("Unknown animation group loading mode value '" + animationGroupLoadingMode + "'");
        }
    }
    const startingIndexForNewAnimatables = scene.animatables.length;
    const container = await loadAssetContainerCoreAsync(rootUrl, sceneFilename, scene, onProgress, pluginExtension, name, pluginOptions);
    container.mergeAnimationsTo(scene, scene.animatables.slice(startingIndexForNewAnimatables), targetConverter);
    container.dispose();
    scene.onAnimationFileImportedObservable.notifyObservers(scene);
}
/**
 * Import animations from a file into a scene
 * @param source a string that defines the name of the scene file, or starts with "data:" following by the stringified version of the scene, or a File object, or an ArrayBufferView
 * @param scene is the instance of BABYLON.Scene to append to
 * @param options an object that configures aspects of how the scene is loaded
 * @returns A promise that resolves when the animations are imported
 */
export async function ImportAnimationsAsync(source, scene, options) {
    const { rootUrl = "", overwriteAnimations, animationGroupLoadingMode, targetConverter, onProgress, pluginExtension, name, pluginOptions } = options ?? {};
    await importAnimationsCoreAsync(rootUrl, source, scene, overwriteAnimations, animationGroupLoadingMode, targetConverter, onProgress, pluginExtension, name, pluginOptions);
}
/**
 * Import animations from a file into a scene
 * @deprecated Please use {@link ImportAnimationsAsync} instead.
 * @param source a string that defines the name of the scene file, or starts with "data:" following by the stringified version of the scene, or a File object, or an ArrayBufferView
 * @param scene is the instance of BABYLON.Scene to append to
 * @param options an object that configures aspects of how the scene is loaded
 * @returns A promise that resolves when the animations are imported
 */
export async function importAnimationsAsync(source, scene, options) {
    return await ImportAnimationsAsync(source, scene, options);
}
/**
 * Class used to load scene from various file formats using registered plugins
 * @see https://doc.babylonjs.com/features/featuresDeepDive/importers/loadingFileTypes
 * @deprecated The module level functions are more efficient for bundler tree shaking and allow plugin options to be passed through. Future improvements to scene loading will primarily be in the module level functions. The SceneLoader class will remain available, but it will be beneficial to prefer the module level functions.
 * @see {@link ImportMeshAsync}, {@link LoadSceneAsync}, {@link AppendSceneAsync}, {@link ImportAnimationsAsync}, {@link LoadAssetContainerAsync}
 */
export class SceneLoader {
    /**
     * Gets or sets a boolean indicating if entire scene must be loaded even if scene contains incremental data
     */
    static get ForceFullSceneLoadingForIncremental() {
        return SceneLoaderFlags.ForceFullSceneLoadingForIncremental;
    }
    static set ForceFullSceneLoadingForIncremental(value) {
        SceneLoaderFlags.ForceFullSceneLoadingForIncremental = value;
    }
    /**
     * Gets or sets a boolean indicating if loading screen must be displayed while loading a scene
     */
    static get ShowLoadingScreen() {
        return SceneLoaderFlags.ShowLoadingScreen;
    }
    static set ShowLoadingScreen(value) {
        SceneLoaderFlags.ShowLoadingScreen = value;
    }
    /**
     * Defines the current logging level (while loading the scene)
     * @ignorenaming
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    static get loggingLevel() {
        return SceneLoaderFlags.loggingLevel;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    static set loggingLevel(value) {
        SceneLoaderFlags.loggingLevel = value;
    }
    /**
     * Gets or set a boolean indicating if matrix weights must be cleaned upon loading
     */
    static get CleanBoneMatrixWeights() {
        return SceneLoaderFlags.CleanBoneMatrixWeights;
    }
    static set CleanBoneMatrixWeights(value) {
        SceneLoaderFlags.CleanBoneMatrixWeights = value;
    }
    /**
     * Gets the default plugin (used to load Babylon files)
     * @returns the .babylon plugin
     */
    static GetDefaultPlugin() {
        return getDefaultPlugin();
    }
    // Public functions
    /**
     * Gets a plugin that can load the given extension
     * @param extension defines the extension to load
     * @returns a plugin or null if none works
     */
    static GetPluginForExtension(extension) {
        return getPluginForExtension(extension, true)?.plugin;
    }
    /**
     * Gets a boolean indicating that the given extension can be loaded
     * @param extension defines the extension to load
     * @returns true if the extension is supported
     */
    static IsPluginForExtensionAvailable(extension) {
        return isPluginForExtensionAvailable(extension);
    }
    /**
     * Adds a new plugin to the list of registered plugins
     * @param plugin defines the plugin to add
     */
    static RegisterPlugin(plugin) {
        RegisterSceneLoaderPlugin(plugin);
    }
    /**
     * Import meshes into a scene
     * @param meshNames an array of mesh names, a single mesh name, or empty string for all meshes that filter what meshes are imported
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene or a File object (default: empty string)
     * @param scene the instance of BABYLON.Scene to append to
     * @param onSuccess a callback with a list of imported meshes, particleSystems, skeletons, and animationGroups when import succeeds
     * @param onProgress a callback with a progress event for each file being loaded
     * @param onError a callback with the scene, a message, and possibly an exception when import fails
     * @param pluginExtension the extension used to determine the plugin
     * @param name defines the name of the file, if the data is binary
     * @param pluginOptions defines the options to use with the plugin
     * @deprecated Please use the module level {@link ImportMeshAsync} instead
     */
    static ImportMesh(meshNames, rootUrl, sceneFilename, scene, onSuccess, onProgress, onError, pluginExtension, name, pluginOptions) {
        const reportScene = scene ?? EngineStore.LastCreatedScene;
        void (async () => {
            try {
                const result = await importMeshCoreAsync(meshNames, rootUrl, sceneFilename, scene, onProgress, pluginExtension, name, pluginOptions);
                onSuccess?.(result.meshes, result.particleSystems, result.skeletons, result.animationGroups, result.transformNodes, result.geometries, result.lights, result.spriteManagers);
            }
            catch (error) {
                reportLegacyLoadError(onError, reportScene, error);
            }
        })();
    }
    /**
     * Import meshes into a scene
     * @param meshNames an array of mesh names, a single mesh name, or empty string for all meshes that filter what meshes are imported
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene or a File object (default: empty string)
     * @param scene the instance of BABYLON.Scene to append to
     * @param onProgress a callback with a progress event for each file being loaded
     * @param pluginExtension the extension used to determine the plugin
     * @param name defines the name of the file
     * @returns The loaded list of imported meshes, particle systems, skeletons, and animation groups
     * @deprecated Please use the module level {@link ImportMeshAsync} instead
     */
    static async ImportMeshAsync(meshNames, rootUrl, sceneFilename, scene, onProgress, pluginExtension, name) {
        return await importMeshCoreAsync(meshNames, rootUrl, sceneFilename, scene, onProgress, pluginExtension, name);
    }
    /**
     * Load a scene
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene or a File object (default: empty string)
     * @param engine is the instance of BABYLON.Engine to use to create the scene
     * @param onSuccess a callback with the scene when import succeeds
     * @param onProgress a callback with a progress event for each file being loaded
     * @param onError a callback with the scene, a message, and possibly an exception when import fails
     * @param pluginExtension the extension used to determine the plugin
     * @param name defines the filename, if the data is binary
     * @deprecated Please use the module level {@link LoadSceneAsync} instead
     */
    static Load(rootUrl, sceneFilename, engine, onSuccess, onProgress, onError, pluginExtension, name) {
        void (async () => {
            try {
                const scene = await loadSceneCoreAsync(rootUrl, sceneFilename, engine, onProgress, pluginExtension, name);
                onSuccess?.(scene);
            }
            catch (error) {
                reportLegacyLoadError(onError, EngineStore.LastCreatedScene, error);
            }
        })();
    }
    /**
     * Load a scene
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene or a File object (default: empty string)
     * @param engine is the instance of BABYLON.Engine to use to create the scene
     * @param onProgress a callback with a progress event for each file being loaded
     * @param pluginExtension the extension used to determine the plugin
     * @param name defines the filename, if the data is binary
     * @returns The loaded scene
     * @deprecated Please use the module level {@link LoadSceneAsync} instead
     */
    static async LoadAsync(rootUrl, sceneFilename, engine, onProgress, pluginExtension, name) {
        return await loadSceneCoreAsync(rootUrl, sceneFilename, engine, onProgress, pluginExtension, name);
    }
    /**
     * Append a scene
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene or a File object (default: empty string)
     * @param scene is the instance of BABYLON.Scene to append to
     * @param onSuccess a callback with the scene when import succeeds
     * @param onProgress a callback with a progress event for each file being loaded
     * @param onError a callback with the scene, a message, and possibly an exception when import fails
     * @param pluginExtension the extension used to determine the plugin
     * @param name defines the name of the file, if the data is binary
     * @deprecated Please use the module level {@link AppendSceneAsync} instead
     */
    static Append(rootUrl, sceneFilename, scene, onSuccess, onProgress, onError, pluginExtension, name) {
        const reportScene = scene ?? EngineStore.LastCreatedScene;
        void (async () => {
            try {
                const appendedScene = await appendSceneCoreAsync(rootUrl, sceneFilename, scene, onProgress, pluginExtension, name);
                onSuccess?.(appendedScene);
            }
            catch (error) {
                reportLegacyLoadError(onError, reportScene, error);
            }
        })();
    }
    /**
     * Append a scene
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene or a File object (default: empty string)
     * @param scene is the instance of BABYLON.Scene to append to
     * @param onProgress a callback with a progress event for each file being loaded
     * @param pluginExtension the extension used to determine the plugin
     * @param name defines the name of the file, if the data is binary
     * @returns The given scene
     * @deprecated Please use the module level {@link AppendSceneAsync} instead
     */
    static async AppendAsync(rootUrl, sceneFilename, scene, onProgress, pluginExtension, name) {
        return await appendSceneCoreAsync(rootUrl, sceneFilename, scene, onProgress, pluginExtension, name);
    }
    /**
     * Load a scene into an asset container
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene or a File object (default: empty string)
     * @param scene is the instance of BABYLON.Scene to append to (default: last created scene)
     * @param onSuccess a callback with the scene when import succeeds
     * @param onProgress a callback with a progress event for each file being loaded
     * @param onError a callback with the scene, a message, and possibly an exception when import fails
     * @param pluginExtension the extension used to determine the plugin
     * @param name defines the filename, if the data is binary
     * @deprecated Please use the module level {@link LoadAssetContainerAsync} instead
     */
    static LoadAssetContainer(rootUrl, sceneFilename, scene, onSuccess, onProgress, onError, pluginExtension, name) {
        const reportScene = scene ?? EngineStore.LastCreatedScene;
        void (async () => {
            try {
                const assets = await loadAssetContainerCoreAsync(rootUrl, sceneFilename, scene, onProgress, pluginExtension, name);
                onSuccess?.(assets);
            }
            catch (error) {
                reportLegacyLoadError(onError, reportScene, error);
            }
        })();
    }
    /**
     * Load a scene into an asset container
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene (default: empty string)
     * @param scene is the instance of Scene to append to
     * @param onProgress a callback with a progress event for each file being loaded
     * @param pluginExtension the extension used to determine the plugin
     * @param name defines the filename, if the data is binary
     * @returns The loaded asset container
     * @deprecated Please use the module level {@link LoadAssetContainerAsync} instead
     */
    static async LoadAssetContainerAsync(rootUrl, sceneFilename, scene, onProgress, pluginExtension, name) {
        return await loadAssetContainerCoreAsync(rootUrl, sceneFilename, scene, onProgress, pluginExtension, name);
    }
    /**
     * Import animations from a file into a scene
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene or a File object (default: empty string)
     * @param scene is the instance of BABYLON.Scene to append to (default: last created scene)
     * @param overwriteAnimations when true, animations are cleaned before importing new ones. Animations are appended otherwise
     * @param animationGroupLoadingMode defines how to handle old animations groups before importing new ones
     * @param targetConverter defines a function used to convert animation targets from loaded scene to current scene (default: search node by name)
     * @param onSuccess a callback with the scene when import succeeds
     * @param onProgress a callback with a progress event for each file being loaded
     * @param onError a callback with the scene, a message, and possibly an exception when import fails
     * @param pluginExtension the extension used to determine the plugin
     * @param name defines the filename, if the data is binary
     * @deprecated Please use the module level {@link ImportAnimationsAsync} instead
     */
    static ImportAnimations(rootUrl, sceneFilename, scene, overwriteAnimations, animationGroupLoadingMode, targetConverter, onSuccess, onProgress, onError, pluginExtension, name) {
        const reportScene = scene ?? EngineStore.LastCreatedScene;
        void (async () => {
            try {
                await importAnimationsCoreAsync(rootUrl, sceneFilename, scene, overwriteAnimations, animationGroupLoadingMode, targetConverter, onProgress, pluginExtension, name);
                onSuccess?.(reportScene);
            }
            catch (error) {
                reportLegacyLoadError(onError, reportScene, error);
            }
        })();
    }
    /**
     * Import animations from a file into a scene
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene or a File object (default: empty string)
     * @param scene is the instance of BABYLON.Scene to append to (default: last created scene)
     * @param overwriteAnimations when true, animations are cleaned before importing new ones. Animations are appended otherwise
     * @param animationGroupLoadingMode defines how to handle old animations groups before importing new ones
     * @param targetConverter defines a function used to convert animation targets from loaded scene to current scene (default: search node by name)
     * @param onSuccess a callback with the scene when import succeeds
     * @param onProgress a callback with a progress event for each file being loaded
     * @param onError a callback with the scene, a message, and possibly an exception when import fails
     * @param pluginExtension the extension used to determine the plugin
     * @param name defines the filename, if the data is binary
     * @returns the updated scene with imported animations
     * @deprecated Please use the module level {@link ImportAnimationsAsync} instead
     */
    static async ImportAnimationsAsync(rootUrl, sceneFilename, scene, overwriteAnimations, animationGroupLoadingMode, targetConverter, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess, onProgress, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onError, pluginExtension, name) {
        const targetScene = scene ?? EngineStore.LastCreatedScene;
        await importAnimationsCoreAsync(rootUrl, sceneFilename, targetScene, overwriteAnimations, animationGroupLoadingMode, targetConverter, onProgress, pluginExtension, name);
        return targetScene;
    }
}
/**
 * No logging while loading
 */
SceneLoader.NO_LOGGING = 0;
/**
 * Minimal logging while loading
 */
SceneLoader.MINIMAL_LOGGING = 1;
/**
 * Summary logging while loading
 */
SceneLoader.SUMMARY_LOGGING = 2;
/**
 * Detailed logging while loading
 */
SceneLoader.DETAILED_LOGGING = 3;
// Members
/**
 * Event raised when a plugin is used to load a scene
 */
SceneLoader.OnPluginActivatedObservable = onPluginActivatedObservable;
//# sourceMappingURL=sceneLoader.js.map