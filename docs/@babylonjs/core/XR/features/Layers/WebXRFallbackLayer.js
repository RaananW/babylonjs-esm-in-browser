import { StandardMaterial } from "../../../Materials/standardMaterial.pure.js";
import { Quaternion, Vector3 } from "../../../Maths/math.vector.pure.js";
import { Color3 } from "../../../Maths/math.color.pure.js";
import { Mesh } from "../../../Meshes/mesh.pure.js";
import { CreateBox } from "../../../Meshes/Builders/boxBuilder.pure.js";
import { CreateCylinder } from "../../../Meshes/Builders/cylinderBuilder.pure.js";
import { CreatePlane } from "../../../Meshes/Builders/planeBuilder.pure.js";
import { CreateSphere } from "../../../Meshes/Builders/sphereBuilder.pure.js";

/**
 * Wraps a mesh used when a requested native WebXR composition layer is unavailable.
 */
export class WebXRFallbackLayerWrapper {
    constructor(scene, 
    /**
     * The requested WebXR composition layer type.
     */
    layerType, 
    /**
     * The texture displayed by the fallback mesh.
     */
    texture, 
    /**
     * The Babylon node whose world position and rotation control the fallback mesh.
     */
    transformNode, _ownsTransformNode, ownsTexture, dimensions, worldScalingFactor) {
        this.layerType = layerType;
        this.transformNode = transformNode;
        this._ownsTransformNode = _ownsTransformNode;
        this._currentPosition = new Vector3();
        this._currentRotation = new Quaternion();
        this._meshRotationOffset = new Quaternion();
        /**
         * The native layer is always `null` for a fallback wrapper.
         */
        this.layer = null;
        /**
         * Whether this wrapper is backed by a native WebXR composition layer.
         */
        this.isNative = false;
        if (layerType === "XRCubeLayer") {
            const clonedTexture = texture.clone();
            if (clonedTexture) {
                texture = clonedTexture;
                texture.coordinatesMode = 5;
                ownsTexture = true;
            }
        }
        this.texture = texture;
        this._ownsTexture = ownsTexture;
        this.mesh = this._createMesh(scene, dimensions);
        this.mesh.isPickable = false;
        this.mesh.rotationQuaternion = new Quaternion();
        this._material = new StandardMaterial(`WebXR ${layerType} fallback material`, scene);
        this._material.disableLighting = true;
        this._material.emissiveColor = Color3.Black();
        this._material.backFaceCulling = layerType === "XRQuadLayer";
        if (layerType === "XRCubeLayer" && this.texture.isCube) {
            this._material.reflectionTexture = this.texture;
        }
        else {
            this._material.emissiveTexture = this.texture;
            this._material.opacityTexture = this.texture;
        }
        this.mesh.material = this._material;
        this.updateFromTransformNode(worldScalingFactor);
    }
    _createMesh(scene, dimensions) {
        switch (this.layerType) {
            case "XRQuadLayer":
                return CreatePlane(`WebXR ${this.layerType} fallback`, {
                    width: dimensions.width ?? 1,
                    height: dimensions.height ?? 1,
                }, scene);
            case "XRCylinderLayer": {
                const radius = dimensions.radius ?? 2;
                const centralAngle = dimensions.centralAngle ?? Math.PI / 4;
                const aspectRatio = dimensions.aspectRatio ?? 2;
                Quaternion.RotationAxisToRef(Vector3.UpReadOnly, (Math.PI - centralAngle) / 2, this._meshRotationOffset);
                return CreateCylinder(`WebXR ${this.layerType} fallback`, {
                    diameter: radius * 2,
                    height: (radius * centralAngle) / aspectRatio,
                    arc: centralAngle / (Math.PI * 2),
                    cap: Mesh.NO_CAP,
                    sideOrientation: Mesh.BACKSIDE,
                }, scene);
            }
            case "XREquirectLayer": {
                const radius = dimensions.radius && Number.isFinite(dimensions.radius) ? dimensions.radius : 1000;
                const centralHorizontalAngle = dimensions.centralHorizontalAngle ?? Math.PI * 2;
                const upperVerticalAngle = dimensions.upperVerticalAngle ?? Math.PI / 2;
                const lowerVerticalAngle = dimensions.lowerVerticalAngle ?? -Math.PI / 2;
                Quaternion.RotationYawPitchRollToRef((Math.PI - centralHorizontalAngle) / 2, upperVerticalAngle - Math.PI / 2, 0, this._meshRotationOffset);
                return CreateSphere(`WebXR ${this.layerType} fallback`, {
                    diameter: radius * 2,
                    arc: centralHorizontalAngle / (Math.PI * 2),
                    slice: (upperVerticalAngle - lowerVerticalAngle) / Math.PI,
                    sideOrientation: Mesh.BACKSIDE,
                }, scene);
            }
            case "XRCubeLayer":
                return CreateBox(`WebXR ${this.layerType} fallback`, {
                    size: 1000,
                    sideOrientation: Mesh.BACKSIDE,
                }, scene);
        }
    }
    /**
     * Copies the transform node's world position and rotation to the fallback mesh without applying the node's scaling.
     * @param worldScalingFactor the number of Babylon scene units represented by one meter
     */
    updateFromTransformNode(worldScalingFactor = 1) {
        this.transformNode.computeWorldMatrix(true).decompose(undefined, this._currentRotation, this._currentPosition);
        if (this.layerType === "XRCubeLayer") {
            this.mesh.position.setAll(0);
        }
        else {
            this.mesh.position.copyFrom(this._currentPosition);
        }
        this._currentRotation.multiplyToRef(this._meshRotationOffset, this.mesh.rotationQuaternion);
        this.mesh.scaling.setAll(worldScalingFactor);
    }
    /**
     * Disposes the fallback mesh, material, and any resources owned by this wrapper.
     */
    dispose() {
        this.mesh.dispose(false, false);
        this._material.dispose();
        if (this._ownsTexture) {
            this.texture.dispose();
        }
        if (this._ownsTransformNode) {
            this.transformNode.dispose();
        }
    }
}
//# sourceMappingURL=WebXRFallbackLayer.js.map