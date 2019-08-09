import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import WordArray from 'crypto-js/lib-typedarrays';
import Hex from 'crypto-js/enc-hex';

const iv = WordArray.create();

/**
 * 随机生成256位的key
 * @returns {number|*|WordArray}
 */
export function randomKey() {
    return WordArray.random(256 / 8);
}

/**
 * 加密
 * @param {string} content - 明文
 * @param {WordArray} key
 * @returns {string} - base64编码后的密文
 */
export function encrypt(content, key = randomKey()) {
    return AES.encrypt(content, key, {iv: iv}).toString();
}

/**
 * 解密
 * @param {string} content - 密文
 * @param {string} key - hex编码后的key
 * @returns {string} - 明文
 */
export function decrypt(content, key) {
    let bytes = AES.decrypt(content, Hex.parse(key), {iv: iv});
    return bytes.toString(Utf8);
}
