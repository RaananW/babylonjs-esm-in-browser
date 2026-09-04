import { type BoundingBoxRenderer } from "./boundingBoxRenderer.pure.js";
declare module "../scene.pure.js" {
    interface Scene {
        /** @internal (Backing field) */
        _boundingBoxRenderer: BoundingBoxRenderer;
        /** @internal (Backing field) */
        _forceShowBoundingBoxes: boolean;
        /**
         * Gets or sets a boolean indicating if all bounding boxes must be rendered
         */
        forceShowBoundingBoxes: boolean;
        /**
         * Gets the bounding box renderer associated with the scene
         * @returns a BoundingBoxRenderer
         */
        getBoundingBoxRenderer(): BoundingBoxRenderer;
    }
}
declare module "../Meshes/abstractMesh.pure.js" {
    interface AbstractMesh {
        /** @internal (Backing field) */
        _showBoundingBox: boolean;
        /**
         * Gets or sets a boolean indicating if the bounding box must be rendered as well (false by default)
         */
        showBoundingBox: boolean;
    }
}
