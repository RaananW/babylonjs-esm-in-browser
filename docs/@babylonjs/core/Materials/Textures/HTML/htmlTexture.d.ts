/** This module has no top-level side effects: the engine extension it depends on is registered lazily from the constructor */
import { type Nullable } from "../../../types.js";
import { BaseTexture } from "../baseTexture.pure.js";
import { Matrix } from "../../../Maths/math.vector.pure.js";
import { Observable } from "../../../Misc/observable.pure.js";
import { type AbstractEngine } from "../../../Engines/abstractEngine.pure.js";
import { type InternalTexture } from "../internalTexture.js";
import { type Scene } from "../../../scene.pure.js";
/**
 * Detects whether the engine can upload an HTML element through the native (or polyfilled) WICG
 * HTML-in-Canvas API, without emitting any warning. Used to decide whether the SVG fallback is needed.
 * @param engine defines the engine to test
 * @returns true when the WICG upload API is available for this engine
 */
export declare function IsHtmlInCanvasUploadSupported(engine: AbstractEngine): boolean;
/**
 * Uploads a live HTML element (or a captured ElementImage) into an existing 2D texture using the WICG
 * HTML-in-Canvas API (https://github.com/WICG/html-in-canvas).
 *
 * This is a side-effect-free helper - it is only reachable when {@link HtmlTexture} (or a direct caller)
 * is imported, so it adds nothing to bundles that do not use it. It relies on
 * `WebGLRenderingContext.texElementImage2D` (WebGL) or `GPUQueue.copyElementImageToTexture` (WebGPU),
 * available either natively (behind chrome://flags/#canvas-draw-element) or through the
 * three-html-render polyfill.
 * @param engine defines the engine that owns the texture
 * @param texture defines the internal texture to update
 * @param element defines the source HTML element (or captured ElementImage) to upload
 * @param invertY defines if data must be stored with Y axis inverted (true by default)
 * @param config defines an optional source rectangle and sizing configuration
 * @returns true if the upload succeeded, false otherwise (e.g. the API is unavailable)
 */
export declare function UploadHtmlElementToTexture(engine: AbstractEngine, texture: Nullable<InternalTexture>, element: Element | ElementImage, invertY?: boolean, config?: WebGLCopyElementImageConfig): boolean;
/**
 * Defines the options used to create an {@link HtmlTexture}.
 */
export interface IHtmlTextureOptions {
    /** Defines the width of the texture in pixels (defaults to the element's offset width, then 256). */
    width?: number;
    /** Defines the height of the texture in pixels (defaults to the element's offset height, then 256). */
    height?: number;
    /** Defines whether mip maps should be created or not (default: false). */
    generateMipMaps?: boolean;
    /** Defines the sampling mode of the texture (default: TEXTURE_BILINEAR_SAMPLINGMODE). */
    samplingMode?: number;
    /** Defines the associated texture format (default: TEXTUREFORMAT_RGBA). */
    format?: number;
    /** Defines whether the texture is automatically updated when the host canvas emits a paint event (default: true). */
    autoUpdate?: boolean;
    /**
     * Defines whether to fall back to an SVG `<foreignObject>` rasterization when the native WICG
     * HTML-in-Canvas API is unavailable (default: true). The fallback works in any browser but only
     * captures same-origin, inline-styled content as a static snapshot (see the documentation for caveats).
     */
    useSvgFallback?: boolean;
    /** Defines the engine instance to use the texture with. Not mandatory if a scene is provided. */
    engine?: Nullable<AbstractEngine>;
    /** Defines the scene the texture belongs to. Not mandatory if an engine is provided. */
    scene?: Nullable<Scene>;
}
/**
 * A texture whose content is rendered from a live HTML element using the WICG HTML-in-Canvas API
 * (https://github.com/WICG/html-in-canvas).
 *
 * The element is hosted as a child of the engine's rendering canvas (which is marked `layoutsubtree`) so
 * the browser can lay it out and snapshot it; the WICG API requires the source element to be a direct
 * child of the canvas whose context performs the upload. Content is uploaded through
 * `WebGLRenderingContext.texElementImage2D` (WebGL) or `GPUQueue.copyElementImageToTexture` (WebGPU),
 * available either natively (behind chrome://flags/#canvas-draw-element) or via the three-html-render
 * polyfill (https://github.com/repalash/three-html-render). When neither is present, a built-in SVG
 * `<foreignObject>` fallback is used instead (see `useSvgFallback`).
 *
 * As with {@link HtmlElementTexture}, updates are not automatic unless `autoUpdate` is enabled; in
 * that case the texture refreshes whenever the host canvas reports a paint change.
 */
export declare class HtmlTexture extends BaseTexture {
    /**
     * The HTML element rendered into the texture.
     */
    readonly element: HTMLElement;
    /**
     * The element that hosts {@link element} in the document. This is the engine's rendering canvas when one
     * is available (required by the WICG API, which can only capture the element from that canvas), or a
     * hidden helper `<div>` otherwise - in which case only the SVG fallback can render.
     */
    readonly host: Nullable<HTMLElement>;
    /**
     * Observable triggered once the texture has been rendered for the first time.
     */
    onLoadObservable: Observable<HtmlTexture>;
    private static readonly _DefaultOptions;
    private readonly _format;
    private readonly _generateMipMaps;
    private readonly _samplingMode;
    private readonly _useSvgFallback;
    private readonly _textureMatrix;
    private _paintHandler;
    private _ownsHost;
    private _originalParent;
    private _originalNextSibling;
    private _addedInert;
    private _width;
    private _height;
    /**
     * Instantiates an HtmlTexture from an HTML element.
     * @param name Defines the name of the texture
     * @param element Defines the HTML element to render into the texture
     * @param options Defines the texture creation options
     */
    constructor(name: string, element: HTMLElement, options: IHtmlTextureOptions);
    private _createHost;
    private _createInternalTexture;
    /**
     * @returns the texture matrix used in most of the material.
     */
    getTextureMatrix(): Matrix;
    /**
     * Requests the host canvas to emit a paint event on the next rendering update. When auto-update is
     * enabled, this triggers a texture refresh in sync with the DOM. Falls back to an immediate update
     * when the WICG API is not available.
     */
    requestUpdate(): void;
    /**
     * Updates the content of the texture from the current state of the HTML element.
     * @param invertY Defines whether the texture should be inverted on Y (true by default)
     */
    update(invertY?: boolean): void;
    /**
     * Renders the element through an SVG `<foreignObject>` snapshot and uploads it to the texture. This
     * fallback works in any browser but only captures same-origin, inline-styled content as a static image.
     * @param engine defines the engine that owns the texture
     * @param invertY defines whether the texture should be inverted on Y
     */
    private _updateFromSvgFallback;
    /**
     * Serializes the element into an SVG `<foreignObject>` data URL sized to the texture.
     * @returns a data URL, or null if serialization failed
     */
    private _buildSvgDataUrl;
    /**
     * Gets the current class name of the texture useful for serialization or dynamic coding.
     * @returns "HtmlTexture"
     */
    getClassName(): string;
    /**
     * Dispose the texture and release its associated resources.
     */
    dispose(): void;
}
