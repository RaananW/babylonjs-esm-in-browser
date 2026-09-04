import { type IOfflineProvider } from "../../Offline/IOfflineProvider.js";
declare module "../abstractEngine.pure.js" {
    interface AbstractEngine {
        /**
         * @internal
         */
        _loadFileAsync(url: string, offlineProvider?: IOfflineProvider, useArrayBuffer?: false): Promise<string>;
        _loadFileAsync(url: string, offlineProvider?: IOfflineProvider, useArrayBuffer?: true): Promise<ArrayBuffer>;
        _loadFileAsync(url: string, offlineProvider?: IOfflineProvider, useArrayBuffer?: boolean): Promise<string | ArrayBuffer>;
    }
}
