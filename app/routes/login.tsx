import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import { ALAN_COURSE_ID } from "~/api/config";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { getSession } from "~/lib/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request.headers.get('cookie'));
    const user = session.get('user');

    if (user) throw redirect(`/app/courses/${ALAN_COURSE_ID}`);

    return null;
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const email = formData.get('email') as string;

    return redirect(`/verify?email=${email}`)
}

export default function LoginPage(){
    return(
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 px-4 py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight">Sign in</CardTitle>
                    <CardDescription>Enter your email to receive a verification code</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form method="post" id="login-form" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                autoComplete="email"
                                className="transition-all duration-200"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                            Continue with Email
                        </Button>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-center space-y-2 border-t pt-4">
                    <div className="text-sm text-gray-500">
                        By continuing, you agree to our{" "}
                        <a href="/terms-of-service" className="underline underline-offset-4 hover:text-gray-900">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="/privacy-policy" className="underline underline-offset-4 hover:text-gray-900">
                            Privacy Policy.
                        </a>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}