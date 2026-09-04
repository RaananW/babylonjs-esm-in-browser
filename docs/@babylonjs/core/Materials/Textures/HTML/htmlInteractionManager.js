import { Matrix, Vector3 } from "../../../Maths/math.vector.pure.js";
import { Viewport } from "../../../Maths/math.viewport.js";
// Attribution: the overlay-and-hit-test technique used here is prior art from `three-html-render`
// (Palash Bansal, MIT), three.js' `InteractionManager`, and Jake Archibald's `curved-markup` demo.
// The implementation below is a clean-room rewrite against Babylon.js' own projection APIs.
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
export function ComputeOverlayCssTransform(centerX, centerY, scaleX, scaleY, rotation, elementWidth, elementHeight) {
    return `translate(${centerX}px, ${centerY}px) rotate(${rotation}rad) scale(${scaleX}, ${scaleY}) translate(${-elementWidth / 2}px, ${-elementHeight / 2}px)`;
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
export class HtmlInteractionManager {
    /**
     * Creates an overlay interaction manager.
     * @param scene the scene whose camera drives the projection
     * @param texture the HTML texture whose element should be overlaid
     * @param mesh the planar mesh displaying the texture
     * @param options optional configuration
     */
    constructor(scene, texture, mesh, options = {}) {
        this._previousTransform = "";
        // Reused across frames to avoid per-frame allocations.
        this._viewport = new Viewport(0, 0, 0, 0);
        this._center = new Vector3();
        this._xAxis = new Vector3();
        this._yAxis = new Vector3();
        this._projectedCenter = new Vector3();
        this._projectedX = new Vector3();
        this._projectedY = new Vector3();
        this._corner = new Vector3();
        this._restoreInertOnDispose = false;
        this._scene = scene;
        this._mesh = mesh;
        this._element = options.targetElement ?? texture.element;
        this._element.style.position = "absolute";
        this._element.style.left = "0px";
        this._element.style.top = "0px";
        this._element.style.transformOrigin = "0 0";
        this._element.style.pointerEvents = (options.enablePointerEvents ?? true) ? "auto" : "none";
        // This manager relies on native browser hit testing of the element. HtmlTexture marks the element
        // `inert` while hosting it inside the rendering canvas (so it does not steal input from the canvas);
        // clear that here so native interaction works, and restore it on dispose.
        this._restoreInertOnDispose = this._element.hasAttribute("inert");
        if (this._restoreInertOnDispose) {
            this._element.removeAttribute("inert");
        }
        this._observer = scene.onAfterRenderObservable.add(() => this._update());
    }
    _update() {
        const camera = this._scene.activeCamera;
        const engine = this._scene.getEngine();
        if (!camera) {
            return;
        }
        const boundingBox = this._mesh.getBoundingInfo().boundingBox;
        const world = this._mesh.getWorldMatrix();
        const extend = boundingBox.extendSize;
        this._center.copyFrom(boundingBox.centerWorld);
        // World-space half-axis directions of the mesh face.
        Vector3.TransformNormalFromFloatsToRef(extend.x, 0, 0, world, this._xAxis);
        Vector3.TransformNormalFromFloatsToRef(0, extend.y, 0, world, this._yAxis);
        const transform = this._scene.getTransformMatrix();
        camera.viewport.toGlobalToRef(engine.getRenderWidth(), engine.getRenderHeight(), this._viewport);
        Vector3.ProjectToRef(this._center, Matrix.IdentityReadOnly, transform, this._viewport, this._projectedCenter);
        this._center.addToRef(this._xAxis, this._corner);
        Vector3.ProjectToRef(this._corner, Matrix.IdentityReadOnly, transform, this._viewport, this._projectedX);
        this._center.addToRef(this._yAxis, this._corner);
        Vector3.ProjectToRef(this._corner, Matrix.IdentityReadOnly, transform, this._viewport, this._projectedY);
        // Hide the overlay when the face is behind the camera.
        if (this._projectedCenter.z < 0 || this._projectedCenter.z > 1) {
            this._setTransform("translate(-99999px, -99999px)");
            return;
        }
        const dpr = engine.getHardwareScalingLevel();
        const centerX = this._projectedCenter.x * dpr;
        const centerY = this._projectedCenter.y * dpr;
        const halfWidth = Math.hypot(this._projectedX.x - this._projectedCenter.x, this._projectedX.y - this._projectedCenter.y) * dpr;
        const halfHeight = Math.hypot(this._projectedY.x - this._projectedCenter.x, this._projectedY.y - this._projectedCenter.y) * dpr;
        const rotation = Math.atan2(this._projectedX.y - this._projectedCenter.y, this._projectedX.x - this._projectedCenter.x);
        const elementWidth = this._element.offsetWidth || 1;
        const elementHeight = this._element.offsetHeight || 1;
        const scaleX = (2 * halfWidth) / elementWidth;
        const scaleY = (2 * halfHeight) / elementHeight;
        this._setTransform(ComputeOverlayCssTransform(centerX, centerY, scaleX, scaleY, rotation, elementWidth, elementHeight));
    }
    _setTransform(transform) {
        if (transform === this._previousTransform) {
            return;
        }
        this._previousTransform = transform;
        this._element.style.transform = transform;
    }
    /**
     * Detaches the manager and stops updating the overlay.
     */
    dispose() {
        if (this._restoreInertOnDispose) {
            this._element.setAttribute("inert", "");
            this._restoreInertOnDispose = false;
        }
        if (this._observer) {
            this._scene.onAfterRenderObservable.remove(this._observer);
            this._observer = null;
        }
    }
}
//# sourceMappingURL=htmlInteractionManager.js.map