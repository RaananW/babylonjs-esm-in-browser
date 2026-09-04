import { Vector3, Quaternion } from "@babylonjs/core/Maths/math.vector.pure.js";
import { Color3 } from "@babylonjs/core/Maths/math.color.pure.js";
import { Light } from "@babylonjs/core/Lights/light.js";
import { RectAreaLight } from "@babylonjs/core/Lights/rectAreaLight.pure.js";
import { TransformNode as BabylonTransformNode } from "@babylonjs/core/Meshes/transformNode.pure.js";
import { GLTFLoader, ArrayItem } from "../glTFLoader.pure.js";
import { registerGLTFExtension, unregisterGLTFExtension } from "../glTFLoaderExtensionRegistry.js";
const NAME = "EXT_lights_area";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Vendor/EXT_lights_area/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class EXT_lights_area {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME);
    }
    /** @internal */
    dispose() {
        this._loader = null;
        delete this._lights;
    }
    /** @internal */
    onLoading() {
        const extensions = this._loader.gltf.extensions;
        if (extensions && extensions[this.name]) {
            const extension = extensions[this.name];
            this._lights = extension.lights;
            ArrayItem.Assign(this._lights);
        }
    }
    /**
     * @internal
     */
    // eslint-disable-next-line no-restricted-syntax
    loadNodeAsync(context, node, assign) {
        return GLTFLoader.LoadExtensionAsync(context, node, this.name, async (extensionContext, extension) => {
            this._loader._allMaterialsDirtyRequired = true;
            return await this._loader.loadNodeAsync(context, node, (babylonMesh) => {
                let babylonLight;
                const light = ArrayItem.Get(extensionContext, this._lights, extension.light);
                const name = light.name || babylonMesh.name;
                this._loader.babylonScene._blockEntityCollection = !!this._loader._assetContainer;
                const size = light.size !== undefined ? light.size : 1.0;
                switch (light.type) {
                    case "rect" /* EXTLightsArea_LightType.RECT */: {
                        const width = light.rect?.aspect !== undefined ? light.rect.aspect * size : size;
                        const height = size;
                        const babylonRectAreaLight = new RectAreaLight(name, Vector3.Zero(), width, height, this._loader.babylonScene);
                        babylonLight = babylonRectAreaLight;
                        break;
                    }
                    case "disk" /* EXTLightsArea_LightType.DISK */: {
                        // For disk lights, we'll use a rectangle light with the same area to approximate the disk light
                        // In the future, this could be extended to support actual disk area lights
                        const newSize = Math.sqrt(size * size * 0.25 * Math.PI); // Area of the disk
                        const babylonRectAreaLight = new RectAreaLight(name, Vector3.Zero(), newSize, newSize, this._loader.babylonScene);
                        babylonLight = babylonRectAreaLight;
                        break;
                    }
                    default: {
                        this._loader.babylonScene._blockEntityCollection = false;
                        throw new Error(`${extensionContext}: Invalid area light type (${light.type})`);
                    }
                }
                babylonLight._parentContainer = this._loader._assetContainer;
                this._loader.babylonScene._blockEntityCollection = false;
                light._babylonLight = babylonLight;
                babylonLight.falloffType = Light.FALLOFF_GLTF;
                babylonLight.diffuse = light.color ? Color3.FromArray(light.color) : Color3.White();
                babylonLight.intensity = light.intensity == undefined ? 1 : light.intensity;
                // glTF EXT_lights_area specifies lights face down -Z, but Babylon.js area lights face down +Z
                // Create a parent transform node with 180-degree rotation around Y axis to flip the direction
                const lightParentNode = new BabylonTransformNode(`${name}_orientation`, this._loader.babylonScene);
                lightParentNode.rotationQuaternion = Quaternion.RotationAxis(Vector3.Up(), Math.PI);
                lightParentNode.parent = babylonMesh;
                babylonLight.parent = lightParentNode;
                this._loader._babylonLights.push(babylonLight);
                GLTFLoader.AddPointerMetadata(babylonLight, extensionContext);
                assign(babylonMesh);
            });
        });
    }
}
let _Registered = false;
/**
 * Registers the EXT_lights_area glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function RegisterEXT_lights_area() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    unregisterGLTFExtension(NAME);
    registerGLTFExtension(NAME, true, (loader) => new EXT_lights_area(loader));
}
//# sourceMappingURL=EXT_lights_area.pure.js.map