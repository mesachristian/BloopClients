import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/lib/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(
        request.headers.get("cookie")
    );

    // Destroy the session and redirect to login.
    throw redirect("/login", {
        headers: {
            "Set-Cookie": await destroySession(session),
        },
    });
}