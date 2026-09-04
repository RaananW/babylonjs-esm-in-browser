/** @internal */
// eslint-disable-next-line @typescript-eslint/naming-convention
function createXMLHttpRequest() {
    // If running in Babylon Native, then defer to the native XMLHttpRequest, which has the same public contract
    if (typeof _native !== "undefined" && _native.XMLHttpRequest) {
        return new _native.XMLHttpRequest();
    }
    else {
        return new XMLHttpRequest();
    }
}
/**
 * Extended version of XMLHttpRequest with support for customizations (headers, ...)
 */
export class WebRequest {
    constructor() {
        this._xhr = createXMLHttpRequest();
        this._requestURL = "";
    }
    /**
     * This function can be called to check if there are request modifiers for network requests
     * @returns true if there are any custom requests available
     */
    static get IsCustomRequestAvailable() {
        return Object.keys(WebRequest.CustomRequestHeaders).length > 0 || WebRequest.CustomRequestModifiers.length > 0;
    }
    static _CleanUrl(url) {
        url = url.replace("file:http:", "http:");
        url = url.replace("file:https:", "https:");
        return url;
    }
    static _ShouldSkipRequestModifications(url) {
        return WebRequest.SkipRequestModificationForBabylonCDN && (url.includes("preview.babylonjs.com") || url.includes("cdn.babylonjs.com"));
    }
    /**
     * Merges `CustomRequestHeaders` and `CustomRequestModifiers` into a plain headers record and returns the
     * (possibly rewritten) URL. Can be used to apply URL and header customizations without making a network
     * request (e.g. for streaming media where the download is handled by the browser natively).
     * @param url - The initial URL to modify.
     * @param baseHeaders - An optional set of headers to start with (e.g. from the caller's options) that modifiers can further modify.
     * @returns An object containing the final URL and the merged headers after applying all modifiers and header customizations.
     * @internal
     */
    static _CollectCustomizations(url, baseHeaders = {}) {
        const headers = { ...baseHeaders };
        if (WebRequest._ShouldSkipRequestModifications(url)) {
            return { url, headers };
        }
        for (const key in WebRequest.CustomRequestHeaders) {
            const val = WebRequest.CustomRequestHeaders[key];
            if (val) {
                headers[key] = val;
            }
        }
        // Provide a minimal proxy so modifiers can call setRequestHeader as they would on a real XHR.
        const xhrProxy = {
            setRequestHeader: (name, value) => {
                headers[name] = value;
            },
        };
        for (const modifier of WebRequest.CustomRequestModifiers) {
            if (WebRequest._ShouldSkipRequestModifications(url)) {
                break;
            }
            const newUrl = modifier(xhrProxy, url);
            if (typeof newUrl === "string") {
                url = newUrl;
            }
        }
        return { url, headers };
    }
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
    static async FetchAsync(url, options = {}) {
        const method = options.method ?? "GET";
        if (typeof fetch !== "undefined") {
            // Use the Fetch API. Collect all customizations into a plain headers object first, since the
            // Fetch API does not share the XHR instance that WebRequest.open/send work with.
            const { url: resolvedUrl, headers } = WebRequest._CollectCustomizations(WebRequest._CleanUrl(url), options.headers ?? {});
            return await fetch(resolvedUrl, { method, headers, body: options.body ?? undefined });
        }
        // Fallback: use a WebRequest instance, which handles _CleanUrl, CustomRequestModifiers and
        // CustomRequestHeaders (via open()) internally — wrapping the response in a Promise<Response>.
        return await new Promise((resolve, reject) => {
            const request = new WebRequest();
            request.responseType = "arraybuffer";
            request.addEventListener("readystatechange", () => {
                if (request.readyState === 4) {
                    if (request.status >= 200 && request.status < 300) {
                        const responseHeaders = typeof Headers !== "undefined" ? new Headers() : undefined;
                        const contentType = request.getResponseHeader("Content-Type");
                        if (contentType && responseHeaders) {
                            responseHeaders.set("Content-Type", contentType);
                        }
                        if (typeof Response !== "undefined") {
                            resolve(new Response(request.response, { status: request.status, statusText: request.statusText, headers: responseHeaders }));
                        }
                        else {
                            // Minimal Response-like object for environments lacking the Fetch API globals.
                            resolve({
                                ok: true,
                                status: request.status,
                                statusText: request.statusText,
                                headers: { get: (name) => request.getResponseHeader(name) },
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                arrayBuffer: async () => await Promise.resolve(request.response),
                            });
                        }
                    }
                    else {
                        reject(new Error(`HTTP ${request.status} loading '${request.requestURL}': ${request.statusText}`));
                    }
                }
            });
            request.open(method, url, options.headers);
            request.send(options.body ?? null);
        });
    }
    /**
     * Returns the requested URL once open has been called
     */
    get requestURL() {
        return this._requestURL;
    }
    /**
     * Gets or sets a function to be called when loading progress changes
     */
    get onprogress() {
        return this._xhr.onprogress;
    }
    set onprogress(value) {
        this._xhr.onprogress = value;
    }
    /**
     * Returns client's state
     */
    get readyState() {
        return this._xhr.readyState;
    }
    /**
     * Returns client's status
     */
    get status() {
        return this._xhr.status;
    }
    /**
     * Returns client's status as a text
     */
    get statusText() {
        return this._xhr.statusText;
    }
    /**
     * Returns client's response
     */
    get response() {
        return this._xhr.response;
    }
    /**
     * Returns client's response url
     */
    get responseURL() {
        return this._xhr.responseURL;
    }
    /**
     * Returns client's response as text
     */
    get responseText() {
        return this._xhr.responseText;
    }
    /**
     * Gets or sets the expected response type
     */
    get responseType() {
        return this._xhr.responseType;
    }
    set responseType(value) {
        this._xhr.responseType = value;
    }
    /**
     * Gets or sets the timeout value in milliseconds
     */
    get timeout() {
        return this._xhr.timeout;
    }
    set timeout(value) {
        this._xhr.timeout = value;
    }
    addEventListener(type, listener, options) {
        this._xhr.addEventListener(type, listener, options);
    }
    removeEventListener(type, listener, options) {
        this._xhr.removeEventListener(type, listener, options);
    }
    /**
     * Cancels any network activity
     */
    abort() {
        this._xhr.abort();
    }
    /**
     * Initiates the request. The optional argument provides the request body. The argument is ignored if request method is GET or HEAD
     * @param body defines an optional request body
     */
    send(body) {
        this._xhr.send(body);
    }
    /**
     * Sets the request method, request URL
     * @param method defines the method to use (GET, POST, etc..)
     * @param url defines the url to connect with
     * @param baseHeaders optional headers to include as a base before applying CustomRequestHeaders and modifiers
     */
    open(method, url, baseHeaders) {
        const { url: modifiedUrl, headers } = WebRequest._CollectCustomizations(url, baseHeaders);
        this._requestURL = WebRequest._CleanUrl(modifiedUrl);
        this._xhr.open(method, this._requestURL, true);
        // Apply the collected headers (CustomRequestHeaders + modifier-set headers) to the XHR.
        // Must happen after open() and before send().
        for (const key in headers) {
            this._xhr.setRequestHeader(key, headers[key]);
        }
    }
    /**
     * Sets the value of a request header.
     * @param name The name of the header whose value is to be set
     * @param value The value to set as the body of the header
     */
    setRequestHeader(name, value) {
        this._xhr.setRequestHeader(name, value);
    }
    /**
     * Get the string containing the text of a particular header's value.
     * @param name The name of the header
     * @returns The string containing the text of the given header name
     */
    getResponseHeader(name) {
        return this._xhr.getResponseHeader(name);
    }
}
/**
 * Custom HTTP Request Headers to be sent with XMLHttpRequests
 * i.e. when loading files, where the server/service expects an Authorization header
 */
WebRequest.CustomRequestHeaders = {};
/**
 * Add callback functions in this array to update all the requests before they get sent to the network
 */
WebRequest.CustomRequestModifiers = new Array();
/**
 * If set to true, requests to Babylon.js CDN requests will not be modified
 */
WebRequest.SkipRequestModificationForBabylonCDN = true;
//# sourceMappingURL=webRequest.js.map