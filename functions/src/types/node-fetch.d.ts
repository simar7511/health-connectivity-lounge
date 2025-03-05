
declare module 'node-fetch' {
  export default function fetch(url: string | Request, init?: RequestInit): Promise<Response>;
  export class Request {
    constructor(input: string | Request, init?: RequestInit);
  }
  export class Response {
    constructor(body?: BodyInit, init?: ResponseInit);
    json(): Promise<any>;
    text(): Promise<string>;
    ok: boolean;
    status: number;
    statusText: string;
    headers: Headers;
  }
  export class Headers {
    constructor(init?: HeadersInit);
    append(name: string, value: string): void;
    delete(name: string): void;
    get(name: string): string | null;
    has(name: string): boolean;
    set(name: string, value: string): void;
    forEach(callback: (value: string, name: string) => void): void;
  }
  export type BodyInit = string | Blob | ArrayBufferView | ArrayBuffer | FormData | URLSearchParams | ReadableStream<Uint8Array> | null;
  export type RequestInit = {
    method?: string;
    headers?: HeadersInit;
    body?: BodyInit;
    redirect?: 'follow' | 'error' | 'manual';
    signal?: AbortSignal;
    credentials?: 'omit' | 'same-origin' | 'include';
    mode?: 'cors' | 'no-cors' | 'same-origin';
    cache?: 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached';
  };
  export type HeadersInit = Headers | string[][] | Record<string, string>;
  export type ResponseInit = {
    status?: number;
    statusText?: string;
    headers?: HeadersInit;
  };
}
