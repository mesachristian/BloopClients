import { API_BASE_URL } from "~/api/config";

export async function createVerificationCode(email: string){
    const response = await fetch(`${API_BASE_URL}/auth/verification-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        throw new Error("Verification code not created");
    }
}

export async function verifyCode(email: string, code: string){
    const response = await fetch(`${API_BASE_URL}/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
    });

    if (!response.ok) {
        throw new Error("Invalid email code pair");
    }

    let data = await response.json();
    return data;
}