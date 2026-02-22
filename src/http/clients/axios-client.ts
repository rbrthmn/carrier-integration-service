import {HttpClient} from "../client";

export class AxiosClient implements HttpClient {
    post<T>(url: string, body: any, options?: { headers?: Record<string, string> }): Promise<T> {
        return Promise.resolve(undefined);
    }
}
