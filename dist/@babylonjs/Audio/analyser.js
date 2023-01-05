import { Engine } from "../Engines/engine.js";
import { Tools } from "../Misc/tools.js";
import { EngineStore } from "../Engines/engineStore.js";
/**
 * Class used to work with sound analyzer using fast fourier transform (FFT)
 * @see https://doc.babylonjs.com/features/featuresDeepDive/audio/playingSoundsMusic
 */
export class Analyser {
    /**
     * Creates a new analyser
     * @param scene defines hosting scene
     */
    constructor(scene) {
        /**
         * Gets or sets the smoothing
         * @ignorenaming
         */
        this.SMOOTHING = 0.75;
        /**
         * Gets or sets the FFT table size
         * @ignorenaming
         */
        this.FFT_SIZE = 512;
        /**
         * Gets or sets the bar graph amplitude
         * @ignorenaming
         */
        this.BARGRAPHAMPLITUDE = 256;
        /**
         * Gets or sets the position of the debug canvas
         * @ignorenaming
         */
        this.DEBUGCANVASPOS = { x: 20, y: 20 };
        /**
         * Gets or sets the debug canvas size
         * @ignorenaming
         */
        this.DEBUGCANVASSIZE = { width: 320, height: 200 };
        scene = scene || EngineStore.LastCreatedScene;
        if (!scene) {
            return;
        }
        this._scene = scene;
        if (!Engine.audioEngine) {
            Tools.Warn("No audio engine initialized, failed to create an audio analyser");
            return;
        }
        this._audioEngine = Engine.audioEngine;
        if (this._audioEngine.canUseWebAudio && this._audioEngine.audioContext) {
            this._webAudioAnalyser = this._audioEngine.audioContext.createAnalyser();
            this._webAudioAnalyser.minDecibels = -140;
            this._webAudioAnalyser.maxDecibels = 0;
            this._byteFreqs = new Uint8Array(this._webAudioAnalyser.frequencyBinCount);
            this._byteTime = new Uint8Array(this._webAudioAnalyser.frequencyBinCount);
            this._floatFreqs = new Float32Array(this._webAudioAnalyser.frequencyBinCount);
        }
    }
    /**
     * Get the number of data values you will have to play with for the visualization
     * @see https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/frequencyBinCount
     * @returns a number
     */
    getFrequencyBinCount() {
        if (this._audioEngine.canUseWebAudio) {
            return this._webAudioAnalyser.frequencyBinCount;
        }
        else {
            return 0;
        }
    }
    /**
     * Gets the current frequency data as a byte array
     * @see https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getByteFrequencyData
     * @returns a Uint8Array
     */
    getByteFrequencyData() {
        if (this._audioEngine.canUseWebAudio) {
            this._webAudioAnalyser.smoothingTimeConstant = this.SMOOTHING;
            this._webAudioAnalyser.fftSize = this.FFT_SIZE;
            this._webAudioAnalyser.getByteFrequencyData(this._byteFreqs);
        }
        return this._byteFreqs;
    }
    /**
     * Gets the current waveform as a byte array
     * @see https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getByteTimeDomainData
     * @returns a Uint8Array
     */
    getByteTimeDomainData() {
        if (this._audioEngine.canUseWebAudio) {
            this._webAudioAnalyser.smoothingTimeConstant = this.SMOOTHING;
            this._webAudioAnalyser.fftSize = this.FFT_SIZE;
            this._webAudioAnalyser.getByteTimeDomainData(this._byteTime);
        }
        return this._byteTime;
    }
    /**
     * Gets the current frequency data as a float array
     * @see https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getByteFrequencyData
     * @returns a Float32Array
     */
    getFloatFrequencyData() {
        if (this._audioEngine.canUseWebAudio) {
            this._webAudioAnalyser.smoothingTimeConstant = this.SMOOTHING;
            this._webAudioAnalyser.fftSize = this.FFT_SIZE;
            this._webAudioAnalyser.getFloatFrequencyData(this._floatFreqs);
        }
        return this._floatFreqs;
    }
    /**
     * Renders the debug canvas
     */
    drawDebugCanvas() {
        if (this._audioEngine.canUseWebAudio) {
            if (!this._debugCanvas) {
                this._debugCanvas = document.createElement("canvas");
                this._debugCanvas.width = this.DEBUGCANVASSIZE.width;
                this._debugCanvas.height = this.DEBUGCANVASSIZE.height;
                this._debugCanvas.style.position = "absolute";
                this._debugCanvas.style.top = this.DEBUGCANVASPOS.y + "px";
                this._debugCanvas.style.left = this.DEBUGCANVASPOS.x + "px";
                this._debugCanvasContext = this._debugCanvas.getContext("2d");
                document.body.appendChild(this._debugCanvas);
                this._registerFunc = () => {
                    this.drawDebugCanvas();
                };
                this._scene.registerBeforeRender(this._registerFunc);
            }
            if (this._registerFunc && this._debugCanvasContext) {
                const workingArray = this.getByteFrequencyData();
                this._debugCanvasContext.fillStyle = "rgb(0, 0, 0)";
                this._debugCanvasContext.fillRect(0, 0, this.DEBUGCANVASSIZE.width, this.DEBUGCANVASSIZE.height);
                // Draw the frequency domain chart.
                for (let i = 0; i < this.getFrequencyBinCount(); i++) {
                    const value = workingArray[i];
                    const percent = value / this.BARGRAPHAMPLITUDE;
                    const height = this.DEBUGCANVASSIZE.height * percent;
                    const offset = this.DEBUGCANVASSIZE.height - height - 1;
                    const barWidth = this.DEBUGCANVASSIZE.width / this.getFrequencyBinCount();
                    const hue = (i / this.getFrequencyBinCount()) * 360;
                    this._debugCanvasContext.fillStyle = "hsl(" + hue + ", 100%, 50%)";
                    this._debugCanvasContext.fillRect(i * barWidth, offset, barWidth, height);
                }
            }
        }
    }
    /**
     * Stops rendering the debug canvas and removes it
     */
    stopDebugCanvas() {
        if (this._debugCanvas) {
            if (this._registerFunc) {
                this._scene.unregisterBeforeRender(this._registerFunc);
                this._registerFunc = null;
            }
            document.body.removeChild(this._debugCanvas);
            this._debugCanvas = null;
            this._debugCanvasContext = null;
        }
    }
    /**
     * Connects two audio nodes
     * @param inputAudioNode defines first node to connect
     * @param outputAudioNode defines second node to connect
     */
    connectAudioNodes(inputAudioNode, outputAudioNode) {
        if (this._audioEngine.canUseWebAudio) {
            inputAudioNode.connect(this._webAudioAnalyser);
            this._webAudioAnalyser.connect(outputAudioNode);
        }
    }
    /**
     * Releases all associated resources
     */
    dispose() {
        if (this._audioEngine.canUseWebAudio) {
            this._webAudioAnalyser.disconnect();
        }
    }
}
//# sourceMappingURL=analyser.js.map