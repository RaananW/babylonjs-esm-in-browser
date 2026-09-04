import { type IWebRequest } from "./interfaces/iWebRequest.js";
import { type Nullable } from "../types.js";
/**
 * Extended version of XMLHttpRequest with support for customizations (headers, ...)
 */
export declare class WebRequest implements IWebRequest {
    private readonly _xhr;
    /**
     * Custom HTTP Request Headers to be sent with XMLHttpRequests
     * i.e. when loading files, where the server/service expects an Authorization header
     */
    static CustomRequestHeaders: {
        [key: string]: string;
    };
    /**
     * Add callback functions in this array to update all the requests before they get sent to the network
     */
    static CustomRequestModifiers: ((request: XMLHttpRequest, url: string) => string | void)[];
    /**
     * If set to true, requests to Babylon.js CDN requests will not be modified
     */
    static SkipRequestModificationForBabylonCDN: boolean;
    /**
     * This function can be called to check if there are request modifiers for network requests
     * @returns true if there are any custom requests available
     */
    static get IsCustomRequestAvailable(): boolean;
    private static _CleanUrl;
    private static _ShouldSkipRequestModifications;
    /**
     * Merges `CustomRequestHeaders` and `CustomRequestModifiers` into a plain headers record and returns the
     * (possibly rewritten) URL. Can be used to apply URL and header customizations without making a network
     * request (e.g. for streaming media where the download is handled by the browser natively).
     * @param url - The initial URL to modify.
     * @param baseHeaders - An optional set of headers to start with (e.g. from the caller's options) that modifiers can further modify.
     * @returns An object containing the final URL and the merged headers after applying all modifiers and header customizations.
     * @internal
     */
    static _CollectCustomizations(url: string, baseHeaders?: Record<string, string>): {
        url: string;
        headers: Record<string, string>;
    };
    /**
     * Performs a network request using the Fetch API when available on the platform, falling back to XMLHttpRequest.
     * `WebRequest.CustomRequestHeaders` and `WebRequest.CustomRequestModifiers` are applied in both cases.
     *
     * For `CustomRequestModifiers`, a minimal proxy XHR is provided to each modifier so that calls to
     * `setRequestHeader` on it are captured and forwarded to the underlying request. The URL returned by a
     * modifier (if any) replaces the current URL before the next modifier runs.
     *
     * @param url - The URL to request.
     * @param options - Optional request options (method, headers, body).
     * @returns A Promise that resolves to a `Response`.
     */
    static FetchAsync(url: string, options?: {
        method?: string;
        headers?: Record<string, string>;
        body?: BodyInit | null;
    }): Promise<Response>;
    private _requestURL;
    /**
     * Returns the requested URL once open has been called
     */
    get requestURL(): string;
    /**
     * Gets or sets a function to be called when loading progress changes
     */
    get onprogress(): ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
    set onprogress(value: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null);
    /**
     * Returns client's state
     */
    get readyState(): number;
    /**
     * Returns client's status
     */
    get status(): number;
    /**
     * Returns client's status as a text
     */
    get statusText(): string;
    /**
     * Returns client's response
     */
    get response(): any;
    /**
     * Returns client's response url
     */
    get responseURL(): string;
    /**
     * Returns client's response as text
     */
    get responseText(): string;
    /**
     * Gets or sets the expected response type
     */
    get responseType(): XMLHttpRequestResponseType;
    set responseType(value: XMLHttpRequestResponseType);
    /**
     * Gets or sets the timeout value in milliseconds
     */
    get timeout(): number;
    set timeout(value: number);
    /** @internal */
    addEventListener<K extends keyof XMLHttpRequestEventMap>(type: K, listener: (this: XMLHttpRequest, ev: XMLHttpRequestEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    /** @internal */
    removeEventListener<K extends keyof XMLHttpRequestEventMap>(type: K, listener: (this: XMLHttpRequest, ev: XMLHttpRequestEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    /**
     * Cancels any network activity
     */
    abort(): void;
    /**
     * Initiates the request. The optional argument provides the request body. The argument is ignored if request method is GET or HEAD
     * @param body defines an optional request body
     */
    send(body?: Document | XMLHttpRequestBodyInit | null): void;
    /**
     * Sets the request method, request URL
     * @param method defines the method to use (GET, POST, etc..)
     * @param url defines the url to connect with
     * @param baseHeaders optional headers to include as a base before applying CustomRequestHeaders and modifiers
     */
    open(method: string, url: string, baseHeaders?: Record<string, string>): void;
    /**
     * Sets the value of a request header.
     * @param name The name of the header whose value is to be set
     * @param value The value to set as the body of the header
     */
    setRequestHeader(name: string, value: string): void;
    /**
     * Get the string containing the text of a particular header's value.
     * @param name The name of the header
     * @returns The string containing the text of the given header name
     */
    getResponseHeader(name: string): Nullable<string>;
}
