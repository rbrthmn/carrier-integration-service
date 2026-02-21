import {HttpClient} from "../src/http/client";

export function createMockHttpClient() {
    type ResponseHandler = {
        status?: number;
        data?: any;
        headers?: Record<string, string>;
        isTimeout?: boolean;
        once?: boolean;
    };

    const handlers = new Map<string, ResponseHandler[]>();

    const history: { post: { url: string; data: any; headers?: any }[] } = {
        post: []
    };

    const addHandler = (url: string, handler: ResponseHandler) => {
        if (!handlers.has(url)) {
            handlers.set(url, []);
        }
        handlers.get(url)!.push(handler);
    };

    const client: HttpClient & any = {
        async post(url: string, body: any, options?: any) {
            history.post.push({ url, data: body, headers: options?.headers });

            const urlHandlers = handlers.get(url);
            if (!urlHandlers || urlHandlers.length === 0) {
                throw new Error(`No mock handler found for POST ${url}`);
            }

            const handler = urlHandlers.length > 1 && urlHandlers[0].once
                ? urlHandlers.shift()!
                : urlHandlers[0];

            if (handler.isTimeout) {
                const error: any = new Error('timeout');
                error.code = 'ECONNABORTED';
                throw error;
            }

            if (handler.status && handler.status >= 400) {
                const error: any = new Error('Request failed');
                error.response = {
                    status: handler.status,
                    data: handler.data,
                    headers: handler.headers
                };
                throw error;
            }

            return handler.data;
        },

        onPost(url: string) {
            return {
                reply(status: number, data: any, headers?: Record<string, string>) {
                    addHandler(url, { status, data, headers });
                },
                replyOnce(status: number, data: any, headers?: Record<string, string>) {
                    addHandler(url, { status, data, headers, once: true });
                },
                timeout() {
                    addHandler(url, { isTimeout: true });
                }
            };
        },

        history
    };

    return client;
}

export const testConfig = {
    clientId: 'test-client',
    clientSecret: 'test-secret',
    ratingUrl: '/rating',
    tokenUrl: '/oauth/token'
} as any;

export const successResponse = {
    RateResponse: {
        RatedShipment: [
            {
                Service: { Code: '03', Description: 'UPS' },
                TotalCharges: { MonetaryValue: '10.50', CurrencyCode: 'USD' }
            }
        ]
    }
};

export const errorResponse = {
    response: {
        errors: [{ code: '10001', message: 'message' }]
    }
};
