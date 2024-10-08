import { pbkdf2Sync } from "pbkdf2";
import aesjs from "aes-js";

/**
 * Encrypts plaintext using AES-GCM with supplied password, for decryption with aesGcmDecrypt().
 *                                                                      (c) Chris Veness MIT Licence
 *
 * @param   {ArrayBuffer} arraybuffer - Plaintext to be encrypted.
 * @param   {String} password - Password to use to encrypt plaintext.
 * @returns {String} Encrypted ciphertext.
 *
 * @example
 *   const ciphertext = await aesGcmEncrypt('my secret text', 'pw');
 *   aesGcmEncrypt('my secret text', 'pw').then(function(ciphertext) { console.log(ciphertext); });
 */
export async function aesGcmEncrypt(arraybuffer, password) {
  const pwUtf8 = new TextEncoder().encode(password); // encode password as UTF-8
  const pwHash = await crypto.subtle.digest("SHA-256", pwUtf8); // hash the password

  const iv = crypto.getRandomValues(new Uint8Array(12)); // get 96-bit random iv
  const ivStr = Array.from(iv)
    .map((b) => String.fromCharCode(b))
    .join(""); // iv as utf-8 string

  const alg = { name: "AES-GCM", iv: iv }; // specify algorithm to use

  const key = await crypto.subtle.importKey("raw", pwHash, alg, false, [
    "encrypt",
  ]); // generate key from pw

  // const ptUint8 = new TextEncoder().encode(arraybuffer);                               // encode plaintext as UTF-8
  const ctBuffer = await crypto.subtle.encrypt(alg, key, arraybuffer); // encrypt plaintext using key

  // return ctBuffer;
  const ctArray = Array.from(new Uint8Array(ctBuffer)); // ciphertext as byte array
  const ctStr = ctArray.map((byte) => String.fromCharCode(byte)).join(""); // ciphertext as string

  console.log("ivStr", ivStr);
  console.log("ctStr", ctStr);
  console.log("ctArray", ctArray);

  return btoa(ivStr + ctStr, "base64"); // iv+ciphertext base64-encoded
}

/**
 * Decrypts ciphertext encrypted with aesGcmEncrypt() using supplied password.
 *                                                                      (c) Chris Veness MIT Licence
 *
 * @param   {String} ciphertext - Ciphertext to be decrypted.
 * @param   {String} password - Password to use to decrypt ciphertext.
 * @returns {ArrayBuffer} Decrypted arraybuffer.
 *
 * @example
 *   const plaintext = await aesGcmDecrypt(ciphertext, 'pw');
 *   aesGcmDecrypt(ciphertext, 'pw').then(function(plaintext) { console.log(plaintext); });
 */
export async function aesGcmDecrypt(ciphertext, password) {
  console.log(ciphertext);
  const pwUtf8 = new TextEncoder().encode(password); // encode password as UTF-8
  const pwHash = await crypto.subtle.digest("SHA-256", pwUtf8); // hash the password

  const ivStr = atob(ciphertext).slice(0, 12); // decode base64 iv
  const iv = new Uint8Array(Array.from(ivStr).map((ch) => ch.charCodeAt(0))); // iv as Uint8Array

  const alg = { name: "AES-GCM", iv: iv }; // specify algorithm to use

  const key = await crypto.subtle.importKey("raw", pwHash, alg, false, [
    "decrypt",
  ]); // generate key from pw

  const ctStr = atob(ciphertext).slice(12); // decode base64 ciphertext
  const ctUint8 = new Uint8Array(
    Array.from(ctStr).map((ch) => ch.charCodeAt(0))
  ); // ciphertext as Uint8Array
  // note: why doesn't ctUint8 = new TextEncoder().encode(ctStr) work?

  console.log("ivStr", ivStr);
  console.log("ctStr", ctStr);
  console.log("ctUint8", ctUint8);

  try {
    const plainBuffer = await crypto.subtle.decrypt(alg, key, ctUint8); // decrypt ciphertext using key
    return plainBuffer;
    // const plaintext = new TextDecoder().decode(plainBuffer);                       // plaintext from ArrayBuffer
    // return plaintext;                                                              // return the plaintext
  } catch (e) {
    console.log(e);
  }
}

export async function aesEncrypt(arraybuffer, password) {
  const key_128 = pbkdf2Sync(password, "salt", 1, 16, "sha512");
  console.log(key_128);
  const aesCtr = new aesjs.ModeOfOperation.ctr(key_128);
  const textBytes = new Uint8Array(arraybuffer);
  console.log(textBytes);
  const encryptedBytes = aesCtr.encrypt(textBytes);
  console.log(encryptedBytes);
  return encryptedBytes;
}

export async function aesDecrypt(arraybuffer, password) {
  const key_128 = pbkdf2Sync(password, "salt", 1, 16, "sha512");
  console.log(key_128);
  const aesCtr = new aesjs.ModeOfOperation.ctr(key_128);
  const encryptedBytes = new Uint8Array(arraybuffer);
  console.log(encryptedBytes);
  const decryptedBytes = aesCtr.decrypt(encryptedBytes);
  console.log(decryptedBytes);
  return decryptedBytes;
}
