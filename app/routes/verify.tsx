import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { ArrowLeft } from "lucide-react";
import { useRef, useState } from "react";
import invariant from "tiny-invariant";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { authenticator } from "~/lib/auth.server";
import { commitSession, getSession } from "~/lib/session.server";
import { createVerificationCode, verifyEmail } from "~/services/user.service";

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request.headers.get('cookie'))
    const user = session.get('user');

    if (user) throw redirect('/app');

    const email = (new URL(request.url)).searchParams.get("email");
    invariant(email, "Missing email param");

    const resEmailVerify = await verifyEmail(email);
    if (!resEmailVerify.isValid) {
        throw new Response("Not Found", { status: 404 });
    }

    // Create and send verification code
    await createVerificationCode(email);

    return { email };
}

export const action = async ({ request }: ActionFunctionArgs) => {
    let user = await authenticator.authenticate("otp-email", request);

    let session = await getSession(request.headers.get("cookie"));
    session.set("user", user);

    throw redirect("/app", {
        headers: { "Set-Cookie": await commitSession(session) },
    });
}

export default function VerifyPage() {

    const [otpValues, setOtpValues] = useState(["", "", "", "", "", "", ""])
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    //const actionData = useActionData<typeof action>()
    const navigation = useNavigation()
    const isSubmitting = navigation.state === "submitting"
    const isResending = navigation.formData?.get("_action") === "resend"

    // Email would typically come from a previous step or URL param
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
                if (i < 6) {
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
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 px-4 py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 mr-2" onClick={() => window.history.back()}>
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </Button>
                        <CardTitle className="text-2xl font-bold tracking-tight">Verify your email</CardTitle>
                    </div>
                    <CardDescription>
                        We sent a verification code to <span className="font-medium">{email}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form method="post" className="space-y-4">
                        <input type="hidden" name="email" value={email} />

                        <div className="space-y-2">
                            <Label htmlFor="otp-0">Verification code</Label>
                            <div className="flex gap-2">
                                {otpValues.map((value, index) => (
                                    <Input
                                        key={`otp-${index}`}
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
                                // TODO: Show errors
                                //actionData?.error && <p className="text-sm text-red-500 mt-1">{actionData.error}</p>
                            }

                            <p className="text-sm text-gray-500 mt-2">
                                Didn't receive a code?{" "}
                                <button
                                    type="submit"
                                    name="_action"
                                    value="resend"
                                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                                    disabled={isResending}
                                >
                                    {isResending ? "Sending..." : "Resend"}
                                </button>
                            </p>

                            {
                                // TODO
                                //actionData?.message && <p className="text-sm text-green-600 mt-1">{actionData.message}</p>
                            }
                        </div>

                        <Button
                            type="submit"
                            name="_action"
                            value="verify"
                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                            disabled={otpValues.some((v) => v === "") || isSubmitting}
                        >
                            {isSubmitting && !isResending ? "Verifying..." : "Verify and Sign In"}
                        </Button>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}