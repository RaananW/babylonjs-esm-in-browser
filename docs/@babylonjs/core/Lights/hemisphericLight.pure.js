/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { serializeAsColor3, serializeAsVector3 } from "../Misc/decorators.js";
import { Matrix, Vector3 } from "../Maths/math.vector.pure.js";
import { Color3 } from "../Maths/math.color.pure.js";
import { Light } from "./light.js";
import { Node } from "../node.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * The HemisphericLight simulates the ambient environment light,
 * so the passed direction is the light reflection direction, not the incoming direction.
 */
let HemisphericLight = (() => {
    var _a;
    let _classSuper = Light;
    let _groundColor_decorators;
    let _groundColor_initializers = [];
    let _groundColor_extraInitializers = [];
    let _direction_decorators;
    let _direction_initializers = [];
    let _direction_extraInitializers = [];
    return _a = class HemisphericLight extends _classSuper {
            /**
             * Creates a HemisphericLight object in the scene according to the passed direction (Vector3).
             * The HemisphericLight simulates the ambient environment light, so the passed direction is the light reflection direction, not the incoming direction.
             * The HemisphericLight can't cast shadows.
             * Documentation : https://doc.babylonjs.com/features/featuresDeepDive/lights/lights_introduction
             * @param name The friendly name of the light
             * @param direction The direction of the light reflection
             * @param scene The scene the light belongs to
             * @param dontAddToScene True to not add the light to the scene
             */
            constructor(name, direction, scene, dontAddToScene) {
                super(name, scene, dontAddToScene);
                /**
                 * The groundColor is the light in the opposite direction to the one specified during creation.
                 * You can think of the diffuse and specular light as coming from the centre of the object in the given direction and the groundColor light in the opposite direction.
                 */
                this.groundColor = __runInitializers(this, _groundColor_initializers, new Color3(0.0, 0.0, 0.0));
                /**
                 * The light reflection direction, not the incoming direction.
                 */
                this.direction = (__runInitializers(this, _groundColor_extraInitializers), __runInitializers(this, _direction_initializers, void 0));
                __runInitializers(this, _direction_extraInitializers);
                this.direction = direction || Vector3.Up();
            }
            _buildUniformLayout() {
                this._uniformBuffer.addUniform("vLightData", 4);
                this._uniformBuffer.addUniform("vLightDiffuse", 4);
                this._uniformBuffer.addUniform("vLightSpecular", 4);
                this._uniformBuffer.addUniform("vLightGround", 3);
                this._uniformBuffer.addUniform("shadowsInfo", 3);
                this._uniformBuffer.addUniform("depthValues", 2);
                this._uniformBuffer.create();
            }
            /**
             * Returns the string "HemisphericLight".
             * @returns The class name
             */
            getClassName() {
                return "HemisphericLight";
            }
            /**
             * Sets the HemisphericLight direction towards the passed target (Vector3).
             * Returns the updated direction.
             * @param target The target the direction should point to
             * @returns The computed direction
             */
            setDirectionToTarget(target) {
                this.direction = Vector3.Normalize(target.subtract(Vector3.Zero()));
                return this.direction;
            }
            /**
             * Returns the shadow generator associated to the light.
             * @returns Always null for hemispheric lights because it does not support shadows.
             */
            getShadowGenerator() {
                return null;
            }
            /**
             * Sets the passed Effect object with the HemisphericLight normalized direction and color and the passed name (string).
             * @param _effect The effect to update
             * @param lightIndex The index of the light in the effect to update
             * @returns The hemispheric light
             */
            transferToEffect(_effect, lightIndex) {
                const normalizeDirection = Vector3.Normalize(this.direction);
                this._uniformBuffer.updateFloat4("vLightData", normalizeDirection.x, normalizeDirection.y, normalizeDirection.z, 0.0, lightIndex);
                this._uniformBuffer.updateColor3("vLightGround", this.groundColor.scale(this.intensity), lightIndex);
                return this;
            }
            transferToNodeMaterialEffect(effect, lightDataUniformName) {
                const normalizeDirection = Vector3.Normalize(this.direction);
                effect.setFloat3(lightDataUniformName, normalizeDirection.x, normalizeDirection.y, normalizeDirection.z);
                return this;
            }
            /**
             * Computes the world matrix of the node
             * @returns the world matrix
             */
            computeWorldMatrix() {
                if (!this._worldMatrix) {
                    this._worldMatrix = Matrix.Identity();
                }
                return this._worldMatrix;
            }
            /**
             * Returns the integer 3.
             * @returns The light Type id as a constant defines in Light.LIGHTTYPEID_x
             */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            getTypeID() {
                return Light.LIGHTTYPEID_HEMISPHERICLIGHT;
            }
            /**
             * Prepares the list of defines specific to the light type.
             * @param defines the list of defines
             * @param lightIndex defines the index of the light for the effect
             */
            prepareLightSpecificDefines(defines, lightIndex) {
                defines["HEMILIGHT" + lightIndex] = true;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _groundColor_decorators = [serializeAsColor3()];
            _direction_decorators = [serializeAsVector3()];
            __esDecorate(null, null, _groundColor_decorators, { kind: "field", name: "groundColor", static: false, private: false, access: { has: obj => "groundColor" in obj, get: obj => obj.groundColor, set: (obj, value) => { obj.groundColor = value; } }, metadata: _metadata }, _groundColor_initializers, _groundColor_extraInitializers);
            __esDecorate(null, null, _direction_decorators, { kind: "field", name: "direction", static: false, private: false, access: { has: obj => "direction" in obj, get: obj => obj.direction, set: (obj, value) => { obj.direction = value; } }, metadata: _metadata }, _direction_initializers, _direction_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { HemisphericLight };
let _Registered = false;
/**
 * Register side effects for hemisphericLight.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterHemisphericLight() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Node.AddNodeConstructor("Light_Type_3", (name, scene) => {
        return () => new HemisphericLight(name, Vector3.Zero(), scene);
    });
    // Register Class Name
    RegisterClass("BABYLON.HemisphericLight", HemisphericLight);
}
//# sourceMappingURL=hemisphericLight.pure.js.map