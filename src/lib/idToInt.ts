import * as crypto from 'crypto';

export function idToInt(id: string): number {
    return parseInt('0x' + crypto.createHash('md5').update(id).digest('hex'));
}
