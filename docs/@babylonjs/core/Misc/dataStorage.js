import { Logger } from "./logger.js";
/**
 * Class for storing data to local storage if available or in-memory storage otherwise
 */
export class DataStorage {
    static _GetStorage() {
        try {
            localStorage.setItem("test", "");
            localStorage.removeItem("test");
            return localStorage;
        }
        catch {
            const inMemoryStorage = {};
            return {
                getItem: (key) => {
                    const value = inMemoryStorage[key];
                    return value === undefined ? null : value;
                },
                setItem: (key, value) => {
                    inMemoryStorage[key] = value;
                },
            };
        }
    }
    /**
     * Reads a string from the data storage
     * @param key The key to read
     * @param defaultValue The value if the key doesn't exist
     * @returns The string value
     */
    static ReadString(key, defaultValue) {
        const value = this._Storage.getItem(key);
        return value !== null ? value : defaultValue;
    }
    /**
     * Writes a string to the data storage
     * @param key The key to write
     * @param value The value to write
     */
    static WriteString(key, value) {
        this._Storage.setItem(key, value);
    }
    /**
     * Reads a boolean from the data storage
     * @param key The key to read
     * @param defaultValue The value if the key doesn't exist
     * @returns The boolean value
     */
    static ReadBoolean(key, defaultValue) {
        const value = this._Storage.getItem(key);
        return value !== null ? value === "true" : defaultValue;
    }
    /**
     * Writes a boolean to the data storage
     * @param key The key to write
     * @param value The value to write
     */
    static WriteBoolean(key, value) {
        this._Storage.setItem(key, value ? "true" : "false");
    }
    /**
     * Reads a number from the data storage
     * @param key The key to read
     * @param defaultValue The value if the key doesn't exist
     * @returns The number value
     */
    static ReadNumber(key, defaultValue) {
        const value = this._Storage.getItem(key);
        return value !== null ? parseFloat(value) : defaultValue;
    }
    /**
     * Writes a number to the data storage
     * @param key The key to write
     * @param value The value to write
     */
    static WriteNumber(key, value) {
        this._Storage.setItem(key, value.toString());
    }
    /**
     * Reads a JSON value from the data storage
     * @param key The key to read
     * @param defaultValue The value if the key doesn't exist
     * @returns The JSON value
     */
    static ReadJson(key, defaultValue) {
        const value = this._Storage.getItem(key);
        try {
            return value !== null ? JSON.parse(value) : defaultValue;
        }
        catch (e) {
            Logger.Warn(`Failed to parse JSON from storage for key "${key}". Returning default value.`, e);
            return defaultValue;
        }
    }
    /**
     * Writes a JSON value to the data storage
     * @param key The key to write
     * @param value The JSON value to write
     */
    static WriteJson(key, value) {
        this._Storage.setItem(key, JSON.stringify(value));
    }
}
DataStorage._Storage = DataStorage._GetStorage();
//# sourceMappingURL=dataStorage.js.map