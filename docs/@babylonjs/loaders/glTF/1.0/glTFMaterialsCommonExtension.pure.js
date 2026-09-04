import { GLTFLoaderExtension, GLTFLoaderBase, GLTFLoader } from "./glTFLoader.pure.js";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.pure.js";
import { Color3 } from "@babylonjs/core/Maths/math.color.pure.js";
import { Tools } from "@babylonjs/core/Misc/tools.pure.js";
import { Material } from "@babylonjs/core/Materials/material.pure.js";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial.pure.js";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight.pure.js";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight.pure.js";
import { PointLight } from "@babylonjs/core/Lights/pointLight.pure.js";
import { SpotLight } from "@babylonjs/core/Lights/spotLight.pure.js";
/**
 * @internal
 * @deprecated
 */
export class GLTFMaterialsCommonExtension extends GLTFLoaderExtension {
    constructor() {
        super("KHR_materials_common");
    }
    // eslint-disable-next-line no-restricted-syntax
    loadRuntimeExtensionsAsync(gltfRuntime) {
        if (!gltfRuntime.extensions) {
            return false;
        }
        const extension = gltfRuntime.extensions[this.name];
        if (!extension) {
            return false;
        }
        // Create lights
        const lights = extension.lights;
        if (lights) {
            for (const thing in lights) {
                const light = lights[thing];
                switch (light.type) {
                    case "ambient": {
                        const ambientLight = new HemisphericLight(light.name, new Vector3(0, 1, 0), gltfRuntime.scene);
                        const ambient = light.ambient;
                        if (ambient) {
                            ambientLight.diffuse = Color3.FromArray(ambient.color || [1, 1, 1]);
                        }
                        break;
                    }
                    case "point": {
                        const pointLight = new PointLight(light.name, new Vector3(10, 10, 10), gltfRuntime.scene);
                        const point = light.point;
                        if (point) {
                            pointLight.diffuse = Color3.FromArray(point.color || [1, 1, 1]);
                        }
                        break;
                    }
                    case "directional": {
                        const dirLight = new DirectionalLight(light.name, new Vector3(0, -1, 0), gltfRuntime.scene);
                        const directional = light.directional;
                        if (directional) {
                            dirLight.diffuse = Color3.FromArray(directional.color || [1, 1, 1]);
                        }
                        break;
                    }
                    case "spot": {
                        const spot = light.spot;
                        if (spot) {
                            const spotLight = new SpotLight(light.name, new Vector3(0, 10, 0), new Vector3(0, -1, 0), spot.fallOffAngle || Math.PI, spot.fallOffExponent || 0.0, gltfRuntime.scene);
                            spotLight.diffuse = Color3.FromArray(spot.color || [1, 1, 1]);
                        }
                        break;
                    }
                    default:
                        Tools.Warn('GLTF Material Common extension: light type "' + light.type + "” not supported");
                        break;
                }
            }
        }
        return false;
    }
    // eslint-disable-next-line no-restricted-syntax
    loadMaterialAsync(gltfRuntime, id, onSuccess, onError) {
        const material = gltfRuntime.materials[id];
        if (!material || !material.extensions) {
            return false;
        }
        const extension = material.extensions[this.name];
        if (!extension) {
            return false;
        }
        const standardMaterial = new StandardMaterial(id, gltfRuntime.scene);
        standardMaterial.sideOrientation = Material.CounterClockWiseSideOrientation;
        if (extension.technique === "CONSTANT") {
            standardMaterial.disableLighting = true;
        }
        standardMaterial.backFaceCulling = extension.doubleSided === undefined ? false : !extension.doubleSided;
        standardMaterial.alpha = extension.values.transparency === undefined ? 1.0 : extension.values.transparency;
        standardMaterial.specularPower = extension.values.shininess === undefined ? 0.0 : extension.values.shininess;
        // Ambient
        if (typeof extension.values.ambient === "string") {
            this._loadTexture(gltfRuntime, extension.values.ambient, standardMaterial, "ambientTexture", onError);
        }
        else {
            standardMaterial.ambientColor = Color3.FromArray(extension.values.ambient || [0, 0, 0]);
        }
        // Diffuse
        if (typeof extension.values.diffuse === "string") {
            this._loadTexture(gltfRuntime, extension.values.diffuse, standardMaterial, "diffuseTexture", onError);
        }
        else {
            standardMaterial.diffuseColor = Color3.FromArray(extension.values.diffuse || [0, 0, 0]);
        }
        // Emission
        if (typeof extension.values.emission === "string") {
            this._loadTexture(gltfRuntime, extension.values.emission, standardMaterial, "emissiveTexture", onError);
        }
        else {
            standardMaterial.emissiveColor = Color3.FromArray(extension.values.emission || [0, 0, 0]);
        }
        // Specular
        if (typeof extension.values.specular === "string") {
            this._loadTexture(gltfRuntime, extension.values.specular, standardMaterial, "specularTexture", onError);
        }
        else {
            standardMaterial.specularColor = Color3.FromArray(extension.values.specular || [0, 0, 0]);
        }
        return true;
    }
    _loadTexture(gltfRuntime, id, material, propertyPath, onError) {
        // Create buffer from texture url
        GLTFLoaderBase.LoadTextureBufferAsync(gltfRuntime, id, (buffer) => {
            // Create texture from buffer
            GLTFLoaderBase.CreateTextureAsync(gltfRuntime, id, buffer, (texture) => (material[propertyPath] = texture));
        }, onError);
    }
}
let _Registered = false;
/**
 * Registers the KHR_materials_common extension.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterGLTFMaterialsCommonExtension() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    GLTFLoader.RegisterExtension(new GLTFMaterialsCommonExtension());
}
//# sourceMappingURL=glTFMaterialsCommonExtension.pure.js.map