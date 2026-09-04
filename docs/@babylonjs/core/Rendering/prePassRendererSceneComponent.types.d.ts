import { type PrePassRenderTarget } from "../Materials/Textures/prePassRenderTarget.js";
import { type Nullable } from "../types.js";
import { type PrePassRenderer } from "./prePassRenderer.js";
declare module "../scene.pure.js" {
    interface Scene {
        /** @internal (Backing field) */
        _prePassRenderer: Nullable<PrePassRenderer>;
        /**
         * Gets or Sets the current prepass renderer associated to the scene.
         */
        prePassRenderer: Nullable<PrePassRenderer>;
        /**
         * Enables the prepass and associates it with the scene
         * @returns the PrePassRenderer
         */
        enablePrePassRenderer(): Nullable<PrePassRenderer>;
        /**
         * Disables the prepass associated with the scene
         */
        disablePrePassRenderer(): void;
    }
}
declare module "../Materials/Textures/renderTargetTexture.pure.js" {
    interface RenderTargetTexture {
        /**
         * Gets or sets a boolean indicating that the prepass renderer should not be used with this render target
         */
        noPrePassRenderer: boolean;
        /** @internal */
        _prePassRenderTarget: Nullable<PrePassRenderTarget>;
    }
}
