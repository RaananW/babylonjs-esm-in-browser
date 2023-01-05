import { Observable } from "../Misc/observable.js";
import { InternalTexture, InternalTextureSource } from "../Materials/Textures/internalTexture.js";
import { IsDocumentAvailable, IsWindowObjectExist } from "../Misc/domManagement.js";
import { EngineStore } from "./engineStore.js";
import { _WarnImport } from "../Misc/devTools.js";
import { ThinEngine } from "./thinEngine.js";

import { PerformanceMonitor } from "../Misc/performanceMonitor.js";
import { PerfCounter } from "../Misc/perfCounter.js";
import { WebGLDataBuffer } from "../Meshes/WebGL/webGLDataBuffer.js";
import { Logger } from "../Misc/logger.js";
import { WebGLHardwareTexture } from "./WebGL/webGLHardwareTexture.js";
import "./Extensions/engine.alpha.js";
import "./Extensions/engine.readTexture.js";
import "./Extensions/engine.dynamicBuffer.js";
/**
 * The engine class is responsible for interfacing with all lower-level APIs such as WebGL and Audio
 */
export class Engine extends ThinEngine {
    /**
     * Creates a new engine
     * @param canvasOrContext defines the canvas or WebGL context to use for rendering. If you provide a WebGL context, Babylon.js will not hook events on the canvas (like pointers, keyboards, etc...) so no event observables will be available. This is mostly used when Babylon.js is used as a plugin on a system which already used the WebGL context
     * @param antialias defines enable antialiasing (default: false)
     * @param options defines further options to be sent to the getContext() function
     * @param adaptToDeviceRatio defines whether to adapt to the device's viewport characteristics (default: false)
     */
    constructor(canvasOrContext, antialias, options, adaptToDeviceRatio = false) {
        super(canvasOrContext, antialias, options, adaptToDeviceRatio);
        // Members
        /**
         * Gets or sets a boolean to enable/disable IndexedDB support and avoid XHR on .manifest
         **/
        this.enableOfflineSupport = false;
        /**
         * Gets or sets a boolean to enable/disable checking manifest if IndexedDB support is enabled (js will always consider the database is up to date)
         **/
        this.disableManifestCheck = false;
        /**
         * Gets or sets a boolean to enable/disable the context menu (right-click) from appearing on the main canvas
         */
        this.disableContextMenu = true;
        /**
         * Gets the list of created scenes
         */
        this.scenes = new Array();
        /** @internal */
        this._virtualScenes = new Array();
        /**
         * Event raised when a new scene is created
         */
        this.onNewSceneAddedObservable = new Observable();
        /**
         * Gets the list of created postprocesses
         */
        this.postProcesses = new Array();
        /**
         * Gets a boolean indicating if the pointer is currently locked
         */
        this.isPointerLock = false;
        // Observables
        /**
         * Observable event triggered each time the rendering canvas is resized
         */
        this.onResizeObservable = new Observable();
        /**
         * Observable event triggered each time the canvas loses focus
         */
        this.onCanvasBlurObservable = new Observable();
        /**
         * Observable event triggered each time the canvas gains focus
         */
        this.onCanvasFocusObservable = new Observable();
        /**
         * Observable event triggered each time the canvas receives pointerout event
         */
        this.onCanvasPointerOutObservable = new Observable();
        /**
         * Observable raised when the engine begins a new frame
         */
        this.onBeginFrameObservable = new Observable();
        /**
         * If set, will be used to request the next animation frame for the render loop
         */
        this.customAnimationFrameRequester = null;
        /**
         * Observable raised when the engine ends the current frame
         */
        this.onEndFrameObservable = new Observable();
        /**
         * Observable raised when the engine is about to compile a shader
         */
        this.onBeforeShaderCompilationObservable = new Observable();
        /**
         * Observable raised when the engine has just compiled a shader
         */
        this.onAfterShaderCompilationObservable = new Observable();
        // Deterministic lockstepMaxSteps
        this._deterministicLockstep = false;
        this._lockstepMaxSteps = 4;
        this._timeStep = 1 / 60;
        // FPS
        this._fps = 60;
        this._deltaTime = 0;
        /** @internal */
        this._drawCalls = new PerfCounter();
        /** Gets or sets the tab index to set to the rendering canvas. 1 is the minimum value to set to be able to capture keyboard events */
        this.canvasTabIndex = 1;
        /**
         * Turn this value on if you want to pause FPS computation when in background
         */
        this.disablePerformanceMonitorInBackground = false;
        this._performanceMonitor = new PerformanceMonitor();
        this._compatibilityMode = true;
        /**
         * Gets or sets the current render pass id
         */
        this.currentRenderPassId = 0;
        this._renderPassNames = ["main"];
        Engine.Instances.push(this);
        if (!canvasOrContext) {
            return;
        }
        this._features.supportRenderPasses = true;
        options = this._creationOptions;
        if (canvasOrContext.getContext) {
            const canvas = canvasOrContext;
            this._sharedInit(canvas, !!options.doNotHandleTouchAction, options.audioEngine);
            if (IsWindowObjectExist()) {
                // Fullscreen
                this._onFullscreenChange = () => {
                    this.isFullscreen = !!document.fullscreenElement;
                    // Pointer lock
                    if (this.isFullscreen && this._pointerLockRequested && canvas) {
                        Engine._RequestPointerlock(canvas);
                    }
                };
                document.addEventListener("fullscreenchange", this._onFullscreenChange, false);
                document.addEventListener("webkitfullscreenchange", this._onFullscreenChange, false);
                // Pointer lock
                this._onPointerLockChange = () => {
                    this.isPointerLock = document.pointerLockElement === canvas;
                };
                document.addEventListener("pointerlockchange", this._onPointerLockChange, false);
                document.addEventListener("webkitpointerlockchange", this._onPointerLockChange, false);
                // Create Audio Engine if needed.
                if (!Engine.audioEngine && options.audioEngine && Engine.AudioEngineFactory) {
                    Engine.audioEngine = Engine.AudioEngineFactory(this.getRenderingCanvas(), this.getAudioContext(), this.getAudioDestination());
                }
            }
            this._connectVREvents();
            this.enableOfflineSupport = Engine.OfflineProviderFactory !== undefined;
            this._deterministicLockstep = !!options.deterministicLockstep;
            this._lockstepMaxSteps = options.lockstepMaxSteps || 0;
            this._timeStep = options.timeStep || 1 / 60;
        }
        // Load WebVR Devices
        this._prepareVRComponent();
        if (options.autoEnableWebVR) {
            this.initWebVR();
        }
    }
    /**
     * Returns the current npm package of the sdk
     */
    // Not mixed with Version for tooling purpose.
    static get NpmPackage() {
        return ThinEngine.NpmPackage;
    }
    /**
     * Returns the current version of the framework
     */
    static get Version() {
        return ThinEngine.Version;
    }
    /** Gets the list of created engines */
    static get Instances() {
        return EngineStore.Instances;
    }
    /**
     * Gets the latest created engine
     */
    static get LastCreatedEngine() {
        return EngineStore.LastCreatedEngine;
    }
    /**
     * Gets the latest created scene
     */
    static get LastCreatedScene() {
        return EngineStore.LastCreatedScene;
    }
    /** @internal */
    /**
     * Engine abstraction for loading and creating an image bitmap from a given source string.
     * @param imageSource source to load the image from.
     * @param options An object that sets options for the image's extraction.
     * @returns ImageBitmap.
     */
    _createImageBitmapFromSource(imageSource, options) {
        const promise = new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
                image.decode().then(() => {
                    this.createImageBitmap(image, options).then((imageBitmap) => {
                        resolve(imageBitmap);
                    });
                });
            };
            image.onerror = () => {
                reject(`Error loading image ${image.src}`);
            };
            image.src = imageSource;
        });
        return promise;
    }
    /**
     * Engine abstraction for createImageBitmap
     * @param image source for image
     * @param options An object that sets options for the image's extraction.
     * @returns ImageBitmap
     */
    createImageBitmap(image, options) {
        return createImageBitmap(image, options);
    }
    /**
     * Resize an image and returns the image data as an uint8array
     * @param image image to resize
     * @param bufferWidth destination buffer width
     * @param bufferHeight destination buffer height
     * @returns an uint8array containing RGBA values of bufferWidth * bufferHeight size
     */
    resizeImageBitmap(image, bufferWidth, bufferHeight) {
        const canvas = this.createCanvas(bufferWidth, bufferHeight);
        const context = canvas.getContext("2d");
        if (!context) {
            throw new Error("Unable to get 2d context for resizeImageBitmap");
        }
        context.drawImage(image, 0, 0);
        // Create VertexData from map data
        // Cast is due to wrong definition in lib.d.ts from ts 1.3 - https://github.com/Microsoft/TypeScript/issues/949
        const buffer = context.getImageData(0, 0, bufferWidth, bufferHeight).data;
        return buffer;
    }
    /**
     * Will flag all materials in all scenes in all engines as dirty to trigger new shader compilation
     * @param flag defines which part of the materials must be marked as dirty
     * @param predicate defines a predicate used to filter which materials should be affected
     */
    static MarkAllMaterialsAsDirty(flag, predicate) {
        for (let engineIndex = 0; engineIndex < Engine.Instances.length; engineIndex++) {
            const engine = Engine.Instances[engineIndex];
            for (let sceneIndex = 0; sceneIndex < engine.scenes.length; sceneIndex++) {
                engine.scenes[sceneIndex].markAllMaterialsAsDirty(flag, predicate);
            }
        }
    }
    /**
     * Method called to create the default loading screen.
     * This can be overridden in your own app.
     * @param canvas The rendering canvas element
     * @returns The loading screen
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static DefaultLoadingScreenFactory(canvas) {
        throw _WarnImport("LoadingScreen");
    }
    get _supportsHardwareTextureRescaling() {
        return !!Engine._RescalePostProcessFactory;
    }
    /**
     * Gets the performance monitor attached to this engine
     * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene#engineinstrumentation
     */
    get performanceMonitor() {
        return this._performanceMonitor;
    }
    /**
     * (WebGPU only) True (default) to be in compatibility mode, meaning rendering all existing scenes without artifacts (same rendering than WebGL).
     * Setting the property to false will improve performances but may not work in some scenes if some precautions are not taken.
     * See https://doc.babylonjs.com/setup/support/webGPU/webGPUOptimization/webGPUNonCompatibilityMode for more details
     */
    get compatibilityMode() {
        return this._compatibilityMode;
    }
    set compatibilityMode(mode) {
        // not supported in WebGL
        this._compatibilityMode = true;
    }
    // Events
    /**
     * Gets the HTML element used to attach event listeners
     * @returns a HTML element
     */
    getInputElement() {
        return this._renderingCanvas;
    }
    _initGLContext() {
        super._initGLContext();
        this._rescalePostProcess = null;
    }
    /**
     * Shared initialization across engines types.
     * @param canvas The canvas associated with this instance of the engine.
     * @param doNotHandleTouchAction Defines that engine should ignore modifying touch action attribute and style
     * @param audioEngine Defines if an audio engine should be created by default
     */
    _sharedInit(canvas, doNotHandleTouchAction, audioEngine) {
        super._sharedInit(canvas, doNotHandleTouchAction, audioEngine);
        this._onCanvasFocus = () => {
            this.onCanvasFocusObservable.notifyObservers(this);
        };
        this._onCanvasBlur = () => {
            this.onCanvasBlurObservable.notifyObservers(this);
        };
        this._onCanvasContextMenu = (evt) => {
            if (this.disableContextMenu) {
                evt.preventDefault();
            }
        };
        canvas.addEventListener("focus", this._onCanvasFocus);
        canvas.addEventListener("blur", this._onCanvasBlur);
        canvas.addEventListener("contextmenu", this._onCanvasContextMenu);
        this._onBlur = () => {
            if (this.disablePerformanceMonitorInBackground) {
                this._performanceMonitor.disable();
            }
            this._windowIsBackground = true;
        };
        this._onFocus = () => {
            if (this.disablePerformanceMonitorInBackground) {
                this._performanceMonitor.enable();
            }
            this._windowIsBackground = false;
        };
        this._onCanvasPointerOut = (ev) => {
            // Check that the element at the point of the pointer out isn't the canvas and if it isn't, notify observers
            // Note: This is a workaround for a bug with Safari
            if (document.elementFromPoint(ev.clientX, ev.clientY) !== canvas) {
                this.onCanvasPointerOutObservable.notifyObservers(ev);
            }
        };
        if (IsWindowObjectExist()) {
            const hostWindow = this.getHostWindow();
            if (hostWindow) {
                hostWindow.addEventListener("blur", this._onBlur);
                hostWindow.addEventListener("focus", this._onFocus);
            }
        }
        canvas.addEventListener("pointerout", this._onCanvasPointerOut);
        if (!doNotHandleTouchAction) {
            this._disableTouchAction();
        }
        // Create Audio Engine if needed.
        if (!Engine.audioEngine && audioEngine && Engine.AudioEngineFactory) {
            Engine.audioEngine = Engine.AudioEngineFactory(this.getRenderingCanvas(), this.getAudioContext(), this.getAudioDestination());
        }
    }
    /**
     * Gets current aspect ratio
     * @param viewportOwner defines the camera to use to get the aspect ratio
     * @param useScreen defines if screen size must be used (or the current render target if any)
     * @returns a number defining the aspect ratio
     */
    getAspectRatio(viewportOwner, useScreen = false) {
        const viewport = viewportOwner.viewport;
        return (this.getRenderWidth(useScreen) * viewport.width) / (this.getRenderHeight(useScreen) * viewport.height);
    }
    /**
     * Gets current screen aspect ratio
     * @returns a number defining the aspect ratio
     */
    getScreenAspectRatio() {
        return this.getRenderWidth(true) / this.getRenderHeight(true);
    }
    /**
     * Gets the client rect of the HTML canvas attached with the current webGL context
     * @returns a client rectangle
     */
    getRenderingCanvasClientRect() {
        if (!this._renderingCanvas) {
            return null;
        }
        return this._renderingCanvas.getBoundingClientRect();
    }
    /**
     * Gets the client rect of the HTML element used for events
     * @returns a client rectangle
     */
    getInputElementClientRect() {
        if (!this._renderingCanvas) {
            return null;
        }
        return this.getInputElement().getBoundingClientRect();
    }
    /**
     * Gets a boolean indicating that the engine is running in deterministic lock step mode
     * @see https://doc.babylonjs.com/features/featuresDeepDive/animation/advanced_animations#deterministic-lockstep
     * @returns true if engine is in deterministic lock step mode
     */
    isDeterministicLockStep() {
        return this._deterministicLockstep;
    }
    /**
     * Gets the max steps when engine is running in deterministic lock step
     * @see https://doc.babylonjs.com/features/featuresDeepDive/animation/advanced_animations#deterministic-lockstep
     * @returns the max steps
     */
    getLockstepMaxSteps() {
        return this._lockstepMaxSteps;
    }
    /**
     * Returns the time in ms between steps when using deterministic lock step.
     * @returns time step in (ms)
     */
    getTimeStep() {
        return this._timeStep * 1000;
    }
    /**
     * Force the mipmap generation for the given render target texture
     * @param texture defines the render target texture to use
     * @param unbind defines whether or not to unbind the texture after generation. Defaults to true.
     */
    generateMipMapsForCubemap(texture, unbind = true) {
        if (texture.generateMipMaps) {
            const gl = this._gl;
            this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, texture, true);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            if (unbind) {
                this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, null);
            }
        }
    }
    /** States */
    /**
     * Gets a boolean indicating if depth writing is enabled
     * @returns the current depth writing state
     */
    getDepthWrite() {
        return this._depthCullingState.depthMask;
    }
    /**
     * Enable or disable depth writing
     * @param enable defines the state to set
     */
    setDepthWrite(enable) {
        this._depthCullingState.depthMask = enable;
    }
    /**
     * Gets a boolean indicating if stencil buffer is enabled
     * @returns the current stencil buffer state
     */
    getStencilBuffer() {
        return this._stencilState.stencilTest;
    }
    /**
     * Enable or disable the stencil buffer
     * @param enable defines if the stencil buffer must be enabled or disabled
     */
    setStencilBuffer(enable) {
        this._stencilState.stencilTest = enable;
    }
    /**
     * Gets the current stencil mask
     * @returns a number defining the new stencil mask to use
     */
    getStencilMask() {
        return this._stencilState.stencilMask;
    }
    /**
     * Sets the current stencil mask
     * @param mask defines the new stencil mask to use
     */
    setStencilMask(mask) {
        this._stencilState.stencilMask = mask;
    }
    /**
     * Gets the current stencil function
     * @returns a number defining the stencil function to use
     */
    getStencilFunction() {
        return this._stencilState.stencilFunc;
    }
    /**
     * Gets the current stencil reference value
     * @returns a number defining the stencil reference value to use
     */
    getStencilFunctionReference() {
        return this._stencilState.stencilFuncRef;
    }
    /**
     * Gets the current stencil mask
     * @returns a number defining the stencil mask to use
     */
    getStencilFunctionMask() {
        return this._stencilState.stencilFuncMask;
    }
    /**
     * Sets the current stencil function
     * @param stencilFunc defines the new stencil function to use
     */
    setStencilFunction(stencilFunc) {
        this._stencilState.stencilFunc = stencilFunc;
    }
    /**
     * Sets the current stencil reference
     * @param reference defines the new stencil reference to use
     */
    setStencilFunctionReference(reference) {
        this._stencilState.stencilFuncRef = reference;
    }
    /**
     * Sets the current stencil mask
     * @param mask defines the new stencil mask to use
     */
    setStencilFunctionMask(mask) {
        this._stencilState.stencilFuncMask = mask;
    }
    /**
     * Gets the current stencil operation when stencil fails
     * @returns a number defining stencil operation to use when stencil fails
     */
    getStencilOperationFail() {
        return this._stencilState.stencilOpStencilFail;
    }
    /**
     * Gets the current stencil operation when depth fails
     * @returns a number defining stencil operation to use when depth fails
     */
    getStencilOperationDepthFail() {
        return this._stencilState.stencilOpDepthFail;
    }
    /**
     * Gets the current stencil operation when stencil passes
     * @returns a number defining stencil operation to use when stencil passes
     */
    getStencilOperationPass() {
        return this._stencilState.stencilOpStencilDepthPass;
    }
    /**
     * Sets the stencil operation to use when stencil fails
     * @param operation defines the stencil operation to use when stencil fails
     */
    setStencilOperationFail(operation) {
        this._stencilState.stencilOpStencilFail = operation;
    }
    /**
     * Sets the stencil operation to use when depth fails
     * @param operation defines the stencil operation to use when depth fails
     */
    setStencilOperationDepthFail(operation) {
        this._stencilState.stencilOpDepthFail = operation;
    }
    /**
     * Sets the stencil operation to use when stencil passes
     * @param operation defines the stencil operation to use when stencil passes
     */
    setStencilOperationPass(operation) {
        this._stencilState.stencilOpStencilDepthPass = operation;
    }
    /**
     * Sets a boolean indicating if the dithering state is enabled or disabled
     * @param value defines the dithering state
     */
    setDitheringState(value) {
        if (value) {
            this._gl.enable(this._gl.DITHER);
        }
        else {
            this._gl.disable(this._gl.DITHER);
        }
    }
    /**
     * Sets a boolean indicating if the rasterizer state is enabled or disabled
     * @param value defines the rasterizer state
     */
    setRasterizerState(value) {
        if (value) {
            this._gl.disable(this._gl.RASTERIZER_DISCARD);
        }
        else {
            this._gl.enable(this._gl.RASTERIZER_DISCARD);
        }
    }
    /**
     * Gets the current depth function
     * @returns a number defining the depth function
     */
    getDepthFunction() {
        return this._depthCullingState.depthFunc;
    }
    /**
     * Sets the current depth function
     * @param depthFunc defines the function to use
     */
    setDepthFunction(depthFunc) {
        this._depthCullingState.depthFunc = depthFunc;
    }
    /**
     * Sets the current depth function to GREATER
     */
    setDepthFunctionToGreater() {
        this.setDepthFunction(516);
    }
    /**
     * Sets the current depth function to GEQUAL
     */
    setDepthFunctionToGreaterOrEqual() {
        this.setDepthFunction(518);
    }
    /**
     * Sets the current depth function to LESS
     */
    setDepthFunctionToLess() {
        this.setDepthFunction(513);
    }
    /**
     * Sets the current depth function to LEQUAL
     */
    setDepthFunctionToLessOrEqual() {
        this.setDepthFunction(515);
    }
    /**
     * Caches the the state of the stencil buffer
     */
    cacheStencilState() {
        this._cachedStencilBuffer = this.getStencilBuffer();
        this._cachedStencilFunction = this.getStencilFunction();
        this._cachedStencilMask = this.getStencilMask();
        this._cachedStencilOperationPass = this.getStencilOperationPass();
        this._cachedStencilOperationFail = this.getStencilOperationFail();
        this._cachedStencilOperationDepthFail = this.getStencilOperationDepthFail();
        this._cachedStencilReference = this.getStencilFunctionReference();
    }
    /**
     * Restores the state of the stencil buffer
     */
    restoreStencilState() {
        this.setStencilFunction(this._cachedStencilFunction);
        this.setStencilMask(this._cachedStencilMask);
        this.setStencilBuffer(this._cachedStencilBuffer);
        this.setStencilOperationPass(this._cachedStencilOperationPass);
        this.setStencilOperationFail(this._cachedStencilOperationFail);
        this.setStencilOperationDepthFail(this._cachedStencilOperationDepthFail);
        this.setStencilFunctionReference(this._cachedStencilReference);
    }
    /**
     * Directly set the WebGL Viewport
     * @param x defines the x coordinate of the viewport (in screen space)
     * @param y defines the y coordinate of the viewport (in screen space)
     * @param width defines the width of the viewport (in screen space)
     * @param height defines the height of the viewport (in screen space)
     * @returns the current viewport Object (if any) that is being replaced by this call. You can restore this viewport later on to go back to the original state
     */
    setDirectViewport(x, y, width, height) {
        const currentViewport = this._cachedViewport;
        this._cachedViewport = null;
        this._viewport(x, y, width, height);
        return currentViewport;
    }
    /**
     * Executes a scissor clear (ie. a clear on a specific portion of the screen)
     * @param x defines the x-coordinate of the bottom left corner of the clear rectangle
     * @param y defines the y-coordinate of the corner of the clear rectangle
     * @param width defines the width of the clear rectangle
     * @param height defines the height of the clear rectangle
     * @param clearColor defines the clear color
     */
    scissorClear(x, y, width, height, clearColor) {
        this.enableScissor(x, y, width, height);
        this.clear(clearColor, true, true, true);
        this.disableScissor();
    }
    /**
     * Enable scissor test on a specific rectangle (ie. render will only be executed on a specific portion of the screen)
     * @param x defines the x-coordinate of the bottom left corner of the clear rectangle
     * @param y defines the y-coordinate of the corner of the clear rectangle
     * @param width defines the width of the clear rectangle
     * @param height defines the height of the clear rectangle
     */
    enableScissor(x, y, width, height) {
        const gl = this._gl;
        // Change state
        gl.enable(gl.SCISSOR_TEST);
        gl.scissor(x, y, width, height);
    }
    /**
     * Disable previously set scissor test rectangle
     */
    disableScissor() {
        const gl = this._gl;
        gl.disable(gl.SCISSOR_TEST);
    }
    /**
     * @internal
     */
    _reportDrawCall(numDrawCalls = 1) {
        this._drawCalls.addCount(numDrawCalls, false);
    }
    /**
     * Initializes a webVR display and starts listening to display change events
     * The onVRDisplayChangedObservable will be notified upon these changes
     * @returns The onVRDisplayChangedObservable
     */
    initWebVR() {
        throw _WarnImport("WebVRCamera");
    }
    /** @internal */
    _prepareVRComponent() {
        // Do nothing as the engine side effect will overload it
    }
    /**
     * @internal
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _connectVREvents(canvas, document) {
        // Do nothing as the engine side effect will overload it
    }
    /** @internal */
    _submitVRFrame() {
        // Do nothing as the engine side effect will overload it
    }
    /**
     * Call this function to leave webVR mode
     * Will do nothing if webVR is not supported or if there is no webVR device
     * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/webVRCamera
     */
    disableVR() {
        // Do nothing as the engine side effect will overload it
    }
    /**
     * Gets a boolean indicating that the system is in VR mode and is presenting
     * @returns true if VR mode is engaged
     */
    isVRPresenting() {
        return false;
    }
    /** @internal */
    _requestVRFrame() {
        // Do nothing as the engine side effect will overload it
    }
    /**
     * @internal
     */
    _loadFileAsync(url, offlineProvider, useArrayBuffer) {
        return new Promise((resolve, reject) => {
            this._loadFile(url, (data) => {
                resolve(data);
            }, undefined, offlineProvider, useArrayBuffer, (request, exception) => {
                reject(exception);
            });
        });
    }
    /**
     * Gets the source code of the vertex shader associated with a specific webGL program
     * @param program defines the program to use
     * @returns a string containing the source code of the vertex shader associated with the program
     */
    getVertexShaderSource(program) {
        const shaders = this._gl.getAttachedShaders(program);
        if (!shaders) {
            return null;
        }
        return this._gl.getShaderSource(shaders[0]);
    }
    /**
     * Gets the source code of the fragment shader associated with a specific webGL program
     * @param program defines the program to use
     * @returns a string containing the source code of the fragment shader associated with the program
     */
    getFragmentShaderSource(program) {
        const shaders = this._gl.getAttachedShaders(program);
        if (!shaders) {
            return null;
        }
        return this._gl.getShaderSource(shaders[1]);
    }
    /**
     * Sets a depth stencil texture from a render target to the according uniform.
     * @param channel The texture channel
     * @param uniform The uniform to set
     * @param texture The render target texture containing the depth stencil texture to apply
     * @param name The texture name
     */
    setDepthStencilTexture(channel, uniform, texture, name) {
        if (channel === undefined) {
            return;
        }
        if (uniform) {
            this._boundUniforms[channel] = uniform;
        }
        if (!texture || !texture.depthStencilTexture) {
            this._setTexture(channel, null, undefined, undefined, name);
        }
        else {
            this._setTexture(channel, texture, false, true, name);
        }
    }
    /**
     * Sets a texture to the webGL context from a postprocess
     * @param channel defines the channel to use
     * @param postProcess defines the source postprocess
     * @param name name of the channel
     */
    setTextureFromPostProcess(channel, postProcess, name) {
        var _a;
        let postProcessInput = null;
        if (postProcess) {
            if (postProcess._textures.data[postProcess._currentRenderTextureInd]) {
                postProcessInput = postProcess._textures.data[postProcess._currentRenderTextureInd];
            }
            else if (postProcess._forcedOutputTexture) {
                postProcessInput = postProcess._forcedOutputTexture;
            }
        }
        this._bindTexture(channel, (_a = postProcessInput === null || postProcessInput === void 0 ? void 0 : postProcessInput.texture) !== null && _a !== void 0 ? _a : null, name);
    }
    /**
     * Binds the output of the passed in post process to the texture channel specified
     * @param channel The channel the texture should be bound to
     * @param postProcess The post process which's output should be bound
     * @param name name of the channel
     */
    setTextureFromPostProcessOutput(channel, postProcess, name) {
        var _a, _b;
        this._bindTexture(channel, (_b = (_a = postProcess === null || postProcess === void 0 ? void 0 : postProcess._outputTexture) === null || _a === void 0 ? void 0 : _a.texture) !== null && _b !== void 0 ? _b : null, name);
    }
    _rebuildBuffers() {
        // Index / Vertex
        for (const scene of this.scenes) {
            scene.resetCachedMaterial();
            scene._rebuildGeometries();
            scene._rebuildTextures();
        }
        for (const scene of this._virtualScenes) {
            scene.resetCachedMaterial();
            scene._rebuildGeometries();
            scene._rebuildTextures();
        }
        super._rebuildBuffers();
    }
    /** @internal */
    _renderFrame() {
        for (let index = 0; index < this._activeRenderLoops.length; index++) {
            const renderFunction = this._activeRenderLoops[index];
            renderFunction();
        }
    }
    _renderLoop() {
        if (!this._contextWasLost) {
            let shouldRender = true;
            if (!this.renderEvenInBackground && this._windowIsBackground) {
                shouldRender = false;
            }
            if (shouldRender) {
                // Start new frame
                this.beginFrame();
                // Child canvases
                if (!this._renderViews()) {
                    // Main frame
                    this._renderFrame();
                }
                // Present
                this.endFrame();
            }
        }
        if (this._activeRenderLoops.length > 0) {
            // Register new frame
            if (this.customAnimationFrameRequester) {
                this.customAnimationFrameRequester.requestID = this._queueNewFrame(this.customAnimationFrameRequester.renderFunction || this._boundRenderFunction, this.customAnimationFrameRequester);
                this._frameHandler = this.customAnimationFrameRequester.requestID;
            }
            else if (this.isVRPresenting()) {
                this._requestVRFrame();
            }
            else {
                this._frameHandler = this._queueNewFrame(this._boundRenderFunction, this.getHostWindow());
            }
        }
        else {
            this._renderingQueueLaunched = false;
        }
    }
    /** @internal */
    _renderViews() {
        return false;
    }
    /**
     * Toggle full screen mode
     * @param requestPointerLock defines if a pointer lock should be requested from the user
     */
    switchFullscreen(requestPointerLock) {
        if (this.isFullscreen) {
            this.exitFullscreen();
        }
        else {
            this.enterFullscreen(requestPointerLock);
        }
    }
    /**
     * Enters full screen mode
     * @param requestPointerLock defines if a pointer lock should be requested from the user
     */
    enterFullscreen(requestPointerLock) {
        if (!this.isFullscreen) {
            this._pointerLockRequested = requestPointerLock;
            if (this._renderingCanvas) {
                Engine._RequestFullscreen(this._renderingCanvas);
            }
        }
    }
    /**
     * Exits full screen mode
     */
    exitFullscreen() {
        if (this.isFullscreen) {
            Engine._ExitFullscreen();
        }
    }
    /**
     * Enters Pointerlock mode
     */
    enterPointerlock() {
        if (this._renderingCanvas) {
            Engine._RequestPointerlock(this._renderingCanvas);
        }
    }
    /**
     * Exits Pointerlock mode
     */
    exitPointerlock() {
        Engine._ExitPointerlock();
    }
    /**
     * Begin a new frame
     */
    beginFrame() {
        this._measureFps();
        this.onBeginFrameObservable.notifyObservers(this);
        super.beginFrame();
    }
    /**
     * End the current frame
     */
    endFrame() {
        super.endFrame();
        this._submitVRFrame();
        this.onEndFrameObservable.notifyObservers(this);
    }
    /**
     * Resize the view according to the canvas' size
     * @param forceSetSize true to force setting the sizes of the underlying canvas
     */
    resize(forceSetSize = false) {
        // We're not resizing the size of the canvas while in VR mode & presenting
        if (this.isVRPresenting()) {
            return;
        }
        super.resize(forceSetSize);
    }
    /**
     * Force a specific size of the canvas
     * @param width defines the new canvas' width
     * @param height defines the new canvas' height
     * @param forceSetSize true to force setting the sizes of the underlying canvas
     * @returns true if the size was changed
     */
    setSize(width, height, forceSetSize = false) {
        if (!this._renderingCanvas) {
            return false;
        }
        if (!super.setSize(width, height, forceSetSize)) {
            return false;
        }
        if (this.scenes) {
            for (let index = 0; index < this.scenes.length; index++) {
                const scene = this.scenes[index];
                for (let camIndex = 0; camIndex < scene.cameras.length; camIndex++) {
                    const cam = scene.cameras[camIndex];
                    cam._currentRenderId = 0;
                }
            }
            if (this.onResizeObservable.hasObservers()) {
                this.onResizeObservable.notifyObservers(this);
            }
        }
        return true;
    }
    _deletePipelineContext(pipelineContext) {
        const webGLPipelineContext = pipelineContext;
        if (webGLPipelineContext && webGLPipelineContext.program) {
            if (webGLPipelineContext.transformFeedback) {
                this.deleteTransformFeedback(webGLPipelineContext.transformFeedback);
                webGLPipelineContext.transformFeedback = null;
            }
        }
        super._deletePipelineContext(pipelineContext);
    }
    createShaderProgram(pipelineContext, vertexCode, fragmentCode, defines, context, transformFeedbackVaryings = null) {
        context = context || this._gl;
        this.onBeforeShaderCompilationObservable.notifyObservers(this);
        const program = super.createShaderProgram(pipelineContext, vertexCode, fragmentCode, defines, context, transformFeedbackVaryings);
        this.onAfterShaderCompilationObservable.notifyObservers(this);
        return program;
    }
    _createShaderProgram(pipelineContext, vertexShader, fragmentShader, context, transformFeedbackVaryings = null) {
        const shaderProgram = context.createProgram();
        pipelineContext.program = shaderProgram;
        if (!shaderProgram) {
            throw new Error("Unable to create program");
        }
        context.attachShader(shaderProgram, vertexShader);
        context.attachShader(shaderProgram, fragmentShader);
        if (this.webGLVersion > 1 && transformFeedbackVaryings) {
            const transformFeedback = this.createTransformFeedback();
            this.bindTransformFeedback(transformFeedback);
            this.setTranformFeedbackVaryings(shaderProgram, transformFeedbackVaryings);
            pipelineContext.transformFeedback = transformFeedback;
        }
        context.linkProgram(shaderProgram);
        if (this.webGLVersion > 1 && transformFeedbackVaryings) {
            this.bindTransformFeedback(null);
        }
        pipelineContext.context = context;
        pipelineContext.vertexShader = vertexShader;
        pipelineContext.fragmentShader = fragmentShader;
        if (!pipelineContext.isParallelCompiled) {
            this._finalizePipelineContext(pipelineContext);
        }
        return shaderProgram;
    }
    /**
     * @internal
     */
    _releaseTexture(texture) {
        super._releaseTexture(texture);
    }
    /**
     * @internal
     */
    _releaseRenderTargetWrapper(rtWrapper) {
        super._releaseRenderTargetWrapper(rtWrapper);
        // Set output texture of post process to null if the framebuffer has been released/disposed
        this.scenes.forEach((scene) => {
            scene.postProcesses.forEach((postProcess) => {
                if (postProcess._outputTexture === rtWrapper) {
                    postProcess._outputTexture = null;
                }
            });
            scene.cameras.forEach((camera) => {
                camera._postProcesses.forEach((postProcess) => {
                    if (postProcess) {
                        if (postProcess._outputTexture === rtWrapper) {
                            postProcess._outputTexture = null;
                        }
                    }
                });
            });
        });
    }
    /**
     * Gets the names of the render passes that are currently created
     * @returns list of the render pass names
     */
    getRenderPassNames() {
        return this._renderPassNames;
    }
    /**
     * Gets the name of the current render pass
     * @returns name of the current render pass
     */
    getCurrentRenderPassName() {
        return this._renderPassNames[this.currentRenderPassId];
    }
    /**
     * Creates a render pass id
     * @param name Name of the render pass (for debug purpose only)
     * @returns the id of the new render pass
     */
    createRenderPassId(name) {
        // Note: render pass id == 0 is always for the main render pass
        const id = ++Engine._RenderPassIdCounter;
        this._renderPassNames[id] = name !== null && name !== void 0 ? name : "NONAME";
        return id;
    }
    /**
     * Releases a render pass id
     * @param id id of the render pass to release
     */
    releaseRenderPassId(id) {
        this._renderPassNames[id] = undefined;
        for (let s = 0; s < this.scenes.length; ++s) {
            const scene = this.scenes[s];
            for (let m = 0; m < scene.meshes.length; ++m) {
                const mesh = scene.meshes[m];
                if (mesh.subMeshes) {
                    for (let b = 0; b < mesh.subMeshes.length; ++b) {
                        const subMesh = mesh.subMeshes[b];
                        subMesh._removeDrawWrapper(id);
                    }
                }
            }
        }
    }
    /**
     * @internal
     * Rescales a texture
     * @param source input texture
     * @param destination destination texture
     * @param scene scene to use to render the resize
     * @param internalFormat format to use when resizing
     * @param onComplete callback to be called when resize has completed
     */
    _rescaleTexture(source, destination, scene, internalFormat, onComplete) {
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.LINEAR);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
        const rtt = this.createRenderTargetTexture({
            width: destination.width,
            height: destination.height,
        }, {
            generateMipMaps: false,
            type: 0,
            samplingMode: 2,
            generateDepthBuffer: false,
            generateStencilBuffer: false,
        });
        if (!this._rescalePostProcess && Engine._RescalePostProcessFactory) {
            this._rescalePostProcess = Engine._RescalePostProcessFactory(this);
        }
        if (this._rescalePostProcess) {
            this._rescalePostProcess.externalTextureSamplerBinding = true;
            this._rescalePostProcess.getEffect().executeWhenCompiled(() => {
                this._rescalePostProcess.onApply = function (effect) {
                    effect._bindTexture("textureSampler", source);
                };
                let hostingScene = scene;
                if (!hostingScene) {
                    hostingScene = this.scenes[this.scenes.length - 1];
                }
                hostingScene.postProcessManager.directRender([this._rescalePostProcess], rtt, true);
                this._bindTextureDirectly(this._gl.TEXTURE_2D, destination, true);
                this._gl.copyTexImage2D(this._gl.TEXTURE_2D, 0, internalFormat, 0, 0, destination.width, destination.height, 0);
                this.unBindFramebuffer(rtt);
                rtt.dispose();
                if (onComplete) {
                    onComplete();
                }
            });
        }
    }
    // FPS
    /**
     * Gets the current framerate
     * @returns a number representing the framerate
     */
    getFps() {
        return this._fps;
    }
    /**
     * Gets the time spent between current and previous frame
     * @returns a number representing the delta time in ms
     */
    getDeltaTime() {
        return this._deltaTime;
    }
    _measureFps() {
        this._performanceMonitor.sampleFrame();
        this._fps = this._performanceMonitor.averageFPS;
        this._deltaTime = this._performanceMonitor.instantaneousFrameTime || 0;
    }
    /**
     * Wraps an external web gl texture in a Babylon texture.
     * @param texture defines the external texture
     * @returns the babylon internal texture
     */
    wrapWebGLTexture(texture) {
        const hardwareTexture = new WebGLHardwareTexture(texture, this._gl);
        const internalTexture = new InternalTexture(this, InternalTextureSource.Unknown, true);
        internalTexture._hardwareTexture = hardwareTexture;
        internalTexture.isReady = true;
        return internalTexture;
    }
    /**
     * @internal
     */
    _uploadImageToTexture(texture, image, faceIndex = 0, lod = 0) {
        const gl = this._gl;
        const textureType = this._getWebGLTextureType(texture.type);
        const format = this._getInternalFormat(texture.format);
        const internalFormat = this._getRGBABufferInternalSizedFormat(texture.type, format);
        const bindTarget = texture.isCube ? gl.TEXTURE_CUBE_MAP : gl.TEXTURE_2D;
        this._bindTextureDirectly(bindTarget, texture, true);
        this._unpackFlipY(texture.invertY);
        let target = gl.TEXTURE_2D;
        if (texture.isCube) {
            target = gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex;
        }
        gl.texImage2D(target, lod, internalFormat, format, textureType, image);
        this._bindTextureDirectly(bindTarget, null, true);
    }
    /**
     * Updates a depth texture Comparison Mode and Function.
     * If the comparison Function is equal to 0, the mode will be set to none.
     * Otherwise, this only works in webgl 2 and requires a shadow sampler in the shader.
     * @param texture The texture to set the comparison function for
     * @param comparisonFunction The comparison function to set, 0 if no comparison required
     */
    updateTextureComparisonFunction(texture, comparisonFunction) {
        if (this.webGLVersion === 1) {
            Logger.Error("WebGL 1 does not support texture comparison.");
            return;
        }
        const gl = this._gl;
        if (texture.isCube) {
            this._bindTextureDirectly(this._gl.TEXTURE_CUBE_MAP, texture, true);
            if (comparisonFunction === 0) {
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_COMPARE_FUNC, 515);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_COMPARE_MODE, gl.NONE);
            }
            else {
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_COMPARE_FUNC, comparisonFunction);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
            }
            this._bindTextureDirectly(this._gl.TEXTURE_CUBE_MAP, null);
        }
        else {
            this._bindTextureDirectly(this._gl.TEXTURE_2D, texture, true);
            if (comparisonFunction === 0) {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, 515);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.NONE);
            }
            else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, comparisonFunction);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
            }
            this._bindTextureDirectly(this._gl.TEXTURE_2D, null);
        }
        texture._comparisonFunction = comparisonFunction;
    }
    /**
     * Creates a webGL buffer to use with instantiation
     * @param capacity defines the size of the buffer
     * @returns the webGL buffer
     */
    createInstancesBuffer(capacity) {
        const buffer = this._gl.createBuffer();
        if (!buffer) {
            throw new Error("Unable to create instance buffer");
        }
        const result = new WebGLDataBuffer(buffer);
        result.capacity = capacity;
        this.bindArrayBuffer(result);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, capacity, this._gl.DYNAMIC_DRAW);
        result.references = 1;
        return result;
    }
    /**
     * Delete a webGL buffer used with instantiation
     * @param buffer defines the webGL buffer to delete
     */
    deleteInstancesBuffer(buffer) {
        this._gl.deleteBuffer(buffer);
    }
    _clientWaitAsync(sync, flags = 0, intervalms = 10) {
        const gl = this._gl;
        return new Promise((resolve, reject) => {
            const check = () => {
                const res = gl.clientWaitSync(sync, flags, 0);
                if (res == gl.WAIT_FAILED) {
                    reject();
                    return;
                }
                if (res == gl.TIMEOUT_EXPIRED) {
                    setTimeout(check, intervalms);
                    return;
                }
                resolve();
            };
            check();
        });
    }
    /**
     * @internal
     */
    _readPixelsAsync(x, y, w, h, format, type, outputBuffer) {
        if (this._webGLVersion < 2) {
            throw new Error("_readPixelsAsync only work on WebGL2+");
        }
        const gl = this._gl;
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.PIXEL_PACK_BUFFER, buf);
        gl.bufferData(gl.PIXEL_PACK_BUFFER, outputBuffer.byteLength, gl.STREAM_READ);
        gl.readPixels(x, y, w, h, format, type, 0);
        gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        if (!sync) {
            return null;
        }
        gl.flush();
        return this._clientWaitAsync(sync, 0, 10).then(() => {
            gl.deleteSync(sync);
            gl.bindBuffer(gl.PIXEL_PACK_BUFFER, buf);
            gl.getBufferSubData(gl.PIXEL_PACK_BUFFER, 0, outputBuffer);
            gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
            gl.deleteBuffer(buf);
            return outputBuffer;
        });
    }
    dispose() {
        this.hideLoadingUI();
        this.onNewSceneAddedObservable.clear();
        // Release postProcesses
        while (this.postProcesses.length) {
            this.postProcesses[0].dispose();
        }
        // Rescale PP
        if (this._rescalePostProcess) {
            this._rescalePostProcess.dispose();
        }
        // Release scenes
        while (this.scenes.length) {
            this.scenes[0].dispose();
        }
        while (this._virtualScenes.length) {
            this._virtualScenes[0].dispose();
        }
        // Release audio engine
        if (Engine.Instances.length === 1 && Engine.audioEngine) {
            Engine.audioEngine.dispose();
            Engine.audioEngine = null;
        }
        //WebVR
        this.disableVR();
        // Events
        if (IsWindowObjectExist()) {
            window.removeEventListener("blur", this._onBlur);
            window.removeEventListener("focus", this._onFocus);
            if (this._renderingCanvas) {
                this._renderingCanvas.removeEventListener("focus", this._onCanvasFocus);
                this._renderingCanvas.removeEventListener("blur", this._onCanvasBlur);
                this._renderingCanvas.removeEventListener("pointerout", this._onCanvasPointerOut);
                this._renderingCanvas.removeEventListener("contextmenu", this._onCanvasContextMenu);
            }
            if (IsDocumentAvailable()) {
                document.removeEventListener("fullscreenchange", this._onFullscreenChange);
                document.removeEventListener("mozfullscreenchange", this._onFullscreenChange);
                document.removeEventListener("webkitfullscreenchange", this._onFullscreenChange);
                document.removeEventListener("msfullscreenchange", this._onFullscreenChange);
                document.removeEventListener("pointerlockchange", this._onPointerLockChange);
                document.removeEventListener("mspointerlockchange", this._onPointerLockChange);
                document.removeEventListener("mozpointerlockchange", this._onPointerLockChange);
                document.removeEventListener("webkitpointerlockchange", this._onPointerLockChange);
            }
        }
        super.dispose();
        // Remove from Instances
        const index = Engine.Instances.indexOf(this);
        if (index >= 0) {
            Engine.Instances.splice(index, 1);
        }
        // Observables
        this.onResizeObservable.clear();
        this.onCanvasBlurObservable.clear();
        this.onCanvasFocusObservable.clear();
        this.onCanvasPointerOutObservable.clear();
        this.onBeginFrameObservable.clear();
        this.onEndFrameObservable.clear();
    }
    _disableTouchAction() {
        if (!this._renderingCanvas || !this._renderingCanvas.setAttribute) {
            return;
        }
        this._renderingCanvas.setAttribute("touch-action", "none");
        this._renderingCanvas.style.touchAction = "none";
        this._renderingCanvas.style.webkitTapHighlightColor = "transparent";
    }
    // Loading screen
    /**
     * Display the loading screen
     * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/customLoadingScreen
     */
    displayLoadingUI() {
        if (!IsWindowObjectExist()) {
            return;
        }
        const loadingScreen = this.loadingScreen;
        if (loadingScreen) {
            loadingScreen.displayLoadingUI();
        }
    }
    /**
     * Hide the loading screen
     * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/customLoadingScreen
     */
    hideLoadingUI() {
        if (!IsWindowObjectExist()) {
            return;
        }
        const loadingScreen = this._loadingScreen;
        if (loadingScreen) {
            loadingScreen.hideLoadingUI();
        }
    }
    /**
     * Gets the current loading screen object
     * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/customLoadingScreen
     */
    get loadingScreen() {
        if (!this._loadingScreen && this._renderingCanvas) {
            this._loadingScreen = Engine.DefaultLoadingScreenFactory(this._renderingCanvas);
        }
        return this._loadingScreen;
    }
    /**
     * Sets the current loading screen object
     * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/customLoadingScreen
     */
    set loadingScreen(loadingScreen) {
        this._loadingScreen = loadingScreen;
    }
    /**
     * Sets the current loading screen text
     * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/customLoadingScreen
     */
    set loadingUIText(text) {
        this.loadingScreen.loadingUIText = text;
    }
    /**
     * Sets the current loading screen background color
     * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/customLoadingScreen
     */
    set loadingUIBackgroundColor(color) {
        this.loadingScreen.loadingUIBackgroundColor = color;
    }
    /**
     * creates and returns a new video element
     * @param constraints video constraints
     * @returns video element
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createVideoElement(constraints) {
        return document.createElement("video");
    }
    /** Pointerlock and fullscreen */
    /**
     * Ask the browser to promote the current element to pointerlock mode
     * @param element defines the DOM element to promote
     */
    static _RequestPointerlock(element) {
        if (element.requestPointerLock) {
            element.requestPointerLock();
            element.focus();
        }
    }
    /**
     * Asks the browser to exit pointerlock mode
     */
    static _ExitPointerlock() {
        if (document.exitPointerLock) {
            document.exitPointerLock();
        }
    }
    /**
     * Ask the browser to promote the current element to fullscreen rendering mode
     * @param element defines the DOM element to promote
     */
    static _RequestFullscreen(element) {
        const requestFunction = element.requestFullscreen || element.webkitRequestFullscreen;
        if (!requestFunction) {
            return;
        }
        requestFunction.call(element);
    }
    /**
     * Asks the browser to exit fullscreen mode
     */
    static _ExitFullscreen() {
        const anyDoc = document;
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (anyDoc.webkitCancelFullScreen) {
            anyDoc.webkitCancelFullScreen();
        }
    }
    /**
     * Get Font size information
     * @param font font name
     * @returns an object containing ascent, height and descent
     */
    getFontOffset(font) {
        const text = document.createElement("span");
        text.innerHTML = "Hg";
        text.setAttribute("style", `font: ${font} !important`);
        const block = document.createElement("div");
        block.style.display = "inline-block";
        block.style.width = "1px";
        block.style.height = "0px";
        block.style.verticalAlign = "bottom";
        const div = document.createElement("div");
        div.style.whiteSpace = "nowrap";
        div.appendChild(text);
        div.appendChild(block);
        document.body.appendChild(div);
        let fontAscent = 0;
        let fontHeight = 0;
        try {
            fontHeight = block.getBoundingClientRect().top - text.getBoundingClientRect().top;
            block.style.verticalAlign = "baseline";
            fontAscent = block.getBoundingClientRect().top - text.getBoundingClientRect().top;
        }
        finally {
            document.body.removeChild(div);
        }
        return { ascent: fontAscent, height: fontHeight, descent: fontHeight - fontAscent };
    }
}
// Const statics
/** Defines that alpha blending is disabled */
Engine.ALPHA_DISABLE = 0;
/** Defines that alpha blending to SRC ALPHA * SRC + DEST */
Engine.ALPHA_ADD = 1;
/** Defines that alpha blending to SRC ALPHA * SRC + (1 - SRC ALPHA) * DEST */
Engine.ALPHA_COMBINE = 2;
/** Defines that alpha blending to DEST - SRC * DEST */
Engine.ALPHA_SUBTRACT = 3;
/** Defines that alpha blending to SRC * DEST */
Engine.ALPHA_MULTIPLY = 4;
/** Defines that alpha blending to SRC ALPHA * SRC + (1 - SRC) * DEST */
Engine.ALPHA_MAXIMIZED = 5;
/** Defines that alpha blending to SRC + DEST */
Engine.ALPHA_ONEONE = 6;
/** Defines that alpha blending to SRC + (1 - SRC ALPHA) * DEST */
Engine.ALPHA_PREMULTIPLIED = 7;
/**
 * Defines that alpha blending to SRC + (1 - SRC ALPHA) * DEST
 * Alpha will be set to (1 - SRC ALPHA) * DEST ALPHA
 */
Engine.ALPHA_PREMULTIPLIED_PORTERDUFF = 8;
/** Defines that alpha blending to CST * SRC + (1 - CST) * DEST */
Engine.ALPHA_INTERPOLATE = 9;
/**
 * Defines that alpha blending to SRC + (1 - SRC) * DEST
 * Alpha will be set to SRC ALPHA + (1 - SRC ALPHA) * DEST ALPHA
 */
Engine.ALPHA_SCREENMODE = 10;
/** Defines that the resource is not delayed*/
Engine.DELAYLOADSTATE_NONE = 0;
/** Defines that the resource was successfully delay loaded */
Engine.DELAYLOADSTATE_LOADED = 1;
/** Defines that the resource is currently delay loading */
Engine.DELAYLOADSTATE_LOADING = 2;
/** Defines that the resource is delayed and has not started loading */
Engine.DELAYLOADSTATE_NOTLOADED = 4;
// Depht or Stencil test Constants.
/** Passed to depthFunction or stencilFunction to specify depth or stencil tests will never pass. i.e. Nothing will be drawn */
Engine.NEVER = 512;
/** Passed to depthFunction or stencilFunction to specify depth or stencil tests will always pass. i.e. Pixels will be drawn in the order they are drawn */
Engine.ALWAYS = 519;
/** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than the stored value */
Engine.LESS = 513;
/** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is equals to the stored value */
Engine.EQUAL = 514;
/** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than or equal to the stored value */
Engine.LEQUAL = 515;
/** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than the stored value */
Engine.GREATER = 516;
/** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than or equal to the stored value */
Engine.GEQUAL = 518;
/** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is not equal to the stored value */
Engine.NOTEQUAL = 517;
// Stencil Actions Constants.
/** Passed to stencilOperation to specify that stencil value must be kept */
Engine.KEEP = 7680;
/** Passed to stencilOperation to specify that stencil value must be replaced */
Engine.REPLACE = 7681;
/** Passed to stencilOperation to specify that stencil value must be incremented */
Engine.INCR = 7682;
/** Passed to stencilOperation to specify that stencil value must be decremented */
Engine.DECR = 7683;
/** Passed to stencilOperation to specify that stencil value must be inverted */
Engine.INVERT = 5386;
/** Passed to stencilOperation to specify that stencil value must be incremented with wrapping */
Engine.INCR_WRAP = 34055;
/** Passed to stencilOperation to specify that stencil value must be decremented with wrapping */
Engine.DECR_WRAP = 34056;
/** Texture is not repeating outside of 0..1 UVs */
Engine.TEXTURE_CLAMP_ADDRESSMODE = 0;
/** Texture is repeating outside of 0..1 UVs */
Engine.TEXTURE_WRAP_ADDRESSMODE = 1;
/** Texture is repeating and mirrored */
Engine.TEXTURE_MIRROR_ADDRESSMODE = 2;
/** ALPHA */
Engine.TEXTUREFORMAT_ALPHA = 0;
/** LUMINANCE */
Engine.TEXTUREFORMAT_LUMINANCE = 1;
/** LUMINANCE_ALPHA */
Engine.TEXTUREFORMAT_LUMINANCE_ALPHA = 2;
/** RGB */
Engine.TEXTUREFORMAT_RGB = 4;
/** RGBA */
Engine.TEXTUREFORMAT_RGBA = 5;
/** RED */
Engine.TEXTUREFORMAT_RED = 6;
/** RED (2nd reference) */
Engine.TEXTUREFORMAT_R = 6;
/** RG */
Engine.TEXTUREFORMAT_RG = 7;
/** RED_INTEGER */
Engine.TEXTUREFORMAT_RED_INTEGER = 8;
/** RED_INTEGER (2nd reference) */
Engine.TEXTUREFORMAT_R_INTEGER = 8;
/** RG_INTEGER */
Engine.TEXTUREFORMAT_RG_INTEGER = 9;
/** RGB_INTEGER */
Engine.TEXTUREFORMAT_RGB_INTEGER = 10;
/** RGBA_INTEGER */
Engine.TEXTUREFORMAT_RGBA_INTEGER = 11;
/** UNSIGNED_BYTE */
Engine.TEXTURETYPE_UNSIGNED_BYTE = 0;
/** UNSIGNED_BYTE (2nd reference) */
Engine.TEXTURETYPE_UNSIGNED_INT = 0;
/** FLOAT */
Engine.TEXTURETYPE_FLOAT = 1;
/** HALF_FLOAT */
Engine.TEXTURETYPE_HALF_FLOAT = 2;
/** BYTE */
Engine.TEXTURETYPE_BYTE = 3;
/** SHORT */
Engine.TEXTURETYPE_SHORT = 4;
/** UNSIGNED_SHORT */
Engine.TEXTURETYPE_UNSIGNED_SHORT = 5;
/** INT */
Engine.TEXTURETYPE_INT = 6;
/** UNSIGNED_INT */
Engine.TEXTURETYPE_UNSIGNED_INTEGER = 7;
/** UNSIGNED_SHORT_4_4_4_4 */
Engine.TEXTURETYPE_UNSIGNED_SHORT_4_4_4_4 = 8;
/** UNSIGNED_SHORT_5_5_5_1 */
Engine.TEXTURETYPE_UNSIGNED_SHORT_5_5_5_1 = 9;
/** UNSIGNED_SHORT_5_6_5 */
Engine.TEXTURETYPE_UNSIGNED_SHORT_5_6_5 = 10;
/** UNSIGNED_INT_2_10_10_10_REV */
Engine.TEXTURETYPE_UNSIGNED_INT_2_10_10_10_REV = 11;
/** UNSIGNED_INT_24_8 */
Engine.TEXTURETYPE_UNSIGNED_INT_24_8 = 12;
/** UNSIGNED_INT_10F_11F_11F_REV */
Engine.TEXTURETYPE_UNSIGNED_INT_10F_11F_11F_REV = 13;
/** UNSIGNED_INT_5_9_9_9_REV */
Engine.TEXTURETYPE_UNSIGNED_INT_5_9_9_9_REV = 14;
/** FLOAT_32_UNSIGNED_INT_24_8_REV */
Engine.TEXTURETYPE_FLOAT_32_UNSIGNED_INT_24_8_REV = 15;
/** nearest is mag = nearest and min = nearest and mip = none */
Engine.TEXTURE_NEAREST_SAMPLINGMODE = 1;
/** Bilinear is mag = linear and min = linear and mip = nearest */
Engine.TEXTURE_BILINEAR_SAMPLINGMODE = 2;
/** Trilinear is mag = linear and min = linear and mip = linear */
Engine.TEXTURE_TRILINEAR_SAMPLINGMODE = 3;
/** nearest is mag = nearest and min = nearest and mip = linear */
Engine.TEXTURE_NEAREST_NEAREST_MIPLINEAR = 8;
/** Bilinear is mag = linear and min = linear and mip = nearest */
Engine.TEXTURE_LINEAR_LINEAR_MIPNEAREST = 11;
/** Trilinear is mag = linear and min = linear and mip = linear */
Engine.TEXTURE_LINEAR_LINEAR_MIPLINEAR = 3;
/** mag = nearest and min = nearest and mip = nearest */
Engine.TEXTURE_NEAREST_NEAREST_MIPNEAREST = 4;
/** mag = nearest and min = linear and mip = nearest */
Engine.TEXTURE_NEAREST_LINEAR_MIPNEAREST = 5;
/** mag = nearest and min = linear and mip = linear */
Engine.TEXTURE_NEAREST_LINEAR_MIPLINEAR = 6;
/** mag = nearest and min = linear and mip = none */
Engine.TEXTURE_NEAREST_LINEAR = 7;
/** mag = nearest and min = nearest and mip = none */
Engine.TEXTURE_NEAREST_NEAREST = 1;
/** mag = linear and min = nearest and mip = nearest */
Engine.TEXTURE_LINEAR_NEAREST_MIPNEAREST = 9;
/** mag = linear and min = nearest and mip = linear */
Engine.TEXTURE_LINEAR_NEAREST_MIPLINEAR = 10;
/** mag = linear and min = linear and mip = none */
Engine.TEXTURE_LINEAR_LINEAR = 2;
/** mag = linear and min = nearest and mip = none */
Engine.TEXTURE_LINEAR_NEAREST = 12;
/** Explicit coordinates mode */
Engine.TEXTURE_EXPLICIT_MODE = 0;
/** Spherical coordinates mode */
Engine.TEXTURE_SPHERICAL_MODE = 1;
/** Planar coordinates mode */
Engine.TEXTURE_PLANAR_MODE = 2;
/** Cubic coordinates mode */
Engine.TEXTURE_CUBIC_MODE = 3;
/** Projection coordinates mode */
Engine.TEXTURE_PROJECTION_MODE = 4;
/** Skybox coordinates mode */
Engine.TEXTURE_SKYBOX_MODE = 5;
/** Inverse Cubic coordinates mode */
Engine.TEXTURE_INVCUBIC_MODE = 6;
/** Equirectangular coordinates mode */
Engine.TEXTURE_EQUIRECTANGULAR_MODE = 7;
/** Equirectangular Fixed coordinates mode */
Engine.TEXTURE_FIXED_EQUIRECTANGULAR_MODE = 8;
/** Equirectangular Fixed Mirrored coordinates mode */
Engine.TEXTURE_FIXED_EQUIRECTANGULAR_MIRRORED_MODE = 9;
// Texture rescaling mode
/** Defines that texture rescaling will use a floor to find the closer power of 2 size */
Engine.SCALEMODE_FLOOR = 1;
/** Defines that texture rescaling will look for the nearest power of 2 size */
Engine.SCALEMODE_NEAREST = 2;
/** Defines that texture rescaling will use a ceil to find the closer power of 2 size */
Engine.SCALEMODE_CEILING = 3;
/**
 * Method called to create the default rescale post process on each engine.
 */
Engine._RescalePostProcessFactory = null;
// eslint-disable-next-line @typescript-eslint/naming-convention
Engine._RenderPassIdCounter = 0;
//# sourceMappingURL=engine.js.map