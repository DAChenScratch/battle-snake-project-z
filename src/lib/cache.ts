import { BTData } from "../types/BTData";

export function cache(data: BTData, key: string, value: any) {
    if (!data.cache[key]) {
        data.cache[key] = value;
    }
    return data.cache[key];
}