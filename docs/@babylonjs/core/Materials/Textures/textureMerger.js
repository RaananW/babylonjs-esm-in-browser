import { ProceduralTexture } from "./Procedurals/proceduralTexture.pure.js";

const _ShaderName = "textureMerger";
/**
 * @internal
 * Check if a channel input is a texture input
 * @param input The channel input to check
 * @returns True if the input is a texture input, false otherwise
 */
function IsTextureInput(input) {
    return "texture" in input;
}
/**
 * @internal
 * Check if a channel input is a constant input
 * @param input The channel input to check
 * @returns True if the input is a constant input, false otherwise
 */
function IsConstantInput(input) {
    return "value" in input;
}
/**
 * @internal
 * Copy texture transformation properties from one texture to another
 * @param source The source texture
 * @param destination The destination texture
 */
function CopyTextureTransform(source, destination) {
    destination.uOffset = source.uOffset;
    destination.vOffset = source.vOffset;
    destination.uScale = source.uScale;
    destination.vScale = source.vScale;
    destination.uAng = source.uAng;
    destination.vAng = source.vAng;
    destination.wAng = source.wAng;
    destination.uRotationCenter = source.uRotationCenter;
    destination.vRotationCenter = source.vRotationCenter;
}
/**
 * @internal
 * Merge multiple texture channels into a single texture
 * @param name Name for the resulting texture
 * @param config Merge configuration
 * @param scene Scene to create the texture in
 * @returns The merged texture
 */
export async function MergeTexturesAsync(name, config, scene) {
    const channels = [config.red, config.green, config.blue, config.alpha];
    const textureInputs = [];
    const textureInputMap = []; // Maps channel index to texture input index (-1 for constants)
    // Collect unique textures and validate inputs
    for (let channelIndex = 0; channelIndex < 4; channelIndex++) {
        const channel = channels[channelIndex];
        if (channel) {
            if (IsTextureInput(channel)) {
                // Validate source channel
                if (channel.sourceChannel < 0 || channel.sourceChannel > 3) {
                    throw new Error("Source channel must be between 0 and 3 (R, G, B, A)");
                }
                // Find or add texture to inputs
                let textureIndex = textureInputs.indexOf(channel.texture);
                if (textureIndex === -1) {
                    textureIndex = textureInputs.length;
                    textureInputs.push(channel.texture);
                }
                textureInputMap[channelIndex] = textureIndex;
            }
            else if (IsConstantInput(channel)) {
                // Validate constant value
                if (channel.value < 0 || channel.value > 1) {
                    throw new Error("Constant value must be between 0.0 and 1.0");
                }
                textureInputMap[channelIndex] = -1;
            }
            else {
                throw new Error("Invalid channel input configuration");
            }
        }
        else {
            textureInputMap[channelIndex] = -1;
        }
    }
    // Determine output size
    let outputSize = config.outputSize;
    if (!outputSize && textureInputs.length > 0) {
        // Use the largest texture size
        let maxSize = 0;
        for (const texture of textureInputs) {
            const size = texture.getSize();
            const currentSize = Math.max(size.width, size.height);
            if (currentSize > maxSize) {
                maxSize = currentSize;
                outputSize = size.width === size.height ? maxSize : size;
            }
        }
    }
    outputSize = outputSize || 512; // Fallback size
    // Generate shader defines
    const defines = [];
    const usedTextures = new Set();
    for (let channelIndex = 0; channelIndex < 4; channelIndex++) {
        const channel = channels[channelIndex];
        const channelName = ["RED", "GREEN", "BLUE", "ALPHA"][channelIndex];
        if (channel && IsTextureInput(channel)) {
            defines.push(`${channelName}_FROM_TEXTURE`);
            const textureIndex = textureInputMap[channelIndex];
            usedTextures.add(textureIndex);
        }
    }
    // Add texture defines for used textures
    usedTextures.forEach((textureIndex) => {
        defines.push(`USE_TEXTURE${textureIndex}`);
    });
    // Create the procedural texture
    const outputTextureOptions = {
        type: 2,
        format: 5,
        samplingMode: 1,
        generateDepthBuffer: false,
        generateMipMaps: false,
        shaderLanguage: scene.getEngine().isWebGPU ? 1 /* ShaderLanguage.WGSL */ : 0 /* ShaderLanguage.GLSL */,
        extraInitializationsAsync: async () => {
            if (scene.getEngine().isWebGPU) {
                await Promise.all([import("../../ShadersWGSL/textureMerger.fragment.js")]);
            }
            else {
                await Promise.all([import("../../Shaders/textureMerger.fragment.js")]);
            }
        },
        skipSceneRegistration: true,
    };
    const proceduralTexture = new ProceduralTexture(name, outputSize, _ShaderName, scene, outputTextureOptions);
    proceduralTexture.refreshRate = -1; // Do not auto-refresh
    // Set the defines
    proceduralTexture.defines = defines.length > 0 ? "#define " + defines.join("\n#define ") + "\n" : "";
    // Set up texture inputs
    for (let i = 0; i < textureInputs.length; i++) {
        CopyTextureTransform(textureInputs[i], proceduralTexture);
        proceduralTexture.setTexture(`inputTexture${i}`, textureInputs[i]);
    }
    // Set up channel configuration
    for (let channelIndex = 0; channelIndex < 4; channelIndex++) {
        const channel = channels[channelIndex];
        const channelName = ["red", "green", "blue", "alpha"][channelIndex];
        if (channel && IsTextureInput(channel)) {
            const textureIndex = textureInputMap[channelIndex];
            proceduralTexture.setInt(`${channelName}TextureIndex`, textureIndex);
            proceduralTexture.setInt(`${channelName}SourceChannel`, channel.sourceChannel);
        }
        else {
            // Use constant value (either provided or default)
            let constantValue;
            if (channel && IsConstantInput(channel)) {
                constantValue = channel.value;
            }
            else {
                // Use default values: 0 for RGB, 1 for alpha
                constantValue = channelIndex === 3 ? 1.0 : 0.0;
            }
            proceduralTexture.setFloat(`${channelName}ConstantValue`, constantValue);
        }
    }
    return await new Promise((resolve, reject) => {
        // Compile and render
        proceduralTexture.executeWhenReady(() => {
            try {
                proceduralTexture.render();
                resolve(proceduralTexture);
            }
            catch (error) {
                reject(error instanceof Error ? error : new Error(String(error)));
            }
        });
    });
}
/**
 * @internal
 * Create a texture input configuration
 * @param texture The texture to read from
 * @param sourceChannel The channel to read (0=R, 1=G, 2=B, 3=A)
 * @returns Texture channel input configuration
 */
export function CreateTextureInput(texture, sourceChannel) {
    return { texture, sourceChannel };
}
/**
 * @internal
 * Create a constant value input configuration
 * @param value The constant value (0.0-1.0)
 * @returns Constant channel input configuration
 */
export function CreateConstantInput(value) {
    return { value };
}
/**
 * @internal
 * Create a simple RGBA channel packing configuration
 * @param red Input for red channel
 * @param green Input for green channel (optional, defaults to 0)
 * @param blue Input for blue channel (optional, defaults to 0)
 * @param alpha Input for alpha channel (optional, defaults to 1)
 * @returns Texture merge configuration
 */
export function CreateRGBAConfiguration(red, green, blue, alpha) {
    return { red, green, blue, alpha };
}
//# sourceMappingURL=textureMerger.js.map