import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useIsClient, useScript } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { commitSession, getSession } from "~/sessions.server";


import querystring from 'node:querystring';
import { getCSRFTokenFromBody, getCSRFTokenFromCookie, verify } from "./helpers/helpers.server";

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
        if(isClient)
        {
            // @ts-expect-error
            const res = google.accounts.id.initialize({
                client_id: window.env.GOOGLE_CLIENT_ID,
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




export async function action({request}: ActionFunctionArgs)
{
    const decodedRequestBody = querystring.decode(await request.text())
    const g_csrf_token_from_cookie = getCSRFTokenFromCookie(request);
    const g_csrf_token_from_body = getCSRFTokenFromBody(decodedRequestBody)

    if(g_csrf_token_from_cookie !== g_csrf_token_from_body)
    {
        throw new Error("Failed to verify double submit cookie.")
    }

    
    const verifiedResult = await verify(decodedRequestBody)

    //TODO: check if user exists on DB here

    const session = await getSession(
        request.headers.get("Cookie")
    );

    if(verifiedResult.userId)
    {
        session.set("userId", verifiedResult.userId);
        session.set("username", verifiedResult.name);
        return redirect("/", {
            headers: {
                "Set-Cookie": await commitSession(session)
            }
        })
    }
    else
    {
        session.flash("error", "Invalid username/password");
        return redirect("/login", {
            headers: {
                "Set-Cookie": await commitSession(session)
            }
        })
    }

 






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


