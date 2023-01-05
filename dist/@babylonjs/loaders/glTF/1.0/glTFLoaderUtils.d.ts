import type { IGLTFTechniqueParameter, IGLTFAccessor, IGLTFRuntime, IGLTFBufferView } from "./glTFLoaderInterfaces";
import { ETextureFilterType, EComponentType } from "./glTFLoaderInterfaces";
import { Effect } from "@babylonjs/core/Materials/effect.js";
import { ShaderMaterial } from "@babylonjs/core/Materials/shaderMaterial.js";
import type { Node } from "@babylonjs/core/node.js";
import type { Scene } from "@babylonjs/core/scene.js";
/**
 * Utils functions for GLTF
 * @internal
 * @deprecated
 */
export declare class GLTFUtils {
    /**
     * Sets the given "parameter" matrix
     * @param scene the Scene object
     * @param source the source node where to pick the matrix
     * @param parameter the GLTF technique parameter
     * @param uniformName the name of the shader's uniform
     * @param shaderMaterial the shader material
     */
    static SetMatrix(scene: Scene, source: Node, parameter: IGLTFTechniqueParameter, uniformName: string, shaderMaterial: ShaderMaterial | Effect): void;
    /**
     * Sets the given "parameter" matrix
     * @param shaderMaterial the shader material
     * @param uniform the name of the shader's uniform
     * @param value the value of the uniform
     * @param type the uniform's type (EParameterType FLOAT, VEC2, VEC3 or VEC4)
     */
    static SetUniform(shaderMaterial: ShaderMaterial | Effect, uniform: string, value: any, type: number): boolean;
    /**
     * Returns the wrap mode of the texture
     * @param mode the mode value
     */
    static GetWrapMode(mode: number): number;
    /**
     * Returns the byte stride giving an accessor
     * @param accessor the GLTF accessor objet
     */
    static GetByteStrideFromType(accessor: IGLTFAccessor): number;
    /**
     * Returns the texture filter mode giving a mode value
     * @param mode the filter mode value
     */
    static GetTextureFilterMode(mode: number): ETextureFilterType;
    static GetBufferFromBufferView(gltfRuntime: IGLTFRuntime, bufferView: IGLTFBufferView, byteOffset: number, byteLength: number, componentType: EComponentType): ArrayBufferView;
    /**
     * Returns a buffer from its accessor
     * @param gltfRuntime the GLTF runtime
     * @param accessor the GLTF accessor
     */
    static GetBufferFromAccessor(gltfRuntime: IGLTFRuntime, accessor: IGLTFAccessor): any;
    /**
     * Decodes a buffer view into a string
     * @param view the buffer view
     */
    static DecodeBufferToText(view: ArrayBufferView): string;
    /**
     * Returns the default material of gltf. Related to
     * https://github.com/KhronosGroup/glTF/tree/master/specification/1.0#appendix-a-default-material
     * @param scene the Babylon.js scene
     */
    static GetDefaultMaterial(scene: Scene): ShaderMaterial;
    private static _DefaultMaterial;
}
