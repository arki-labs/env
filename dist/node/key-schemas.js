import { PrivateKey, PublicKey } from 'eciesjs';
import { z } from 'zod';
import { is, parse } from '@arki/schema';
const publicHex = z.string().regex(/^(?:0[23][a-f\d]{64}|04[a-f\d]{128})$/i);
const privateHex = z.string().regex(/^[a-f\d]{64}$/i);
/** Standard Schema for an external public key; issue text never echoes the key. */
export const envPublicKeySchema = z.custom(value => {
    if (!is(value, publicHex))
        return false;
    try {
        PublicKey.fromHex(value, 'secp256k1');
        return true;
    }
    catch {
        return false;
    }
}, 'Invalid env public key');
/** Standard Schema for an external private key; issue text never echoes the key. */
export const envPrivateKeySchema = z.custom(value => {
    if (!is(value, privateHex))
        return false;
    try {
        PrivateKey.fromHex(value, 'secp256k1');
        return true;
    }
    catch {
        return false;
    }
}, 'Invalid env private key');
/** Parse an external public key without manufacturing a brand. */
export function parsePublicKey(value) {
    return parse(envPublicKeySchema, value);
}
/** Parse an external private key without exposing its bytes in issues. */
export function parsePrivateKey(value) {
    return parse(envPrivateKeySchema, value);
}
//# sourceMappingURL=key-schemas.js.map