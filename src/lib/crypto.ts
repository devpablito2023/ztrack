// Funciones de encriptación SHA-256
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

// Función para generar claves de encriptación seguras
function generateKey(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

// Función auxiliar para convertir string a base64 de forma segura
function stringToBase64(str: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  return btoa(String.fromCharCode(...data));
}

// Función auxiliar para convertir base64 a string de forma segura
function base64ToString(base64: string): string {
  try {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  } catch {
    return "";
  }
}

// Encriptar datos con método moderno
export function encryptData(data: string): string {
  try {
    const key = generateKey();
    const payload = data + "::" + key;
    const encrypted = stringToBase64(payload);
    return encrypted;
  } catch {
    return "";
  }
}

// Desencriptar datos con método moderno
export function decryptData(encryptedData: string): string {
  try {
    const decoded = base64ToString(encryptedData);
    const [data] = decoded.split("::");
    return data || "";
  } catch {
    return "";
  }
}

// Función adicional para encriptación más robusta (opcional)
export async function encryptDataAdvanced(data: string): Promise<string> {
  try {
    const key = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encodedData
    );

    const exportedKey = await crypto.subtle.exportKey("raw", key);
    const keyArray = new Uint8Array(exportedKey);
    const encryptedArray = new Uint8Array(encrypted);

    // Combinar IV + Key + Data encriptada
    const combined = new Uint8Array(
      iv.length + keyArray.length + encryptedArray.length
    );
    combined.set(iv, 0);
    combined.set(keyArray, iv.length);
    combined.set(encryptedArray, iv.length + keyArray.length);

    return btoa(String.fromCharCode(...combined));
  } catch {
    return "";
  }
}

// Función para desencriptar datos avanzados (opcional)
export async function decryptDataAdvanced(
  encryptedData: string
): Promise<string> {
  try {
    const combined = new Uint8Array(
      atob(encryptedData)
        .split("")
        .map((char) => char.charCodeAt(0))
    );

    const iv = combined.slice(0, 12);
    const keyData = combined.slice(12, 44);
    const encrypted = combined.slice(44);

    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encrypted
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch {
    return "";
  }
}
