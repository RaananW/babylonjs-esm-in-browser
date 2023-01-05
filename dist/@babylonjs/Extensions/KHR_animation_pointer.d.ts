import type { IGLTFLoaderExtension } from "../glTFLoaderExtension";
import { GLTFLoader } from "../glTFLoader";
import type { Nullable } from "@babylonjs/core/types.js";
import type { Animation } from "@babylonjs/core/Animations/animation.js";
import type { IAnimatable } from "@babylonjs/core/Animations/animatable.interface.js";
import type { IAnimation, IAnimationChannel } from "../glTFLoaderInterfaces";
/**
 * [Specification PR](https://github.com/KhronosGroup/glTF/pull/2147)
 * !!! Experimental Extension Subject to Changes !!!
 */
export declare class KHR_animation_pointer implements IGLTFLoaderExtension {
    /**
     * The name of this extension.
     */
    readonly name = "KHR_animation_pointer";
    private _loader;
    /**
     * @internal
     */
    constructor(loader: GLTFLoader);
    /**
     * Defines whether this extension is enabled.
     */
    get enabled(): boolean;
    /** @internal */
    dispose(): void;
    /**
     * Loads a glTF animation channel.
     * @param context The context when loading the asset
     * @param animationContext The context of the animation when loading the asset
     * @param animation The glTF animation property
     * @param channel The glTF animation channel property
     * @param onLoad Called for each animation loaded
     * @returns A void promise that resolves when the load is complete or null if not handled
     */
    _loadAnimationChannelAsync(context: string, animationContext: string, animation: IAnimation, channel: IAnimationChannel, onLoad: (babylonAnimatable: IAnimatable, babylonAnimation: Animation) => void): Nullable<Promise<void>>;
    /**
     * The pointer string is represented by a [JSON pointer](https://datatracker.ietf.org/doc/html/rfc6901).
     * <animationPointer> := /<rootNode>/<assetIndex>/<propertyPath>
     * <rootNode> := "nodes" | "materials" | "meshes" | "cameras" | "extensions"
     * <assetIndex> := <digit> | <name>
     * <propertyPath> := <extensionPath> | <standardPath>
     * <extensionPath> := "extensions"/<name>/<standardPath>
     * <standardPath> := <name> | <name>/<standardPath>
     * <name> := W+
     * <digit> := D+
     *
     * Examples:
     *  - "/nodes/0/rotation"
     *  - "/materials/2/emissiveFactor"
     *  - "/materials/2/pbrMetallicRoughness/baseColorFactor"
     *  - "/materials/2/extensions/KHR_materials_emissive_strength/emissiveStrength"
     */
    private _parseAnimationPointer;
}
