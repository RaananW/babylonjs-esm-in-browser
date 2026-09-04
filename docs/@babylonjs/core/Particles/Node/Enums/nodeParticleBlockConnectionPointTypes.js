/**
 * Defines the kind of connection point for node geometry
 */
export var NodeParticleBlockConnectionPointTypes;
(function (NodeParticleBlockConnectionPointTypes) {
    /** Int */
    NodeParticleBlockConnectionPointTypes[NodeParticleBlockConnectionPointTypes["Int"] = 1] = "Int";
    /** Float */
    NodeParticleBlockConnectionPointTypes[NodeParticleBlockConnectionPointTypes["Float"] = 2] = "Float";
    /** Vector2 */
    NodeParticleBlockConnectionPointTypes[NodeParticleBlockConnectionPointTypes["Vector2"] = 4] = "Vector2";
    /** Vector3 */
    NodeParticleBlockConnectionPointTypes[NodeParticleBlockConnectionPointTypes["Vector3"] = 8] = "Vector3";
    /** Matrix */
    NodeParticleBlockConnectionPointTypes[NodeParticleBlockConnectionPointTypes["Matrix"] = 16] = "Matrix";
    /** Particle */
    NodeParticleBlockConnectionPointTypes[NodeParticleBlockConnectionPointTypes["Particle"] = 32] = "Particle";
    /** Texture */
    NodeParticleBlockConnectionPointTypes[NodeParticleBlockConnectionPointTypes["Texture"] = 64] = "Texture";
    /** Color4 */
    NodeParticleBlockConnectionPointTypes[NodeParticleBlockConnectionPointTypes["Color4"] = 128] = "Color4";
    /** FloatGradient */
    NodeParticleBlockConnectionPointTypes[NodeParticleBlockConnectionPointTypes["FloatGradient"] = 256] = "FloatGradient";
    /** Vector2Gradient */
    NodeParticleBlockConnectionPointTypes[NodeParticleBlockConnectionPointTypes["Vector2Gradient"] = 512] = "Vector2Gradient";
    /** Vector3Gradient */
    NodeParticleBlockConnectionPointTypes[NodeParticleBlockConnectionPointTypes["Vector3Gradient"] = 1024] = "Vector3Gradient";
    /** Color4Gradient */
    NodeParticleBlockConnectionPointTypes[NodeParticleBlockConnectionPointTypes["Color4Gradient"] = 2048] = "Color4Gradient";
    /** System */
    NodeParticleBlockConnectionPointTypes[NodeParticleBlockConnectionPointTypes["System"] = 4096] = "System";
    /** Detect type based on connection */
    NodeParticleBlockConnectionPointTypes[NodeParticleBlockConnectionPointTypes["AutoDetect"] = 8192] = "AutoDetect";
    /** Output type that will be defined by input type */
    NodeParticleBlockConnectionPointTypes[NodeParticleBlockConnectionPointTypes["BasedOnInput"] = 16384] = "BasedOnInput";
    /** Undefined */
    NodeParticleBlockConnectionPointTypes[NodeParticleBlockConnectionPointTypes["Undefined"] = 32768] = "Undefined";
    /** Bitmask of all types */
    NodeParticleBlockConnectionPointTypes[NodeParticleBlockConnectionPointTypes["All"] = 65535] = "All";
})(NodeParticleBlockConnectionPointTypes || (NodeParticleBlockConnectionPointTypes = {}));
//# sourceMappingURL=nodeParticleBlockConnectionPointTypes.js.map