/** This file must only contain pure code and pure imports */
import { Scene } from "../scene.pure.js";
import { SceneComponentConstants } from "../sceneComponent.js";
/**
 * Defines the IBL CDF Generator scene component responsible for generating CDF maps for a given IBL.
 */
export class IblCdfGeneratorSceneComponent {
    /**
     * Creates a new instance of the component for the given scene
     * @param scene Defines the scene to register the component in
     */
    constructor(scene) {
        /**
         * The component name helpful to identify the component in the list of scene components.
         */
        this.name = SceneComponentConstants.NAME_IBLCDFGENERATOR;
        this._newIblObserver = null;
        this.scene = scene;
    }
    /**
     * Registers the component in a given scene
     */
    register() {
        this._updateIblSource();
        this._newIblObserver = this.scene.onEnvironmentTextureChangedObservable.add(this._updateIblSource.bind(this));
        this.scene.addIsReadyCheck(this);
    }
    /**
     * Rebuilds the elements related to this component in case of
     * context lost for instance.
     */
    rebuild() {
        // Nothing to do for this component
    }
    /**
     * Disposes the component and the associated resources
     */
    dispose() {
        this.scene.onEnvironmentTextureChangedObservable.remove(this._newIblObserver);
        this.scene.removeIsReadyCheck(this);
    }
    /**
     * @returns true once the CDF generator's procedural textures and effects are ready.
     * Used by `Scene.isReady` so that `executeWhenReady` waits for the CDF maps to be
     * generated before declaring the scene ready to render.
     */
    isReady() {
        const generator = this.scene._iblCdfGenerator;
        // If there's no generator, or no environment texture for it to consume,
        // there's nothing to wait for - report ready so Scene.isReady() doesn't stall.
        if (!generator || !this.scene.environmentTexture) {
            return true;
        }
        return !!generator.isReady();
    }
    _updateIblSource() {
        if (this.scene.iblCdfGenerator && this.scene.environmentTexture) {
            this.scene.iblCdfGenerator.iblSource = this.scene.environmentTexture;
        }
    }
}
let _Registered = false;
/**
 * Register side effects for iblCdfGeneratorSceneComponent.
 * Safe to call multiple times; only the first call has an effect.
 * @param iblCdfGeneratorClass The IblCdfGenerator class to register the component for
 */
export function RegisterIblCdfGeneratorSceneComponent(iblCdfGeneratorClass) {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Object.defineProperty(Scene.prototype, "iblCdfGenerator", {
        get: function () {
            return this._iblCdfGenerator;
        },
        set: function (value) {
            if (value) {
                this._iblCdfGenerator = value;
            }
        },
        enumerable: true,
        configurable: true,
    });
    Scene.prototype.enableIblCdfGenerator = function () {
        if (this._iblCdfGenerator) {
            return this._iblCdfGenerator;
        }
        this._iblCdfGenerator = new iblCdfGeneratorClass(this);
        if (!this._iblCdfGenerator.isSupported) {
            this._iblCdfGenerator = null;
            return null;
        }
        if (this.environmentTexture) {
            this._iblCdfGenerator.iblSource = this.environmentTexture;
        }
        return this._iblCdfGenerator;
    };
    Scene.prototype.disableIblCdfGenerator = function () {
        if (!this._iblCdfGenerator) {
            return;
        }
        this._iblCdfGenerator.dispose();
        this._iblCdfGenerator = null;
    };
    iblCdfGeneratorClass._SceneComponentInitialization = (scene) => {
        // Register the CDF generator component to the scene.
        let component = scene._getComponent(SceneComponentConstants.NAME_IBLCDFGENERATOR);
        if (!component) {
            component = new IblCdfGeneratorSceneComponent(scene);
            scene._addComponent(component);
        }
    };
}
//# sourceMappingURL=iblCdfGeneratorSceneComponent.pure.js.map