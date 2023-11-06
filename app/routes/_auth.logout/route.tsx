import { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { redirect } from "react-router";
import { destroySession, getSession } from "~/sessions";

export default function LogoutRoute()
{
    return(
        <>
            <p>Are you sure you want to log out</p>
            <Form method="POST">
                <button>Logout</button>
            </Form>
            <Link to={"/"}>Never Mind</Link>
        </>
    )
}

export async function action({request}: ActionFunctionArgs)
{
    const session = await getSession(request.headers.get("Cookie"));
    return redirect("/login", {
        headers: {
            "Set-Cookie": await destroySession(session)
        }
    })
}