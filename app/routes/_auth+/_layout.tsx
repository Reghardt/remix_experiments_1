import { NavLink, Outlet } from "@remix-run/react";

export default function AuthLayout()
{
    return(
        <div>
            <div>Auth</div>
            <div className="flex gap-2">
                <NavLink
                    prefetch="intent"
                    to={"/login"}
                    className={({isActive, isPending}) => {
                        return isActive ? "bg-slate-200" : ""
                    }}
                >
                    Login
                </NavLink>
                <NavLink
                    to={"/register"}
                    className={({isActive, isPending}) => {
                        return isActive ? "bg-slate-200" : ""
                    }}
                >
                    Register
                </NavLink>
            </div>

            <Outlet/>
            <div>footer</div>
        </div>
    )
}