
// specific salt for this project to prevent rainbow table attacks
export const SALT = "kanyinsola_forever_royal_2024_xyz_99";

export const AUTH_TOKEN_KEY = "v8s2_k9p_token"; // Obfuscated key for localStorage
export const AUTH_TOKEN_VALUE = "c7a8b9d0e1f2g3h4i5j6k7l8m9n0o1p2"; // Obfuscated value for localStorage

export async function hashAnswer(text: string): Promise<string> {
    const normalized = text.toLowerCase().trim();
    const encoder = new TextEncoder();
    const data = encoder.encode(normalized + SALT);

    // Use Web Crypto API which works in modern browsers
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert buffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
}
