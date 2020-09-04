import { BTRequest } from "../types/BTData";

export function cache(request: BTRequest, key: string, value: any) {
    if (!request.cache[key]) {
        request.cache[key] = value;
    }
    return request.cache[key];
}