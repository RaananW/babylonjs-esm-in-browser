import { type Nullable } from "../types.js";
import { Mesh } from "../Meshes/mesh.pure.js";
import { type IGizmo, Gizmo } from "./gizmo.js";
import { UtilityLayerRenderer } from "../Rendering/utilityLayerRenderer.js";
import { StandardMaterial } from "../Materials/standardMaterial.pure.js";
import { type PointerInfo } from "../Events/pointerEvents.js";
import { type Observer, Observable } from "../Misc/observable.js";
import { type AbstractSoundSource } from "../AudioV2/abstractAudio/abstractSoundSource.js";
/**
 * Interface for a spatial audio gizmo.
 */
export interface ISpatialAudioGizmo extends IGizmo {
    /** Event that fires each time the gizmo is clicked. */
    onClickedObservable: Observable<AbstractSoundSource>;
    /** The sound source the gizmo is attached to. */
    soundSource: Nullable<AbstractSoundSource>;
    /** The material used to render the gizmo. */
    readonly material: StandardMaterial;
}
/**
 * Gizmo that visualizes the position and orientation of a v2 spatial sound source.
 */
export declare class SpatialAudioGizmo extends Gizmo implements ISpatialAudioGizmo {
    private static readonly _Scale;
    protected _soundSource: Nullable<AbstractSoundSource>;
    protected _audioMesh: Mesh;
    protected _material: StandardMaterial;
    protected _pointerObserver: Nullable<Observer<PointerInfo>>;
    /** Event that fires each time the gizmo is clicked. */
    readonly onClickedObservable: Observable<AbstractSoundSource>;
    /**
     * Creates a SpatialAudioGizmo.
     * @param gizmoLayer The utility layer the gizmo will be added to.
     */
    constructor(gizmoLayer?: UtilityLayerRenderer);
    /**
     * The sound source the gizmo is attached to.
     */
    get soundSource(): Nullable<AbstractSoundSource>;
    set soundSource(soundSource: Nullable<AbstractSoundSource>);
    /**
     * Gets the material used to render the gizmo.
     */
    get material(): StandardMaterial;
    /**
     * @internal
     * Mirrors the attached mesh to the sound source's spatial position and rotation.
     */
    protected _update(): void;
    /**
     * Disposes of the gizmo.
     */
    dispose(): void;
    private static _CreateSpeakerMesh;
}
