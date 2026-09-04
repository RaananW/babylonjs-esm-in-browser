/** This file must only contain pure code and pure imports */
import { type Nullable, type IndicesArray, type DataArray, type FloatArray, type DeepImmutable, type int } from "../types.js";
import { type VertexBuffer } from "../Buffers/buffer.pure.js";
import { InternalTexture, InternalTextureSource } from "../Materials/Textures/internalTexture.js";
import { type BaseTexture } from "../Materials/Textures/baseTexture.pure.js";
import { type Effect } from "../Materials/effect.pure.js";
import { DataBuffer } from "../Buffers/dataBuffer.js";
import { type RenderTargetCreationOptions, type TextureSize, type DepthTextureCreationOptions, type InternalTextureCreationOptions } from "../Materials/Textures/textureCreationOptions.js";
import { type IPipelineContext } from "./IPipelineContext.js";
import { type IMultiRenderTargetOptions } from "../Materials/Textures/multiRenderTarget.pure.js";
import { type IColor3Like, type IColor4Like, type IViewportLike } from "../Maths/math.like.js";
import { type ISceneLike } from "./abstractEngine.pure.js";
import { ThinEngine } from "./thinEngine.pure.js";
import { type IMaterialContext } from "./IMaterialContext.js";
import { type IDrawContext } from "./IDrawContext.js";
import { type ICanvas, type IImage, type IPath2D } from "./ICanvas.js";
import { type IStencilState } from "../States/IStencilState.js";
import { type RenderTargetWrapper } from "./renderTargetWrapper.js";
import { type NativeData, NativeDataStream } from "./Native/nativeDataStream.js";
import { type INative, type INativeEngine, type NativeFramebuffer, type NativeTexture } from "./Native/nativeInterfaces.js";
import { NativeRenderTargetWrapper } from "./Native/nativeRenderTargetWrapper.js";
import { type IHardwareTextureWrapper } from "../Materials/Textures/hardwareTextureWrapper.js";
import { type _IShaderProcessingContext } from "./Processors/shaderProcessingOptions.js";
import { type ShaderLanguage } from "../Materials/shaderLanguage.js";
import { type WebGLHardwareTexture } from "./WebGL/webGLHardwareTexture.js";
import { _TimeToken } from "../Instrumentation/timeToken.js";
/**
 * Returns _native only after it has been defined by BabylonNative.
 * @internal
 */
export declare function AcquireNativeObjectAsync(): Promise<INative>;
/**
 * Registers a constructor on the _native object. See NativeXRFrame for an example.
 * @internal
 */
export declare function RegisterNativeTypeAsync<Type>(typeName: string, constructor: Type): Promise<void>;
/**
 * Container for accessors for natively-stored mesh data buffers.
 */
declare class NativeDataBuffer extends DataBuffer {
    /**
     * Accessor value used to identify/retrieve a natively-stored index buffer.
     */
    nativeIndexBuffer?: NativeData;
    /**
     * Accessor value used to identify/retrieve a natively-stored vertex buffer.
     */
    nativeVertexBuffer?: NativeData;
}
/**
 * Options to create the Native engine
 */
export interface ThinNativeEngineOptions {
    /**
     * defines whether to adapt to the device's viewport characteristics (default: false)
     */
    adaptToDeviceRatio?: boolean;
}
/** @internal */
export declare class ThinNativeEngine extends ThinEngine {
    private static readonly PROTOCOL_VERSION;
    /** @internal */
    static _createNativeDataStream(): NativeDataStream;
    protected _engine: INativeEngine;
    private _camera;
    private _commandBufferEncoder;
    private _frameStats;
    private _boundBuffersVertexArray;
    private _currentDepthTest;
    private _depthTestEnabled;
    private _stencilTest;
    private _stencilMask;
    private _stencilFunc;
    private _stencilFuncRef;
    private _stencilFuncMask;
    private _stencilOpStencilFail;
    private _stencilOpDepthFail;
    private _stencilOpStencilDepthPass;
    private _zOffset;
    private _zOffsetUnits;
    private _cachedCulling;
    private _cachedReverseSide;
    private _cachedCullBackFaces;
    private _cachedZOffset;
    private _cachedZOffsetUnits;
    private _depthWrite;
    private _fillModeWarningDisplayed;
    constructor(options?: ThinNativeEngineOptions);
    /**
     * Keeps as a separate function to use in NativeEngine
     * @internal
     */
    protected _initializeNativeEngine(adaptToDeviceRatio: boolean): void;
    /**
     * Brackets a scene's render with a command scope, so the commands it encodes are submitted together.
     * @param scene the scene whose render should be wrapped
     */
    private _wrapSceneRenderWithCommandScope;
    setHardwareScalingLevel(level: number): void;
    dispose(): void;
    /**
     * Enable scissor test on a specific rectangle (ie. render will only be executed on a specific portion of the screen)
     * @param x defines the x-coordinate of the bottom left corner of the clear rectangle
     * @param y defines the y-coordinate of the corner of the clear rectangle
     * @param width defines the width of the clear rectangle
     * @param height defines the height of the clear rectangle
     */
    enableScissor(x: number, y: number, width: number, height: number): void;
    /**
     * Disable previously set scissor test rectangle
     */
    disableScissor(): void;
    /**
     * Can be used to override the current requestAnimationFrame requester.
     * @internal
     */
    protected _queueNewFrame(bindedRenderFunction: any, requester?: any): number;
    protected _restoreEngineAfterContextLost(): void;
    /**
     * Override default engine behavior.
     * @param framebuffer
     */
    _bindUnboundFramebuffer(framebuffer: Nullable<WebGLFramebuffer>): void;
    /**
     * Gets host document
     * @returns the host document object
     */
    getHostDocument(): Nullable<Document>;
    clear(color: Nullable<IColor4Like>, backBuffer: boolean, depth: boolean, stencil?: boolean, stencilClearValue?: number): void;
    createIndexBuffer(indices: IndicesArray, updateable?: boolean, _label?: string): NativeDataBuffer;
    createVertexBuffer(vertices: DataArray, updateable?: boolean, _label?: string): NativeDataBuffer;
    private _recordVertexArrayObject;
    bindBuffers(vertexBuffers: {
        [key: string]: VertexBuffer;
    }, indexBuffer: Nullable<NativeDataBuffer>, effect: Effect): void;
    recordVertexArrayObject(vertexBuffers: {
        [key: string]: VertexBuffer;
    }, indexBuffer: Nullable<NativeDataBuffer>, effect: Effect, overrideVertexBuffers?: {
        [kind: string]: Nullable<VertexBuffer>;
    }): WebGLVertexArrayObject;
    private _deleteVertexArray;
    bindVertexArrayObject(vertexArray: WebGLVertexArrayObject): void;
    releaseVertexArrayObject(vertexArray: WebGLVertexArrayObject): void;
    getAttributes(pipelineContext: IPipelineContext, attributesNames: string[]): number[];
    /**
     * Triangle Fan and Line Loop are not supported by modern rendering API
     * @param fillMode  defines the primitive to use
     * @returns true if supported
     */
    private _checkSupportedFillMode;
    /**
     * Draw a list of indexed primitives
     * @param fillMode defines the primitive to use
     * @param indexStart defines the starting index
     * @param indexCount defines the number of index to draw
     * @param instancesCount defines the number of instances to draw (if instantiation is enabled)
     */
    drawElementsType(fillMode: number, indexStart: number, indexCount: number, instancesCount?: number): void;
    /**
     * Draw a list of unindexed primitives
     * @param fillMode defines the primitive to use
     * @param verticesStart defines the index of first vertex to draw
     * @param verticesCount defines the count of vertices to draw
     * @param instancesCount defines the number of instances to draw (if instantiation is enabled)
     */
    drawArraysType(fillMode: number, verticesStart: number, verticesCount: number, instancesCount?: number): void;
    createPipelineContext(shaderProcessingContext: Nullable<_IShaderProcessingContext>): IPipelineContext;
    createMaterialContext(): IMaterialContext | undefined;
    createDrawContext(): IDrawContext | undefined;
    /**
     * Function is not technically Async
     * @internal
     */
    _preparePipelineContextAsync(pipelineContext: IPipelineContext, vertexSourceCode: string, fragmentSourceCode: string, createAsRaw: boolean, _rawVertexSourceCode: string, _rawFragmentSourceCode: string, _rebuildRebind: any, defines: Nullable<string>, _transformFeedbackVaryings: Nullable<string[]>, _key: string, onReady: () => void): void;
    /**
     * @internal
     */
    _getShaderProcessingContext(_shaderLanguage: ShaderLanguage): Nullable<_IShaderProcessingContext>;
    /**
     * @internal
     */
    _executeWhenRenderingStateIsCompiled(pipelineContext: IPipelineContext, action: () => void): void;
    createRawShaderProgram(): WebGLProgram;
    createShaderProgram(pipelineContext: IPipelineContext, vertexCode: string, fragmentCode: string, defines: Nullable<string>): WebGLProgram;
    /**
     * Inline functions in shader code that are marked to be inlined
     * @param code code to inline
     * @returns inlined code
     */
    inlineShaderCode(code: string): string;
    protected _setProgram(program: WebGLProgram): void;
    _deletePipelineContext(pipelineContext: IPipelineContext): void;
    getUniforms(pipelineContext: IPipelineContext, uniformsNames: string[]): WebGLUniformLocation[];
    bindUniformBlock(pipelineContext: IPipelineContext, blockName: string, index: number): void;
    bindSamplers(effect: Effect): void;
    getRenderWidth(useScreen?: boolean): number;
    getRenderHeight(useScreen?: boolean): number;
    setViewport(viewport: IViewportLike, requiredWidth?: number, requiredHeight?: number): void;
    setStateCullFaceType(cullBackFaces?: boolean, force?: boolean): void;
    setState(culling: boolean, zOffset?: number, force?: boolean, reverseSide?: boolean, cullBackFaces?: boolean, stencil?: IStencilState, zOffsetUnits?: number): void;
    /**
     * Gets the client rect of native canvas.  Needed for InputManager.
     * @returns a client rectangle
     */
    getInputElementClientRect(): Nullable<DOMRect>;
    /**
     * Set the z offset Factor to apply to current rendering
     * @param value defines the offset to apply
     */
    setZOffset(value: number): void;
    /**
     * Gets the current value of the zOffset Factor
     * @returns the current zOffset Factor state
     */
    getZOffset(): number;
    /**
     * Set the z offset Units to apply to current rendering
     * @param value defines the offset to apply
     */
    setZOffsetUnits(value: number): void;
    /**
     * Gets the current value of the zOffset Units
     * @returns the current zOffset Units state
     */
    getZOffsetUnits(): number;
    /**
     * Enable or disable depth buffering
     * @param enable defines the state to set
     */
    setDepthBuffer(enable: boolean): void;
    private _encodeDepthTest;
    private _flushDepthTestState;
    applyStates(): void;
    /**
     * Gets a boolean indicating if depth writing is enabled
     * @returns the current depth writing state
     */
    getDepthWrite(): boolean;
    getDepthFunction(): Nullable<number>;
    setDepthFunction(depthFunc: number): void;
    /**
     * Enable or disable depth writing
     * @param enable defines the state to set
     */
    setDepthWrite(enable: boolean): void;
    /**
     * Enable or disable color writing
     * @param enable defines the state to set
     */
    setColorWrite(enable: boolean): void;
    /**
     * Gets a boolean indicating if color writing is enabled
     * @returns the current color writing state
     */
    getColorWrite(): boolean;
    private applyStencil;
    private _setStencil;
    /**
     * Enable or disable the stencil buffer
     * @param enable defines if the stencil buffer must be enabled or disabled
     */
    setStencilBuffer(enable: boolean): void;
    /**
     * Gets a boolean indicating if stencil buffer is enabled
     * @returns the current stencil buffer state
     */
    getStencilBuffer(): boolean;
    /**
     * Gets the current stencil operation when stencil passes
     * @returns a number defining stencil operation to use when stencil passes
     */
    getStencilOperationPass(): number;
    /**
     * Sets the stencil operation to use when stencil passes
     * @param operation defines the stencil operation to use when stencil passes
     */
    setStencilOperationPass(operation: number): void;
    /**
     * Sets the current stencil mask
     * @param mask defines the new stencil mask to use
     */
    setStencilMask(mask: number): void;
    /**
     * Sets the current stencil function
     * @param stencilFunc defines the new stencil function to use
     */
    setStencilFunction(stencilFunc: number): void;
    /**
     * Sets the current stencil reference
     * @param reference defines the new stencil reference to use
     */
    setStencilFunctionReference(reference: number): void;
    /**
     * Sets the current stencil mask
     * @param mask defines the new stencil mask to use
     */
    setStencilFunctionMask(mask: number): void;
    /**
     * Sets the stencil operation to use when stencil fails
     * @param operation defines the stencil operation to use when stencil fails
     */
    setStencilOperationFail(operation: number): void;
    /**
     * Sets the stencil operation to use when depth fails
     * @param operation defines the stencil operation to use when depth fails
     */
    setStencilOperationDepthFail(operation: number): void;
    /**
     * Gets the current stencil mask
     * @returns a number defining the new stencil mask to use
     */
    getStencilMask(): number;
    /**
     * Gets the current stencil function
     * @returns a number defining the stencil function to use
     */
    getStencilFunction(): number;
    /**
     * Gets the current stencil reference value
     * @returns a number defining the stencil reference value to use
     */
    getStencilFunctionReference(): number;
    /**
     * Gets the current stencil mask
     * @returns a number defining the stencil mask to use
     */
    getStencilFunctionMask(): number;
    /**
     * Gets the current stencil operation when stencil fails
     * @returns a number defining stencil operation to use when stencil fails
     */
    getStencilOperationFail(): number;
    /**
     * Gets the current stencil operation when depth fails
     * @returns a number defining stencil operation to use when depth fails
     */
    getStencilOperationDepthFail(): number;
    /**
     * Sets alpha constants used by some alpha blending modes
     * @param r defines the red component
     * @param g defines the green component
     * @param b defines the blue component
     * @param a defines the alpha component
     */
    setAlphaConstants(r: number, g: number, b: number, a: number): void;
    /**
     * Sets the current alpha mode
     * @param mode defines the mode to use (one of the BABYLON.Constants.ALPHA_XXX)
     * @param noDepthWriteChange defines if depth writing state should remains unchanged (false by default)
     * @param targetIndex defines the index of the target to set the alpha mode for (default is 0)
     * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/advanced/transparent_rendering
     */
    setAlphaMode(mode: number, noDepthWriteChange?: boolean, targetIndex?: number): void;
    setInt(uniform: WebGLUniformLocation, int: number): boolean;
    setIntArray(uniform: WebGLUniformLocation, array: Int32Array): boolean;
    setIntArray2(uniform: WebGLUniformLocation, array: Int32Array): boolean;
    setIntArray3(uniform: WebGLUniformLocation, array: Int32Array): boolean;
    setIntArray4(uniform: WebGLUniformLocation, array: Int32Array): boolean;
    setFloatArray(uniform: WebGLUniformLocation, array: Float32Array): boolean;
    setFloatArray2(uniform: WebGLUniformLocation, array: Float32Array): boolean;
    setFloatArray3(uniform: WebGLUniformLocation, array: Float32Array): boolean;
    setFloatArray4(uniform: WebGLUniformLocation, array: Float32Array): boolean;
    setArray(uniform: WebGLUniformLocation, array: number[]): boolean;
    setArray2(uniform: WebGLUniformLocation, array: number[]): boolean;
    setArray3(uniform: WebGLUniformLocation, array: number[]): boolean;
    setArray4(uniform: WebGLUniformLocation, array: number[]): boolean;
    setMatrices(uniform: WebGLUniformLocation, matrices: DeepImmutable<FloatArray>): boolean;
    setMatrix3x3(uniform: WebGLUniformLocation, matrix: Float32Array): boolean;
    setMatrix2x2(uniform: WebGLUniformLocation, matrix: Float32Array): boolean;
    setFloat(uniform: WebGLUniformLocation, value: number): boolean;
    setFloat2(uniform: WebGLUniformLocation, x: number, y: number): boolean;
    setFloat3(uniform: WebGLUniformLocation, x: number, y: number, z: number): boolean;
    setFloat4(uniform: WebGLUniformLocation, x: number, y: number, z: number, w: number): boolean;
    setColor3(uniform: WebGLUniformLocation, color3: IColor3Like): boolean;
    setColor4(uniform: WebGLUniformLocation, color3: IColor3Like, alpha: number): boolean;
    wipeCaches(bruteForce?: boolean): void;
    protected _createTexture(): WebGLTexture;
    protected _deleteTexture(texture: Nullable<WebGLHardwareTexture>): void;
    /**
     * Update the content of a dynamic texture
     * @param texture defines the texture to update
     * @param canvas defines the canvas containing the source
     * @param invertY defines if data must be stored with Y axis inverted
     * @param premulAlpha defines if alpha is stored as premultiplied
     * @param format defines the format of the data
     */
    updateDynamicTexture(texture: Nullable<InternalTexture>, canvas: any, invertY: boolean, premulAlpha?: boolean, format?: number): void;
    createDynamicTexture(width: number, height: number, generateMipMaps: boolean, samplingMode: number): InternalTexture;
    createVideoElement(constraints: MediaTrackConstraints): any;
    updateVideoTexture(texture: Nullable<InternalTexture>, video: HTMLVideoElement, invertY: boolean): void;
    createRawTexture(data: Nullable<ArrayBufferView>, width: number, height: number, format: number, generateMipMaps: boolean, invertY: boolean, samplingMode: number, compression?: Nullable<string>, type?: number, creationFlags?: number, useSRGBBuffer?: boolean): InternalTexture;
    createRawTexture2DArray(data: Nullable<ArrayBufferView>, width: number, height: number, depth: number, format: number, generateMipMaps: boolean, invertY: boolean, samplingMode: number, compression?: Nullable<string>, textureType?: number): InternalTexture;
    updateRawTexture(texture: Nullable<InternalTexture>, bufferView: Nullable<ArrayBufferView>, format: number, invertY: boolean, compression?: Nullable<string>, type?: number, useSRGBBuffer?: boolean): void;
    /**
     * Usually called from Texture.ts.
     * Passed information to create a NativeTexture
     * @param url defines a value which contains one of the following:
     * * A conventional http URL, e.g. 'http://...' or 'file://...'
     * * A base64 string of in-line texture data, e.g. 'data:image/jpg;base64,/...'
     * * An indicator that data being passed using the buffer parameter, e.g. 'data:mytexture.jpg'
     * @param noMipmap defines a boolean indicating that no mipmaps shall be generated.  Ignored for compressed textures.  They must be in the file
     * @param invertY when true, image is flipped when loaded.  You probably want true. Certain compressed textures may invert this if their default is inverted (eg. ktx)
     * @param scene needed for loading to the correct scene
     * @param samplingMode mode with should be used sample / access the texture (Default: Texture.TRILINEAR_SAMPLINGMODE)
     * @param onLoad optional callback to be called upon successful completion
     * @param onError optional callback to be called upon failure
     * @param buffer a source of a file previously fetched as either a base64 string, an ArrayBuffer (compressed or image format), HTMLImageElement (image format), or a Blob
     * @param fallback an internal argument in case the function must be called again, due to etc1 not having alpha capabilities
     * @param format internal format.  Default: RGB when extension is '.jpg' else RGBA.  Ignored for compressed textures
     * @param forcedExtension defines the extension to use to pick the right loader
     * @param mimeType defines an optional mime type
     * @param loaderOptions options to be passed to the loader
     * @param creationFlags specific flags to use when creating the texture (Constants.TEXTURE_CREATIONFLAG_STORAGE for storage textures, for eg)
     * @param useSRGBBuffer defines if the texture must be loaded in a sRGB GPU buffer (if supported by the GPU).
     * @returns a InternalTexture for assignment back into BABYLON.Texture
     */
    createTexture(url: Nullable<string>, noMipmap: boolean, invertY: boolean, scene: Nullable<ISceneLike>, samplingMode?: number, onLoad?: Nullable<(texture: InternalTexture) => void>, onError?: Nullable<(message: string, exception: any) => void>, buffer?: Nullable<string | ArrayBuffer | ArrayBufferView | HTMLImageElement | Blob | ImageBitmap>, fallback?: Nullable<InternalTexture>, format?: Nullable<number>, forcedExtension?: Nullable<string>, mimeType?: string, loaderOptions?: any, creationFlags?: number, useSRGBBuffer?: boolean): InternalTexture;
    /**
     * Wraps an external native texture in a Babylon texture.
     * @param texture defines the external texture
     * @param hasMipMaps defines whether the external texture has mip maps
     * @param samplingMode defines the sampling mode for the external texture (default: Constants.TEXTURE_TRILINEAR_SAMPLINGMODE)
     * @returns the babylon internal texture
     */
    wrapNativeTexture(texture: NativeTexture, hasMipMaps?: boolean, samplingMode?: number): InternalTexture;
    /**
     * Replaces the underlying native texture handle of a texture previously created via {@link wrapNativeTexture},
     * preserving the InternalTexture identity.
     *
     * Intended for the device-loss / device-restored flow (a DisableRendering / EnableRendering cycle from the host
     * application): when the host recreates its external resource on the new graphics device, it calls this method to
     * repoint Babylon's wrapper at the new handle without losing references held by materials, render-target wrappers,
     * particle systems, etc.
     *
     * The new handle must match the wrapped texture's recorded dimensions. To change dimensions, dispose the wrapped
     * texture and call {@link wrapNativeTexture} again. Sampling mode and mip-map flag are properties of the logical
     * wrapped texture and are re-applied to the new resource. Any render-target wrapper holding this texture as its
     * color attachment has its framebuffer rebuilt with the new handle.
     *
     * Throws if the target was not produced by {@link wrapNativeTexture}, if the new handle's dimensions don't match,
     * if the wrapped texture is part of a multi render-target, or if the wrapper has a depth/stencil texture (these
     * are not supported in this version; dispose and re-wrap).
     * @param internalTexture defines the wrapped InternalTexture to repoint
     * @param texture defines the new native texture handle to wrap
     */
    updateWrappedNativeTexture(internalTexture: InternalTexture, texture: NativeTexture): void;
    _createDepthStencilTexture(size: TextureSize, options: DepthTextureCreationOptions, rtWrapper: RenderTargetWrapper): InternalTexture;
    /**
     * @internal
     */
    _releaseFramebufferObjects(framebuffer: Nullable<NativeFramebuffer>): void;
    /**
     * @internal Engine abstraction for loading and creating an image bitmap from a given source string.
     * @param imageSource source to load the image from.
     * @param _options An object that sets options for the image's extraction.
     * @returns ImageBitmap
     */
    _createImageBitmapFromSource(imageSource: string, _options?: ImageBitmapOptions): Promise<ImageBitmap>;
    /**
     * Engine abstraction for createImageBitmap
     * @param image source for image
     * @param options An object that sets options for the image's extraction.
     * @returns ImageBitmap
     */
    createImageBitmap(image: ImageBitmapSource, options?: ImageBitmapOptions): Promise<ImageBitmap>;
    /**
     * Resize an image and returns the image data as an uint8array
     * @param image image to resize
     * @param bufferWidth destination buffer width
     * @param bufferHeight destination buffer height
     * @returns an uint8array containing RGBA values of bufferWidth * bufferHeight size
     */
    resizeImageBitmap(image: ImageBitmap, bufferWidth: number, bufferHeight: number): Uint8Array;
    /** @internal */
    _createHardwareTexture(): IHardwareTextureWrapper;
    /** @internal */
    _createHardwareRenderTargetWrapper(isMulti: boolean, isCube: boolean, size: TextureSize): RenderTargetWrapper;
    /** @internal */
    _createInternalTexture(size: TextureSize, options: boolean | InternalTextureCreationOptions, _delayGPUTextureCreation?: boolean, source?: InternalTextureSource): InternalTexture;
    createRenderTargetTexture(size: number | {
        width: number;
        height: number;
        depth: number;
    }, options: boolean | RenderTargetCreationOptions): RenderTargetWrapper;
    createRenderTargetCubeTexture(size: number, options?: RenderTargetCreationOptions): RenderTargetWrapper;
    createMultipleRenderTarget(size: TextureSize, options: IMultiRenderTargetOptions, _initializeBuffers?: boolean): RenderTargetWrapper;
    /**
     * Creates (or recreates) the native framebuffer of a multi render target from the color attachment
     * textures currently held by the wrapper. bgfx binds a fixed attachment set when a framebuffer is
     * created and cannot re-point an individual attachment the way GL's framebufferTexture2D can, so the
     * whole framebuffer has to be recreated whenever an attachment is swapped after creation (e.g. the OIT
     * depth-peeling renderer replaces every attachment via MultiRenderTarget.setInternalTexture).
     * @param rtWrapper The multi render target wrapper to build the framebuffer for.
     * @internal
     */
    _createMultiRenderTargetFramebuffer(rtWrapper: NativeRenderTargetWrapper): void;
    generateMipMapsForCubemap(_texture: InternalTexture, _unbind?: boolean): void;
    bindAttachments(_attachments: number[]): void;
    buildTextureLayout(textureStatus: boolean[], _backBufferLayout?: boolean): number[];
    restoreSingleAttachment(): void;
    restoreSingleAttachmentForRenderTarget(): void;
    generateMipMapsMultiFramebuffer(_texture: RenderTargetWrapper): void;
    resolveMultiFramebuffer(_texture: RenderTargetWrapper): void;
    unBindMultiColorAttachmentFramebuffer(_rtWrapper: RenderTargetWrapper, _disableGenerateMipMaps?: boolean, onBeforeUnbind?: () => void): void;
    updateMultipleRenderTargetTextureSampleCount(rtWrapper: Nullable<RenderTargetWrapper>, samples: number, _initializeBuffers?: boolean): number;
    updateRenderTargetTextureSampleCount(rtWrapper: RenderTargetWrapper, samples: number): number;
    updateTextureSamplingMode(samplingMode: number, texture: InternalTexture): void;
    bindFramebuffer(texture: RenderTargetWrapper, faceIndex?: number, requiredWidth?: number, requiredHeight?: number, forceFullscreenViewport?: boolean): void;
    unBindFramebuffer(texture: RenderTargetWrapper, disableGenerateMipMaps?: boolean, onBeforeUnbind?: () => void): void;
    createDynamicVertexBuffer(data: DataArray): DataBuffer;
    updateDynamicIndexBuffer(indexBuffer: DataBuffer, indices: IndicesArray, offset?: number): void;
    updateDynamicVertexBuffer(vertexBuffer: DataBuffer, data: DataArray, byteOffset?: number, byteLength?: number): void;
    /**
     * @internal
     */
    _setTexture(channel: number, texture: Nullable<BaseTexture>, isPartOfTextureArray?: boolean, depthStencilTexture?: boolean): boolean;
    private _setTextureSampling;
    private _setTextureWrapMode;
    private _setNativeTexture;
    private _unsetNativeTexture;
    private _updateAnisotropicLevel;
    /**
     * @internal
     */
    _bindTexture(channel: number, texture: Nullable<InternalTexture>): void;
    /**
     * Unbind all textures
     */
    unbindAllTextures(): void;
    protected _deleteBuffer(buffer: NativeDataBuffer): void;
    /**
     * Create a canvas
     * @param width width
     * @param height height
     * @returns ICanvas interface
     */
    createCanvas(width: number, height: number): ICanvas;
    /**
     * Create an image to use with canvas
     * @returns IImage interface
     */
    createCanvasImage(): IImage;
    /**
     * Create a 2D path to use with canvas
     * @returns IPath2D interface
     * @param d SVG path string
     */
    createCanvasPath2D(d?: string): IPath2D;
    /**
     * Update a portion of an internal texture
     * @param texture defines the texture to update
     * @param imageData defines the data to store into the texture
     * @param xOffset defines the x coordinates of the update rectangle
     * @param yOffset defines the y coordinates of the update rectangle
     * @param width defines the width of the update rectangle
     * @param height defines the height of the update rectangle
     * @param faceIndex defines the face index if texture is a cube (0 by default)
     * @param lod defines the lod level to update (0 by default)
     * @param generateMipMaps defines whether to generate mipmaps or not
     */
    updateTextureData(texture: InternalTexture, imageData: ArrayBufferView, xOffset: number, yOffset: number, width: number, height: number, faceIndex?: number, lod?: number, generateMipMaps?: boolean): void;
    /**
     * @internal
     */
    _uploadCompressedDataToTextureDirectly(texture: InternalTexture, internalFormat: number, width: number, height: number, data: ArrayBufferView, faceIndex?: number, lod?: number): void;
    /**
     * @internal
     */
    _uploadDataToTextureDirectly(texture: InternalTexture, imageData: ArrayBufferView, faceIndex?: number, lod?: number): void;
    /**
     * @internal
     */
    _uploadArrayBufferViewToTexture(texture: InternalTexture, imageData: ArrayBufferView, faceIndex?: number, lod?: number): void;
    getFontOffset(font: string): {
        ascent: number;
        height: number;
        descent: number;
    };
    /**
     * No equivalent for native. Do nothing.
     */
    flushFramebuffer(): void;
    _readTexturePixels(texture: InternalTexture, width: number, height: number, faceIndex?: number, level?: number, buffer?: Nullable<ArrayBufferView<ArrayBuffer>>, _flushRenderer?: boolean, _noDataConversion?: boolean, x?: number, y?: number): Promise<ArrayBufferView>;
    startTimeQuery(): Nullable<_TimeToken>;
    endTimeQuery(token: _TimeToken): int;
}
export {};
