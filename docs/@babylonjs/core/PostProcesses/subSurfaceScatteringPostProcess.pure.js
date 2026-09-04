/** This file must only contain pure code and pure imports */
import { Texture } from "../Materials/Textures/texture.pure.js";
import { PostProcess } from "./postProcess.pure.js";

import { Logger } from "../Misc/logger.js";
/**
 * Sub surface scattering post process
 */
export class SubSurfaceScatteringPostProcess extends PostProcess {
    /**
     * Gets a string identifying the name of the class
     * @returns "SubSurfaceScatteringPostProcess" string
     */
    getClassName() {
        return "SubSurfaceScatteringPostProcess";
    }
    _gatherImports(useWebGPU, list) {
        if (useWebGPU) {
            this._webGPUReady = true;
            list.push(Promise.all([import("../ShadersWGSL/imageProcessing.fragment.js"), import("../ShadersWGSL/subSurfaceScattering.fragment.js")]));
        }
        else {
            list.push(Promise.all([import("../Shaders/imageProcessing.fragment.js"), import("../Shaders/subSurfaceScattering.fragment.js")]));
        }
        super._gatherImports(useWebGPU, list);
    }
    constructor(name, scene, options, camera = null, samplingMode, engine, reusable, textureType = 0) {
        const localOptions = {
            uniforms: ["texelSize", "viewportSize", "metersPerUnit"],
            samplers: ["diffusionS", "diffusionD", "filterRadii", "irradianceSampler", "depthSampler", "albedoSampler"],
            size: typeof options === "number" ? options : undefined,
            camera,
            samplingMode,
            engine,
            reusable,
            textureType,
            ...options,
            blockCompilation: true,
        };
        super(name, "subSurfaceScattering", { ...localOptions, samplingMode: samplingMode || Texture.BILINEAR_SAMPLINGMODE });
        this._scene = scene;
        this.updateEffect();
        this.onApplyObservable.add((effect) => {
            if (!scene.prePassRenderer || !scene.subSurfaceConfiguration) {
                Logger.Error("PrePass and subsurface configuration needs to be enabled for subsurface scattering.");
                return;
            }
            const texelSize = this.texelSize;
            effect.setFloat("metersPerUnit", scene.subSurfaceConfiguration.metersPerUnit);
            effect.setFloat2("texelSize", texelSize.x, texelSize.y);
            effect.setTexture("irradianceSampler", scene.prePassRenderer.getRenderTarget().textures[scene.prePassRenderer.getIndex(0)]);
            effect.setTexture("depthSampler", scene.prePassRenderer.getRenderTarget().textures[scene.prePassRenderer.getIndex(5)]);
            effect.setTexture("albedoSampler", scene.prePassRenderer.getRenderTarget().textures[scene.prePassRenderer.getIndex(7)]);
            effect.setFloat2("viewportSize", Math.tan(scene.activeCamera.fov / 2) * scene.getEngine().getAspectRatio(scene.activeCamera, true), Math.tan(scene.activeCamera.fov / 2));
            effect.setArray3("diffusionS", scene.subSurfaceConfiguration.ssDiffusionS);
            effect.setArray("diffusionD", scene.subSurfaceConfiguration.ssDiffusionD);
            effect.setArray("filterRadii", scene.subSurfaceConfiguration.ssFilterRadii);
        });
    }
}
//# sourceMappingURL=subSurfaceScatteringPostProcess.pure.js.map