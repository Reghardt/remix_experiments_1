import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { commitSession, getSession } from "~/sessions";

export async function loader({request}: LoaderFunctionArgs){
    const session = await getSession(request.headers.get("Cookie"));

    // console.log("session error:", session.get("error"))

    if(session.has("userId"))
    {
        return redirect("/")
    }
    else
    {
        //if the key is part of the session's flash data, it can only be read once, after which it is removed from the session
        const data = { error: session.get("error")}
        console.log(data)

        return json(data, {
            headers: {
                "Set-Cookie": await commitSession(session)
            }
        })
    }
}

export default function Login()
{
    const { error } = useLoaderData<typeof loader>()
    // console.log(error)

    return(
        <div>
            { error ? <div>{error}</div> : null}
            <form method="POST">
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

            </form>
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
    const session = await getSession(
        request.headers.get("Cookie")
    );

    const form = await request.formData();
    const username = form.get("username");
    const password = form.get("password");

    const userId = validateCredentials(username, password);
    // console.log(userId)
    
    if(userId == null)
    {
        session.flash("error", "Invalid username/password");
        // console.log(session.get("error"))
        return redirect("/login", {
            headers: {
                "Set-Cookie": await commitSession(session)
            }
        })
    }
    else{
        session.set("userId", userId);
        return redirect("/", {
            headers: {
                "Set-Cookie": await commitSession(session)
            }
        })
    }

    



}


