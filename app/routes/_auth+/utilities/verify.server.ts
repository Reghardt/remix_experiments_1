import { OAuth2Client } from 'google-auth-library';
import querystring from 'node:querystring';


/**
 * 
 * @param decodedRequestBody 
 */
export async function verify(decodedRequestBody: querystring.ParsedUrlQuery)
{
    
    //Credential and idToken used interchangably by google
    const idToken = decodedRequestBody["credential"]
    if(typeof idToken !== "string")
    {
        throw new Error("Post Body IdToken Malformed.")
    }

    try
    {
        //OAuth2Client is used to validate Google ID tokens
        //https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
        const client = new OAuth2Client();
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });

        //given_name is not guaranteed to be present
        return {userId: ticket.getUserId(), name: ticket.getPayload()?.given_name ?? ""} 
    }
    catch(error)
    {
        throw new Error("idToken could not be verified");
    }

}

