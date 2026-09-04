/**
 * The shape of the audio ramp used to set an audio parameter's value, such as a sound's volume.
 */
export var AudioParameterRampShape;
(function (AudioParameterRampShape) {
    /**
     * The ramp is linear.
     */
    AudioParameterRampShape["Linear"] = "linear";
    /**
     * The ramp is exponential.
     */
    AudioParameterRampShape["Exponential"] = "exponential";
    /**
     * The ramp is logarithmic.
     */
    AudioParameterRampShape["Logarithmic"] = "logarithmic";
    /**
     * No ramp is used; the value is set immediately.
     */
    AudioParameterRampShape["None"] = "none";
})(AudioParameterRampShape || (AudioParameterRampShape = {}));
//# sourceMappingURL=audioParameter.js.map