import { type Nullable } from "../types.js";
import { type MeshUVSpaceRenderer } from "./meshUVSpaceRenderer.js";
declare module "./abstractMesh.pure.js" {
    /** @internal */
    interface AbstractMesh {
        /** @internal */
        _decalMap: Nullable<MeshUVSpaceRenderer>;
        /**
         * Gets or sets the decal map for this mesh
         */
        decalMap: Nullable<MeshUVSpaceRenderer>;
    }
}
