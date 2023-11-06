import { redirect, type LoaderFunctionArgs, type MetaFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getSession } from "~/sessions.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({request}: LoaderFunctionArgs){
  const session = await getSession(request.headers.get("Cookie"));
  if(session.has("userId"))
  {
    return json({username: session.get("username")})
  }
  else
  {
    return redirect("/login")
  }


}

export default function Index() {

  const { username } = useLoaderData<typeof loader>();

  return (
    <div >
      <div>Hello {username ?? "No username"}</div>
      <Link to={"/logout"}>Logout</Link>
    </div>
  );
}
