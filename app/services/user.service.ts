export async function verifyEmail(email: string) {
    const response = await fetch("http://localhost:5000/users/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        throw new Error("Invalid OTP or login error");
    }

    let data = await response.json();
    return data;
}

export async function createVerificationCode(email: string){
    const response = await fetch("http://localhost:5000/auth/verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        throw new Error("Verification code not created");
    }
}

export async function verifyCode(email: string, code: string){
    const response = await fetch("http://localhost:5000/auth/verify-code", {
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