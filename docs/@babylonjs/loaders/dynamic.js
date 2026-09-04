/* eslint-disable @typescript-eslint/naming-convention */
import { RegisterSceneLoaderPlugin } from "@babylonjs/core/Loading/sceneLoader.js";
import { BVHFileLoaderMetadata } from "./BVH/bvhFileLoader.metadata.js";
import { FBXFileLoaderMetadata } from "./FBX/fbxFileLoader.metadata.js";
import { GLTFFileLoaderMetadata } from "./glTF/glTFFileLoader.metadata.js";
import { OBJFileLoaderMetadata } from "./OBJ/objFileLoader.metadata.js";
import { SPLATFileLoaderMetadata } from "./SPLAT/splatFileLoader.metadata.js";
import { STLFileLoaderMetadata } from "./STL/stlFileLoader.metadata.js";
import { registerBuiltInGLTFExtensions } from "./glTF/2.0/Extensions/dynamic.js";
/**
 * Registers the async plugin factories for all built-in loaders.
 * Loaders will be dynamically imported on demand, only when a SceneLoader load operation needs each respective loader.
 */
export function registerBuiltInLoaders() {
    // Register the BVH loader.
    RegisterSceneLoaderPlugin({
        ...BVHFileLoaderMetadata,
        createPlugin: async (options) => {
            const { BVHFileLoader } = await import("./BVH/bvhFileLoader.pure.js");
            return new BVHFileLoader(options[BVHFileLoaderMetadata.name]);
        },
    });
    // Register the FBX loader.
    RegisterSceneLoaderPlugin({
        ...FBXFileLoaderMetadata,
        createPlugin: async (options) => {
            const { FBXFileLoader } = await import("./FBX/fbxFileLoader.pure.js");
            return new FBXFileLoader(options[FBXFileLoaderMetadata.name]);
        },
    });
    // Register the glTF loader (2.0) specifically/only.
    RegisterSceneLoaderPlugin({
        ...GLTFFileLoaderMetadata,
        createPlugin: async (options) => {
            const [{ GLTFFileLoader, RegisterGLTF2Loader }, { RegisterInstancedMesh }] = await Promise.all([
                import("./glTF/2.0/glTFLoader.pure.js"),
                import("@babylonjs/core/Meshes/instancedMesh.pure.js"),
            ]);
            RegisterInstancedMesh();
            RegisterGLTF2Loader();
            return new GLTFFileLoader(options[GLTFFileLoaderMetadata.name]);
        },
    });
    // Register the built-in glTF (2.0) extensions.
    registerBuiltInGLTFExtensions();
    // Register the OBJ loader.
    RegisterSceneLoaderPlugin({
        ...OBJFileLoaderMetadata,
        createPlugin: async (options) => {
            const { OBJFileLoader } = await import("./OBJ/objFileLoader.pure.js");
            return new OBJFileLoader(options[OBJFileLoaderMetadata.name]);
        },
    });
    // Register the SPLAT loader.
    RegisterSceneLoaderPlugin({
        ...SPLATFileLoaderMetadata,
        createPlugin: async (options) => {
            const [{ SPLATFileLoader }, { RegisterEnginesExtensionsEngineDynamicTexture }] = await Promise.all([
                import("./SPLAT/splatFileLoader.pure.js"),
                import("@babylonjs/core/Engines/Extensions/engine.dynamicTexture.pure.js"),
            ]);
            RegisterEnginesExtensionsEngineDynamicTexture();
            return new SPLATFileLoader(options[SPLATFileLoaderMetadata.name]);
        },
    });
    // Register the STL loader.
    RegisterSceneLoaderPlugin({
        ...STLFileLoaderMetadata,
        createPlugin: async () => {
            const [{ STLFileLoader }, { RegisterStandardMaterial }] = await Promise.all([import("./STL/stlFileLoader.pure.js"), import("@babylonjs/core/Materials/standardMaterial.pure.js")]);
            RegisterStandardMaterial();
            return new STLFileLoader();
        },
    });
}
//# sourceMappingURL=dynamic.js.map