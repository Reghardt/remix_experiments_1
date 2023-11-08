import { OAuth2Client } from 'google-auth-library';
import querystring from 'node:querystring';


/**
 * @description 
 * Verifies the idToken returned by google to check if it is valid. Uses google's OAuth2Client.
 * This catches the posibility of a tampered with token
 * 
 * @remarks 
 * Credential and idToken used interchangably by google
 *  
 * @param decodedRequestBody 
 * parsed query string received from the google sign in redirect. Was origionaly URL encoded. Should be decoded here
 * 
 * @returns 
 * the user's userId, which is is the sub field in the idToken, along with the user's name, which is the first name only
 * 
 * @throws Post Body IdToken Malformed.
 * Throws if no credentials property was found on decodedRequestBody, or if credentials is not a string
 * 
 * @throws idToken could not be verified
 * Throws if the OAuth2Client valiation failed
 */
export async function verifyIdToken(decodedRequestBody: querystring.ParsedUrlQuery)
{
    const idToken = decodedRequestBody["credential"]
    if(idToken === undefined || typeof idToken !== "string")
    {
        throw new Error("Post Body IdToken Malformed.")
    }

    try
    {
        // https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
        const client = new OAuth2Client();
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });

        // the sub field is the users unique user id
        // given_name is not guaranteed to be present
        return {userId: ticket.getUserId(), name: ticket.getPayload()?.given_name ?? ""} 
    }
    catch(error)
    {
        throw new Error("idToken could not be verified");
    }

}

/**
 * @description 
 * Gets the CSRF token from the request's cookie.
 * 
 * @remarks
 * Google sign in attaches a CSRF token to the request cookie and the request body.
 * If they match, no CSRF occured.
 * Uses querystring.decode() which is a node function. Used on the cookie content as its url encoded.
 * 
 * @param request 
 * The request received from google from which the function gets the cookie with the CSRF token
 * 
 * @returns the CSRF token value
 * 
 * @throws No CSRF cookie in request
 * Throws if no cookie was found in the request
 * 
 * @throws No CSRF token in Cookie
 * If a cookie exists but it does not contain a CSRF token
 */
export function getCSRFTokenFromCookie(request: Request)
{
    const csrf_cookie = request.headers.get("cookie")
    if(!csrf_cookie)
    {
        throw new Error("No CSRF cookie in request.");
    }
    else
    {
        const decoded_csrf_cookie = querystring.decode(csrf_cookie);
        const g_csrf_token = decoded_csrf_cookie["g_csrf_token"]
        if(typeof g_csrf_token !== "string")
        {
            throw new Error("No CSRF token in Cookie.");
        }
        return g_csrf_token
    }
}

/**
 * @description 
 * Gets the CSRF token from the request's body.
 * 
 * @remarks
 * Google sign in attaches a CSRF token to the request cookie and the request body.
 * If they match, no CSRF occured.
 * 
 * @param request 
 * The request received from google containing the CSRF token
 * 
 * @returns the CSRF token value
 * 
 * @throws No CSRF token in post body.
 * Throws if no token was found in the request body
 */
export function getCSRFTokenFromBody(decodedRequestBody: querystring.ParsedUrlQuery)
{
    const g_csrf_token = decodedRequestBody["g_csrf_token"]
    if(typeof g_csrf_token !== "string")
    {
        throw new Error("No CSRF token in post body.")
    }
    else
    {
        return g_csrf_token
    }
}

