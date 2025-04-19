import UnauthorizedError from "~/utils/unauthorized-error";
import { getSession } from "./session.server";

type RequestInit = Parameters<typeof fetch>[1];

export async function fetchWithAuth<T>(url: string, request: Request, options: RequestInit = {}) {
    const cookieHeader = request.headers.get("cookie");
    const session = await getSession(cookieHeader);

    let accessToken = session.data.user.accessToken;

    if (!accessToken)
        throw new Error("No access token available");

    const defaultHeaders: Record<string, string> = {
        Authorization: `Bearer ${accessToken}`,
    }

    if (!(options.body instanceof FormData)) {
        defaultHeaders["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    });

    if(response.status === 401){
        // TODO: Implement refresh token. Currently using 1hour sessions
        throw new UnauthorizedError();
    }

    if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
    }

    if(response.status === 204)
        return null as T;

    try{
        return await response.json();
    }catch{
        return null as T;
    }
}