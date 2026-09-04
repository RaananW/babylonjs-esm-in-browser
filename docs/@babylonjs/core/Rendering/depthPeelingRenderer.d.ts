import { type Scene } from "../scene.js";
import { type PrePassRenderer } from "./prePassRenderer.js";
import { ThinDepthPeelingRenderer } from "./thinDepthPeelingRenderer.pure.js";
/**
 * The depth peeling renderer that performs
 * Order independant transparency (OIT).
 * This should not be instanciated directly, as it is part of a scene component
 */
export declare class DepthPeelingRenderer extends ThinDepthPeelingRenderer {
    private _outputRT;
    private _prePassEffectConfiguration;
    private _blendBackTexture;
    /**
     * Instanciates the depth peeling renderer
     * @param scene Scene to attach to
     * @param passCount Number of depth layers to peel
     * @returns The depth peeling renderer
     */
    constructor(scene: Scene, passCount?: number);
    protected _createTextures(): void;
    protected _disposeTextures(): void;
    private _updateTextures;
    private _updateTextureReferences;
    /**
     * Links to the prepass renderer
     * @param prePassRenderer The scene PrePassRenderer
     */
    setPrePassRenderer(prePassRenderer: PrePassRenderer): void;
    protected _finalCompose(writeId: number): void;
    /**
     * Checks if the depth peeling renderer is ready to render transparent meshes
     * @returns true if the depth peeling renderer is ready to render the transparent meshes
     */
    isReady(): boolean;
    protected _beforeRender(): void;
    protected _afterRender(): void;
    protected _noTransparentMeshes(): void;
}
