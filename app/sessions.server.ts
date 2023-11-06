import { createCookieSessionStorage } from "@remix-run/node";

type SessionData = {
    userId: string;
    username: string;
}

type SessionFlashData = {
    error: string;
}

const { getSession, commitSession, destroySession } = 
createCookieSessionStorage<SessionData, SessionFlashData>(
    {
        cookie: {
            name: "__session",
            // domain: "remix.run",
            httpOnly: true, // prevents JS from accesing the cookie, reducing XSS vulnerability
            maxAge: 60,
            path: "/",
            sameSite: "lax",
            secrets: ["secret"],
            secure: true // can only bes used over HTTPS
        }
    }
)

export { getSession, commitSession, destroySession};