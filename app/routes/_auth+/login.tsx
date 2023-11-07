import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useIsClient, useScript } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { commitSession, getSession } from "~/sessions.server";


import querystring from 'node:querystring';
import { verify } from "./utilities/verify.server";

// export async function loader({request}: LoaderFunctionArgs){
//     const session = await getSession(request.headers.get("Cookie"));

//     if(session.has("userId"))
//     {
//         return redirect("/")
//     }
//     else
//     {
//         //if the key is part of the session's flash data, it can only be read once, after which it is removed from the session
//         const data = { error: session.get("error")}
   
//         return json(data, {
//             headers: {
//                 "Set-Cookie": await commitSession(session)
//             }
//         })
//     }

//     return json({})
// }

export default function Login()
{
    // const { error } = useLoaderData<typeof loader>()
    const isClient = useIsClient();

    const status = useScript(
        `https://accounts.google.com/gsi/client`,
        {
          removeOnUnmount: false,
        }
      );

    useEffect(() => {

        if(isClient){
        // @ts-expect-error
            const res = google.accounts.id.initialize({
                client_id: window.env.GOOGLE_CLIENT_ID,
                // callback: handleCredentialResponse
                ux_mode: "redirect"
            });

            // @ts-expect-error
            google.accounts.id.renderButton(
                document.getElementById("signInDiv"),
                {width: 100, size: "large"}
            )
        }
        


    }, [status === "ready"])

    return(
        <div>
            {/* <form method="POST">
                <div>
                    <p>Please Sign In</p>
                </div>
                <div className=" grid gap-2">
                    <label>
                        Username: <br/>
                        <input className=" border border-black" type="text" name="username"/>
                    </label>
                    <label>
                        Password: {" "}
                        <br/>
                        <input className=" border border-black" type="password" name="password"/>
                    </label>

                    <button className=" bg-slate-400" type="submit">OK</button>
                </div>

            </form> */}
            <div className="h-12 py-2">
                <div  id="signInDiv"></div>
            </div>
            
        </div>
    )
}


function validateCredentials(username: FormDataEntryValue | null, password: FormDataEntryValue | null) {
    if(username === "reghardt" && password === "1234")
    {
        return "id-12345"
    }
    else
    {
        return null
    }
}


/**
 * @description Gets the CSRF token from the request.
 * @param request 
 * @returns the CSRF token if it exists, otherwise throws an error
 */
function getCSRFTokenFromCookie(request: Request)
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

function getCSRFTokenFromBody(decodedRequestBody: querystring.ParsedUrlQuery)
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

export async function action({request}: ActionFunctionArgs)
{
    const decodedRequestBody = querystring.decode(await request.text())
    const g_csrf_token_from_cookie = getCSRFTokenFromCookie(request);
    const g_csrf_token_from_body = getCSRFTokenFromBody(decodedRequestBody)

    if(g_csrf_token_from_cookie !== g_csrf_token_from_body)
    {
        throw new Error("Failed to verify double submit cookie.")
    }

    
    console.log(await verify(decodedRequestBody))



    // const payload = ticket.getPayload();
    // const userid = payload['sub'];
    
    // const cred = decoded["credential"]
    // if(cred && typeof cred === "string")
    // {
    //     console.log(cred)
    // }

    return new Response()
    // console.log(await request.body?.getReader().read().then(res => console.log(res)))
    // return json({})
    // const session = await getSession(
    //     request.headers.get("Cookie")
    // );

    // const form = await request.formData();
    // const username = form.get("username");
    // const password = form.get("password");

    // const userId = validateCredentials(username, password);
    // // console.log(userId)
    
    // if(userId == null)
    // {
    //     session.flash("error", "Invalid username/password");
    //     return redirect("/login", {
    //         headers: {
    //             "Set-Cookie": await commitSession(session)
    //         }
    //     })
    // }
    // else{
    //     session.set("userId", userId);
    //     session.set("username", username?.toString() ?? "");
    //     return redirect("/", {
    //         headers: {
    //             "Set-Cookie": await commitSession(session)
    //         }
    //     })
    // }

    



}


