/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { FrameGraphConvolutionTask } from "../../../Tasks/PostProcesses/convolutionTask.js";
import { ThinConvolutionPostProcess } from "../../../../PostProcesses/thinConvolutionPostProcess.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "./baseWithPropertiesPostProcessBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that implements the convolution post process
 */
let NodeRenderGraphConvolutionPostProcessBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBaseWithPropertiesPostProcessBlock;
    let _instanceExtraInitializers = [];
    let _get_kernel_decorators;
    return _a = class NodeRenderGraphConvolutionPostProcessBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new NodeRenderGraphConvolutionPostProcessBlock
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             * @param kernel Array of 9 values corresponding to the 3x3 kernel to be applied
             */
            constructor(name, frameGraph, scene, kernel = ThinConvolutionPostProcess.EmbossKernel) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this._additionalConstructionParameters = [kernel];
                this._finalizeInputOutputRegistering();
                this._frameGraphTask = new FrameGraphConvolutionTask(this.name, frameGraph, new ThinConvolutionPostProcess(name, frameGraph.engine, kernel));
            }
            _createTask(kernelIndex) {
                const sourceSamplingMode = this._frameGraphTask.sourceSamplingMode;
                this._frameGraphTask.dispose();
                let kernel = ThinConvolutionPostProcess.EmbossKernel;
                switch (kernelIndex) {
                    case 0:
                        kernel = ThinConvolutionPostProcess.EdgeDetect0Kernel;
                        break;
                    case 1:
                        kernel = ThinConvolutionPostProcess.EdgeDetect1Kernel;
                        break;
                    case 2:
                        kernel = ThinConvolutionPostProcess.EdgeDetect2Kernel;
                        break;
                    case 3:
                        kernel = ThinConvolutionPostProcess.SharpenKernel;
                        break;
                    case 4:
                        kernel = ThinConvolutionPostProcess.EmbossKernel;
                        break;
                    case 5:
                        kernel = ThinConvolutionPostProcess.GaussianKernel;
                        break;
                }
                this._frameGraphTask = new FrameGraphConvolutionTask(this.name, this._frameGraph, new ThinConvolutionPostProcess(this.name, this._frameGraph.engine, kernel));
                this._frameGraphTask.sourceSamplingMode = sourceSamplingMode;
                this._additionalConstructionParameters = [kernel];
            }
            /** The quality of the blur effect */
            get kernel() {
                const kernel = this._frameGraphTask.postProcess.kernel;
                if (kernel.every((value, index) => value === ThinConvolutionPostProcess.EdgeDetect0Kernel[index])) {
                    return 0;
                }
                if (kernel.every((value, index) => value === ThinConvolutionPostProcess.EdgeDetect1Kernel[index])) {
                    return 1;
                }
                if (kernel.every((value, index) => value === ThinConvolutionPostProcess.EdgeDetect2Kernel[index])) {
                    return 2;
                }
                if (kernel.every((value, index) => value === ThinConvolutionPostProcess.SharpenKernel[index])) {
                    return 3;
                }
                if (kernel.every((value, index) => value === ThinConvolutionPostProcess.EmbossKernel[index])) {
                    return 4;
                }
                if (kernel.every((value, index) => value === ThinConvolutionPostProcess.GaussianKernel[index])) {
                    return 5;
                }
                return 0;
            }
            set kernel(value) {
                this._createTask(value);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphConvolutionPostProcessBlock";
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_kernel_decorators = [editableInPropertyPage("Kernel", 5 /* PropertyTypeForEdition.List */, "PROPERTIES", {
                    options: [
                        { label: "EdgeDetect0", value: 0 },
                        { label: "EdgeDetect1", value: 1 },
                        { label: "EdgeDetect2", value: 2 },
                        { label: "Sharpen", value: 3 },
                        { label: "Emboss", value: 4 },
                        { label: "Gaussian", value: 5 },
                    ],
                })];
            __esDecorate(_a, null, _get_kernel_decorators, { kind: "getter", name: "kernel", static: false, private: false, access: { has: obj => "kernel" in obj, get: obj => obj.kernel }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphConvolutionPostProcessBlock };
let _Registered = false;
/**
 * Register side effects for convolutionPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterConvolutionPostProcessBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphConvolutionPostProcessBlock", NodeRenderGraphConvolutionPostProcessBlock);
}
//# sourceMappingURL=convolutionPostProcessBlock.pure.js.map