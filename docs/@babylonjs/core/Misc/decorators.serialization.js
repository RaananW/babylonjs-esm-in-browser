import { _WarnImport } from "./devTools.js";
import { Tags } from "./tags.js";
import { Color3, Color4 } from "../Maths/math.color.pure.js";
import { Matrix, Quaternion, Vector2, Vector3, Vector4 } from "../Maths/math.vector.pure.js";
import { GetMergedStore } from "./decorators.functions.js";
const CopySource = function (creationFunction, source, instanciate, options = {}) {
    const destination = creationFunction();
    // Tags
    if (Tags && Tags.HasTags(source)) {
        Tags.AddTagsTo(destination, Tags.GetTags(source, true));
    }
    const classStore = GetMergedStore(destination);
    // Map from source texture uniqueId to destination texture
    const textureMap = {};
    // Properties
    for (const property in classStore) {
        const propertyDescriptor = classStore[property];
        const sourceProperty = source[property];
        const propertyType = propertyDescriptor.type;
        if (sourceProperty !== undefined && sourceProperty !== null && (property !== "uniqueId" || SerializationHelper.AllowLoadingUniqueId)) {
            switch (propertyType) {
                case 0 /* SerializedFieldType.VALUE */:
                case 6 /* SerializedFieldType.MESH */:
                case 9 /* SerializedFieldType.IMAGE_PROCESSING */:
                case 11 /* SerializedFieldType.CAMERA */:
                    if (typeof sourceProperty.slice === "function") {
                        destination[property] = sourceProperty.slice();
                    }
                    else {
                        destination[property] = sourceProperty;
                    }
                    break;
                case 1 /* SerializedFieldType.TEXTURE */:
                    if (options.cloneTexturesOnlyOnce && textureMap[sourceProperty.uniqueId]) {
                        destination[property] = textureMap[sourceProperty.uniqueId];
                    }
                    else {
                        destination[property] = instanciate || sourceProperty.isRenderTarget ? sourceProperty : sourceProperty.clone();
                        textureMap[sourceProperty.uniqueId] = destination[property];
                    }
                    break;
                case 2 /* SerializedFieldType.COLOR3 */:
                case 3 /* SerializedFieldType.FRESNEL_PARAMETERS */:
                case 4 /* SerializedFieldType.VECTOR2 */:
                case 5 /* SerializedFieldType.VECTOR3 */:
                case 7 /* SerializedFieldType.COLOR_CURVES */:
                case 8 /* SerializedFieldType.COLOR4 */:
                case 10 /* SerializedFieldType.QUATERNION */:
                case 12 /* SerializedFieldType.MATRIX */:
                case 13 /* SerializedFieldType.VECTOR4 */:
                    destination[property] = instanciate ? sourceProperty : sourceProperty.clone();
                    break;
            }
        }
    }
    return destination;
};
/**
 * Class used to help serialization objects
 */
export class SerializationHelper {
    /**
     * Appends the serialized animations from the source animations
     * @param source Source containing the animations
     * @param destination Target to store the animations
     */
    static AppendSerializedAnimations(source, destination) {
        if (source.animations) {
            destination.animations = [];
            for (let animationIndex = 0; animationIndex < source.animations.length; animationIndex++) {
                const animation = source.animations[animationIndex];
                destination.animations.push(animation.serialize());
            }
        }
    }
    /**
     * Static function used to serialized a specific entity
     * @param entity defines the entity to serialize
     * @param serializationObject defines the optional target object where serialization data will be stored
     * @returns a JSON compatible object representing the serialization of the entity
     */
    static Serialize(entity, serializationObject) {
        if (!serializationObject) {
            serializationObject = {};
        }
        // Tags
        if (Tags) {
            serializationObject.tags = Tags.GetTags(entity);
        }
        const serializedProperties = GetMergedStore(entity);
        // Properties
        for (const property in serializedProperties) {
            const propertyDescriptor = serializedProperties[property];
            const targetPropertyName = propertyDescriptor.sourceName || property;
            const propertyType = propertyDescriptor.type;
            const sourceProperty = entity[property];
            if (sourceProperty !== undefined && sourceProperty !== null && (property !== "uniqueId" || SerializationHelper.AllowLoadingUniqueId)) {
                switch (propertyType) {
                    case 0 /* SerializedFieldType.VALUE */:
                        if (Array.isArray(sourceProperty)) {
                            serializationObject[targetPropertyName] = sourceProperty.slice();
                        }
                        else {
                            serializationObject[targetPropertyName] = sourceProperty;
                        }
                        break;
                    case 1 /* SerializedFieldType.TEXTURE */:
                        serializationObject[targetPropertyName] = sourceProperty.serialize();
                        break;
                    case 2 /* SerializedFieldType.COLOR3 */:
                        serializationObject[targetPropertyName] = sourceProperty.asArray();
                        break;
                    case 3 /* SerializedFieldType.FRESNEL_PARAMETERS */:
                        serializationObject[targetPropertyName] = sourceProperty.serialize();
                        break;
                    case 4 /* SerializedFieldType.VECTOR2 */:
                        serializationObject[targetPropertyName] = sourceProperty.asArray();
                        break;
                    case 5 /* SerializedFieldType.VECTOR3 */:
                        serializationObject[targetPropertyName] = sourceProperty.asArray();
                        break;
                    case 6 /* SerializedFieldType.MESH */:
                        serializationObject[targetPropertyName] = sourceProperty.id;
                        break;
                    case 7 /* SerializedFieldType.COLOR_CURVES */:
                        serializationObject[targetPropertyName] = sourceProperty.serialize();
                        break;
                    case 8 /* SerializedFieldType.COLOR4 */:
                        serializationObject[targetPropertyName] = sourceProperty.asArray();
                        break;
                    case 9 /* SerializedFieldType.IMAGE_PROCESSING */:
                        serializationObject[targetPropertyName] = sourceProperty.serialize();
                        break;
                    case 10 /* SerializedFieldType.QUATERNION */:
                        serializationObject[targetPropertyName] = sourceProperty.asArray();
                        break;
                    case 11 /* SerializedFieldType.CAMERA */:
                        serializationObject[targetPropertyName] = sourceProperty.id;
                        break;
                    case 12 /* SerializedFieldType.MATRIX */:
                        serializationObject[targetPropertyName] = sourceProperty.asArray();
                        break;
                    case 13 /* SerializedFieldType.VECTOR4 */:
                        serializationObject[targetPropertyName] = sourceProperty.asArray();
                        break;
                }
            }
        }
        return serializationObject;
    }
    /**
     * Given a source json and a destination object in a scene, this function will parse the source and will try to apply its content to the destination object
     * @param source the source json data
     * @param destination the destination object
     * @param scene the scene where the object is
     * @param rootUrl root url to use to load assets
     */
    static ParseProperties(source, destination, scene, rootUrl) {
        if (!rootUrl) {
            rootUrl = "";
        }
        const classStore = GetMergedStore(destination);
        // Properties
        for (const property in classStore) {
            const propertyDescriptor = classStore[property];
            const sourceProperty = source[propertyDescriptor.sourceName || property];
            const propertyType = propertyDescriptor.type;
            if (sourceProperty !== undefined && sourceProperty !== null && (property !== "uniqueId" || SerializationHelper.AllowLoadingUniqueId)) {
                const dest = destination;
                switch (propertyType) {
                    case 0 /* SerializedFieldType.VALUE */:
                        dest[property] = sourceProperty;
                        break;
                    case 1 /* SerializedFieldType.TEXTURE */:
                        if (scene) {
                            dest[property] = SerializationHelper._TextureParser(sourceProperty, scene, rootUrl);
                        }
                        break;
                    case 2 /* SerializedFieldType.COLOR3 */:
                        dest[property] = Color3.FromArray(sourceProperty);
                        break;
                    case 3 /* SerializedFieldType.FRESNEL_PARAMETERS */:
                        dest[property] = SerializationHelper._FresnelParametersParser(sourceProperty);
                        break;
                    case 4 /* SerializedFieldType.VECTOR2 */:
                        dest[property] = Vector2.FromArray(sourceProperty);
                        break;
                    case 5 /* SerializedFieldType.VECTOR3 */:
                        dest[property] = Vector3.FromArray(sourceProperty);
                        break;
                    case 6 /* SerializedFieldType.MESH */:
                        if (scene) {
                            dest[property] = scene.getLastMeshById(sourceProperty);
                        }
                        break;
                    case 7 /* SerializedFieldType.COLOR_CURVES */:
                        dest[property] = SerializationHelper._ColorCurvesParser(sourceProperty);
                        break;
                    case 8 /* SerializedFieldType.COLOR4 */:
                        dest[property] = Color4.FromArray(sourceProperty);
                        break;
                    case 9 /* SerializedFieldType.IMAGE_PROCESSING */:
                        dest[property] = SerializationHelper._ImageProcessingConfigurationParser(sourceProperty);
                        break;
                    case 10 /* SerializedFieldType.QUATERNION */:
                        dest[property] = Quaternion.FromArray(sourceProperty);
                        break;
                    case 11 /* SerializedFieldType.CAMERA */:
                        if (scene) {
                            dest[property] = scene.getCameraById(sourceProperty);
                        }
                        break;
                    case 12 /* SerializedFieldType.MATRIX */:
                        dest[property] = Matrix.FromArray(sourceProperty);
                        break;
                    case 13 /* SerializedFieldType.VECTOR4 */:
                        dest[property] = Vector4.FromArray(sourceProperty);
                        break;
                }
            }
        }
    }
    /**
     * Creates a new entity from a serialization data object
     * @param creationFunction defines a function used to instanciated the new entity
     * @param source defines the source serialization data
     * @param scene defines the hosting scene
     * @param rootUrl defines the root url for resources
     * @returns a new entity
     */
    static Parse(creationFunction, source, scene, rootUrl = null) {
        const destination = creationFunction();
        // Tags
        if (Tags) {
            Tags.AddTagsTo(destination, source.tags);
        }
        SerializationHelper.ParseProperties(source, destination, scene, rootUrl);
        return destination;
    }
    /**
     * Clones an object
     * @param creationFunction defines the function used to instanciate the new object
     * @param source defines the source object
     * @param options defines the options to use
     * @returns the cloned object
     */
    static Clone(creationFunction, source, options = {}) {
        return CopySource(creationFunction, source, false, options);
    }
    /**
     * Instanciates a new object based on a source one (some data will be shared between both object)
     * @param creationFunction defines the function used to instanciate the new object
     * @param source defines the source object
     * @returns the new object
     */
    static Instanciate(creationFunction, source) {
        return CopySource(creationFunction, source, true);
    }
}
/**
 * Gets or sets a boolean to indicate if the UniqueId property should be serialized
 */
SerializationHelper.AllowLoadingUniqueId = false;
/**
 * @internal
 */
SerializationHelper._ImageProcessingConfigurationParser = (sourceProperty) => {
    throw _WarnImport("ImageProcessingConfiguration");
};
/**
 * @internal
 */
SerializationHelper._FresnelParametersParser = (sourceProperty) => {
    throw _WarnImport("FresnelParameters");
};
/**
 * @internal
 */
SerializationHelper._ColorCurvesParser = (sourceProperty) => {
    throw _WarnImport("ColorCurves");
};
/**
 * @internal
 */
SerializationHelper._TextureParser = (sourceProperty, scene, rootUrl) => {
    throw _WarnImport("Texture");
};
//# sourceMappingURL=decorators.serialization.js.map