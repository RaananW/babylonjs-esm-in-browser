import { EngineStore } from "../Engines/engineStore.js";
import { Mesh } from "../Meshes/mesh.js";
import { Observable } from "./observable.js";
/**
 * Defines the root class used to create scene optimization to use with SceneOptimizer
 * @description More details at https://doc.babylonjs.com/features/featuresDeepDive/scene/sceneOptimizer
 */
export class SceneOptimization {
    /**
     * Creates the SceneOptimization object
     * @param priority defines the priority of this optimization (0 by default which means first in the list)
     */
    constructor(
    /**
     * Defines the priority of this optimization (0 by default which means first in the list)
     */
    priority = 0) {
        this.priority = priority;
    }
    /**
     * Gets a string describing the action executed by the current optimization
     * @returns description string
     */
    getDescription() {
        return "";
    }
    /**
     * This function will be called by the SceneOptimizer when its priority is reached in order to apply the change required by the current optimization
     * @param scene defines the current scene where to apply this optimization
     * @param optimizer defines the current optimizer
     * @returns true if everything that can be done was applied
     */
    apply(scene, optimizer) {
        return true;
    }
}
/**
 * Defines an optimization used to reduce the size of render target textures
 * @description More details at https://doc.babylonjs.com/features/featuresDeepDive/scene/sceneOptimizer
 */
export class TextureOptimization extends SceneOptimization {
    /**
     * Creates the TextureOptimization object
     * @param priority defines the priority of this optimization (0 by default which means first in the list)
     * @param maximumSize defines the maximum sized allowed for textures (1024 is the default value). If a texture is bigger, it will be scaled down using a factor defined by the step parameter
     * @param step defines the factor (0.5 by default) used to scale down textures bigger than maximum sized allowed.
     */
    constructor(
    /**
     * Defines the priority of this optimization (0 by default which means first in the list)
     */
    priority = 0, 
    /**
     * Defines the maximum sized allowed for textures (1024 is the default value). If a texture is bigger, it will be scaled down using a factor defined by the step parameter
     */
    maximumSize = 1024, 
    /**
     * Defines the factor (0.5 by default) used to scale down textures bigger than maximum sized allowed.
     */
    step = 0.5) {
        super(priority);
        this.priority = priority;
        this.maximumSize = maximumSize;
        this.step = step;
    }
    /**
     * Gets a string describing the action executed by the current optimization
     * @returns description string
     */
    getDescription() {
        return "Reducing render target texture size to " + this.maximumSize;
    }
    /**
     * This function will be called by the SceneOptimizer when its priority is reached in order to apply the change required by the current optimization
     * @param scene defines the current scene where to apply this optimization
     * @param optimizer defines the current optimizer
     * @returns true if everything that can be done was applied
     */
    apply(scene, optimizer) {
        let allDone = true;
        for (let index = 0; index < scene.textures.length; index++) {
            const texture = scene.textures[index];
            if (!texture.canRescale || texture.getContext) {
                continue;
            }
            const currentSize = texture.getSize();
            const maxDimension = Math.max(currentSize.width, currentSize.height);
            if (maxDimension > this.maximumSize) {
                texture.scale(this.step);
                allDone = false;
            }
        }
        return allDone;
    }
}
/**
 * Defines an optimization used to increase or decrease the rendering resolution
 * @description More details at https://doc.babylonjs.com/features/featuresDeepDive/scene/sceneOptimizer
 */
export class HardwareScalingOptimization extends SceneOptimization {
    /**
     * Creates the HardwareScalingOptimization object
     * @param priority defines the priority of this optimization (0 by default which means first in the list)
     * @param maximumScale defines the maximum scale to use (2 by default)
     * @param step defines the step to use between two passes (0.5 by default)
     */
    constructor(
    /**
     * Defines the priority of this optimization (0 by default which means first in the list)
     */
    priority = 0, 
    /**
     * Defines the maximum scale to use (2 by default)
     */
    maximumScale = 2, 
    /**
     * Defines the step to use between two passes (0.5 by default)
     */
    step = 0.25) {
        super(priority);
        this.priority = priority;
        this.maximumScale = maximumScale;
        this.step = step;
        this._currentScale = -1;
        this._directionOffset = 1;
    }
    /**
     * Gets a string describing the action executed by the current optimization
     * @returns description string
     */
    getDescription() {
        return "Setting hardware scaling level to " + this._currentScale;
    }
    /**
     * This function will be called by the SceneOptimizer when its priority is reached in order to apply the change required by the current optimization
     * @param scene defines the current scene where to apply this optimization
     * @param optimizer defines the current optimizer
     * @returns true if everything that can be done was applied
     */
    apply(scene, optimizer) {
        if (this._currentScale === -1) {
            this._currentScale = scene.getEngine().getHardwareScalingLevel();
            if (this._currentScale > this.maximumScale) {
                this._directionOffset = -1;
            }
        }
        this._currentScale += this._directionOffset * this.step;
        scene.getEngine().setHardwareScalingLevel(this._currentScale);
        return this._directionOffset === 1 ? this._currentScale >= this.maximumScale : this._currentScale <= this.maximumScale;
    }
}
/**
 * Defines an optimization used to remove shadows
 * @description More details at https://doc.babylonjs.com/features/featuresDeepDive/scene/sceneOptimizer
 */
export class ShadowsOptimization extends SceneOptimization {
    /**
     * Gets a string describing the action executed by the current optimization
     * @returns description string
     */
    getDescription() {
        return "Turning shadows on/off";
    }
    /**
     * This function will be called by the SceneOptimizer when its priority is reached in order to apply the change required by the current optimization
     * @param scene defines the current scene where to apply this optimization
     * @param optimizer defines the current optimizer
     * @returns true if everything that can be done was applied
     */
    apply(scene, optimizer) {
        scene.shadowsEnabled = optimizer.isInImprovementMode;
        return true;
    }
}
/**
 * Defines an optimization used to turn post-processes off
 * @description More details at https://doc.babylonjs.com/features/featuresDeepDive/scene/sceneOptimizer
 */
export class PostProcessesOptimization extends SceneOptimization {
    /**
     * Gets a string describing the action executed by the current optimization
     * @returns description string
     */
    getDescription() {
        return "Turning post-processes on/off";
    }
    /**
     * This function will be called by the SceneOptimizer when its priority is reached in order to apply the change required by the current optimization
     * @param scene defines the current scene where to apply this optimization
     * @param optimizer defines the current optimizer
     * @returns true if everything that can be done was applied
     */
    apply(scene, optimizer) {
        scene.postProcessesEnabled = optimizer.isInImprovementMode;
        return true;
    }
}
/**
 * Defines an optimization used to turn lens flares off
 * @description More details at https://doc.babylonjs.com/features/featuresDeepDive/scene/sceneOptimizer
 */
export class LensFlaresOptimization extends SceneOptimization {
    /**
     * Gets a string describing the action executed by the current optimization
     * @returns description string
     */
    getDescription() {
        return "Turning lens flares on/off";
    }
    /**
     * This function will be called by the SceneOptimizer when its priority is reached in order to apply the change required by the current optimization
     * @param scene defines the current scene where to apply this optimization
     * @param optimizer defines the current optimizer
     * @returns true if everything that can be done was applied
     */
    apply(scene, optimizer) {
        scene.lensFlaresEnabled = optimizer.isInImprovementMode;
        return true;
    }
}
/**
 * Defines an optimization based on user defined callback.
 * @description More details at https://doc.babylonjs.com/features/featuresDeepDive/scene/sceneOptimizer
 */
export class CustomOptimization extends SceneOptimization {
    /**
     * Gets a string describing the action executed by the current optimization
     * @returns description string
     */
    getDescription() {
        if (this.onGetDescription) {
            return this.onGetDescription();
        }
        return "Running user defined callback";
    }
    /**
     * This function will be called by the SceneOptimizer when its priority is reached in order to apply the change required by the current optimization
     * @param scene defines the current scene where to apply this optimization
     * @param optimizer defines the current optimizer
     * @returns true if everything that can be done was applied
     */
    apply(scene, optimizer) {
        if (this.onApply) {
            return this.onApply(scene, optimizer);
        }
        return true;
    }
}
/**
 * Defines an optimization used to turn particles off
 * @description More details at https://doc.babylonjs.com/features/featuresDeepDive/scene/sceneOptimizer
 */
export class ParticlesOptimization extends SceneOptimization {
    /**
     * Gets a string describing the action executed by the current optimization
     * @returns description string
     */
    getDescription() {
        return "Turning particles on/off";
    }
    /**
     * This function will be called by the SceneOptimizer when its priority is reached in order to apply the change required by the current optimization
     * @param scene defines the current scene where to apply this optimization
     * @param optimizer defines the current optimizer
     * @returns true if everything that can be done was applied
     */
    apply(scene, optimizer) {
        scene.particlesEnabled = optimizer.isInImprovementMode;
        return true;
    }
}
/**
 * Defines an optimization used to turn render targets off
 * @description More details at https://doc.babylonjs.com/features/featuresDeepDive/scene/sceneOptimizer
 */
export class RenderTargetsOptimization extends SceneOptimization {
    /**
     * Gets a string describing the action executed by the current optimization
     * @returns description string
     */
    getDescription() {
        return "Turning render targets off";
    }
    /**
     * This function will be called by the SceneOptimizer when its priority is reached in order to apply the change required by the current optimization
     * @param scene defines the current scene where to apply this optimization
     * @param optimizer defines the current optimizer
     * @returns true if everything that can be done was applied
     */
    apply(scene, optimizer) {
        scene.renderTargetsEnabled = optimizer.isInImprovementMode;
        return true;
    }
}
/**
 * Defines an optimization used to merge meshes with compatible materials
 * @description More details at https://doc.babylonjs.com/features/featuresDeepDive/scene/sceneOptimizer
 */
export class MergeMeshesOptimization extends SceneOptimization {
    constructor() {
        super(...arguments);
        this._canBeMerged = (abstractMesh) => {
            if (!(abstractMesh instanceof Mesh)) {
                return false;
            }
            const mesh = abstractMesh;
            if (mesh.isDisposed()) {
                return false;
            }
            if (!mesh.isVisible || !mesh.isEnabled()) {
                return false;
            }
            if (mesh.instances.length > 0) {
                return false;
            }
            if (mesh.skeleton || mesh.hasLODLevels) {
                return false;
            }
            return true;
        };
    }
    /**
     * Gets or sets a boolean which defines if optimization octree has to be updated
     */
    static get UpdateSelectionTree() {
        return MergeMeshesOptimization._UpdateSelectionTree;
    }
    /**
     * Gets or sets a boolean which defines if optimization octree has to be updated
     */
    static set UpdateSelectionTree(value) {
        MergeMeshesOptimization._UpdateSelectionTree = value;
    }
    /**
     * Gets a string describing the action executed by the current optimization
     * @returns description string
     */
    getDescription() {
        return "Merging similar meshes together";
    }
    /**
     * This function will be called by the SceneOptimizer when its priority is reached in order to apply the change required by the current optimization
     * @param scene defines the current scene where to apply this optimization
     * @param optimizer defines the current optimizer
     * @param updateSelectionTree defines that the selection octree has to be updated (false by default)
     * @returns true if everything that can be done was applied
     */
    apply(scene, optimizer, updateSelectionTree) {
        const globalPool = scene.meshes.slice(0);
        let globalLength = globalPool.length;
        for (let index = 0; index < globalLength; index++) {
            const currentPool = new Array();
            const current = globalPool[index];
            // Checks
            if (!this._canBeMerged(current)) {
                continue;
            }
            currentPool.push(current);
            // Find compatible meshes
            for (let subIndex = index + 1; subIndex < globalLength; subIndex++) {
                const otherMesh = globalPool[subIndex];
                if (!this._canBeMerged(otherMesh)) {
                    continue;
                }
                if (otherMesh.material !== current.material) {
                    continue;
                }
                if (otherMesh.checkCollisions !== current.checkCollisions) {
                    continue;
                }
                currentPool.push(otherMesh);
                globalLength--;
                globalPool.splice(subIndex, 1);
                subIndex--;
            }
            if (currentPool.length < 2) {
                continue;
            }
            // Merge meshes
            Mesh.MergeMeshes(currentPool, undefined, true);
        }
        // Call the octree system optimization if it is defined.
        const sceneAsAny = scene;
        if (sceneAsAny.createOrUpdateSelectionOctree) {
            if (updateSelectionTree != undefined) {
                if (updateSelectionTree) {
                    sceneAsAny.createOrUpdateSelectionOctree();
                }
            }
            else if (MergeMeshesOptimization.UpdateSelectionTree) {
                sceneAsAny.createOrUpdateSelectionOctree();
            }
        }
        return true;
    }
}
MergeMeshesOptimization._UpdateSelectionTree = false;
/**
 * Defines a list of options used by SceneOptimizer
 * @description More details at https://doc.babylonjs.com/features/featuresDeepDive/scene/sceneOptimizer
 */
export class SceneOptimizerOptions {
    /**
     * Creates a new list of options used by SceneOptimizer
     * @param targetFrameRate defines the target frame rate to reach (60 by default)
     * @param trackerDuration defines the interval between two checks (2000ms by default)
     */
    constructor(
    /**
     * Defines the target frame rate to reach (60 by default)
     */
    targetFrameRate = 60, 
    /**
     * Defines the interval between two checks (2000ms by default)
     */
    trackerDuration = 2000) {
        this.targetFrameRate = targetFrameRate;
        this.trackerDuration = trackerDuration;
        /**
         * Gets the list of optimizations to apply
         */
        this.optimizations = new Array();
    }
    /**
     * Add a new optimization
     * @param optimization defines the SceneOptimization to add to the list of active optimizations
     * @returns the current SceneOptimizerOptions
     */
    addOptimization(optimization) {
        this.optimizations.push(optimization);
        return this;
    }
    /**
     * Add a new custom optimization
     * @param onApply defines the callback called to apply the custom optimization (true if everything that can be done was applied)
     * @param onGetDescription defines the callback called to get the description attached with the optimization.
     * @param priority defines the priority of this optimization (0 by default which means first in the list)
     * @returns the current SceneOptimizerOptions
     */
    addCustomOptimization(onApply, onGetDescription, priority = 0) {
        const optimization = new CustomOptimization(priority);
        optimization.onApply = onApply;
        optimization.onGetDescription = onGetDescription;
        this.optimizations.push(optimization);
        return this;
    }
    /**
     * Creates a list of pre-defined optimizations aimed to reduce the visual impact on the scene
     * @param targetFrameRate defines the target frame rate (60 by default)
     * @returns a SceneOptimizerOptions object
     */
    static LowDegradationAllowed(targetFrameRate) {
        const result = new SceneOptimizerOptions(targetFrameRate);
        let priority = 0;
        result.addOptimization(new MergeMeshesOptimization(priority));
        result.addOptimization(new ShadowsOptimization(priority));
        result.addOptimization(new LensFlaresOptimization(priority));
        // Next priority
        priority++;
        result.addOptimization(new PostProcessesOptimization(priority));
        result.addOptimization(new ParticlesOptimization(priority));
        // Next priority
        priority++;
        result.addOptimization(new TextureOptimization(priority, 1024));
        return result;
    }
    /**
     * Creates a list of pre-defined optimizations aimed to have a moderate impact on the scene visual
     * @param targetFrameRate defines the target frame rate (60 by default)
     * @returns a SceneOptimizerOptions object
     */
    static ModerateDegradationAllowed(targetFrameRate) {
        const result = new SceneOptimizerOptions(targetFrameRate);
        let priority = 0;
        result.addOptimization(new MergeMeshesOptimization(priority));
        result.addOptimization(new ShadowsOptimization(priority));
        result.addOptimization(new LensFlaresOptimization(priority));
        // Next priority
        priority++;
        result.addOptimization(new PostProcessesOptimization(priority));
        result.addOptimization(new ParticlesOptimization(priority));
        // Next priority
        priority++;
        result.addOptimization(new TextureOptimization(priority, 512));
        // Next priority
        priority++;
        result.addOptimization(new RenderTargetsOptimization(priority));
        // Next priority
        priority++;
        result.addOptimization(new HardwareScalingOptimization(priority, 2));
        return result;
    }
    /**
     * Creates a list of pre-defined optimizations aimed to have a big impact on the scene visual
     * @param targetFrameRate defines the target frame rate (60 by default)
     * @returns a SceneOptimizerOptions object
     */
    static HighDegradationAllowed(targetFrameRate) {
        const result = new SceneOptimizerOptions(targetFrameRate);
        let priority = 0;
        result.addOptimization(new MergeMeshesOptimization(priority));
        result.addOptimization(new ShadowsOptimization(priority));
        result.addOptimization(new LensFlaresOptimization(priority));
        // Next priority
        priority++;
        result.addOptimization(new PostProcessesOptimization(priority));
        result.addOptimization(new ParticlesOptimization(priority));
        // Next priority
        priority++;
        result.addOptimization(new TextureOptimization(priority, 256));
        // Next priority
        priority++;
        result.addOptimization(new RenderTargetsOptimization(priority));
        // Next priority
        priority++;
        result.addOptimization(new HardwareScalingOptimization(priority, 4));
        return result;
    }
}
/**
 * Class used to run optimizations in order to reach a target frame rate
 * @description More details at https://doc.babylonjs.com/features/featuresDeepDive/scene/sceneOptimizer
 */
export class SceneOptimizer {
    /**
     * Creates a new SceneOptimizer
     * @param scene defines the scene to work on
     * @param options defines the options to use with the SceneOptimizer
     * @param autoGeneratePriorities defines if priorities must be generated and not read from SceneOptimization property (true by default)
     * @param improvementMode defines if the scene optimizer must run the maximum optimization while staying over a target frame instead of trying to reach the target framerate (false by default)
     */
    constructor(scene, options, autoGeneratePriorities = true, improvementMode = false) {
        this._isRunning = false;
        this._currentPriorityLevel = 0;
        this._targetFrameRate = 60;
        this._trackerDuration = 2000;
        this._currentFrameRate = 0;
        this._improvementMode = false;
        /**
         * Defines an observable called when the optimizer reaches the target frame rate
         */
        this.onSuccessObservable = new Observable();
        /**
         * Defines an observable called when the optimizer enables an optimization
         */
        this.onNewOptimizationAppliedObservable = new Observable();
        /**
         * Defines an observable called when the optimizer is not able to reach the target frame rate
         */
        this.onFailureObservable = new Observable();
        if (!options) {
            this._options = new SceneOptimizerOptions();
        }
        else {
            this._options = options;
        }
        if (this._options.targetFrameRate) {
            this._targetFrameRate = this._options.targetFrameRate;
        }
        if (this._options.trackerDuration) {
            this._trackerDuration = this._options.trackerDuration;
        }
        if (autoGeneratePriorities) {
            let priority = 0;
            for (const optim of this._options.optimizations) {
                optim.priority = priority++;
            }
        }
        this._improvementMode = improvementMode;
        this._scene = scene || EngineStore.LastCreatedScene;
        this._sceneDisposeObserver = this._scene.onDisposeObservable.add(() => {
            this._sceneDisposeObserver = null;
            this.dispose();
        });
    }
    /**
     * Gets or sets a boolean indicating if the optimizer is in improvement mode
     */
    get isInImprovementMode() {
        return this._improvementMode;
    }
    set isInImprovementMode(value) {
        this._improvementMode = value;
    }
    /**
     * Gets the current priority level (0 at start)
     */
    get currentPriorityLevel() {
        return this._currentPriorityLevel;
    }
    /**
     * Gets the current frame rate checked by the SceneOptimizer
     */
    get currentFrameRate() {
        return this._currentFrameRate;
    }
    /**
     * Gets or sets the current target frame rate (60 by default)
     */
    get targetFrameRate() {
        return this._targetFrameRate;
    }
    /**
     * Gets or sets the current target frame rate (60 by default)
     */
    set targetFrameRate(value) {
        this._targetFrameRate = value;
    }
    /**
     * Gets or sets the current interval between two checks (every 2000ms by default)
     */
    get trackerDuration() {
        return this._trackerDuration;
    }
    /**
     * Gets or sets the current interval between two checks (every 2000ms by default)
     */
    set trackerDuration(value) {
        this._trackerDuration = value;
    }
    /**
     * Gets the list of active optimizations
     */
    get optimizations() {
        return this._options.optimizations;
    }
    /**
     * Stops the current optimizer
     */
    stop() {
        this._isRunning = false;
    }
    /**
     * Reset the optimizer to initial step (current priority level = 0)
     */
    reset() {
        this._currentPriorityLevel = 0;
    }
    /**
     * Start the optimizer. By default it will try to reach a specific framerate
     * but if the optimizer is set with improvementMode === true then it will run all optimization while frame rate is above the target frame rate
     */
    start() {
        if (this._isRunning) {
            return;
        }
        this._isRunning = true;
        // Let's wait for the scene to be ready before running our check
        this._scene.executeWhenReady(() => {
            setTimeout(() => {
                this._checkCurrentState();
            }, this._trackerDuration);
        });
    }
    _checkCurrentState() {
        if (!this._isRunning) {
            return;
        }
        const scene = this._scene;
        const options = this._options;
        this._currentFrameRate = Math.round(scene.getEngine().getFps());
        if ((this._improvementMode && this._currentFrameRate <= this._targetFrameRate) || (!this._improvementMode && this._currentFrameRate >= this._targetFrameRate)) {
            this._isRunning = false;
            this.onSuccessObservable.notifyObservers(this);
            return;
        }
        // Apply current level of optimizations
        let allDone = true;
        let noOptimizationApplied = true;
        for (let index = 0; index < options.optimizations.length; index++) {
            const optimization = options.optimizations[index];
            if (optimization.priority === this._currentPriorityLevel) {
                noOptimizationApplied = false;
                allDone = allDone && optimization.apply(scene, this);
                this.onNewOptimizationAppliedObservable.notifyObservers(optimization);
            }
        }
        // If no optimization was applied, this is a failure :(
        if (noOptimizationApplied) {
            this._isRunning = false;
            this.onFailureObservable.notifyObservers(this);
            return;
        }
        // If all optimizations were done, move to next level
        if (allDone) {
            this._currentPriorityLevel++;
        }
        // Let's the system running for a specific amount of time before checking FPS
        scene.executeWhenReady(() => {
            setTimeout(() => {
                this._checkCurrentState();
            }, this._trackerDuration);
        });
    }
    /**
     * Release all resources
     */
    dispose() {
        this.stop();
        this.onSuccessObservable.clear();
        this.onFailureObservable.clear();
        this.onNewOptimizationAppliedObservable.clear();
        if (this._sceneDisposeObserver) {
            this._scene.onDisposeObservable.remove(this._sceneDisposeObserver);
        }
    }
    /**
     * Helper function to create a SceneOptimizer with one single line of code
     * @param scene defines the scene to work on
     * @param options defines the options to use with the SceneOptimizer
     * @param onSuccess defines a callback to call on success
     * @param onFailure defines a callback to call on failure
     * @returns the new SceneOptimizer object
     */
    static OptimizeAsync(scene, options, onSuccess, onFailure) {
        const optimizer = new SceneOptimizer(scene, options || SceneOptimizerOptions.ModerateDegradationAllowed(), false);
        if (onSuccess) {
            optimizer.onSuccessObservable.add(() => {
                onSuccess();
            });
        }
        if (onFailure) {
            optimizer.onFailureObservable.add(() => {
                onFailure();
            });
        }
        optimizer.start();
        return optimizer;
    }
}
//# sourceMappingURL=sceneOptimizer.js.map