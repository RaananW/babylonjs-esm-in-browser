import { type Scene } from "../../../scene.pure.js";
import { type AbstractMesh } from "../../../Meshes/abstractMesh.pure.js";
import { type HtmlTexture } from "./htmlTexture.js";
/**
 * Maps a UV coordinate sampled from an {@link HtmlTexture} to a pixel position inside the source element.
 *
 * When `invertY` is true (the default, matching {@link HtmlTexture}'s default upload orientation) the V
 * axis is flipped so that `v = 1` maps to the top of the element, matching the top-left origin used by
 * DOM layout.
 * @param u horizontal texture coordinate, normally in [0, 1]
 * @param v vertical texture coordinate, normally in [0, 1]
 * @param width element width in pixels
 * @param height element height in pixels
 * @param invertY whether the texture content is stored Y-inverted (default true)
 * @returns the pixel position `{ x, y }` within the element
 */
export declare function GetElementPixelFromUv(u: number, v: number, width: number, height: number, invertY?: boolean): {
    x: number;
    y: number;
};
/**
 * Options for {@link HtmlRaycastInteractionManager}.
 */
export interface IHtmlRaycastInteractionManagerOptions {
    /** The DOM element that receives the forwarded pointer events (defaults to the texture's element). */
    targetElement?: HTMLElement;
    /** Whether hits on back-facing geometry are ignored (default true). */
    backFaceCulling?: boolean;
    /** Whether the texture content is stored Y-inverted, used when mapping UVs to element pixels (default true). */
    invertY?: boolean;
}
/**
 * Routes Babylon pointer events to a live HTML element rendered through an {@link HtmlTexture}.
 *
 * On every pointer event the scene is picked; when the configured mesh is hit, the picked UV is mapped to
 * a pixel inside the source element and an equivalent DOM pointer (and mouse) event is dispatched there.
 * This works for arbitrary meshes (planes, boxes, curved surfaces) because it relies on UV coordinates
 * rather than a flat CSS overlay. For a perspective-correct overlay on planar surfaces, see
 * {@link HtmlInteractionManager}.
 */
export declare class HtmlRaycastInteractionManager {
    private readonly _scene;
    private readonly _mesh;
    private readonly _element;
    private readonly _backFaceCulling;
    private readonly _invertY;
    private _observer;
    private _downTarget;
    private readonly _containHandler;
    private readonly _rectCache;
    private _rectCacheValid;
    private readonly _invalidateRectCache;
    private _resizeObserver;
    private _mutationObserver;
    /**
     * Creates a raycast interaction manager.
     * @param scene the scene to listen to for pointer events
     * @param texture the HTML texture whose element should receive the forwarded events
     * @param mesh the mesh displaying the texture; only hits on this mesh are forwarded
     * @param options optional configuration
     */
    constructor(scene: Scene, texture: HtmlTexture, mesh: AbstractMesh, options?: IHtmlRaycastInteractionManagerOptions);
    private _onPointer;
    private _isBackFace;
    private _dispatch;
    /**
     * Resolves the deepest descendant of the hosted element whose layout box contains the given client point.
     * @param clientX horizontal client coordinate
     * @param clientY vertical client coordinate
     * @returns the deepest matching element, or the hosted element itself when no descendant matches
     */
    private _resolveTarget;
    /**
     * Returns the client rect of an element, served from a cache that is rebuilt only when layout may have
     * changed (see the constructor). This keeps pointer routing free of per-event layout reads.
     * @param element the element whose bounding rect is needed
     * @returns the element's cached {@link DOMRect}
     */
    private _getRect;
    /**
     * Detaches the manager and stops forwarding pointer events.
     */
    dispose(): void;
}
