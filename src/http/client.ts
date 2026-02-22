export  interface HttpClient {
    post<T>(url: string, body: any, options?: { headers?: Record<string, string>, timeout?: number }): Promise<T>;
}
