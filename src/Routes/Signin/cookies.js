import CryptoAES from 'crypto-js/aes';
import CryptoENC from 'crypto-js/enc-utf8';
import servKey from '../../../dev.js';


//const servKey = process.env.serv_key;

export async function issueCookie(email, password) {
  const now = new Date();
  const expireTime = new Date(now.getTime() + 604800000);
  const expires = expireTime.toUTCString();

  const path = '/';
  const secure = true;
  const httpOnly = true;
  const sameSite = 'lax';

  const cookieData = [email, password];

  var encodedData = CryptoAES.encrypt(
    cookieData.toString(),
    servKey,
  ).toString();

  document.cookie = `rememberMeToken=${encodedData};expires=${expires};path=${path};secure=${secure};sameSite=${sameSite};`;
}

export async function decodeCookie() {
  const cookies = document.cookie;
  const [_, cookieDatas] = cookies.split('=');
  const decryptedData = CryptoAES.decrypt(cookieDatas, servKey).toString(CryptoENC,);
  return decryptedData;
}
