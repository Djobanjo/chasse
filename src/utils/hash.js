// hash.js
export async function hashPBKDF2(input) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  // clé/salt fixe pour que le hash soit toujours le même
  const salt = encoder.encode('python'); 

  const key = await crypto.subtle.importKey(
    "raw",
    data,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256
  );

  // Convertir ArrayBuffer en hex
  const hashArray = Array.from(new Uint8Array(derivedBits));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
