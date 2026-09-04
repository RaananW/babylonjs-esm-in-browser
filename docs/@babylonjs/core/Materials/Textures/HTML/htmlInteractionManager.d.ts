import { type Scene } from "../../../scene.pure.js";
import { type AbstractMesh } from "../../../Meshes/abstractMesh.pure.js";
import { type HtmlTexture } from "./htmlTexture.js";
/**
 * Builds the CSS `transform` string that positions an overlay element over the projected face of a mesh.
 *
 * The transform is applied with `transform-origin: 0 0`. Reading right to left it centers the element on
 * its own origin, scales and rotates it to match the projected face, then translates it to the projected
 * center (in CSS pixels, top-left origin).
 * @param centerX projected center X in CSS pixels
 * @param centerY projected center Y in CSS pixels
 * @param scaleX horizontal scale to apply to the element
 * @param scaleY vertical scale to apply to the element
 * @param rotation in-plane rotation in radians
 * @param elementWidth element width in pixels
 * @param elementHeight element height in pixels
 * @returns the CSS transform string
 */
export declare function ComputeOverlayCssTransform(centerX: number, centerY: number, scaleX: number, scaleY: number, rotation: number, elementWidth: number, elementHeight: number): string;
/**
 * Options for {@link HtmlInteractionManager}.
 */
export interface IHtmlInteractionManagerOptions {
    /** The DOM element to overlay (defaults to the texture's element). */
    targetElement?: HTMLElement;
    /** Whether the overlay element captures pointer events so the browser hit-tests it natively (default true). */
    enablePointerEvents?: boolean;
}
/**
 * Overlays the live HTML element of an {@link HtmlTexture} on top of the projected face of a planar mesh,
 * so the browser hit-tests the real DOM element natively (enabling focus, text selection and form input).
 *
 * Each frame the mesh face is projected to screen space and the element is translated, scaled and rotated
 * to match. This is best suited to planar, camera-facing surfaces. For arbitrary or curved meshes, use the
 * UV-based {@link HtmlRaycastInteractionManager} instead.
 *
 * The overlay is screen-aligned (position, size and in-plane rotation); it does not apply a full
 * perspective skew, so steeply oblique faces will not be perspective-correct.
 */
export declare class HtmlInteractionManager {
    private readonly _scene;
    private readonly _mesh;
    private readonly _element;
    private _observer;
    private _previousTransform;
    private readonly _viewport;
    private readonly _center;
    private readonly _xAxis;
    private readonly _yAxis;
    private readonly _projectedCenter;
    private readonly _projectedX;
    private readonly _projectedY;
    private readonly _corner;
    private _restoreInertOnDispose;
    /**
     * Creates an overlay interaction manager.
     * @param scene the scene whose camera drives the projection
     * @param texture the HTML texture whose element should be overlaid
     * @param mesh the planar mesh displaying the texture
     * @param options optional configuration
     */
    constructor(scene: Scene, texture: HtmlTexture, mesh: AbstractMesh, options?: IHtmlInteractionManagerOptions);
    private _update;
    private _setTransform;
    /**
     * Detaches the manager and stops updating the overlay.
     */
    dispose(): void;
}
