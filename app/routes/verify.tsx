import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { useRef, useState } from "react";
import invariant from "tiny-invariant";
import { ALAN_COURSE_ID } from "~/api/config";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { authenticator } from "~/lib/auth.server";
import { commitSession, getSession } from "~/lib/session.server";
import { createVerificationCode } from "~/services/user.service";
import logo from "~/assets/art-of-reset-logo.png";

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request.headers.get('cookie'))
    const user = session.get('user');

    if (user) throw redirect('/app');

    const email = (new URL(request.url)).searchParams.get("email");
    invariant(email, "Missing email param");

    // Create and send verification code
    await createVerificationCode(email);

    return { email };
}

export const action = async ({ request }: ActionFunctionArgs) => {

    try {
        let user = await authenticator.authenticate("otp-email", request);

        let session = await getSession(request.headers.get("cookie"));
        session.set("user", user);

        return redirect(`/app/courses/${ALAN_COURSE_ID}`, {
            headers: { "Set-Cookie": await commitSession(session) },
        });

    }catch {
        return { error: "Código no válido" }
    }
}

const OTP_KEYS = ["otp-1", "otp-12", "otp-3", "otp-4", "otp-5", "otp-6", "otp-7"];

export default function VerifyPage() {

    const [otpValues, setOtpValues] = useState(["", "", "", "", "", "", ""])
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const actionData = useActionData<typeof action>();
    const navigation = useNavigation()
    const isSubmitting = navigation.state === "submitting"
    const isResending = navigation.formData?.get("_action") === "resend"

    const { email } = useLoaderData<typeof loader>();

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) {
            value = value[0]
        }

        const newOtpValues = [...otpValues]
        newOtpValues[index] = value
        setOtpValues(newOtpValues)

        // Auto-focus next input
        if (value !== "" && index < 7) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && otpValues[index] === "" && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    // Paste handler for the entire code
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text").trim()

        if (/^\d+$/.test(pastedData) && pastedData.length <= 7) {
            const newOtpValues = [...otpValues]

            for (let i = 0; i < pastedData.length; i++) {
                if (i < 7) {
                    newOtpValues[i] = pastedData[i]
                }
            }

            setOtpValues(newOtpValues)

            // Focus the next empty input or the last one
            const nextEmptyIndex = newOtpValues.findIndex((c) => c === "")
            if (nextEmptyIndex !== -1) {
                inputRefs.current[nextEmptyIndex]?.focus()
            } else {
                inputRefs.current[6]?.focus()
            }
        }
    }

    return (
        <div className="flex min-h-screen">
            { /* Left side logo*/}
            <div className="hidden md:flex md:w-1/2 bg-principal box-content">
                <img alt="verify-logo" src={logo} className="w-full h-full object-cover" />
            </div>

            <div className="w-full md:w-1/2 bg-gray-50 flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Verifica tu correo electrónico</h2>
                        Nosotros enviamos un código de verificación a <span className="font-medium">{email}</span>
                    </div>

                    <Form method="post" className="space-y-4">
                        <input type="hidden" name="email" value={email} />

                        <div className="space-y-2">
                            <Label htmlFor="otp-0">Verification code</Label>
                            <div className="flex gap-2">
                                {otpValues.map((value, index) => (
                                    <Input
                                        key={OTP_KEYS[index]}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        id={`otp-${index}`}
                                        name={`otp-${index}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={value}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        onPaste={index === 0 ? handlePaste : undefined}
                                        className="h-12 w-12 text-center text-lg"
                                        autoComplete="one-time-code"
                                        required
                                    />
                                ))}
                            </div>
                            {
                                actionData?.error && <p className="text-sm text-red-500 mt-1">{actionData.error}</p>
                            }

                            <p className="text-sm text-gray-500 mt-2">
                                Didn't receive a code?{" "}
                                <button
                                    type="submit"
                                    name="_action"
                                    value="resend"
                                    className="text-principal cursor-pointer font-medium"
                                    disabled={isResending}
                                >
                                    {isResending ? "Sending..." : "Resend"}
                                </button>
                            </p>

                            {
                                //actionData?.message && <p className="text-sm text-green-600 mt-1">{actionData.message}</p>
                            }
                        </div>

                        <Button
                            type="submit"
                            name="_action"
                            value="verify"
                            className="w-full bg-principal hover:brightness-125"
                            disabled={otpValues.some((v) => v === "") || isSubmitting}
                        >
                            {isSubmitting && !isResending ? "Verifying..." : "Verify and Sign In"}
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}