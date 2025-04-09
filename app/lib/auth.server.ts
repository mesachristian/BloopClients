import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import invariant from "tiny-invariant";
import { verifyCode } from "~/services/user.service";

interface UserSessionData {
    accessToken: string;
    name: string;
    email: string;
}

// Create authenticator
const authenticator = new Authenticator<UserSessionData>();

// Use strategy
authenticator.use(
    new FormStrategy(async ({ request }) => {
        let formData = await request.formData();
        
        let email = formData.get("email") as string;
        invariant(email, "Email needed")
        const code = Array.from({ length: 7 }, (_, i) => formData.get(`otp-${i}`) as string).join("");
        
        let response = await verifyCode(email, code);

        return response as UserSessionData;
    }),
    "otp-email"
);

export { authenticator };