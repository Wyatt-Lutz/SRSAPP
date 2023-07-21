import CryptoAES from 'crypto-js/aes';
import CryptoENC from 'crypto-js/enc-utf8';

export async function issueCookie(data, servKeyPromise) {
  const servKey = await servKeyPromise;

  const now = new Date();
  const expireTime = new Date(now.getTime() + 604800000);
  const expires = expireTime.toUTCString();

  const path = '/';
  const secure = true;
  const httpOnly = true;
  const sameSite = 'lax';

  const cookieData = [data.Email, data.Password];

  var encodedData = CryptoAES.encrypt(
    cookieData.toString(),
    servKey,
  ).toString();

  document.cookie = `rememberMeToken=${encodedData};expires=${expires};path=${path};secure=${secure};sameSite=${sameSite};`;
}

export async function decodeCookie(servKeyPromise) {
  const servKey = await servKeyPromise;

  const cookies = document.cookie;
  const [_, cookieDatas] = cookies.split('=');

  const decryptedData = CryptoAES.decrypt(cookieDatas, servKey).toString(
    CryptoENC,
  );
  return decryptedData;
}