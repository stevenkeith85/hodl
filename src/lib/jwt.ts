import { Redis } from '@upstash/redis';

import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export const accessTokenExpiresIn = 60 * 60; // 1 hour
export const refreshTokenExpiresIn = 60 * 60 * 24 * 30; // need to login once a month

const client = Redis.fromEnv();


// This will return a status code and a 'refreshed' value that we
// can use with axios to retry the request
export const apiAuthenticate = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken || !refreshToken) {
    req.address = null;
    return next(); // we check for req.address being present in api endpoints that need the user to be auth'd
  }

  try {
    const { address } = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.address = address;
    return next();

  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      try {
        const { sessionId } = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const { address } = jwt.decode(accessToken);

        const storedSessionId = await client.hget(`user:${address}`, 'sessionId');

        // The sessionId that was set in the (longer lasting) refreshToken matches what we have in the database; so this looks legit
        // Give the user a new accessToken
        if (sessionId == storedSessionId) {
          const accessToken = jwt.sign({ address, sessionId }, process.env.JWT_SECRET, { expiresIn: accessTokenExpiresIn });

          res.setHeader('Set-Cookie', [
            cookie.serialize('accessToken', accessToken, { httpOnly: true, path: '/', sameSite: 'Lax' }), // Setting this to 'lax' should prevent CSRF attacks; as our state changing endpoints use POST or DELETE
          ])

          const timestamp = Date.now();

          // we've update the cookie; so the browser can retry. 
          // (we have an axios retry set up if refreshed is true)
          return res.status(401).json({ refreshed: true });
        }

        // the sessionId does not match the storedSessionId
        // the user has previously logged out; perhaps on another device

        // user will need to re-login to re-auth
        // the next endpoint may not require auth though; so clear req.address and forward the request to it

        req.address = null;
        return next();
      } catch (e) {
        // the verify call has failed, 
        // the refreshToken has expired. 
        // TODO: This doesn't do exactly the same as our logout function in api/auth - check if we need to update this
        res.setHeader('Set-Cookie', [
          cookie.serialize('accessToken', "", { httpOnly: true, path: '/', maxAge: -1 }),
          cookie.serialize('refreshToken', "", { httpOnly: true, path: '/', maxAge: -1 })
        ])
        return res.status(401).json({ refreshed: false });
      }
    }

    // This is unlikely to happen in the wild; but if it does; just log the user out
    // WE usually see it when switching from dev to prod mode (as we have a different jwt secret for both); 
    if (e instanceof jwt.JsonWebTokenError) {

      req.address = null;
      return next();
    }

    // just forward the call if there's anything we aren't handling
    req.address = null;
    return next();
  }

}

// This just sets req.address and returns a boolean to let us know whether
// we were able to authenticate the user
export const authenticate = async (req, res): Promise<boolean> => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken || !refreshToken) {
    console.log('AUTH: access or refresh token missing')
    return false;
  }

  try {
    const { address } = jwt.verify(accessToken, process.env.JWT_SECRET);
    console.log('AUTH: successfully verified access token, setting req.address')
    req.address = address;
    return true;
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      try {
        const { sessionId } = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const { address } = jwt.decode(accessToken);

        const storedSessionId = await client.hget(`user:${address}`, 'sessionId');

        // The sessionId that was set in the (longer lasting) refreshToken matches what we have in the database; so this looks legit
        // Give the user a new accessToken
        if (sessionId == storedSessionId) {
          const accessToken = jwt.sign({ address, sessionId }, process.env.JWT_SECRET, { expiresIn: accessTokenExpiresIn });

          console.log(`AUTH: new access token issued for ${address}`)
          res.setHeader('Set-Cookie', [
            cookie.serialize('accessToken', accessToken, { httpOnly: true, path: '/' , sameSite: 'Lax' }), // Setting this to 'lax' should prevent CSRF attacks; as our state changing endpoints use POST or DELETE
          ])

          return true;
        }

        // the sessionId does not match the storedSessionId
        // the user has been logged out; by themselves - or us
        // user will need to re-login
        console.log(`AUTH: the sessionId does not match the storedSessionId for ${address}`)
        return false;
      } catch (e) {
        // the verify call has failed, 
        // the refreshToken has expired. 
        // TODO: This doesn't do exactly the same as our logout function in api/auth - check if we need to update this
        res.setHeader('Set-Cookie', [
          cookie.serialize('accessToken', "", { httpOnly: true, path: '/', maxAge: -1 }),
          cookie.serialize('refreshToken', "", { httpOnly: true, path: '/', maxAge: -1 })
        ])
        return false;
      }
    }

    if (e instanceof jwt.JsonWebTokenError) {
      console.log(`AUTH: secrets dont match, have switched from dev to prod or vice versa`)

      res.setHeader('Set-Cookie', [
        cookie.serialize('accessToken', "", { httpOnly: true, path: '/', maxAge: -1 }),
        cookie.serialize('refreshToken', "", { httpOnly: true, path: '/', maxAge: -1 })
      ])
      return false;
    }

    console.log(`AUTH: something has gone wrong with the auth`, e);

    // just log them out if there's any issue we aren't handling
    return false;
  }
}