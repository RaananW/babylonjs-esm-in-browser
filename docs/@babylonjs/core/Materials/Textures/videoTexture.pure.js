/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { Observable } from "../../Misc/observable.pure.js";
import { Tools } from "../../Misc/tools.pure.js";
import { IsExponentOfTwo } from "../../Misc/tools.functions.js";
import { Logger } from "../../Misc/logger.js";
import { Texture } from "../../Materials/Textures/texture.pure.js";

import { serialize } from "../../Misc/decorators.js";
import { RegisterClass } from "../../Misc/typeStore.js";
function RemoveSource(video) {
    // Remove any <source> elements, etc.
    while (video.firstChild) {
        video.removeChild(video.firstChild);
    }
    // detach srcObject
    video.srcObject = null;
    // Set a blank src (https://html.spec.whatwg.org/multipage/media.html#best-practices-for-authors-using-media-elements)
    video.src = "";
    // Prevent non-important errors maybe (https://twitter.com/beraliv/status/1205214277956775936)
    video.removeAttribute("src");
}
/**
 * If you want to display a video in your scene, this is the special texture for that.
 * This special texture works similar to other textures, with the exception of a few parameters.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/videoTexture
 */
let VideoTexture = (() => {
    var _a;
    let _classSuper = Texture;
    let __settings_decorators;
    let __settings_initializers = [];
    let __settings_extraInitializers = [];
    let __currentSrc_decorators;
    let __currentSrc_initializers = [];
    let __currentSrc_extraInitializers = [];
    let _isVideo_decorators;
    let _isVideo_initializers = [];
    let _isVideo_extraInitializers = [];
    return _a = class VideoTexture extends _classSuper {
            /**
             * Event triggered when a dom action is required by the user to play the video.
             * This happens due to recent changes in browser policies preventing video to auto start.
             */
            get onUserActionRequestedObservable() {
                if (!this._onUserActionRequestedObservable) {
                    this._onUserActionRequestedObservable = new Observable();
                }
                return this._onUserActionRequestedObservable;
            }
            _processError(reason) {
                this._errorFound = true;
                if (this._onError) {
                    this._onError(reason?.message);
                }
                else {
                    Logger.Error(reason?.message);
                }
            }
            _handlePlay() {
                this._errorFound = false;
                // eslint-disable-next-line github/no-then
                this.video.play().catch((reason) => {
                    if (reason?.name === "NotAllowedError") {
                        if (this._onUserActionRequestedObservable && this._onUserActionRequestedObservable.hasObservers()) {
                            this._onUserActionRequestedObservable.notifyObservers(this);
                            return;
                        }
                        else if (!this.video.muted) {
                            Logger.Warn("Unable to autoplay a video with sound. Trying again with muted turned true");
                            this.video.muted = true;
                            this._errorFound = false;
                            // eslint-disable-next-line github/no-then
                            this.video.play().catch((otherReason) => {
                                this._processError(otherReason);
                            });
                            return;
                        }
                    }
                    this._processError(reason);
                });
            }
            /**
             * Creates a video texture.
             * If you want to display a video in your scene, this is the special texture for that.
             * This special texture works similar to other textures, with the exception of a few parameters.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/videoTexture
             * @param name optional name, will detect from video source, if not defined
             * @param src can be used to provide an url, array of urls or an already setup HTML video element.
             * @param scene is obviously the current scene.
             * @param generateMipMaps can be used to turn on mipmaps (Can be expensive for videoTextures because they are often updated).
             * @param invertY is false by default but can be used to invert video on Y axis
             * @param samplingMode controls the sampling method and is set to TRILINEAR_SAMPLINGMODE by default
             * @param settings allows finer control over video usage
             * @param onError defines a callback triggered when an error occurred during the loading session
             * @param format defines the texture format to use (Engine.TEXTUREFORMAT_RGBA by default)
             */
            constructor(name, src, scene, generateMipMaps = false, invertY = false, samplingMode = Texture.TRILINEAR_SAMPLINGMODE, settings = {}, onError, format = 5) {
                super(null, scene, !generateMipMaps, invertY);
                this._externalTexture = null;
                this._snapshotRenderingObserver = null;
                this._onUserActionRequestedObservable = null;
                this._stillImageCaptured = false;
                this._displayingPosterTexture = false;
                this._settings = __runInitializers(this, __settings_initializers, void 0);
                this._createInternalTextureOnEvent = __runInitializers(this, __settings_extraInitializers);
                this._frameId = -1;
                this._currentSrc = __runInitializers(this, __currentSrc_initializers, null);
                this._onError = __runInitializers(this, __currentSrc_extraInitializers);
                this._errorFound = false;
                /**
                 * Serialize the flag to define this texture as a video texture
                 */
                this.isVideo = __runInitializers(this, _isVideo_initializers, true);
                this._resizeInternalTexture = (__runInitializers(this, _isVideo_extraInitializers), () => {
                    // Cleanup the old texture before replacing it
                    if (this._texture != null) {
                        this._texture.dispose();
                    }
                    if (!this._getEngine().needPOTTextures || (IsExponentOfTwo(this.video.videoWidth) && IsExponentOfTwo(this.video.videoHeight))) {
                        this.wrapU = Texture.WRAP_ADDRESSMODE;
                        this.wrapV = Texture.WRAP_ADDRESSMODE;
                    }
                    else {
                        this.wrapU = Texture.CLAMP_ADDRESSMODE;
                        this.wrapV = Texture.CLAMP_ADDRESSMODE;
                        this._generateMipMaps = false;
                    }
                    this._texture = this._getEngine().createDynamicTexture(this.video.videoWidth, this.video.videoHeight, this._generateMipMaps, this.samplingMode);
                    this._texture.format = this._format ?? 5;
                    // The internal texture (bound by materials) was just recreated. A recorded FAST snapshot bundle still
                    // references the previous GPU texture, so force a snapshot reset to re-record against the new texture.
                    this._resetSnapshotRenderingIfFast();
                    // Reset the frame ID and update the new texture to ensure it pulls in the current video frame
                    this._frameId = -1;
                    this._updateInternalTexture();
                });
                this._createInternalTexture = () => {
                    if (this._texture != null) {
                        if (this._displayingPosterTexture) {
                            this._displayingPosterTexture = false;
                        }
                        else {
                            return;
                        }
                    }
                    this.video.addEventListener("resize", this._resizeInternalTexture);
                    this._resizeInternalTexture();
                    if (!this.video.autoplay && !this._settings.poster && !this._settings.independentVideoSource) {
                        const oldHandler = this.video.onplaying;
                        const oldMuted = this.video.muted;
                        this.video.muted = true;
                        this.video.onplaying = () => {
                            this.video.muted = oldMuted;
                            this.video.onplaying = oldHandler;
                            this._updateInternalTexture();
                            if (!this._errorFound) {
                                this.video.pause();
                            }
                            if (this.onLoadObservable.hasObservers()) {
                                this.onLoadObservable.notifyObservers(this);
                            }
                        };
                        this._handlePlay();
                    }
                    else {
                        this._updateInternalTexture();
                        if (this.onLoadObservable.hasObservers()) {
                            this.onLoadObservable.notifyObservers(this);
                        }
                    }
                };
                this._reset = () => {
                    if (this._texture == null) {
                        return;
                    }
                    if (!this._displayingPosterTexture) {
                        this._texture.dispose();
                        this._texture = null;
                    }
                };
                this._updateWhileSnapshotRendering = () => {
                    const engine = this._engine;
                    if (engine && engine.snapshotRendering && engine.snapshotRenderingMode === 1) {
                        this.update();
                    }
                };
                this._updateInternalTexture = () => {
                    if (this._texture == null) {
                        return;
                    }
                    if (this.video.readyState < this.video.HAVE_CURRENT_DATA) {
                        return;
                    }
                    if (this._displayingPosterTexture) {
                        return;
                    }
                    const frameId = this.getScene().getFrameId();
                    if (this._frameId === frameId) {
                        return;
                    }
                    this._frameId = frameId;
                    this._getEngine().updateVideoTexture(this._texture, this._externalTexture ? this._externalTexture : this.video, this._invertY);
                };
                this._settings = {
                    autoPlay: true,
                    loop: true,
                    autoUpdateTexture: true,
                    ...settings,
                };
                this._onError = onError;
                this._generateMipMaps = generateMipMaps;
                this._initialSamplingMode = samplingMode;
                this.autoUpdateTexture = this._settings.autoUpdateTexture;
                this._currentSrc = src;
                this.name = name || this._getName(src);
                this.video = this._getVideo(src);
                const engineWebGPU = this._engine;
                const createExternalTexture = engineWebGPU?.createExternalTexture;
                if (createExternalTexture) {
                    this._externalTexture = createExternalTexture.call(engineWebGPU, this.video);
                }
                if (this._externalTexture) {
                    // Under FAST snapshot rendering the active meshes are not re-evaluated each frame, so materials
                    // (and the video textures they bind) are never re-bound and VideoTexture.update() is never called.
                    // Drive the per-frame update from a scene hook so the video keeps playing while snapshot rendering is active.
                    const ownerScene = this.getScene();
                    if (ownerScene) {
                        this._snapshotRenderingObserver = ownerScene.onBeforeRenderObservable.add(this._updateWhileSnapshotRendering);
                    }
                }
                if (!this._settings.independentVideoSource) {
                    if (this._settings.poster) {
                        this.video.poster = this._settings.poster;
                    }
                    if (this._settings.autoPlay !== undefined) {
                        this.video.autoplay = this._settings.autoPlay;
                    }
                    if (this._settings.loop !== undefined) {
                        this.video.loop = this._settings.loop;
                    }
                    if (this._settings.muted !== undefined) {
                        this.video.muted = this._settings.muted;
                    }
                    this.video.setAttribute("playsinline", "");
                    this.video.addEventListener("paused", this._updateInternalTexture);
                    this.video.addEventListener("seeked", this._updateInternalTexture);
                    this.video.addEventListener("loadeddata", this._updateInternalTexture);
                    this.video.addEventListener("emptied", this._reset);
                    if (this._settings.autoPlay) {
                        this._handlePlay();
                    }
                }
                this._createInternalTextureOnEvent = this._settings.poster && !this._settings.autoPlay ? "play" : "canplay";
                this.video.addEventListener(this._createInternalTextureOnEvent, this._createInternalTexture);
                this._format = format;
                const videoHasEnoughData = this.video.readyState >= this.video.HAVE_CURRENT_DATA;
                if (this._settings.poster && (!this._settings.autoPlay || !videoHasEnoughData)) {
                    this._texture = this._getEngine().createTexture(this._settings.poster, false, !this.invertY, scene);
                    this._displayingPosterTexture = true;
                }
                else if (videoHasEnoughData) {
                    this._createInternalTexture();
                }
            }
            /**
             * Get the current class name of the video texture useful for serialization or dynamic coding.
             * @returns "VideoTexture"
             */
            getClassName() {
                return "VideoTexture";
            }
            _getName(src) {
                if (src instanceof HTMLVideoElement) {
                    return src.currentSrc;
                }
                if (typeof src === "object") {
                    return src.toString();
                }
                return src;
            }
            _getVideo(src) {
                if (src.isNative) {
                    return src;
                }
                if (src instanceof HTMLVideoElement) {
                    Tools.SetCorsBehavior(src.currentSrc, src);
                    return src;
                }
                const video = document.createElement("video");
                if (typeof src === "string") {
                    Tools.SetCorsBehavior(src, video);
                    video.src = src;
                }
                else {
                    Tools.SetCorsBehavior(src[0], video);
                    for (const url of src) {
                        const source = document.createElement("source");
                        source.src = url;
                        video.appendChild(source);
                    }
                }
                this.onDisposeObservable.addOnce(() => {
                    RemoveSource(video);
                });
                return video;
            }
            /**
             * @internal Internal method to initiate `update`.
             */
            _rebuild() {
                this.update();
            }
            /**
             * Update Texture in the `auto` mode. Does not do anything if `settings.autoUpdateTexture` is false.
             */
            update() {
                if (!this.autoUpdateTexture) {
                    // Expecting user to call `updateTexture` manually
                    return;
                }
                this.updateTexture(true);
            }
            /**
             * Update Texture in `manual` mode. Does not do anything if not visible or paused.
             * @param isVisible Visibility state, detected by user using `scene.getActiveMeshes()` or otherwise.
             */
            updateTexture(isVisible) {
                if (!isVisible) {
                    return;
                }
                if (this.video.paused && this._stillImageCaptured) {
                    return;
                }
                this._stillImageCaptured = true;
                this._updateInternalTexture();
            }
            _resetSnapshotRenderingIfFast() {
                const engine = this._engine;
                if (engine?.snapshotRendering && engine.snapshotRenderingMode === 1) {
                    engine.snapshotRenderingReset();
                }
            }
            /**
             * Get the underlying external texture (if supported by the current engine, else null)
             */
            get externalTexture() {
                return this._externalTexture;
            }
            /**
             * Change video content. Changing video instance or setting multiple urls (as in constructor) is not supported.
             * @param url New url.
             */
            updateURL(url) {
                this.video.src = url;
                this._currentSrc = url;
            }
            /**
             * Clones the texture.
             * @returns the cloned texture
             */
            clone() {
                return new _a(this.name, this._currentSrc, this.getScene(), this._generateMipMaps, this.invertY, this.samplingMode, this._settings);
            }
            /**
             * Dispose the texture and release its associated resources.
             */
            dispose() {
                if (this._snapshotRenderingObserver) {
                    // Remove the per-frame snapshot rendering hook before super.dispose() clears the scene reference.
                    this.getScene()?.onBeforeRenderObservable.remove(this._snapshotRenderingObserver);
                    this._snapshotRenderingObserver = null;
                }
                super.dispose();
                this._currentSrc = null;
                if (this._onUserActionRequestedObservable) {
                    this._onUserActionRequestedObservable.clear();
                    this._onUserActionRequestedObservable = null;
                }
                this.video.removeEventListener(this._createInternalTextureOnEvent, this._createInternalTexture);
                if (!this._settings.independentVideoSource) {
                    this.video.removeEventListener("paused", this._updateInternalTexture);
                    this.video.removeEventListener("seeked", this._updateInternalTexture);
                    this.video.removeEventListener("loadeddata", this._updateInternalTexture);
                    this.video.removeEventListener("emptied", this._reset);
                    this.video.removeEventListener("resize", this._resizeInternalTexture);
                    this.video.pause();
                }
                this._externalTexture?.dispose();
            }
            /**
             * Creates a video texture straight from a stream.
             * @param scene Define the scene the texture should be created in
             * @param stream Define the stream the texture should be created from
             * @param constraints video constraints
             * @param invertY Defines if the video should be stored with invert Y set to true (true by default)
             * @returns The created video texture as a promise
             */
            // eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
            static CreateFromStreamAsync(scene, stream, constraints, invertY = true) {
                const video = scene.getEngine().createVideoElement(constraints);
                if (scene.getEngine()._badOS) {
                    // Yes... I know and I hope to remove it soon...
                    document.body.appendChild(video);
                    video.style.transform = "scale(0.0001, 0.0001)";
                    video.style.opacity = "0";
                    video.style.position = "fixed";
                    video.style.bottom = "0px";
                    video.style.right = "0px";
                }
                video.setAttribute("autoplay", "");
                video.setAttribute("muted", "true");
                video.setAttribute("playsinline", "");
                video.muted = true;
                if (video.isNative) {
                    // No additional configuration needed for native
                }
                else {
                    if (typeof video.srcObject == "object") {
                        video.srcObject = stream;
                    }
                    else {
                        // older API. See https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL#using_object_urls_for_media_streams
                        video.src = window.URL && window.URL.createObjectURL(stream);
                    }
                }
                return new Promise((resolve) => {
                    const onPlaying = () => {
                        const videoTexture = new _a("video", video, scene, true, invertY, undefined, undefined, undefined, 4);
                        if (scene.getEngine()._badOS) {
                            videoTexture.onDisposeObservable.addOnce(() => {
                                video.remove();
                            });
                        }
                        videoTexture.onDisposeObservable.addOnce(() => {
                            RemoveSource(video);
                        });
                        resolve(videoTexture);
                        video.removeEventListener("playing", onPlaying);
                    };
                    video.addEventListener("playing", onPlaying);
                    video.play();
                });
            }
            /**
             * Creates a video texture straight from your WebCam video feed.
             * @param scene Define the scene the texture should be created in
             * @param constraints Define the constraints to use to create the web cam feed from WebRTC
             * @param audioConstaints Define the audio constraints to use to create the web cam feed from WebRTC
             * @param invertY Defines if the video should be stored with invert Y set to true (true by default)
             * @returns The created video texture as a promise
             */
            static async CreateFromWebCamAsync(scene, constraints, audioConstaints = false, invertY = true) {
                if (navigator.mediaDevices) {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: constraints,
                        audio: audioConstaints,
                    });
                    const videoTexture = await this.CreateFromStreamAsync(scene, stream, constraints, invertY);
                    videoTexture.onDisposeObservable.addOnce(() => {
                        const tracks = stream.getTracks();
                        for (const track of tracks) {
                            track.stop();
                        }
                    });
                    return videoTexture;
                }
                // eslint-disable-next-line @typescript-eslint/return-await, @typescript-eslint/prefer-promise-reject-errors
                return Promise.reject("No support for userMedia on this device");
            }
            /**
             * Creates a video texture straight from your WebCam video feed.
             * @param scene Defines the scene the texture should be created in
             * @param onReady Defines a callback to triggered once the texture will be ready
             * @param constraints Defines the constraints to use to create the web cam feed from WebRTC
             * @param audioConstaints Defines the audio constraints to use to create the web cam feed from WebRTC
             * @param invertY Defines if the video should be stored with invert Y set to true (true by default)
             */
            static CreateFromWebCam(scene, onReady, constraints, audioConstaints = false, invertY = true) {
                this.CreateFromWebCamAsync(scene, constraints, audioConstaints, invertY)
                    // eslint-disable-next-line github/no-then
                    .then(function (videoTexture) {
                    if (onReady) {
                        onReady(videoTexture);
                    }
                })
                    // eslint-disable-next-line github/no-then
                    .catch(function (err) {
                    Logger.Error(err.name);
                });
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __settings_decorators = [serialize("settings")];
            __currentSrc_decorators = [serialize("src")];
            _isVideo_decorators = [serialize()];
            __esDecorate(null, null, __settings_decorators, { kind: "field", name: "_settings", static: false, private: false, access: { has: obj => "_settings" in obj, get: obj => obj._settings, set: (obj, value) => { obj._settings = value; } }, metadata: _metadata }, __settings_initializers, __settings_extraInitializers);
            __esDecorate(null, null, __currentSrc_decorators, { kind: "field", name: "_currentSrc", static: false, private: false, access: { has: obj => "_currentSrc" in obj, get: obj => obj._currentSrc, set: (obj, value) => { obj._currentSrc = value; } }, metadata: _metadata }, __currentSrc_initializers, __currentSrc_extraInitializers);
            __esDecorate(null, null, _isVideo_decorators, { kind: "field", name: "isVideo", static: false, private: false, access: { has: obj => "isVideo" in obj, get: obj => obj.isVideo, set: (obj, value) => { obj.isVideo = value; } }, metadata: _metadata }, _isVideo_initializers, _isVideo_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { VideoTexture };
let _Registered = false;
/**
 * Register side effects for videoTexture.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterVideoTexture() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Texture._CreateVideoTexture = (name, src, scene, generateMipMaps = false, invertY = false, samplingMode = Texture.TRILINEAR_SAMPLINGMODE, settings = {}, onError, format = 5) => {
        return new VideoTexture(name, src, scene, generateMipMaps, invertY, samplingMode, settings, onError, format);
    };
    // Some exporters relies on Tools.Instantiate
    RegisterClass("BABYLON.VideoTexture", VideoTexture);
}
//# sourceMappingURL=videoTexture.pure.js.map