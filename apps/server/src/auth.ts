import { Hono } from 'hono';
import { sha256 } from 'js-sha256';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';

const baseUrl = 'https://q.trap.jp/api/v3/oauth2';

const codeVerifierKey = (state: string) => `traq-auth-code-verifier-${state}`;
export const tokenKey = 'traq-auth-token';

const clientId = process.env.TRAQ_AUTH_CLIENT_ID;
if (!clientId) throw new Error('TRAQ_AUTH_CLIENT_ID is not set');

const randomString = (len: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  let array = crypto.getRandomValues(new Uint32Array(len));
  array = array.map((val) => characters.charCodeAt(val % charactersLength));
  return String.fromCharCode(...array);
};

const getCodeChallenge = (codeVerifier: string) => {
  const sha256Result = sha256(codeVerifier);
  const bytes = new Uint8Array(sha256Result.length / 2);
  for (let i = 0; i < sha256Result.length; i += 2) {
    bytes[i / 2] = Number.parseInt(sha256Result.substring(i, i + 2), 16);
  }
  const base64 = btoa(String.fromCharCode(...bytes));
  const base64url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  return base64url;
};

export const getTraqAuthCodeRequestUrl = () => {
  const url = baseUrl + '/authorize';

  const state = randomString(10);
  const codeVerifier = randomString(43);
  const codeChallenge = getCodeChallenge(codeVerifier);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  const redirectUri = url + '?' + params.toString();

  return { redirectUri, codeVerifier, state };
};

export const sendTraqAuthTokenRequest = (code: string, codeVerifier: string) => {
  const url = baseUrl + '/token';

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    code,
    code_verifier: codeVerifier,
  });

  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    credentials: 'omit',
    body: body.toString(),
  });
};

export const traqAuthRoutes = () => {
  const app = new Hono();

  const routes = app
    .get('/request', async (c) => {
      const { redirectUri, codeVerifier, state } = getTraqAuthCodeRequestUrl();
      setCookie(c, codeVerifierKey(state), codeVerifier, {
        maxAge: 60 * 60,
        secure: true,
        httpOnly: true,
        sameSite: 'Lax',
      });
      return c.redirect(redirectUri);
    })
    .get('/callback', async (c) => {
      const code = c.req.query('code');
      const state = c.req.query('state');
      if (typeof code !== 'string' || typeof state !== 'string') {
        c.status(400);
        return c.redirect('/');
      }

      const codeVerifier = getCookie(c, codeVerifierKey(state));
      if (typeof codeVerifier !== 'string') {
        c.status(400);
        return c.redirect('/');
      }

      const tokenRes = await sendTraqAuthTokenRequest(code, codeVerifier);
      const tokenData = await tokenRes.json();

      const token = tokenData.access_token;
      deleteCookie(c, codeVerifierKey(state));
      if (typeof token !== 'string') {
        c.status(500);
        return c.redirect('/');
      }

      setCookie(c, tokenKey, token, {
        secure: true,
        httpOnly: true,
        sameSite: 'None',
      });

      return c.redirect('/');
    });

  return routes;
};
