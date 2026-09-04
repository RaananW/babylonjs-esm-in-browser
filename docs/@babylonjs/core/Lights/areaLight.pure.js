/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { serializeAsVector3 } from "../Misc/decorators.js";
import { RawTexture } from "../Materials/Textures/rawTexture.js";
import { Texture } from "../Materials/Textures/texture.pure.js";

import { Light } from "./light.js";
import { DecodeLTCTextureDataAsync } from "./LTC/ltcTextureTool.js";
import { Logger } from "../Misc/logger.js";
function CreateSceneLTCTextures(scene) {
    const useDelayedTextureLoading = scene.useDelayedTextureLoading;
    scene.useDelayedTextureLoading = false;
    const previousState = scene._blockEntityCollection;
    scene._blockEntityCollection = false;
    scene._ltcTextures = {
        LTC1: RawTexture.CreateRGBATexture(null, 64, 64, scene.getEngine(), false, false, 2, 2, 0, false, true),
        LTC2: RawTexture.CreateRGBATexture(null, 64, 64, scene.getEngine(), false, false, 2, 2, 0, false, true),
    };
    scene._blockEntityCollection = previousState;
    scene._ltcTextures.LTC1.wrapU = Texture.CLAMP_ADDRESSMODE;
    scene._ltcTextures.LTC1.wrapV = Texture.CLAMP_ADDRESSMODE;
    scene._ltcTextures.LTC2.wrapU = Texture.CLAMP_ADDRESSMODE;
    scene._ltcTextures.LTC2.wrapV = Texture.CLAMP_ADDRESSMODE;
    scene.useDelayedTextureLoading = useDelayedTextureLoading;
    DecodeLTCTextureDataAsync()
        // eslint-disable-next-line github/no-then
        .then((textureData) => {
        if (scene._ltcTextures) {
            const ltc1 = scene._ltcTextures?.LTC1;
            ltc1.update(textureData[0]);
            const ltc2 = scene._ltcTextures?.LTC2;
            ltc2.update(textureData[1]);
            scene.onDisposeObservable.addOnce(() => {
                scene._ltcTextures?.LTC1.dispose();
                scene._ltcTextures?.LTC2.dispose();
            });
        }
    })
        // eslint-disable-next-line github/no-then
        .catch((error) => {
        Logger.Error(`Area Light fail to get LTC textures data. Error: ${error}`);
    });
}
/**
 * Abstract Area Light class that servers as parent for all Area Lights implementations.
 * The light is emitted from the area in the -Z direction.
 */
let AreaLight = (() => {
    var _a;
    let _classSuper = Light;
    let _position_decorators;
    let _position_initializers = [];
    let _position_extraInitializers = [];
    return _a = class AreaLight extends _classSuper {
            /**
             * Creates a area light object.
             * Documentation : https://doc.babylonjs.com/features/featuresDeepDive/lights/lights_introduction
             * @param name The friendly name of the light
             * @param position The position of the area light.
             * @param scene The scene the light belongs to
             * @param dontAddToScene True to not add the light to the scene
             */
            constructor(name, position, scene, dontAddToScene) {
                super(name, scene, dontAddToScene);
                /**
                 * Area Light position.
                 */
                this.position = __runInitializers(this, _position_initializers, void 0);
                __runInitializers(this, _position_extraInitializers);
                this.position = position;
                if (!this._scene._ltcTextures) {
                    CreateSceneLTCTextures(this._scene);
                }
            }
            transferTexturesToEffect(effect, lightIndex) {
                if (this._scene._ltcTextures) {
                    effect.setTexture("areaLightsLTC1Sampler", this._scene._ltcTextures.LTC1);
                    effect.setTexture("areaLightsLTC2Sampler", this._scene._ltcTextures.LTC2);
                }
                return this;
            }
            /**
             * Prepares the list of defines specific to the light type.
             * @param defines the list of defines
             * @param lightIndex defines the index of the light for the effect
             */
            prepareLightSpecificDefines(defines, lightIndex) {
                defines["AREALIGHT" + lightIndex] = true;
                defines["AREALIGHTUSED"] = true;
            }
            _isReady() {
                if (this._scene._ltcTextures) {
                    return this._scene._ltcTextures.LTC1.isReady() && this._scene._ltcTextures.LTC2.isReady();
                }
                return false;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _position_decorators = [serializeAsVector3()];
            __esDecorate(null, null, _position_decorators, { kind: "field", name: "position", static: false, private: false, access: { has: obj => "position" in obj, get: obj => obj.position, set: (obj, value) => { obj.position = value; } }, metadata: _metadata }, _position_initializers, _position_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { AreaLight };
//# sourceMappingURL=areaLight.pure.js.map