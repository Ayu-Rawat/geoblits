import CryptoJS from "crypto-js";

const HASH_SALT = process.env.NEXT_PUBLIC_HASH_SALT;

export const encryptData = (text) => {
  return CryptoJS.AES.encrypt(text, HASH_SALT).toString();
};

export const decryptData = (cipherText) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, HASH_SALT);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error("Decryption failed", e);
    return null;
  }
};
